import type { ReactNode } from "react";

import styles from "./index.module.scss";

type PageHeadingProps = {
  children: ReactNode;
};

export const PageHeading = ({ children }: PageHeadingProps) => (
  <h1 className={styles["page-heading"]}>
    <span className={styles["page-heading__text"]}>{children}</span>
  </h1>
);
