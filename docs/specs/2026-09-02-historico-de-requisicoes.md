# Spec de feature: tela de Histórico de Requisições

| Campo | Valor |
|---|---|
| Repositório | TableForge_Panel (painel administrativo, React + Vite) |
| Arquivos | Novos: `src/features/request-history/**`, `src/pages/request-history/**`. Alterados: `src/App.tsx`, `src/components/nav-menu/nav-menu.tsx` |
| Origem | Backend de 02/09/2026 (`feat(request-history)`), documentado em `TableForge_Backend/docs/frontend_integration_guide_historico_requisicoes.md` |
| Prioridade | Média: é ferramenta de diagnóstico, não fluxo de usuário. Mas é o que responde "por que a API está lenta" sem abrir o Railway |
| Backend | Pronto e no ar. Endpoints `GET /requesthistory` e `GET /requesthistory/{id}`, só Admin |

## 1. Resumo

O backend passou a registrar **toda requisição recebida**: quem chamou, de onde, qual rota, quanto tempo levou em cada fase e quanto o banco consumiu. Requisições lentas (acima de 1 s, configurável) ou que terminaram em 5xx guardam também um JSON de diagnóstico com os comandos SQL mais lentos, uso de memória e GC.

Não existe tela para isso. Esta spec descreve a tela nova, espelhando a estrutura da tela de **Logs**, que já resolve o mesmo tipo de problema (listagem paginada com filtros + página de detalhe).

Diferença de propósito, para não confundir as duas telas: **Logs** guarda o que a aplicação decidiu registrar (erros e alertas de negócio). **Histórico de requisições** guarda todas as requisições, com foco em desempenho. As duas se ligam pelo campo `errorCode`.

## 2. Contrato do backend

Rotas sem prefixo `/api`, iguais às demais do painel. As duas exigem Bearer de usuário `Admin`; qualquer outro tipo recebe `403`.

### 2.1 Listagem

**`GET /requesthistory`** — todos os parâmetros são opcionais e combináveis:

| Parâmetro | Tipo | Padrão | Observação |
|---|---|---|---|
| `startDate` / `endDate` | instante | 24 h atrás / amanhã | Em UTC. `startDate` precisa ser menor que `endDate`, senão `400` |
| `userId` | long | — | Usuário autenticado na requisição |
| `search` | string | — | Trecho da rota (`api/Events/{id}`) ou do caminho (`/api/events/5`) |
| `statusCode` | int | — | Status HTTP exato |
| `minTotalMs` | int | — | Só requisições com tempo total maior ou igual |
| `onlyWithDetails` | bool | `false` | Só as que têm diagnóstico (lentas ou 5xx) |
| `page` / `size` | int | 1 / 20 | Ordenado da mais recente para a mais antiga |

Resposta `200`, no mesmo envelope paginado do resto da API:

```json
{
  "items": [
    {
      "id": 1518,
      "createdAt": "2026-09-02T18:44:12.0312245Z",
      "method": "GET",
      "route": "api/Events/{id}/Attendees",
      "path": "/api/events/5/attendees",
      "statusCode": 200,
      "userId": 5,
      "userLogin": "wagner",
      "ipAddress": "138.94.103.235, 152.233.12.242",
      "pipelineMs": 3,
      "actionMs": 41,
      "responseMs": 2,
      "totalMs": 46,
      "dbCommands": 3,
      "dbMs": 28,
      "dbFailedCommands": 0,
      "errorCode": null,
      "processUptimeSeconds": 812,
      "hasDetails": false
    }
  ],
  "pagination": { "page": 1, "size": 20, "filteredItems": 1 }
}
```

`pagination` tem `page`, `size` e `filteredItems` — o mesmo `IPaginationResponse` que o painel já usa em Logs; o componente `Paginate` funciona sem adaptação.

### 2.2 Detalhe

**`GET /requesthistory/{id}`** devolve todos os campos da listagem (menos `hasDetails`) mais `ttl`, `query` (com `password`, `token` e `code` já mascarados), `userAgent`, `responseSize` e `details`.

