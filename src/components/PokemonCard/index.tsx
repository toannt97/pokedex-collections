import favouriteIcon from "@assets/icons/favourite-icon.svg";
import unfavouriteIcon from "@assets/icons/unfavourite-icon.svg";
import pokeballPlaceholder from "@assets/images/pokeball-placeholder.svg";

import styles from "./index.module.scss";

type PokemonCardProps = {
  id: number;
  name: string;
  spriteUrl: string | null;
  isFavourite: boolean;
  onFavouriteToggle: () => void;
};

export const PokemonCard = ({
  id,
  name,
  spriteUrl,
  isFavourite,
  onFavouriteToggle,
}: PokemonCardProps) => (
  <article className={styles["pokemon-card"]}>
    <div className={styles["pokemon-card__sprite"]}>
      <img
        src={spriteUrl ?? pokeballPlaceholder}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = pokeballPlaceholder;
        }}
        className={styles["pokemon-card__image"]}
      />
      <button
        type="button"
        className={styles["pokemon-card__favourite"]}
        aria-label={`Favourite ${name}`}
        aria-pressed={isFavourite}
        onClick={onFavouriteToggle}
      >
        <img
          src={isFavourite ? favouriteIcon : unfavouriteIcon}
          alt=""
          className={styles["pokemon-card__favourite-icon"]}
        />
      </button>
    </div>
    <h3 className={styles["pokemon-card__name"]}>{name}</h3>
    <p className={styles["pokemon-card__number"]}>#{String(id).padStart(4, "0")}</p>
  </article>
);
