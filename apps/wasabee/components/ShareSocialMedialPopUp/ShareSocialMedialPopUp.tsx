import { Button } from "../button";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";
import PopUp from "../PopUp/PopUp";
import { useRef } from "react";
import { PopupActions } from "reactjs-popup/dist/types";
import { text } from "stream/consumers";
import Image from "next/image";
import { popmodal } from "@/services/popmodal";

interface IShareSocialMedialPopUpProps
  extends React.HTMLAttributes<HTMLDivElement> {
  shareUrl: string;
  shareText: string;
  text?: React.ReactNode;
}

export function ShareMediaDisplay(props: IShareSocialMedialPopUpProps) {
  return (
    <div>
      <div className="m-2 text-right text-white">
        {" "}
        <Link
          className="cursor-pointer flex items-center gap-2 hover:text-primary"
          target="_blank"
          href={`https://twitter.com/intent/tweet?text=${props.shareText}%0A%0A${props.shareUrl}`}
        >
          <Image
            src="/images/twitter.png"
            alt=""
            width={20}
            height={20}
            className="bg-black rounded-full"
          />
          Share With Twitter
          <BiLinkExternal />
        </Link>
        {/* telegram */}
        <Link
          className="cursor-pointer flex items-center gap-2 hover:text-primary"
          target="_blank"
          href={`https://telegram.me/share/url?url=${props.shareUrl}%0A&text=${props.shareText}`}
        >
          <Image src="/images/telegram.svg" alt="" width={20} height={20} />
          Share With Telegram
          <BiLinkExternal />
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