`details` é uma **string com JSON dentro**. Depois de `JSON.parse`:

```json
{
  "phases": { "pipelineMs": 3, "actionMs": 1840, "responseMs": 2, "totalMs": 1845 },
  "database": {
    "commands": 4, "totalMs": 1790.4, "failedCommands": 1,
    "connectionsOpened": 1, "connectionOpenMs": 96.2,
    "slowestCommands": [ { "ms": 1702.1, "failed": false, "sql": "SELECT ..." } ]
  },
  "runtime": {
    "processUptimeSeconds": 812, "gen0Collections": 2, "gen1Collections": 0, "gen2Collections": 0,
    "totalMemoryMb": 61.3, "workingSetMb": 148.7, "threadCount": 12, "pendingWorkItems": 0
  },
  "request": { "contentType": "application/json", "contentLength": 58, "clientAborted": false, "body": "{\"login\":\"wagner\",\"password\":\"***\"}" },
  "response": { "contentType": "application/json; charset=utf-8", "size": 4643 },
  "errorCode": "C6DF712FFC6542CFB6F2DD7E"
}
```

Chaves nulas são omitidas — todo acesso precisa ser opcional. `request.body` só existe para JSON ou texto até 4 KB, nunca para upload, e sempre mascarado.

### 2.3 Erros

| Situação | Status | Mensagem |
|---|---|---|
| `id` inválido | `400` | `ID inválido!` |
| Registro inexistente | `404` | `Registro de requisição não encontrado com o ID 'X'!` |
| `startDate` maior ou igual a `endDate` | `400` | `A data inicial deve ser menor que a data final!` |
| Usuário sem role Admin | `403` | — |

## 3. Estrutura de arquivos

Espelhar a feature `logs`, arquivo por arquivo:

```
src/features/request-history/
  schemas/request-history.schema.ts     # RequestHistoryListSchema, RequestHistorySchema
  hooks/query-key.ts                    # REQUEST_HISTORY_KEYS (all/lists/list/details/detail)
  hooks/types.ts                        # IGetRequestHistory, IGetAllRequestHistoryResponse
  hooks/use-all-request-history.ts      # filtros no useComponentStore + useQuery
  hooks/use-request-history-by-id.ts
  services/request-history.services.ts  # getAll, getById

src/pages/request-history/
  index.tsx                             # listagem
  details.tsx                           # detalhe
  components/search-filters/search-filters.tsx
```

**Rotas** em [App.tsx](../../src/App.tsx), ao lado das de logs (linhas 64 e 65):

```tsx
<Route path="request-history" element={<RequestHistoryPage />} />
<Route path="request-history/:id" element={<RequestHistoryDetailsPage />} />
```

**Menu** em [nav-menu.tsx](../../src/components/nav-menu/nav-menu.tsx): item novo logo acima de "Logs" (o `logItem` da linha 48), com ícone `Activity` ou `Gauge` do `lucide-react`. **Só renderizar quando `isAdmin`** (a variável já existe na linha 58): o endpoint é Admin-only e um Organizer que clicasse veria só erro.

Filtros no `useComponentStore` seguindo o padrão de `LOGS_COMPONENT_FILTER_KEY`, com chave `"request-history"`, para o filtro sobreviver à navegação até o detalhe e voltar.

## 4. Tela de listagem

Cabeçalho igual ao de Logs: título "Histórico de Requisições" e subtítulo "Todas as requisições recebidas pela API, com tempos por fase.".

### 4.1 Colunas

