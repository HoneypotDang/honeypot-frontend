import { HTMLAttributes } from "react";
import clsx from "clsx";
import { makeAutoObservable } from "mobx";
import React from "react";
import { observer } from "mobx-react-lite";
import { cn } from "../../lib/tailwindcss";

export class SelectState {
  value: string | number | null = null;
  _onSelectChange: (value: string | number) => void = (
    value: string | number
  ) => {};
  onSelectChange(value: string | number) {
    this.value = value;
    this._onSelectChange(value);
  }
  constructor({ onSelectChange, ...args }: Partial<SelectState> = {}) {
    Object.assign(this, args);
    if (onSelectChange) {
      this._onSelectChange = onSelectChange;
    }
    makeAutoObservable(this);
  }
}

const SelectContext = React.createContext<SelectState>(new SelectState());

export const SelectItem = observer(
  ({
    children,
    value,
    className,
    ...props
  }: {
    children: React.ReactNode;
    value?: string | number;
  } & HTMLAttributes<any>) => {
    const selectState = React.useContext(SelectContext);
    return (
      <div
        className={cn(
          "flex h-[30px] px-[8px] flex-col justify-center items-center shrink-0 [background:#523914] rounded-lg cursor-pointer hover:brightness-150",
          selectState?.value === value
            ? "border-primary border-solid border-[1px] [background:rgba(247,147,26,0.37)]"
            : "",
          className
        )}
        onClick={() => {
          value && selectState?.onSelectChange(value);
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const ItemSelect = observer(
  ({
    children,
    selectState,
    className,
    ...props
  }: {
    children: React.ReactNode;
    selectState: SelectState;
  } & HTMLAttributes<any>) => {
    return (
      <SelectContext.Provider value={selectState}>
        <div
          className={cn("flex items-center gap-[8px]", className)}
          {...props}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  }
);
