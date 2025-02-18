import React, { useEffect, useState } from "react";
import { truncate } from "@/lib/format";
import { Copy } from "@/components/Copy";
import { VscCopy } from "react-icons/vsc";
import { Skeleton } from "@nextui-org/react";
import { observer } from "mobx-react-lite";

interface TokenAddressProps {
  address?: string;
}

const TokenAddress: React.FC<TokenAddressProps> = observer(({ address }) => {
  const [addressState, setAddressState] = useState(address);

  console.log("address", address);

  useEffect(() => {
    if (address) {
      setAddressState(address);
    }
  }, [address]);

  return (
    <div className="space-y-2">
      <div className="text-white text-sm font-medium leading-[normal]">
        Token address
      </div>

      {address ? (
        <Copy
          className={"w-full"}
          content="Copy address"
          value={addressState ?? ""}
          displayContent={
            <div className="relative">
              <span className="mt-[8px] flex h-[41px] justify-between items-center bg-[#F2C34A] px-3 py-0 rounded-[10px] cursor-pointer hover:brightness-150 active:brightness-75 select-none text-[#202020]">
                {truncate(addressState ?? "", 28)}
              </span>
              <div className="size-6 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center bg-white text-[#202020] border border-[#202020] rounded-md">
                <VscCopy className="size-4" />
              </div>
            </div>
          }
        />
      ) : (
        <Skeleton className="rounded-lg h-10 w-full" />
      )}
    </div>
  );
});

export default TokenAddress;