| Coluna | Campo | Largura | Observação |
|---|---|---|---|
| Status | `statusCode` | 90px | Pílula colorida: 2xx verde, 3xx neutro, 4xx âmbar, 5xx vermelho. Mesmo padrão visual do badge de `details.tsx` de Logs |
| Método | `method` | 80px | `GET`, `POST`... |
| Rota | `route` | flexível | `normalCase: true`. Quando `route` for nulo, mostrar `path` |
| Usuário | `userLogin` | 140px | `-` quando anônimo |
| Total | `totalMs` | 90px | Alinhado à direita, `ms`. Destacar em âmbar acima de 1000 e em vermelho acima de 3000 |
| Banco | `dbMs` / `dbCommands` | 120px | `28 ms · 3 cmd`. Vermelho quando `dbFailedCommands > 0` |
| Data | `createdAt` | 150px | `formatDate(createdAt, true)` |
| Diagnóstico | `hasDetails` | 60px | Ícone quando verdadeiro; a linha continua clicável de qualquer forma |

`detailsLink="/request-history"` no `Table`, como em Logs. `getRowColor`: vermelho (`var(--color-danger)`) quando `statusCode >= 500`.

Estados: `SkeletonTable` no loading, `InfoNotFound` no erro ("Ocorreu um erro ao carregar o histórico de requisições."), `emptyMessage="Nenhuma requisição encontrada no período."`.

### 4.2 Filtros

Reaproveitar o componente `Filters` com busca no topo (debounce de 500 ms, como `onSearchChange` de `use-all-logs.ts`) e avançados no painel lateral:

- **Data inicial / Data final** — `DateInput`, padrão últimas 24 h.
- **Status HTTP** — `Input` numérico (`statusCode`).
- **Tempo mínimo (ms)** — `Input` numérico (`minTotalMs`), com atalhos sugeridos 500 / 1000 / 3000.
- **Somente com diagnóstico** — checkbox (`onlyWithDetails`).
- **Usuário (ID)** — `Input` numérico (`userId`).
- **Itens por página** — `Select` com `PAGE_SIZE`, igual a Logs.

> **Período em UTC:** `startDate`/`endDate` são instantes. Converter no service com `dayjs(valor).startOf("day").toISOString()` e `endOf("day").toISOString()` — é a mesma correção da spec [datas e fusos](2026-09-02-datas-e-fusos-painel.md) (C1). Mandar `yyyy-MM-dd` cru desloca a janela em 3 h e esconde as requisições mais recentes.

## 5. Tela de detalhe

Mesma moldura de [logs/details.tsx](../../src/pages/logs/details.tsx): botão voltar, título `Requisição #{id}`, badge de status HTTP, subtítulo com `method` + `path`.

**Cards de topo (4):** Tempo total (`totalMs`), Banco (`dbMs` e `dbCommands`), Status HTTP, Uptime do processo (`processUptimeSeconds`). No card de uptime, quando o valor for menor que 120 s, mostrar a legenda "cold start" — é o sinal de container recém-acordado no Railway.

**Barra de fases:** `pipelineMs`, `actionMs`, `responseMs` como uma barra empilhada de 100% de `totalMs`, com legenda. `actionMs` e `responseMs` são **nulos** quando nenhuma action rodou (404 de rota, redirect) — nesse caso, mostrar só o pipeline e a nota "nenhuma action executada".

**Blocos de informação** (`CardBox`/`GridBox`, como em Logs): `route`, `path`, `query`, `userLogin` + `userId`, `ipAddress`, `userAgent`, `responseSize`, `ttl`, `createdAt`.

**Diagnóstico** (só quando `details` existir):

- `JSON.parse` dentro de `try/catch`; se falhar, mostrar o texto cru no componente `Code` em vez de quebrar a página.
- **Comandos mais lentos:** lista de `database.slowestCommands` com o tempo, o marcador de falha e o SQL no componente `Code`.
- **Runtime:** memória (`totalMemoryMb`, `workingSetMb`), coletas de GC por geração, threads e itens pendentes.
- **Corpo da requisição:** `request.body` no `Code`, com o aviso "campos sensíveis mascarados pelo backend".
- **`errorCode`:** quando presente, renderizar como link para `/logs?search=<errorCode>` — é o mesmo código da linha correspondente em Logs.

Estados: `SkeletonDetails` no loading; `InfoNotFound` no 404 com "Registro de requisição não encontrado."

## 6. Pontos de atenção

