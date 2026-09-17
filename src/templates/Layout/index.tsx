import { type ReactNode, useState } from "react";

import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { ScrollToTop } from "../../components/ScrollToTop";
import { FloatingActionsContext } from "../../contexts/FloatingActionsContext";
import styles from "./index.module.scss";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const [floatingActionsSlot, setFloatingActionsSlot] = useState<HTMLDivElement | null>(null);

  return (
    <FloatingActionsContext value={floatingActionsSlot}>
      <div className={styles.layout}>
        <Header />
        <main className={styles.layout__content}>{children}</main>
        <div className={styles["layout__floating-actions"]}>
          <div ref={setFloatingActionsSlot} className={styles["layout__floating-slot"]} />
          <div className={styles["layout__scroll-to-top"]}>
            <ScrollToTop />
          </div>
        </div>
        <Footer />
      </div>
    </FloatingActionsContext>
  );
};
