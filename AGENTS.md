# Instruções para agentes de IA

## Papel e contexto

O Codex é o agente principal deste repositório. Comunique-se em português (pt-BR), salvo quando o pedido exigir outro idioma.

Este é um monorepo npm workspaces:

- `apps/web`: aplicação Next.js com React, TypeScript, Three.js e React Three Fiber; concentra o showroom 3D e a interface.
- `packages/shared`: catálogo, preços, tipos e regras compartilhadas.
- `packages/db`: schema, migrações e seed do Prisma.
- `infra`: infraestrutura declarada em Terraform.

Mantenha mudanças compatíveis com a arquitetura existente. Não altere produto, banco ou infraestrutura fora do escopo solicitado.

## Fluxo de trabalho

1. Inspecione o código, as instruções locais e o estado do Git antes de editar.
2. Preserve alterações preexistentes do usuário; não as reverta, descarte ou misture à sua mudança.
3. Trabalhe em uma branch dedicada e nunca faça commits diretamente em `main`.
4. Não adicione segredos, arquivos `.env`, credenciais, artefatos de build, dependências instaladas ou arquivos gerados ao Git.
5. Mantenha alterações pequenas, coesas e documente decisões ou limitações relevantes na entrega.

## Branches e commits

Para branches criadas pelo Codex, use `codex/<tipo>-<descricao-curta-em-kebab-case>`, por exemplo `codex/feat-catalogo-filtros`.

Outras branches devem usar um destes prefixos: `feat/`, `fix/`, `refactor/`, `docs/`, `test/` ou `chore/`, seguidos de uma descrição curta em kebab-case.

Use Conventional Commits em português. Formato:

```text
tipo(escopo-opcional): descrição curta no imperativo
```

Exemplos:

```text
feat(catalogo): adiciona filtros por material
fix(sacola): corrige total após remover item
docs: atualiza instruções de desenvolvimento
```

Tipos permitidos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf` e `ci`.

## Pull requests

Abra um pull request somente quando o usuário solicitar explicitamente. Cada PR deve ter uma mudança coesa, explicar o que mudou e por quê, listar as verificações executadas e registrar impactos, limitações ou pendências.

Use o template em `.github/PULL_REQUEST_TEMPLATE.md`. Não inclua alterações não relacionadas, segredos ou arquivos gerados.

## Qualidade obrigatória

Antes de entregar uma mudança ou propor a abertura de um PR, execute na raiz do repositório:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Relate com clareza qualquer comando não executado, falha ou risco remanescente. Não declare a mudança validada se algum desses comandos não tiver sido concluído com sucesso.
