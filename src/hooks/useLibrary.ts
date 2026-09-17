import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Group = {
  id: string;
  name: string;
  pokemonIds: number[];
};

type LibraryState = {
  favouriteIds: number[];
  groups: Group[];
  toggleFavourite: (id: number) => void;
  createGroup: (name: string) => void;
  deleteGroup: (groupId: string) => void;
  setPokemonGroups: (pokemonId: number, groupIds: string[]) => void;
};

// Avoids crypto.randomUUID, which isn't available over plain http (e.g. testing on a phone via a LAN IP).
const createGroupId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const withoutPokemon = (group: Group, pokemonId: number): Group => ({
  ...group,
  pokemonIds: group.pokemonIds.filter((id) => id !== pokemonId),
});

export const useLibrary = create<LibraryState>()(
  persist(
    (set) => ({
      favouriteIds: [],
      groups: [],
      toggleFavourite: (id) =>
        set((state) =>
          state.favouriteIds.includes(id)
            ? {
                favouriteIds: state.favouriteIds.filter((favouriteId) => favouriteId !== id),
                // Groups only hold favourites, so unfavouriting also removes it from every group.
                groups: state.groups.map((group) => withoutPokemon(group, id)),
              }
            : { favouriteIds: [...state.favouriteIds, id] },
        ),
      createGroup: (name) =>
        set((state) => ({
          groups: [...state.groups, { id: createGroupId(), name, pokemonIds: [] }],
        })),
      deleteGroup: (groupId) =>
        set((state) => ({ groups: state.groups.filter((group) => group.id !== groupId) })),
      setPokemonGroups: (pokemonId, groupIds) =>
        set((state) => ({
          groups: state.groups.map((group) => {
            const isMember = group.pokemonIds.includes(pokemonId);
            const shouldBeMember = groupIds.includes(group.id);
            if (isMember === shouldBeMember) return group;
            return shouldBeMember
              ? { ...group, pokemonIds: [...group.pokemonIds, pokemonId] }
              : withoutPokemon(group, pokemonId);
          }),
        })),
    }),
    { name: "pokedex-library" },
  ),
);
