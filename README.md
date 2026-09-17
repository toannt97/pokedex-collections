# Pokédex Collections

Search Pokémon, save favourites, organise them into groups.

---

## 1. Running locally

**Requirements**

- Node version: 20 or later

**Commands**

```bash
npm install

npm run dev            # http://localhost:5173
npm run build          # typecheck (tsc -b) + production build to dist/
npm run preview        # serve the production build locally

npm run lint           # ESLint
npm run lint:css       # Stylelint over src/**/*.scss
npm run format         # Prettier, writes changes
npm run format:check   # Prettier
```

---

## 2. Architecture

The app has two pages: **Explore**, for browsing and searching the Pokédex and
favouriting Pokémon, and **Collections**, where favourites are organised into
groups.

### Framework and libraries

- **Framework: Vite + React + TypeScript** — the app is fully client-side, so
  SSR would add build complexity with no benefit. Trade-off: no SEO, and a brief
  blank frame before the bundle executes.

- **State: Zustand + persist** — covers the storage requirement in four lines.
  Writing to localStorage directly wouldn't work: it isn't reactive, so toggling
  a favourite wouldn't update the favourite icon.

- **Data fetching: a small custom hook with fetch** — the app makes one request for an immutable dataset, so a data-fetching library wasn't needed.

- **Styling: SCSS Modules** — scoping happens at build time.