1. **`details` é string, não objeto.** Sempre `JSON.parse` com `try/catch` e acesso opcional a cada chave — chaves nulas são omitidas pelo backend.
2. **Nem toda requisição tem diagnóstico.** `hasDetails` na listagem existe para não prometer na tabela algo que o detalhe não tem.
3. **`route` pode ser nulo** (404 de rota que não casou com nenhum endpoint). Cair para `path`.
4. **`ipAddress` pode vir com mais de um IP** separado por vírgula (proxy do Railway). Exibir inteiro; não tentar validar.
5. **O histórico tem TTL.** Registros expiram; uma janela muito antiga volta vazia sem ser erro — a mensagem de lista vazia deve dizer "no período", não "nenhum registro".
6. **A tela não aparece para Organizer.** Rota e item de menu atrás de `isAdmin`.
7. **Não aparecem no histórico:** `/hubs`, `/swagger` e preflight `OPTIONS`. Endpoints `AllowAnonymous` aparecem sem usuário, porque o middleware descarta o token neles.

## 7. Como testar

| # | Cenário | Esperado |
|---|---|---|
| T1 | Abrir a tela como Admin | Lista as requisições das últimas 24 h, mais recentes primeiro |
| T2 | Navegar pelo painel e recarregar a tela | As próprias chamadas do painel aparecem na lista |
| T3 | Filtrar por `statusCode = 404` | Só requisições 404; as de rota inexistente aparecem sem `route` e sem `actionMs` |
| T4 | Filtrar "tempo mínimo" 1000 ms + "somente com diagnóstico" | Só requisições lentas, todas com o bloco de diagnóstico no detalhe |
| T5 | Abrir o detalhe de uma requisição lenta | Barra de fases somando `totalMs`, lista de SQL mais lento e bloco de runtime |
| T6 | Abrir o detalhe de uma requisição rápida (sem `details`) | Página monta normalmente, sem o bloco de diagnóstico e sem erro no console |
| T7 | Detalhe de uma requisição com `errorCode` | Link leva para Logs já filtrado por aquele código |
| T8 | Requisição de login no histórico | `query` e `request.body` aparecem com `password` mascarado |
| T9 | Filtrar período de hoje | Traz as requisições de hoje até agora (valida a conversão para instante) |
| T10 | Entrar com usuário Organizer | Item de menu não aparece; acessar `/request-history` na mão não quebra a aplicação |
| T11 | Paginação | Página 2 traz registros mais antigos; `filteredItems` bate com o total exibido |

Consulta de apoio no banco (pedir ao backend se não tiver acesso):

```sql
SELECT id, created_at, method, route, status_code, total_ms, db_ms, db_commands
  FROM request_histories
 ORDER BY id DESC
 LIMIT 20;
```

## 8. O que o backend já fez e o que fica sugerido

Feito em 02/09/2026:

- Registro automático de toda requisição, com tempos por fase, contadores de banco e diagnóstico para lentas e 5xx.
- Os dois endpoints desta spec, restritos a Admin.
- A tabela é criada sozinha na subida da API (`docs/migracoes-de-schema.md`); não há passo manual de banco.
- Limite de tempo para considerar "lenta" e TTL dos registros ficam na seção `RequestHistory` do `appsettings.json`, sobrescrevíveis por variável de ambiente.

Sugerido para depois, ainda não feito:

- Endpoint de agregação (média e p95 por rota) para um painel de desempenho. Hoje a tela mostra requisição a requisição.

## 9. Referências

- Contrato do backend: `TableForge_Backend/docs/frontend_integration_guide_historico_requisicoes.md`.
- Regras de data: `TableForge_Backend/docs/frontend_integration_guide_datas_e_fusos.md` e a spec [datas e fusos](2026-09-02-datas-e-fusos-painel.md).
- Padrão a espelhar no painel: `src/features/logs/**` e `src/pages/logs/**`.
- Convenções: `docs/conventions/pages.md`, `docs/conventions/data-fetching.md`, `docs/conventions/status-and-enums.md`.
