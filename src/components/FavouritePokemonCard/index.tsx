import pokeballPlaceholder from "@assets/images/pokeball-placeholder.svg";

import styles from "./index.module.scss";

type FavouritePokemonCardProps = {
  id: number;
  name: string;
  spriteUrl: string | null;
  onGroup: () => void;
  onUnfavourite: () => void;
};

export const FavouritePokemonCard = ({
  id,
  name,
  spriteUrl,
  onGroup,
  onUnfavourite,
}: FavouritePokemonCardProps) => (
  <article className={styles["favourite-pokemon-card"]}>
    <div className={styles["favourite-pokemon-card__sprite"]}>
      <img
        src={spriteUrl ?? pokeballPlaceholder}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = pokeballPlaceholder;
        }}
        className={styles["favourite-pokemon-card__image"]}
      />
    </div>
    <div className={styles["favourite-pokemon-card__info"]}>
      <h3 className={styles["favourite-pokemon-card__name"]}>{name}</h3>
      <p className={styles["favourite-pokemon-card__number"]}>#{String(id).padStart(4, "0")}</p>
    </div>
    <div className={styles["favourite-pokemon-card__actions"]}>
      <button
        type="button"
        aria-label={`Group ${name}`}
        onClick={onGroup}
        className={`${styles["favourite-pokemon-card__action"]} ${styles["favourite-pokemon-card__action--primary"]}`}
      >
        Group
      </button>
      <button
        type="button"
        aria-label={`Unfavourite ${name}`}
        onClick={onUnfavourite}
        className={styles["favourite-pokemon-card__action"]}
      >
        Unfavourite
      </button>
    </div>
  </article>
);
