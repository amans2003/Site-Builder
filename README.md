# Site Builder

A full-stack, drag-and-drop website builder — build pages visually, generate
sites with AI, and export a real, downloadable static site. Built on the
MERN stack (MongoDB, Express, React, Node.js).

**Live app:** https://site-builder-client-five.vercel.app

## Features

- **Drag-and-drop editor** — add, reorder, and configure sections (hero,
  navbar, gallery, pricing, testimonials, product grid/detail, contact form,
  custom code, etc.) on a live canvas with undo/redo and autosave.
- **AI site generation** — describe a site in plain language and get a full
  set of pages/sections back; continue the conversation to refine it. Also
  supports AI-generated custom HTML/CSS/JS for one-off sections.
- **Reusable sections** — mark any section as reusable and drop it onto
  other pages; editing one instance updates every page that uses it.
- **Ecommerce-ready** — a Products collection with its own management page;
  product cards link to an auto-generated detail page, a specific page of
  your choice, or a custom URL.
- **Live preview** — server-rendered preview of any page, including
  per-product detail pages, without needing to export first.
- **Static export** — download a real, ready-to-host HTML/CSS/JS bundle of
  the whole site, with uploaded images collected into an `assets/` folder.
- **Auth & multi-project** — JWT-based login/signup, with a dashboard for
  managing multiple site projects.
- **Contact form submissions** — forms embedded in exported/previewed sites
  post back to the backend and show up in a submissions inbox.

## Tech stack

- **Client:** React (Vite), Zustand, React Router, Tailwind CSS, dnd-kit
- **Server:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Shared:** a schema-driven section registry package consumed by both the
  editor UI and the server-side static site generator, so every section type
  (fields, defaults, rendering) is defined once
- **AI:** Google Gemini (default, free tier) or OpenAI, selectable via env var
- npm workspaces monorepo (`client/`, `server/`, `shared/`)

## Project structure

```
client/    React app — editor UI, dashboard, auth pages
server/    Express API — auth, projects, products, AI, export, preview
shared/    Section registry shared by client and server (single source of
           truth for each section's fields, defaults, and HTML rendering)
```

## Running locally

Requires Node.js and a MongoDB instance (local or Atlas).

```bash
npm install

# copy env templates and fill in your own values
cp server/.env.example server/.env   # MONGO_URI, JWT_SECRET, AI keys, etc.
cp client/.env.example client/.env   # only needed if not using the dev proxy

npm run dev:server   # http://localhost:5050
npm run dev:client   # http://localhost:5173
```

In local dev the client talks to the server through Vite's dev proxy, so
`VITE_API_BASE_URL` can stay unset.

## Deployment

- **Client** is deployed on Vercel (Root Directory: `client`, Build Command:
  `npm run build -w client`, Output Directory: `dist`).
- **Server** is deployed on Render.
- The two communicate cross-origin, so:
  - Server needs `CLIENT_ORIGIN` set to the client's production URL (CORS).
  - Client needs `VITE_API_BASE_URL` set to the server's public URL.
