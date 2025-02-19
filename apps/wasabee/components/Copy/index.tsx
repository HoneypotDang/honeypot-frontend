import { Tooltip } from "@nextui-org/react";
import clsx from "clsx";
import { observer, useLocalObservable } from "mobx-react-lite";
import React, { HTMLAttributes } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { IconType } from "react-icons/lib";
import { VscCopy } from "react-icons/vsc";

export const CopyTrigger = observer(
  ({
    state,
    className,
    content,
    displayContent,
    copiedContent,
    ...props
  }: {
    state: {
      copied: boolean;
      isTooltipOpen: boolean;
      setTooltipOpen(value: boolean): void;
      setCopied(value: boolean): void;
    };
    displayContent?: React.ReactNode;
    content?: string;
    copiedContent?: string;
  } & Partial<IconType> &
    Partial<HTMLAttributes<any>>) => {
    return (
      <Tooltip
        isOpen={state.isTooltipOpen}
        content={state.copied ? copiedContent ?? "Copied" : content ?? "Copy"}
        classNames={{
          base: "",
          content: "bg-[#6B4311]",
        }}
      >
        <span
          onMouseEnter={() => {
            state.setTooltipOpen(true);
          }}
          onMouseLeave={() => {
            state.setTooltipOpen(false);
            state.setCopied(false);
          }}
          className={clsx(
            "inline-block cursor-pointer hover:text-primary",
            className
          )}
          {...props}
        >
          {displayContent ? (
            displayContent
          ) : (
            <VscCopy className="w-full h-full"></VscCopy>
          )}
        </span>
      </Tooltip>
    );
  }
);

export const Copy = observer(
  ({
    value,
    displayContent,
    ...props
  }: { value: string; displayContent?: React.ReactNode } & Partial<IconType> &
    Partial<HTMLAttributes<any>>) => {
    const state = useLocalObservable(() => ({
      copied: false,
      isTooltipOpen: false,
      setTooltipOpen(value: boolean) {
        this.isTooltipOpen = value;
      },
      setCopied(value: boolean) {
        this.copied = value;
      },
    }));
    return (
      <CopyToClipboard
        text={value}
        onCopy={() => {
          console.log("copied");
          state.setCopied(true);
        }}
      >
        <CopyTrigger
          displayContent={displayContent}
          state={state}
          {...props}
        ></CopyTrigger>
      </CopyToClipboard>
    );
  }
);
