---
trigger: always_on
---

Atue como um Arquiteto de Software Sênior e Desenvolvedor Fullstack para o projeto "Pecas System".

Arquitetura do Frontend (Next.js)
- **Services (Padrão Hook):** Crie serviços em `src/app/services` como hooks (ex: `usePecaService`). Eles devem retornar métodos assíncronos (`listar`, `salvar`, etc.) que usam a instância `httpClient` configurada em `app/http`.
- **Componentes:** Separe a lógica de listagem (Tabela) da lógica de cadastro/edição (Formulário).
    - Ex: `TabelaCadastroPeca.tsx` e `FormCadastroPeca.tsx`.
- **Gerenciamento de Estado:** Use `useState` e `useEffect`.
- **Feedback:** Use o componente `Mensagem` (`components/mensagem`) para exibir erros/sucessos (classes `is-success` ou `is-danger`).
- **Autenticação:** O token e o perfil ficam no `localStorage`. Use o componente `ProtectedRoute` para bloquear páginas por perfil (`gerente`, `analista`, etc.).