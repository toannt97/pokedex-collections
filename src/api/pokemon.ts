import { getJson } from "./clients";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SPRITE_BASE_URL = import.meta.env.VITE_SPRITE_BASE_URL;

type NamedApiResource = {
  name: string;
  url: string;
};

type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

export type PokemonSummary = {
  id: number;
  name: string;
  spriteUrl: string;
};

// Resource URLs end with the id, e.g. "https://pokeapi.co/api/v2/pokemon/25/".
const getIdFromUrl = (url: string) => Number(url.split("/").filter(Boolean).at(-1));

export async function getPokemonList(signal?: AbortSignal): Promise<PokemonSummary[]> {
  const { results } = await getJson<PokemonListResponse>(
    `${API_BASE_URL}/pokemon/?limit=2000`,
    signal,
  );

  return results.map(({ name, url }) => {
    const id = getIdFromUrl(url);
    return { id, name, spriteUrl: `${SPRITE_BASE_URL}/${id}.png` };
  });
}
