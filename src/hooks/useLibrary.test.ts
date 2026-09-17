import { beforeEach, describe, expect, it } from "vitest";

import { type Group, useLibrary } from "./useLibrary";

const group = (id: string, pokemonIds: number[]): Group => ({ id, name: `Group ${id}`, pokemonIds });

describe("useLibrary", () => {
  beforeEach(() => {
    useLibrary.setState(useLibrary.getInitialState(), true);
    localStorage.clear();
  });

  describe("toggleFavourite", () => {
    it("adds a Pokémon that isn't a favourite", () => {
      useLibrary.getState().toggleFavourite(25);

      expect(useLibrary.getState().favouriteIds).toEqual([25]);
    });

    it("removes a favourite from favourites and from every group", () => {
      useLibrary.setState({
        favouriteIds: [1, 25],
        groups: [group("a", [1, 25]), group("b", [25])],
      });

      useLibrary.getState().toggleFavourite(25);

      const { favouriteIds, groups } = useLibrary.getState();
      expect(favouriteIds).toEqual([1]);
      expect(groups.map((g) => g.pokemonIds)).toEqual([[1], []]);
    });
  });

  describe("createGroup", () => {
    it("adds an empty group with a unique id", () => {
      useLibrary.getState().createGroup("Starters");
      useLibrary.getState().createGroup("Legendaries");

      const { groups } = useLibrary.getState();
      expect(groups).toMatchObject([
        { name: "Starters", pokemonIds: [] },
        { name: "Legendaries", pokemonIds: [] },
      ]);
      expect(groups[0].id).not.toBe(groups[1].id);
    });
  });

  describe("deleteGroup", () => {
    it("removes only that group and keeps its Pokémon as favourites", () => {
      useLibrary.setState({ favouriteIds: [1, 25], groups: [group("a", [1]), group("b", [25])] });

      useLibrary.getState().deleteGroup("a");

      const { favouriteIds, groups } = useLibrary.getState();
      expect(groups.map((g) => g.id)).toEqual(["b"]);
      expect(favouriteIds).toEqual([1, 25]);
    });
  });

  describe("setPokemonGroups", () => {
    it("adds the Pokémon to and removes it from groups to match the given ids", () => {
      useLibrary.setState({ groups: [group("a", [25]), group("b", []), group("c", [1])] });

      useLibrary.getState().setPokemonGroups(25, ["b", "c"]);

      expect(useLibrary.getState().groups.map((g) => g.pokemonIds)).toEqual([[], [25], [1, 25]]);
    });

    it("doesn't add the Pokémon twice to a group it's already in", () => {
      useLibrary.setState({ groups: [group("a", [25])] });

      useLibrary.getState().setPokemonGroups(25, ["a"]);

      expect(useLibrary.getState().groups[0].pokemonIds).toEqual([25]);
    });
  });

  it("saves favourites and groups to localStorage", () => {
    useLibrary.getState().toggleFavourite(25);
    useLibrary.getState().createGroup("Starters");

    const saved = JSON.parse(localStorage.getItem("pokedex-library") ?? "null");
    expect(saved.state).toMatchObject({
      favouriteIds: [25],
      groups: [{ name: "Starters", pokemonIds: [] }],
    });
  });
});
