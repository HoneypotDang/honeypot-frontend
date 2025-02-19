import { Button } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const SocialsAndCommunity = () => {
  return (
    <div>
      <div className="font-medium">
        <div className="text-xl leading-[26px]">Social Media</div>
        <div className="text-[12px] leading-4 text-white/50">
          Connect your social media to coninue. (Twitter is mandatory)
        </div>
      </div>
      <div className="mt-[38px]">
        <div className="text-[12px] leading-4 text-white/50">Required</div>
        <div className="flex items-center p-1 bg-[#3E2A0FC4] w-fit rounded-xl border border-[#F7931AA8] mt-1">
          <div className="ml-4 flex gap-2">
            <Image
              src="/images/x-icon.png"
              alt="x icon"
              width={19}
              height={17}
            />
            <div className="text-sm font-normal">X (Twitter)</div>
          </div>
          <Button className="border-0 outline-0 ml-4 h-10 bg-[#865215] text-sm font-normal">
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SocialsAndCommunity;
