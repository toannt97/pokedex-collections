import { type ReactNode, useId } from "react";

import styles from "./index.module.scss";

type GroupSectionProps = {
  title: string;
  children: ReactNode;
} & ({ variant?: "normal"; onDelete: () => void } | { variant: "ungrouped"; onDelete?: undefined });

export const GroupSection = ({
  title,
  variant = "normal",
  onDelete,
  children,
}: GroupSectionProps) => {
  const titleId = useId();
  const className =
    variant === "ungrouped"
      ? `${styles["group-section"]} ${styles["group-section--ungrouped"]}`
      : styles["group-section"];

  return (
    <section aria-labelledby={titleId} className={className}>
      <header className={styles["group-section__header"]}>
        <h2 id={titleId} className={styles["group-section__title"]}>
          {title}
        </h2>
        {onDelete && (
          <button
            type="button"
            aria-label={`Delete group ${title}`}
            onClick={onDelete}
            className={styles["group-section__delete"]}
          >
            Delete
          </button>
        )}
      </header>
      <div className={styles["group-section__body"]}>{children}</div>
    </section>
  );
};
