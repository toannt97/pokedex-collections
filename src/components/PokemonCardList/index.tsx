import type { ComponentProps } from "react";

import { PokemonCard } from "../PokemonCard";
import styles from "./index.module.scss";

type PokemonCardItem = Omit<ComponentProps<typeof PokemonCard>, "onFavouriteToggle">;

type PokemonCardListProps = {
  items: PokemonCardItem[];
  onFavouriteToggle: (id: number) => void;
};

export const PokemonCardList = ({ items, onFavouriteToggle }: PokemonCardListProps) => (
  <ul className={styles["pokemon-card-list"]}>
    {items.map((item) => (
      <li key={item.id}>
        <PokemonCard {...item} onFavouriteToggle={() => onFavouriteToggle(item.id)} />
      </li>
    ))}
  </ul>
);
