import Image from "next/image";
import { Button as NextButton } from "@nextui-org/react";
import { motion } from "framer-motion";
import { itemSlideVariants } from "@/lib/animation";
import { truncate } from "@/lib/format";

interface CommentCardProps {
  commenterImageURL: string;
  commenterName: string;
  commentDate: Date;
  comment: string;
}

export function CommentCard(props: CommentCardProps) {
  return (
    <motion.div
      variants={itemSlideVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-3 my-2 p-2 bg-[#202020] rounded-md"
    >
      <div className="flex items-center gap-x-2">
        <div className="flex items-center gap-2 border border-[#FFCD4D] rounded-md w-fit">
          <Image
            src={props.commenterImageURL}
            width={24}
            height={24}
            alt="bera"
          ></Image>
          <div className="flex flex-col gap-1 overflow-hidden overflow-ellipsis break-words text-nowrap mx-2">
            <div className="text-white text-xs">
              <span className="hidden sm:inline">{props.commenterName}</span>
              <span className="inline sm:hidden">
                {truncate(props.commenterName, 10)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-white/50 text-xs">
          {props.commentDate.toLocaleString()}
        </div>
      </div>
      <div className="text-[rgba(255,255,255,0.66)] text-base font-normal leading-[normal]">
        {props.comment}
      </div>
      {/* <div className="flex justify-between items-center">
        <h3 className="pl-2 underline cursor-pointer">Show replies</h3>
        <NextButton>reply</NextButton>
      </div> */}
    </motion.div>
  );
}
