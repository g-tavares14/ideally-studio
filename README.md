# Cria Forma Studio

An interactive 3D showroom website for **Cria Forma**, a made-to-order additive manufacturing (3D printing) atelier based in São Paulo. Visitors orbit a virtual showroom, pick up a product, configure its material/color/size, and add it to a cart — all rendered live in WebGL, no pre-made product photos.

## Features

- **3D showroom** — products are arranged on pedestals in a scene you can orbit and click into, built with Three.js and React Three Fiber.
- **Procedural product geometry** — every piece (vase, ring, napkin holder, controller stand, etc.) is generated from primitive geometries in code, not loaded 3D model files.
- **Live configurator** — swap material (PLA, ceramic resin, metal deposition), color, and size, and see the change applied to the 3D piece and price in real time.
- **Catalog & cart** — a 2D catalog view with filters, and a cart ("Sacola") that carries auto-generated thumbnails rendered from the same 3D geometry.
- **Light/dark showroom ambience** and an "About the atelier" page with studio info.

## Tech stack

- [React 18](https://react.dev/) + TypeScript
- [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) + [drei](https://drei.docs.pmnd.rs/)
- [Next.js](https://nextjs.org/) for the web application

## Getting started

```bash
npm install
npm run dev       # start local dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
```

## Project structure

```
apps/web/        # Next.js application and 3D showroom
packages/shared/ # shared catalog, prices, and cart types
packages/db/     # Prisma schema, seed, and migrations
infra/           # Terraform infrastructure definitions
```

## Status

Early-stage prototype — content and copy are in Portuguese (pt-BR), matching the target audience.
