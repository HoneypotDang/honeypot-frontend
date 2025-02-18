declare module "react-copy-to-clipboard" {
  import * as React from "react";

  export interface CopyToClipboardProps {
    text: string;
    onCopy?: (text: string, result: boolean) => void;
    children?: React.ReactNode;
  }

  export const CopyToClipboard: React.FC<CopyToClipboardProps>;
}
