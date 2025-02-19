import { Currency } from "@cryptoalgebra/sdk";
import React from "react";
import { Address } from "viem";
import USDTLogo from "@/assets/algebra/tokens/usdt.png";
import USDCLogo from "@/assets/algebra/tokens/usdc.svg";
import WBTCLogo from "@/assets/algebra/tokens/wbtc.svg";
import EtherLogo from "@/assets/algebra/tokens/ether.svg";
import { cn } from "@/lib/tailwindcss";
import { Skeleton } from "@/components/algebra/ui/skeleton";
import Image from "next/image";

interface CurrencyLogoProps {
  currency: Currency | undefined | null;
  size: number;
  className?: string;
  style?: React.CSSProperties;
}

export const specialTokens: {
  [key: Address]: { symbol: string; logo: string };
} = {
  ["0x94373a4919b3240d86ea41593d5eba789fef3848"]: {
    symbol: "ETH",
    logo: EtherLogo,
  },
  ["0x7d98346b3b000c55904918e3d9e2fc3f94683b01"]: {
    symbol: "USDT",
    logo: USDTLogo.src,
  },
  ["0x9dad8a1f64692adeb74aca26129e0f16897ff4bb"]: {
    symbol: "WBTC",
    logo: WBTCLogo,
  },
  ["0x6581e59a1c8da66ed0d313a0d4029dce2f746cc5"]: {
    symbol: "USDC",
    logo: USDCLogo,
  },
};

const CurrencyLogo = ({
  currency,
  size,
  className,
  style = {},
}: CurrencyLogoProps) => {
  if (!currency)
    return (
      <Skeleton
        className={cn(`flex rounded-full bg-card-dark`, className)}
        style={{
          minWidth: `${size}px`,
          minHeight: `${size}px`,
          width: `${size}px`,
          height: `${size}px`,
          ...style,
        }}
      />
    );

  const address = currency.wrapped.address.toLowerCase() as Address;

  const classString = cn(
    `w-[${size}px] h-[${size}px] min-w-[${size}px] min-h-[${size}px] bg-card-dark rounded-full`,
    className
  );

  if (address in specialTokens) {
    return (
      <Image
        src={specialTokens[address].logo}
        alt={specialTokens[address].symbol}
        width={size}
        height={size}
        className={classString}
        style={style}
      />
    );
  }

  if (currency.isNative) {
    return (
      <Image
        src={WBTCLogo}
        alt={"ETH"}
        width={size}
        height={size}
        className={classString}
        style={style}
      />
    );
  }

  return (
    <div
      className={`${classString} flex items-center justify-center bg-white text-black`}
      style={{
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
    >
      {currency.symbol?.slice(0, 2)}
    </div>
  );
};

export default CurrencyLogo;
