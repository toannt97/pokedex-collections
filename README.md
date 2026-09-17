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
npm run test           # Unit test
npm run test:watch     # Unit test
```

---

## 2. Architecture and trade-offs

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

- **Unit test: Vitest**

### Trade-offs made for time limit

- **No pagination or virtualisation** - All ~1,300 cards render at once, which produces a visible delay on first paint. I chose to spend the remaining time on error states and accessibility instead. react-window would be the proper solution.

- **No component guide document** - The component should have usage guidelines for reusable components. For e.g, Storybook.

---

## 3. If I had more time

- **A detail modal on Explore** — opening a card would fetch that Pokémon's stats, abilities, and evolution chain. The detail endpoint is already used when favouriting, so the fetch layer is in place; this would mainly be UI work and a loading state inside the modal.
- **Real virtualisation** with `react-window`, replacing the display cap.
- **Wider test coverage** — group CRUD, error and empty states, and an end-to-end pass over the full favourite → group → reload flow.
- **** - the data integrity rules should be documented where they're implemented
- **E2E Testing with Playwright** - Implement and complete E2E tests for the main user flows.
- **Refactor code** - Add TSDoc on the store actions and API layer. Define the SCSS variables for colors.
