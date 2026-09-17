import plusIcon from "@assets/icons/plus-icon.svg";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import type { PokemonSummary } from "../../api/pokemon";
import { FavouritePokemonCard } from "../../components/FavouritePokemonCard";
import { FloatingButton } from "../../components/FloatingButton";
import { GroupSection } from "../../components/GroupSection";
import { NewGroupModal } from "../../components/NewGroupModal";
import { PageHeading } from "../../components/PageHeading";
import { PokemonGroupsModal } from "../../components/PokemonGroupsModal";
import { useLibrary } from "../../hooks/useLibrary";
import styles from "./index.module.scss";

const routeApi = getRouteApi("/collections");

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const CollectionsPage = () => {
  const pokemonList = routeApi.useLoaderData();
  const favouriteIds = useLibrary((state) => state.favouriteIds);
  const groups = useLibrary((state) => state.groups);
  const toggleFavourite = useLibrary((state) => state.toggleFavourite);
  const createGroup = useLibrary((state) => state.createGroup);
  const deleteGroup = useLibrary((state) => state.deleteGroup);
  const setPokemonGroups = useLibrary((state) => state.setPokemonGroups);

  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [groupingPokemonId, setGroupingPokemonId] = useState<number | null>(null);

  const pokemonById = useMemo(
    () => new Map(pokemonList.map((pokemon) => [pokemon.id, pokemon])),
    [pokemonList],
  );
  const toPokemon = (ids: number[]) => ids.flatMap((id) => pokemonById.get(id) ?? []);

  const groupedIds = new Set(groups.flatMap((group) => group.pokemonIds));
  const ungrouped = toPokemon(favouriteIds.filter((id) => !groupedIds.has(id)));
  const groupingPokemon =
    groupingPokemonId === null ? undefined : pokemonById.get(groupingPokemonId);
  const isEmpty = favouriteIds.length === 0;

  const handleUnfavourite = (id: number, name: string) => {
    const groupsNote = groupedIds.has(id) ? " It will also be removed from its groups." : "";
    if (window.confirm(`Remove ${capitalize(name)} from your favourites?${groupsNote}`)) {
      toggleFavourite(id);
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (window.confirm(`Delete the group “${groupName}”? Its Pokémon stay in your favourites.`)) {
      deleteGroup(groupId);
    }
  };

  const renderCards = (pokemon: PokemonSummary[]) => (
    <ul className={styles["collections-page__cards"]}>
      {pokemon.map(({ id, name, spriteUrl }) => (
        <li key={id}>
          <FavouritePokemonCard
            id={id}
            name={name}
            spriteUrl={spriteUrl}
            onGroup={() => setGroupingPokemonId(id)}
            onUnfavourite={() => handleUnfavourite(id, name)}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={styles["collections-page"]}>
      <PageHeading>Collections</PageHeading>

      {isEmpty ? (
        <p className={styles["collections-page__empty-state"]}>
          No favourites yet. Tap the heart on a Pokémon in{" "}
          <Link to="/" className={styles["collections-page__link"]}>
            Explore
          </Link>{" "}
          to save it here.
        </p>
      ) : (
        <>
          {groups.map((group) => {
            const members = toPokemon(group.pokemonIds);
            return (
              <GroupSection
                key={group.id}
                title={group.name}
                onDelete={() => handleDeleteGroup(group.id, group.name)}
              >
                {members.length > 0 ? (
                  renderCards(members)
                ) : (
                  <p className={styles["collections-page__empty"]}>
                    No Pokémon yet. Use “Group” on a card to add one.
                  </p>
                )}
              </GroupSection>
            );
          })}
          {ungrouped.length > 0 && (
            <GroupSection title="Ungrouped" variant="ungrouped">
              {renderCards(ungrouped)}
            </GroupSection>
          )}
        </>
      )}

      <FloatingButton icon={plusIcon} onClick={() => setIsNewGroupModalOpen(true)}>
        New group
      </FloatingButton>

      {isNewGroupModalOpen && (
        <NewGroupModal
          existingGroupNames={groups.map((group) => group.name)}
          onClose={() => setIsNewGroupModalOpen(false)}
          onCreate={(name) => {
            createGroup(name);
            setIsNewGroupModalOpen(false);
          }}
        />
      )}

      {groupingPokemon && (
        <PokemonGroupsModal
          pokemon={groupingPokemon}
          groups={groups}
          selectedGroupIds={groups
            .filter((group) => group.pokemonIds.includes(groupingPokemon.id))
            .map((group) => group.id)}
          onClose={() => setGroupingPokemonId(null)}
          onSave={(groupIds) => {
            setPokemonGroups(groupingPokemon.id, groupIds);
            setGroupingPokemonId(null);
          }}
        />
      )}
    </div>
  );
};
