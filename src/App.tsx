import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

import { getPokemonList } from "./api/pokemon";
import { CollectionsPage } from "./pages/CollectionsPage";
import { ExplorePage } from "./pages/ExplorePage";
import { Layout } from "./templates/Layout";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Both pages need the full list. PokéAPI lets the browser cache it for a day, so loading it on a
// second route is served from that cache.
const pokemonListRouteOptions = {
  loader: ({ abortController }: { abortController: AbortController }) =>
    getPokemonList(abortController.signal),
  staleTime: Infinity,
  pendingMs: 0,
  pendingComponent: () => <p>Loading Pokémon…</p>,
  errorComponent: ({ error }: { error: Error }) => <p>{error.message}</p>,
};

const exploreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  ...pokemonListRouteOptions,
  component: ExplorePage,
});

const collectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collections",
  ...pokemonListRouteOptions,
  component: CollectionsPage,
});

const routeTree = rootRoute.addChildren([exploreRoute, collectionsRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => <RouterProvider router={router} />;

export default App;
