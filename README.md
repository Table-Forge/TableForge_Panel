# TableForge - Panel ⚙️

![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

Bem-vindo ao repositório do **TableForge Panel** – O painel administrativo oficial da plataforma TableForge. Esta aplicação web é utilizada por administradores para gerenciar dados cruciais, contas de usuários e monitorar a saúde do sistema.

## ✨ Funcionalidades Principais

- **Autenticação e Segurança**: Login seguro e fluxo completo de recuperação de senha em etapas.
- **Gestão de Campanhas**: Listagem, moderação e visualização detalhada das campanhas de RPG criadas na plataforma.
- **Gestão de Usuários**: Administração das contas de usuários (Mestres e Jogadores).
- **Gestão de Mídia**: Painel de visualização e controle de imagens e avatares (Assets).
- **Monitoramento e Logs**: Visualização, busca e detalhamento de logs de sistema (Errors, Warnings, Info) para debug e auditoria.

## 🛠️ Stack Tecnológico

O projeto foi construído focando em performance, tipagem rigorosa e facilidade de manutenção:

- **Framework Core**: [React 19](https://react.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) para compilação super rápida.
- **Data Fetching / Cache**: [TanStack Query](https://tanstack.com/query/latest) (React Query).
- **Formulários e Validação**: [React Hook Form](https://react-hook-form.com/) integrado com [Zod](https://zod.dev/).
- **Gerenciamento de Estado**: [Zustand](https://github.com/pmndrs/zustand) (Global state).
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) e componentes UI modernos.

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [npm](https://www.npmjs.com/) (versão 10 ou superior)

### Instalação

1. Clone o repositório e navegue até a pasta:
   ```bash
   cd TableForge-Panel
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o ambiente:
   Crie ou edite o arquivo `.env.development` na raiz do projeto com os endpoints corretos:
   ```env
   VITE_API_URL=https://sua-api-aqui.com/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173` no seu navegador.

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o ambiente local de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build`: Cria a versão otimizada de produção na pasta `dist/`.
- `npm run lint`: Roda o ESLint para encontrar e corrigir problemas no código base.
- `npm run preview`: Simula o servidor servindo os arquivos de produção recém "buildados" localmente.
- `npm run build:pages`: Cria a build configurada especificamente para deploy estático.
- `npm run deploy`: Roda o build e automaticamente faz push da pasta `dist` para a branch `gh-pages` (publicação automática via Github Pages).

## 🤝 Padrões do Projeto

- **Arquitetura**: O projeto segue separação de responsabilidades claras (Hooks separados de Componentes).
- **Comunicação de API**: Formulários devem sempre inferir seus tipos de payloads a partir de schemas Zod.
- **Idiomas**: Código-fonte (variáveis, funções, componentes) em **Inglês**. Textos na UI (interface do usuário) em **Português do Brasil (pt-BR)**.
