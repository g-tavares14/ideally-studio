# Ideally Studio 3D

An institutional catalog and 3D editor for **Ideally Studio 3D**, a made-to-order additive manufacturing (3D printing) atelier based in São Paulo. Visitors browse procedural models, open a piece from the catalog, configure its material/color/size, and add it to a cart — all rendered from the same 3D geometry, with no pre-made product photos.

## Features

- **3D catalog previews** — every product card receives a thumbnail rendered from the procedural model used by the editor.
- **Procedural product geometry** — every piece (vase, ring, napkin holder, controller stand, etc.) is generated from primitive geometries in code, not loaded 3D model files.
- **Live product editor** — open a model from the catalog, rotate it, and swap material (PLA, ceramic resin, metal deposition), color, and size while the price updates in real time.
- **Catalog & cart** — filter the collection and add the configured piece to a cart ("Sacola") with an auto-generated thumbnail from the same 3D geometry.
- **Institutional home** — an interactive presentation of the atelier's process, from intention to fabrication and manual finishing.

## Tech stack

- [React](https://react.dev/) + TypeScript
- [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) + [drei](https://drei.docs.pmnd.rs/)
- [Next.js](https://nextjs.org/) for the web application

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
```

## Pull requests automáticos pelo Codex

O hook nativo em `.codex/hooks.json` observa comandos Bash executados pelo
Codex. Após um `git commit` bem-sucedido em uma branch de trabalho, ele envia
a branch para `origin` e cria um pull request em rascunho, desde que ainda não
exista um PR aberto. O hook ignora `main`, `master`, `develop` e a branch-padrão
do remoto.

Pré-requisitos: [GitHub CLI](https://cli.github.com/) instalado e autenticado.

```bash
gh auth login
```

Ao iniciar o Codex neste repositório, revise e aprove o hook com `/hooks`. O
Codex só carrega hooks locais de projetos confiáveis e não executa hooks de
comando sem essa aprovação. Para desativá-lo, use `/hooks` no Codex; commits
feitos fora do Codex não acionam essa automação.

## Project structure

```
apps/web/        # Next.js application, catalog, and 3D product editor
packages/shared/ # shared catalog, prices, and cart types
packages/db/     # Prisma schema, seed, and migrations
infra/           # Terraform infrastructure definitions
```

## Status

Early-stage prototype — content and copy are in Portuguese (pt-BR), matching the target audience.
