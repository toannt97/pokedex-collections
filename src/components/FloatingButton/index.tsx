import { useContext } from "react";
import { createPortal } from "react-dom";

import { FloatingActionsContext } from "../../contexts/FloatingActionsContext";
import styles from "./index.module.scss";

type FloatingButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "style"
> & {
  icon?: string;
};

export const FloatingButton = ({
  icon,
  type = "button",
  children,
  ...buttonProps
}: FloatingButtonProps) => {
  const floatingActionsSlot = useContext(FloatingActionsContext);

  if (!floatingActionsSlot) return null;

  // Rendered into Layout's floating actions bar so it floats above the footer.
  return createPortal(
    <button {...buttonProps} type={type} className={styles["floating-button"]}>
      {icon && (
        <i
          aria-hidden="true"
          className={styles["floating-button__icon"]}
          style={{ backgroundImage: `url("${icon}")` }}
        />
      )}
      {children}
    </button>,
    floatingActionsSlot,
  );
};
