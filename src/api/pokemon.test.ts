import { describe, expect, it, vi } from "vitest";

import { getPokemonList } from "./pokemon";

const { VITE_API_BASE_URL, VITE_SPRITE_BASE_URL } = import.meta.env;

const stubPokemonListResponse = (results: { name: string; url: string }[]) => {
  const fetchMock = vi.fn(() =>
    Promise.resolve(Response.json({ count: results.length, next: null, previous: null, results })),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
};

describe("getPokemonList", () => {
  it("requests every Pokémon with the given abort signal", async () => {
    const fetchMock = stubPokemonListResponse([]);
    const controller = new AbortController();

    await getPokemonList(controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(`${VITE_API_BASE_URL}/pokemon/?limit=2000`, {
      signal: controller.signal,
    });
  });

  it("reads each id from its resource URL and builds the sprite URL", async () => {
    stubPokemonListResponse([
      { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
      { name: "mr-mime", url: "https://pokeapi.co/api/v2/pokemon/122/" },
      { name: "charizard-mega-x", url: "https://pokeapi.co/api/v2/pokemon/10034/" },
    ]);

    await expect(getPokemonList()).resolves.toEqual([
      { id: 1, name: "bulbasaur", spriteUrl: `${VITE_SPRITE_BASE_URL}/1.png` },
      { id: 122, name: "mr-mime", spriteUrl: `${VITE_SPRITE_BASE_URL}/122.png` },
      { id: 10034, name: "charizard-mega-x", spriteUrl: `${VITE_SPRITE_BASE_URL}/10034.png` },
    ]);
  });
});
