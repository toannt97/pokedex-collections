import { useCallback, useId, useRef, useState } from "react";

import styles from "./index.module.scss";

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "className" | "style"
> & {
  label?: string;
  errorMessage?: string;
  clearable?: boolean;
  ref?: React.RefCallback<HTMLInputElement>;
};

export const TextInput = ({
  label,
  errorMessage,
  clearable = false,
  ref,
  id,
  value,
  defaultValue,
  disabled,
  readOnly,
  onChange,
  "aria-describedby": ariaDescribedBy,
  ...inputProps
}: TextInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState(String(defaultValue ?? ""));

  const isControlled = value !== undefined;
  const hasValue = String(isControlled ? value : uncontrolledValue).length > 0;
  const showClear = clearable && hasValue && !disabled && !readOnly;

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      return ref?.(node);
    },
    [ref],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setUncontrolledValue(event.target.value);
    onChange?.(event);
  };

  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;

    // Set the value through the native setter and fire an input event so React calls
    // onChange with an empty value, which works for both controlled and uncontrolled inputs.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  };

  const describedBy = [ariaDescribedBy, errorMessage && errorId].filter(Boolean).join(" ");
  const fieldClassName = errorMessage
    ? `${styles["text-input__field"]} ${styles["text-input__field--error"]}`
    : styles["text-input__field"];

  return (
    <div className={styles["text-input"]}>
      {label && (
        <label htmlFor={inputId} className={styles["text-input__label"]}>
          {label}
        </label>
      )}
      <div className={fieldClassName}>
        <input
          {...inputProps}
          ref={setInputRef}
          id={inputId}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
          aria-invalid={errorMessage ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={styles["text-input__input"]}
        />
        {showClear && (
          <button
            type="button"
            aria-label="Clear"
            onClick={handleClear}
            className={styles["text-input__clear"]}
          >
            <i aria-hidden="true" className={styles["text-input__clear-icon"]} />
          </button>
        )}
      </div>
      {errorMessage && (
        <p id={errorId} role="alert" className={styles["text-input__error"]}>
          {errorMessage}
        </p>
      )}
    </div>
  );
};
