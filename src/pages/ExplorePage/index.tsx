import { getRouteApi } from "@tanstack/react-router";
import { useDeferredValue, useState } from "react";

import { PageHeading } from "../../components/PageHeading";
import { PokemonCardList } from "../../components/PokemonCardList";
import { TextInput } from "../../components/TextInput";
import { useLibrary } from "../../hooks/useLibrary";
import styles from "./index.module.scss";

const routeApi = getRouteApi("/");

// Ignore case, spaces and punctuation so "Mr Mime" matches "mr-mime" and "#25" matches "25".
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export const ExplorePage = () => {
  const pokemonList = routeApi.useLoaderData();
  const favouriteIds = useLibrary((state) => state.favouriteIds);
  const toggleFavourite = useLibrary((state) => state.toggleFavourite);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const searchTerm = normalize(deferredQuery);
  const items = pokemonList
    .filter(
      (pokemon) =>
        normalize(pokemon.name).includes(searchTerm) ||
        String(pokemon.id).padStart(4, "0").includes(searchTerm),
    )
    .map((pokemon) => ({
      ...pokemon,
      isFavourite: favouriteIds.includes(pokemon.id),
    }));

  return (
    <div className={styles["explore-page"]}>
      <PageHeading>Explore</PageHeading>
      <div className={styles["explore-page__search"]}>
        <TextInput
          type="search"
          aria-label="Search Pokémon"
          placeholder="Search by name or number"
          clearable
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {items.length > 0 ? (
        <PokemonCardList items={items} onFavouriteToggle={toggleFavourite} />
      ) : (
        <p className={styles["explore-page__empty"]}>No Pokémon match “{deferredQuery}”.</p>
      )}
    </div>
  );
};
