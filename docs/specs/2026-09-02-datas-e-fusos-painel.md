# Spec de correção: datas, horas e fusos

| Campo | Valor |
|---|---|
| Repositório | TableForge_Panel (painel administrativo, React + Vite) |
| Arquivos | `src/features/logs/hooks/use-all-logs.ts`, `src/utils/custom-schema-validations.ts`, `src/features/users/schemas/user.schema.ts`, `docs/conventions/dates-and-timestamps.md` |
| Origem | Mudança de datas do backend em 02/09/2026 (`fix(dates)`), documentada em `TableForge_Backend/docs/frontend_integration_guide_datas_e_fusos.md` |
| Prioridade | Média-alta: o filtro de período da tela de Logs esconde as horas mais recentes |
| Backend | Pronto e no ar (seção 6) |

## 1. Resumo

O backend passou a distinguir três tipos de data: **instante** (UTC com `Z`), **dia** (`yyyy-MM-dd`, sem hora e sem fuso) e **hora do dia** (`HH:mm:ss`).

Para o painel, o impacto é menor do que no app: a **exibição já está correta em todo lugar**, porque o painel usa `dayjs` (via `formatDate`) e não faz parse das respostas por zod. O que precisa mudar é o **envio**: filtros de período mandam dia onde o backend espera instante, e a normalização de dia no zod usa o dia UTC em vez do dia local.

Esta spec tem escopo pequeno de propósito. A seção 3.4 lista o que **está certo e não deve ser mexido**, para a correção não virar uma varredura.

## 2. Comportamento atual

1. Abrir **Logs**. O filtro padrão é "últimos 7 dias".
2. Comparar com o que existe no banco: registros gerados hoje e ontem depois das 21h **não aparecem**.

Motivo: o filtro manda `endDate=2026-09-02` (dia), o backend lê como `2026-09-02T00:00:00Z`, e isso é 01/09 às 21h em Brasília. Tudo que aconteceu depois disso fica fora.

Isso **não é regressão de 02/09**: o comportamento já era esse, porque o servidor sempre gravou em UTC. O que mudou é que agora a regra está documentada e o ajuste é explícito.

## 3. Diagnóstico

### P1. Filtro de período manda dia onde o backend espera instante

[use-all-logs.ts](../../src/features/logs/hooks/use-all-logs.ts) linhas 17 e 18:

```ts
startDate: dayjs().subtract(7, "days").format("YYYY-MM-DD"),
endDate: dayjs().format("YYYY-MM-DD"),
```

O `DateInput` dos filtros avançados ([search-filters.tsx](../../src/pages/logs/components/search-filters/search-filters.tsx) linhas 85 e 94) usa `showTime = false`, então também devolve `yyyy-MM-dd` (`serializeDateOnly`, [input.date.controlled.tsx](../../src/components/input/input.date.controlled.tsx) linha 15). O `LogService.getAll` repassa os filtros como query string sem transformar.

No backend, `startDate`/`endDate` de `/logs` são instantes e o filtro é `CreatedAt >= startDate && CreatedAt <= endDate`. Texto sem `Z` nem offset é lido como UTC. Resultado: a janela real fica deslocada 3 h para trás — perde-se o fim do último dia e ganha-se o fim da véspera do primeiro.

### P2. `dateRequired` normaliza usando o dia UTC

[custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) linhas 60 a 66:

```ts
if (arg instanceof Date) {
  if (Number.isNaN(arg.getTime())) return "invalid";
  return arg.toISOString().split("T")[0];
}
```

`toISOString()` converte para UTC antes de cortar. Uma `Date` construída em Brasília às 21h ou mais tarde vira o **dia seguinte**. Hoje o caminho comum não passa por aqui, porque o `DateInput` já entrega string `yyyy-MM-dd` e o `parseDateValue` monta as datas ao meio-dia local ([input.date.controlled.tsx](../../src/components/input/input.date.controlled.tsx) linha 53). O risco aparece quando uma `Date` chega de outro lugar — `defaultValue={new Date()}`, `form.reset` com `Date`, ou um campo novo que não use o `DateInput`.

### P3. `birthDate` sai do formulário como instante

`birthDate` usa `dateOptional` ([user.schema.ts](../../src/features/users/schemas/user.schema.ts) linha 24), que é `z.coerce.date().optional()` ([custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts) linhas 209 a 213). O valor validado vira um objeto `Date`, e o axios serializa `Date` como ISO completo. O `PUT`/`POST` de usuário manda `"1990-08-05T15:00:00.000Z"` num campo que é dia.

Funciona hoje pela tolerância de transição do backend (instante em campo de dia é convertido para o dia de Brasília), mas é a tolerância que segura, não o contrato. O schema de criação usa `dateRequired` ([user.schema.ts](../../src/features/users/schemas/user.schema.ts) linha 122) e cai no P2.

### P4. O que já está correto — não mexer

- **Exibição de instante:** `formatDate(x, true)` é `dayjs(x)` ([format.ts](../../src/utils/format.ts) linha 7). Com o `Z`, usuários, imagens, sistemas, logs, chat de reservas e feedbacks passam a mostrar a hora certa **sem alteração** (antes mostravam 3 h a mais). Não usar `.utc()` nesses valores.
- **Exibição de dia:** `formatDate(booking.bookingDate)` ([bookings-table.tsx](../../src/pages/my-bookings/components/bookings-table/bookings-table.tsx) linha 52 e [modal-booking-details.tsx](../../src/pages/my-bookings/components/modal-booking-details/modal-booking-details.tsx) linha 72) e `formatDate(data.birthDate)` ([users/details.tsx](../../src/pages/users/details.tsx) linha 173) continuam corretos: `dayjs("2026-08-21")` lê como dia local. **Não trocar por `new Date()`.**
- Os serviços não fazem `parse` das respostas pelo zod, então o que chega na tela é a string crua da API — é por isso que a exibição escapou do problema que atingiu o app.
- Envio de instante: `serializeDateTime` (`toISOString()`) em campos com `showTime` continua certo.

