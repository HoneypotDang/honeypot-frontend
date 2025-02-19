import { NextLayoutPage } from "@/types/nextjs";
import { SwapSvg } from "@/components/svg/swap";
import { Tab, Tabs } from "@nextui-org/react";
import { trpc, trpcClient } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { liquidity } from "@/services/liquidity";
import { useAccount } from "wagmi";
import { SwapCard } from "@/components/SwapCard";
import { LPCard } from "@/components/LPCard";
import { Slippage } from "@/components/SwapCard/Slippage";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";

export const Swap = observer(({ activeTab }: { activeTab?: "swap" | "lp" }) => {
  const state = useLocalObservable(() => ({
    activeTab: activeTab || "swap",
    get isSwap() {
      return state.activeTab === "swap";
    },
    get isLp() {
      return state.activeTab === "lp";
    },
    setActiveTab(tab: "swap" | "lp") {
      this.activeTab = tab;
    },
  }));

  return (
    <div className="flex justify-center gap-[44px] flex-wrap">
      {/* <Image
        src="/images/swap_statics.png"
        width={654}
        height={365}
        alt=""
      ></Image> */}
      <div className=" relative w-[569px] max-w-full">
        <Tabs
          //   onSelectionChange={(tab) => {
          //     router.pus
          //   }}
          selectedKey={state.activeTab}
          disableAnimation
          classNames={{
            tab: "p-0 h-auto  rounded-[21.553px] data-[selected:true]:border-[0.718px] data-[selected=true]:[background:var(--Button-Gradient,linear-gradient(180deg,rgba(232,211,124,0.13)_33.67%,#FCD729_132.5%),#F7931A)]",
            tabList: "gap-0 p-0 bg-transparent",
            panel: "p-0 pt-[24px]  ",
          }}
        >
          <Tab
            key={"swap"}
            href="/swap"
            as={Link}
            title={
              <div className="flex w-[113px] h-[43px] justify-center items-center gap-[5.748px]  px-[14.369px] py-[7.184px]  border-solid border-[rgba(247,147,26,0.37)]">
                {state.isSwap && <SwapSvg></SwapSvg>}
                Swap
              </div>
            }
          >
            <SwapCard></SwapCard>
          </Tab>
          <Tab
            key={"lp"}
            href="/pool"
            as={Link}
            title={
              <div className="flex w-[113px] h-[43px] justify-center items-center gap-[5.748px] px-[14.369px] py-[7.184px] border-solid border-[rgba(247,147,26,0.37)]">
                {state.isLp && <SwapSvg></SwapSvg>}
                LP Token
              </div>
            }
          >
            <LPCard></LPCard>
          </Tab>
        </Tabs>
        {state.isSwap && (
          <div className=" absolute right-0 top-0">
            <Slippage onSelect={() => {}}></Slippage>
          </div>
        )}
      </div>
    </div>
  );
});

Swap.displayName = "Swap";
