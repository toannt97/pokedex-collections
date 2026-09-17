import styles from "./index.module.scss";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "style"> & {
  variant?: "primary" | "secondary";
};

export const Button = ({ variant = "primary", type = "button", ...buttonProps }: ButtonProps) => (
  <button
    {...buttonProps}
    type={type}
    className={`${styles.button} ${styles[`button--${variant}`]}`}
  />
);
