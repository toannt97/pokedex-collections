import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ExplorePage } from ".";
import type { PokemonSummary } from "../../api/pokemon";
import { useLibrary } from "../../hooks/useLibrary";

const POKEMON_LIST: PokemonSummary[] = [
  { id: 1, name: "bulbasaur", spriteUrl: "https://example.com/1.png" },
  { id: 25, name: "pikachu", spriteUrl: "https://example.com/25.png" },
  { id: 122, name: "mr-mime", spriteUrl: "https://example.com/122.png" },
];

// ExplorePage reads the list from the "/" route's loader, so render it inside a router.
const renderExplorePage = async () => {
  const rootRoute = createRootRoute();
  const exploreRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    loader: () => POKEMON_LIST,
    component: ExplorePage,
  });
  const router = createRouter({
    routeTree: rootRoute.addChildren([exploreRoute]),
    history: createMemoryHistory(),
  });

  render(<RouterProvider router={router} />);
  await screen.findByRole("heading", { name: "Explore" });

  return { user: userEvent.setup(), searchInput: screen.getByRole("searchbox") };
};

const getListedNames = () =>
  screen.queryAllByRole("heading", { level: 3 }).map((heading) => heading.textContent);

describe("ExplorePage", () => {
  beforeEach(() => {
    useLibrary.setState(useLibrary.getInitialState(), true);
    localStorage.clear();
  });

  it("lists every Pokémon before searching", async () => {
    await renderExplorePage();

    expect(getListedNames()).toEqual(["bulbasaur", "pikachu", "mr-mime"]);
  });

  it("matches names ignoring case, spaces and punctuation", async () => {
    const { user, searchInput } = await renderExplorePage();

    await user.type(searchInput, "Mr. Mime");

    expect(getListedNames()).toEqual(["mr-mime"]);
  });

  it("matches the Pokédex number with or without # and leading zeros", async () => {
    const { user, searchInput } = await renderExplorePage();

    await user.type(searchInput, "#25");
    expect(getListedNames()).toEqual(["pikachu"]);

    await user.clear(searchInput);
    await user.type(searchInput, "0001");
    expect(getListedNames()).toEqual(["bulbasaur"]);
  });

  it("shows a message when nothing matches", async () => {
    const { user, searchInput } = await renderExplorePage();

    await user.type(searchInput, "zzz");

    expect(getListedNames()).toEqual([]);
    expect(screen.getByText("No Pokémon match “zzz”.")).toBeInTheDocument();
  });

  it("shows and toggles favourites from the library", async () => {
    useLibrary.setState({ favouriteIds: [25] });
    const { user } = await renderExplorePage();

    expect(screen.getByRole("button", { name: "Favourite pikachu" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Favourite bulbasaur" }));

    expect(useLibrary.getState().favouriteIds).toEqual([25, 1]);
    expect(screen.getByRole("button", { name: "Favourite bulbasaur" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
