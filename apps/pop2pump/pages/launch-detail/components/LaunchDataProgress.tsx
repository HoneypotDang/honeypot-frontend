import {
  OptionsDropdown,
  optionsPresets,
} from "@/components/OptionsDropdown/OptionsDropdown";
import { trpcClient } from "@/lib/trpc";
import { wallet } from "@/services/wallet";
import { LucideFileEdit } from "lucide-react";
import { toast } from "react-toastify";
import SaleProgress from "./SaleProgress";
import TokenAddress from "./TokenAddress";
import TokenDetails from "./TokenDetails";
import TokenRaised from "./TokenRaised";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";

interface LaunchDataProgressProps {
  pair: MemePairContract;
}

export const LaunchDataProgress = observer(
  ({ pair }: LaunchDataProgressProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [votes, setVotes] = useState({
      rocket_count: 0,
      fire_count: 0,
      poo_count: 0,
      flag_count: 0,
    });

    console.log("pair", pair);

    function refreshVotes() {
      trpcClient.projects.getProjectVotes
        .query({ pair: pair?.address })
        .then((data) => {
          setVotes(data);
        });
    }

    return (
      <div className="flex flex-col py-5 px-4 bg-[#202020] rounded-2xl gap-y-5">
        {/* TODO：kline chart */}
        <div className="flex justify-between items-start \">
          <TokenRaised
            depositedRaisedToken={pair?.depositedRaisedToken}
            raiseTokenDerivedUSD={pair?.raiseToken?.derivedUSD}
            raisedTokenMinCap={pair?.raisedTokenMinCap}
            raiseTokenDecimals={pair?.raiseToken?.decimals}
          />{" "}
        </div>
        <SaleProgress
          ftoStatusDisplayStatus={pair?.ftoStatusDisplay?.status}
          raiseTokenBalance={pair?.raisedTokenMinCap}
          raiseTokenDecimals={pair?.raiseToken?.decimals}
          depositedRaisedToken={pair?.depositedRaisedToken}
          raiseTokenSymbol={pair?.raiseToken?.symbol ?? "Raise Token"}
        />

        <TokenAddress address={pair?.launchedToken?.address} />

        {pair.raiseToken && (
          <TokenDetails
            raisedToken={pair.raiseToken}
            price={pair?.price}
            depositedRaisedToken={pair?.depositedRaisedToken}
            startTimeDisplay={pair?.startTimeDisplay}
            endTimeDisplay={pair?.endTimeDisplay}
          />
        )}

        <div className="w-full h-[1px] bg-[#52493D]"></div>
        <div className="space-y-1.5">
          <p className="text-white/65 text-sm mt-2.5">Rank Project</p>
          <div className="flex gap-5">
            {Object.entries(votes).map(([key, value]) => {
              return (
                <div
                  key={key}
                  onClick={() => {
                    if (!wallet.account || !pair?.address) return;

                    trpcClient.projects.createOrUpdateProjectVotes
                      .mutate({
                        project_pair: pair?.address,
                        wallet_address: wallet.account,
                        vote: key.split("_")[0],
                      })
                      .then(() => {
                        refreshVotes();
                      });
                  }}
                  className="mt-2 flex-1 flex flex-col  justify-center items-center bg-[#202020] text-white px-3 py-3 hover:bg-[#FFCD4D] active:[background:#F0A000] cursor-pointer select-none border border-[#F2C34A] rounded-2xl"
                >
                  <p>
                    {(key.split("_")[0] === "rocket" && "🚀") ||
                      (key.split("_")[0] === "fire" && "🔥") ||
                      (key.split("_")[0] === "poo" && "💩") ||
                      (key.split("_")[0] === "flag" && "🚩")}
                  </p>
                  <p>{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

export default LaunchDataProgress;
