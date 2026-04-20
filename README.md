# TableForge Panel

Painel administrativo do TableForge, construído com React + TypeScript + Vite.

## Stack

- React 19
- TypeScript
- Vite
- TanStack Query
- React Hook Form + Zod
- Zustand
- Tailwind CSS

## Módulos principais

- Login
- Recuperação de senha em etapas
- Campanhas
- Usuários
- Imagens
- Logs (listagem e detalhes)

## Requisitos

- Node.js 20+
- npm 10+

## Configuração local

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie/ajuste o arquivo `.env.development`:

```bash
VITE_API_URL=https://sua-api-aqui
```

3. Rode o projeto:

```bash
npm run dev
```

## Scripts

- `npm run dev`: sobe ambiente local com HMR.
- `npm run lint`: executa lint do projeto.
- `npm run build`: build de produção.
- `npm run preview`: preview local do build.
- `npm run build:pages`: build + preparação de artefatos para GitHub Pages.
- `npm run deploy`: publica `dist` na branch `gh-pages`.
