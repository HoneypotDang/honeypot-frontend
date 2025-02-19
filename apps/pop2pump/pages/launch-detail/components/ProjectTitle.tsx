import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { FaTelegram, FaGlobe } from "react-icons/fa";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { BiSearch } from "react-icons/bi";
import PairStatus from "@/components/atoms/TokenStatusDisplay/PairStatus";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import {
  pot2pumpShareLink,
  pot2PumpShareContent,
} from "@/config/socialSharingContents";
import { cn } from "@nextui-org/theme";
import Link from "next/link";
import { BiLinkExternal } from "react-icons/bi";

interface ProjectTitleProps {
  name?: string;
  displayName?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  address?: string;
  statusColor?: string;
  status?: string;
  isValidated?: boolean;
  pair?: MemePairContract;
}

const ProjectTitle: React.FC<ProjectTitleProps> = ({
  name,
  displayName,
  telegram,
  twitter,
  website,
  address,
  statusColor,
  status,
  isValidated,
  pair,
}) => {
  const isLoading = !pair;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center flex-col gap-3">
        <div className="flex items-center gap-1">
          {isLoading ? (
            <Skeleton className="h-8 w-[60px] bg-slate-200" />
          ) : (
            <div className="text-2xl">{displayName}</div>
          )}
          {isLoading ? (
            <Skeleton className="h-5 w-[150px] bg-slate-200" />
          ) : name ? (
            <div className="text-sm text-[#5C5C5C]/60">({name})</div>
          ) : null}
        </div>
        <div className="flex items-center gap-1">
          {isLoading ? (
            <>
              <Skeleton className="h-4 w-4 bg-slate-200" />
              <Skeleton className="h-4 w-4 bg-slate-200" />
              <Skeleton className="h-4 w-4 bg-slate-200" />
              <Skeleton className="h-4 w-4 bg-slate-200" />
              <Skeleton className="h-4 w-4 bg-slate-200" />
            </>
          ) : (
            <>
              {telegram && (
                <a
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 text-[#5C5C5C]"
                >
                  <FaTelegram size={16} />
                </a>
              )}
              {twitter && (
                <a
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 text-[#5C5C5C]"
                >
                  <FaXTwitter size={16} />
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 text-[#5C5C5C]"
                >
                  <FaGlobe size={16} />
                </a>
              )}
              {address && (
                <>
                  <Copy
                    content="Copy address"
                    value={address}
                    displayContent={
                      <div className="relative hover:opacity-80 text-[#5C5C5C]">
                        <VscCopy size={16} />
                      </div>
                    }
                  />
                  <a
                    href={`https://x.com/search?q=${address} or ${displayName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 text-[#5C5C5C]"
                    title="Search on X"
                  >
                    <BiSearch size={16} />
                  </a>
                </>
              )}
              <PairStatus
                status={status}
                statusColor={statusColor}
                isValidated={isValidated}
              />
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isLoading ? (
            <div className="m-2 flex items-center gap-2">
              <Skeleton className="h-6 w-16 bg-slate-200" />
              <Skeleton className="h-6 w-16 bg-slate-200" />
            </div>
          ) : pair ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#5C5C5C]">Share To</span>
              <div
                className={cn(
                  "m-2 text-right flex items-center gap-2 flex-row text-black"
                )}
              >
                <Link
                  className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                  target="_blank"
                  href={`https://twitter.com/intent/tweet?text=${pot2PumpShareContent(pair, "twitter")}%0A%0A${pot2pumpShareLink(pair)}`}
                >
                  <div className="flex items-center gap-1 hover:text-black/40">
                    X
                    <BiLinkExternal />
                  </div>
                </Link>
                <Link
                  className="cursor-pointer flex items-center gap-2 hover:text-primary flex-col"
                  target="_blank"
                  href={`https://telegram.me/share/url?url=${pot2pumpShareLink(pair)}%0A&text=${pot2PumpShareContent(pair, "telegram")}`}
                >
                  <div className="flex items-center gap-1 hover:text-black/40">
                    TG
                    <BiLinkExternal />
                  </div>
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProjectTitle;
