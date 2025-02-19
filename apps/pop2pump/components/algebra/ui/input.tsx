import * as React from "react";
import { Input as BaseInput } from "@/components/input";

export interface InputProps {
  onUserInput?: (value: string) => void;
  maxDecimals?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  classNames?: Record<string, string>;
  [key: string]: any;
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      onUserInput,
      maxDecimals = 18,
      onChange,
      value,
      className,
      classNames,
      ...props
    }: InputProps,
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value.replace(/,/g, ".");
      newValue =
        newValue.indexOf(".") >= 0
          ? newValue.slice(0, newValue.indexOf(".") + maxDecimals + 1)
          : newValue;

      if (
        newValue === "" ||
        inputRegex.test(newValue.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      ) {
        onChange?.(e);
        onUserInput?.(newValue);
      }
    };

    const handleClear = () => {
      const e = {
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange?.(e);
      onUserInput?.("");
    };

    return (
      <BaseInput
        ref={ref}
        value={value}
        onChange={handleChange}
        onClear={handleClear}
        className={className}
        classNames={classNames}
        inputMode="decimal"
        pattern="^[0-9]*[.,]?[0-9]*$"
        minLength={1}
        maxLength={100}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
