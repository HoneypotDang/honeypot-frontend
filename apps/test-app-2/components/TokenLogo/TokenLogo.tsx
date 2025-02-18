import { cn } from "@/lib/tailwindcss";
import { Token } from "@/services/contract/token";
import { Tooltip } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface TokenLogoProps {
  size?: number;
  token: Token;
  addtionalClasses?: string;
  disableLink?: boolean;
  disableTooltip?: boolean;
}

export const TokenLogo = observer(
  ({
    size,
    token,
    addtionalClasses,
    disableLink,
    disableTooltip,
    ...props
  }: TokenLogoProps) => {
    useEffect(() => {
      token.loadLogoURI();
      token.loadName();
      token.loadSymbol();
    }, [token]);
    return (
      <Tooltip
        content={
          <div className="flex flex-col items-center gap-[8px]">
            {token.name} ({token.symbol})
          </div>
        }
        isDisabled={disableTooltip}
        closeDelay={0}
      >
        <Link
          className="shrink-0"
          href={
            disableLink ? "#" : `https://berascan.com/address/${token.address}`
          }
          target={disableLink ? "" : "_blank"}
        >
          <Image
            className={cn(
              "border border-[color:var(--card-stroke,#F7931A)] rounded-[50%] cursor-pointer aspect-square bg-white",
              addtionalClasses
            )}
            src={
              !!token.logoURI
                ? token.logoURI
                : "/images/icons/tokens/unknown-token-icon.png"
            }
            alt=""
            width={size || 24}
            height={size || 24}
          />
        </Link>
      </Tooltip>
    );
  }
);

export default TokenLogo;
