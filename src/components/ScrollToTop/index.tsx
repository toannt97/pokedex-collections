import { useSyncExternalStore } from "react";

import styles from "./index.module.scss";

const subscribe = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
};

const getIsScrolledPastViewport = () => window.scrollY > window.innerHeight;

const scrollToTop = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
};

export const ScrollToTop = () => {
  const isVisible = useSyncExternalStore(subscribe, getIsScrolledPastViewport);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={styles["scroll-to-top"]}
    >
      <i aria-hidden="true" className={styles["scroll-to-top__icon"]} />
    </button>
  );
};