## 4. Correções

### C1. Converter período para instante na hora de consultar (P1)

O ponto de conversão deve ser único. Sugestão: no service, que é por onde todo filtro passa.

Em [logs.services.ts](../../src/features/logs/services/logs.services.ts), antes de montar `normalizedParams`:

```ts
const toRangeStart = (value?: string | Date) =>
  value ? dayjs(value).startOf("day").toISOString() : undefined;

const toRangeEnd = (value?: string | Date) =>
  value ? dayjs(value).endOf("day").toISOString() : undefined;
```

e aplicar em `startDate`/`endDate` do `getAll`. O usuário continua escolhendo dia; quem manda instante é o service.

Manter `INITIAL_LOGS_FILTERS` como está (`yyyy-MM-dd`): é o formato que o `DateInput` entende e que o filtro exibe.

Critério de aceite: com o filtro padrão, um log gerado agora aparece na lista. No Network, a query string mostra `startDate=2026-08-26T03:00:00.000Z` e `endDate=2026-09-03T02:59:59.999Z`.

### C2. Normalizar dia pelo calendário local (P2)

Em [custom-schema-validations.ts](../../src/utils/custom-schema-validations.ts), trocar a linha 66 por:

```ts
return dayjs(arg).format("YYYY-MM-DD");
```

Mesma ideia do `serializeDateOnly` do `DateInput`: usa o calendário local, não o UTC.

Critério de aceite: com o relógio do computador em 22h de Brasília, escolher "hoje" num campo de data e salvar grava o dia de hoje, não o de amanhã.

### C3. `birthDate` sai como dia (P3)

Em [user.schema.ts](../../src/features/users/schemas/user.schema.ts), trocar `birthDate: dateOptional` (linha 24) por um dia opcional em string:

```ts
const dateOnlyOptional = z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined || arg === "") return undefined;
    if (arg instanceof Date) return dayjs(arg).format("YYYY-MM-DD");
    return arg;
  },
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, ERROR_MESSAGE.validate).optional(),
);
```

Declarar o helper em `custom-schema-validations.ts` junto dos outros e usar em `birthDate`. `createdAt`, `updatedAt` e `lastAccess` continuam com `dateOptional` — são instantes e não passam por formulário.

Critério de aceite: editar um usuário e salvar manda `"birthDate": "1990-08-05"` no corpo do `PUT`; reabrir o cadastro mostra `05/08/1990`.

### C4. Convenção (documentação)

Atualizar [dates-and-timestamps.md](../conventions/dates-and-timestamps.md) com os três tipos, a regra "período de filtro é instante, mesmo quando o usuário escolhe dia" e o aviso de não aplicar `.utc()` em valor que já vem com `Z`.

## 5. Como testar

| # | Cenário | Esperado |
|---|---|---|
| T1 | Abrir Logs com o filtro padrão, depois das 21h | Registros de hoje aparecem (antes sumiam) |
| T2 | Filtrar Logs de 01/09 a 02/09 | Traz de 01/09 00:00 a 02/09 23:59 no horário de Brasília |
| T3 | Detalhe de log, usuário, imagem e feedback | Hora exibida é a hora local do evento, não 3 h a mais |
| T4 | Reservas em "Meus agendamentos" (tabela e modal) | Dia da reserva igual ao do app e ao do banco |
| T5 | Cadastro/edição de usuário com nascimento 05/08/1990 | Corpo do request leva `1990-08-05`; a tela de detalhes mostra `05/08/1990` |
| T6 | Relógio da máquina em 22h, escolher "hoje" num campo de data | Salva o dia de hoje |
| T7 | Regressão de eventos | Formulário de evento continua enviando instante (`toISOString()`) e a data exibida continua certa |

Consulta de apoio no banco (pedir ao backend se não tiver acesso):

```sql
SELECT id, created_at FROM logs ORDER BY id DESC LIMIT 5;
SELECT id, username, birth_date FROM users WHERE id = <id>;
```

## 6. O que o backend já fez e o que fica sugerido

Feito em 02/09/2026:

- Instante sempre em UTC com `Z`; dia como `yyyy-MM-dd`; hora do dia como `HH:mm:ss`, em toda a API.
- Entrada de instante aceita `Z` e offset; texto sem fuso é lido como **UTC**. É por isso que o filtro de período precisa do C1.
- Tolerância de transição: dia enviado como instante é convertido para o dia de Brasília. É o que segura o `birthDate` atual até o C3.
- Regras de negócio de reserva passaram a usar o relógio de Brasília.

Sugerido para depois, ainda não feito:

- Remover a tolerância de instante em campo de dia quando app e painel estiverem enviando `yyyy-MM-dd`.

## 7. Referências

- Contrato do backend: `TableForge_Backend/docs/frontend_integration_guide_datas_e_fusos.md` (seção "Painel (TableForge_Panel): o que mudar" e "Filtros de período").
- Spec irmã: [histórico de requisições](2026-09-02-historico-de-requisicoes.md) — a tela nova nasce já com o C1 aplicado.
- Convenções do painel: `docs/conventions/dates-and-timestamps.md`, `docs/conventions/data-fetching.md`.
