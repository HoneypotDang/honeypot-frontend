import { Button } from "../button";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import PopUp from "../PopUp/PopUp";
import { useRef } from "react";
import { PopupActions } from "reactjs-popup/dist/types";
import { text } from "stream/consumers";
import Image from "next/image";
import { popmodal } from "@/services/popmodal";
import { cn } from "@/lib/tailwindcss";

interface IShareSocialMedialPopUpProps
  extends React.HTMLAttributes<HTMLDivElement> {
  shareUrl: string;
  shareText: string;
  text?: React.ReactNode;
  noIcon?: boolean;
}

export function ShareMediaDisplay(props: IShareSocialMedialPopUpProps) {
  return (
    <div>
      <div className={cn("m-2 text-right text-white gap-2", props.className)}>
        {" "}
        <Link
          className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
          target="_blank"
          href={`https://twitter.com/intent/tweet?text=${props.shareText}%0A%0A${props.shareUrl}`}
        >
          {!props.noIcon && (
            <Image
              src="/images/twitter.svg"
              alt=""
              width={20}
              height={20}
              className="bg-black rounded-full"
            />
          )}
          <div className="flex items-center gap-1">
            Share With Twitter
            <BiLinkExternal />
          </div>
        </Link>
        {/* telegram */}
        <Link
          className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
          target="_blank"
          href={`https://telegram.me/share/url?url=${props.shareUrl}%0A&text=${props.shareText}`}
        >
          {!props.noIcon && (
            <Image src="/images/telegram.svg" alt="" width={20} height={20} />
          )}
          <div className="flex items-center gap-1">
            Share With Telegram
            <BiLinkExternal />
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function ShareSocialMedialPopUp(
  props: IShareSocialMedialPopUpProps
) {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        popmodal.openModal({
          content: (
            <ShareMediaDisplay
              shareText={props.shareText}
              shareUrl={props.shareUrl}
            />
          ),
        });
      }}
      className="flex items-center gap-2 cursor-pointer hover:text-primary"
    >
      <span className="">{props.text}</span>
    </div>
  );
}
