import { type ReactNode, useEffect, useId, useRef } from "react";

import styles from "./index.module.scss";

type ModalProps = {
  title: ReactNode;
  description?: ReactNode;
  media?: ReactNode;
  divided?: boolean;
  footer?: ReactNode;
  children: ReactNode;
  onClose: () => void;
};

// Opens as soon as it mounts, so render it conditionally to show and hide it.
export const Modal = ({
  title,
  description,
  media,
  divided = false,
  footer,
  children,
  onClose,
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      openerRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    // Removing the dialog doesn't restore focus the way close() does, so return it to the opener.
    return () => openerRef.current?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onPointerDown={(event) => {
        // The content fills the dialog, so presses that target the dialog itself are on the backdrop.
        if (event.target === event.currentTarget) onClose();
      }}
      className={divided ? `${styles.modal} ${styles["modal--divided"]}` : styles.modal}
    >
      <header className={styles.modal__header}>
        {media && <div className={styles.modal__media}>{media}</div>}
        <div className={styles.modal__heading}>
          <h2 id={titleId} className={styles.modal__title}>
            {title}
          </h2>
          {description && <p className={styles.modal__description}>{description}</p>}
        </div>
        <button type="button" aria-label="Close" onClick={onClose} className={styles.modal__close}>
          <i aria-hidden="true" className={styles["modal__close-icon"]} />
        </button>
      </header>
      <div className={styles.modal__body}>{children}</div>
      {footer && <footer className={styles.modal__footer}>{footer}</footer>}
    </dialog>
  );
};
