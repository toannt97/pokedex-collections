import type { ReactNode } from "react";

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import styles from "./index.module.scss";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <div className={styles.layout}>
    <Header />
    <main className={styles.layout__content}>{children}</main>
    <Footer />
  </div>
);
