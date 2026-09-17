import { Link } from "@tanstack/react-router";

import styles from "./index.module.scss";

const NAV_ITEMS = [
  { label: "Explore", to: "/", exact: true },
  { label: "Collections", to: "/collections", exact: false },
] as const;

export const Header = () => (
  <header className={styles.header}>
    <Link to="/" className={styles.header__title}>
      Pokédex Collections
    </Link>
    <nav aria-label="Main">
      <ul className={styles.header__nav}>
        {NAV_ITEMS.map(({ label, to, exact }) => (
          <li key={to}>
            <Link to={to} activeOptions={{ exact }} className={styles.header__link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);
