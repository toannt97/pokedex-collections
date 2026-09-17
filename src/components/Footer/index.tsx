import styles from "./index.module.scss";

export const Footer = () => (
  <footer className={styles.footer}>
    Data from{" "}
    <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className={styles.footer__link}>
      PokéAPI
    </a>
  </footer>
);
