import styles from "./PopUp.module.scss";

import Popup from "reactjs-popup";
import { PopupActions } from "reactjs-popup/dist/types";
import { cn } from "@/lib/tailwindcss";
//icons
import xIcon from "@/public/images/pop-up/x-icon.svg";
import successIcon from "@/public/images/pop-up/pop-up-success-icon.svg";
import pendingIcon from "@/public/images/pop-up/pop-up-pending-icon.svg";
import warningIcon from "@/public/images/pop-up/pop-up-warning-icon.svg";
import { useRef, useState } from "react";
import Image from "next/image";

interface PopUpProps extends React.HTMLProps<HTMLDivElement> {
  info: "success" | "error" | "warning" | "pending" | "normal";
  trigger: JSX.Element;
  contents: JSX.Element;
  open?: boolean;
  onClose?: () => void;
}

export default function PopUp({ info = "normal", ...props }: PopUpProps) {
  const popupRef = useRef<PopupActions>(null);

  const popUpIcon = () => {
    switch (info) {
      case "success":
        return successIcon;
      case "error":
        return warningIcon;
      case "warning":
        return warningIcon;
      case "pending":
        return pendingIcon;
      default:
        return "";
    }
  };

  return (
    <Popup
      onClose={props.onClose}
      open={props.open}
      modal
      closeOnDocumentClick
      ref={popupRef}
      trigger={props.trigger}
    >
      <div className={cn(styles["pop-up"], styles[info])}>
        <div className={styles["pop-up-container"]}>
          {popUpIcon() && (
            <Image
              className={styles["pop-up-type-img"]}
              src={popUpIcon()}
              alt=""
              width={50}
              height={50}
            />
          )}

          <div className={styles["pop-up-content"]}>{props.contents}</div>

          <div>
            <Image
              className={styles["pop-up-close-button"]}
              src={xIcon}
              alt=""
              onClick={() => popupRef.current?.close()}
              width={50}
              height={50}
            />
          </div>
        </div>
      </div>
    </Popup>
  );
}
