import React from "react";
import { observe } from "mobx";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { chart } from "@/services/chart";
import { observer } from "mobx-react-lite";
import { wallet } from "@/services/wallet";
import { liquidity } from "@/services/liquidity";
import { useSearchParams } from "next/navigation";
import { itemPopUpVariants } from "@/lib/animation";
import { DarkContainer } from "@/components/CardContianer";
import V3SwapCard from "@/components/algebra/swap/V3SwapCard";
import KlineChart from "./launch-detail/components/KlineChart";
import { LoadingDisplay } from "@/components/LoadingDisplay/LoadingDisplay";
import SwapTransactionHistory from "@/components/SwapTransactionHistory";
import { WNATIVE } from "@cryptoalgebra/sdk";
import { STABLECOINS } from "@/config/algebra/tokens";

const SwapPage = observer(() => {
  useEffect(() => {
    observe(chart, "chartTarget", () => {});
  }, []);

  useEffect(() => {
    if (wallet.isInit) {
      liquidity.initPool();
    }
  }, [wallet.isInit]);

  const inputCurrency = useSearchParams().get("inputCurrency");
  const outputCurrency = useSearchParams().get("outputCurrency");

  const isInit = wallet.isInit && liquidity;

  return isInit ? (
    <div className="w-full flex items-center justify-center pb-6 sm:pb-12 overflow-x-hidden">
      <div className="w-full xl:mx-auto xl:max-w-[1200px] 2xl:max-w-[1500px] px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {chart.showChart && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemPopUpVariants}
            transition={{ duration: 0.5 }}
            className="w-full col-span-2 lg:col-span-1"
          >
            <DarkContainer>
              <KlineChart height={479} />
            </DarkContainer>
          </motion.div>
        )}
        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full flex flex-col items-center justify-start col-span-2 lg:col-span-1"
        >
          <V3SwapCard
            fromTokenAddress={inputCurrency ?? undefined}
            toTokenAddress={
              // outputCurrency ?? wallet.currentChain.platformTokenAddress.HPOT
              STABLECOINS.HONEY.address.toLowerCase()
            }
            isUpdatingPriceChart={true}
          />
        </motion.div>

        <motion.div
          variants={itemPopUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="w-full col-span-2"
        >
          <SwapTransactionHistory />
        </motion.div>
      </div>
    </div>
  ) : (
    <LoadingDisplay />
  );
});

export default SwapPage;
