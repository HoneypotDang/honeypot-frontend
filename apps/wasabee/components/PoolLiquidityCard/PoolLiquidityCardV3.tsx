import { Token } from "@/services/contract/token";
import TokenLogo from "../TokenLogo/TokenLogo";
import { Copy } from "../Copy";
import { observer } from "mobx-react-lite";
import CardContianer from "../CardContianer/CardContianer";
import { RemoveLiquidity } from "../LPCard";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  OptionsDropdown,
  optionsPresets,
} from "../OptionsDropdown/OptionsDropdown";
import { IoAdd, IoRemove } from "react-icons/io5";
import { VscArrowSwap } from "react-icons/vsc";
import { useRouter } from "next/router";
import { popmodal } from "@/services/popmodal";
import { Tooltip } from "@nextui-org/react";
import { AlgebraPoolContract } from "@/services/contract/algebra/algebra-pool-contract";
import { removeLiquidityV3 } from "@/services/removeLoqioditiV3";

interface PoolLiquidityCardV3Props {
  pair: AlgebraPoolContract;
  autoSize?: boolean;
  showMyLiquidity?: boolean;
}

export const PoolLiquidityCardV3 = observer(
  ({
    pair,
    autoSize,
    showMyLiquidity: isMyLiquidity,
  }: PoolLiquidityCardV3Props) => {
    const router = useRouter();

    return (
      <CardContianer autoSize={autoSize}>
        <motion.div
          initial={{
            x: -100,
            opacity: 0,
          }}
          whileInView={{
            x: 0,
            opacity: 1,
          }}
          className="relative flex w-full flex-col md:flex-row gap-[0.5rem]"
        >
          <div className="flex flex-1 flex-col md:flex-row justify-between align-middle items-center gap-[0.5rem]">
            <div className="flex flex-1 items-center gap-2">
              <div className="flex items-center  w-[3rem]">
                {pair.token0.value && <TokenLogo token={pair.token0.value} />}
                {pair.token1.value && <TokenLogo token={pair.token1.value} />}
              </div>
              <span>
                <Tooltip content="View pool on explore">
                  <Link
                    href={`https://berascan.com/address/${pair.address}`}
                    target="_blank"
                    className=" cursor-pointer hover:text-primary "
                  >
                    <span className="inline-flex max-w-[4rem] overflow-ellipsis overflow-hidden">
                      {pair.token0.value?.symbol}
                    </span>{" "}
                    <br />
                    <span className="inline-flex max-w-[4rem] overflow-ellipsis overflow-hidden">
                      {pair.token1.value?.symbol}
                    </span>
                  </Link>
                </Tooltip>
              </span>
            </div>
            {isMyLiquidity ? (
              <>
                {/* <div className="flex-1">
                  <div className="flex flex-col">
                    <div>{pair.myLiquidityDisplay.reserve0}</div>
                    <div>{pair.myLiquidityDisplay.reserve1}</div>
                  </div>
                </div>
                <div className="flex-1 justify-center">
                  <span className="">
                    $ {toCompactLocaleString(pair.userMarketValue)}
                  </span>
                </div> */}
              </>
            ) : (
              <>
                {/* <div className="flex-1">
                  <div>{pair.liquidityDisplay}</div>

                  <div className="flex flex-col">
                    <div>{pair.liquidityDisplay.reserve0}</div>
                    <div>{pair.liquidityDisplay.reserve1}</div>
                  </div>
                </div>
                <div className="flex-1 justify-center">
                  <span className="">
                    ${" "}
                    {toCompactLocaleString(
                      pair.trackedReserveUSD.toNumber() / 10 ** 18
                    )}{" "}
                  </span>
                </div>
                <div className="flex-1 justify-center">
                  <span className="">
                    ${" "}
                    {toCompactLocaleString(
                      Number(pair.tradingVolumeYesterday) / 10 ** 18
                    )}{" "}
                  </span>
                </div> */}
              </>
            )}
          </div>{" "}
          <div className="absolute w-[80px] top-[-0.5rem] left-[-0.5rem] md:relative md:flex md:justify-end md:items-center md:top-[unset] md:right-[unset]">
            <OptionsDropdown
              options={[
                {
                  icon: <IoRemove />,
                  display: "Remove LP",
                  onClick: () => {
                    removeLiquidityV3.setCurrentRemovePair(pair);
                    popmodal.openModal({
                      content: <RemoveLiquidity noCancelButton />,
                    });
                  },
                },
                {
                  icon: <IoAdd />,
                  display: "Add LP",
                  onClick: () => {
                    router.push(
                      `/pool?inputCurrency=${pair.token0.value?.address}&outputCurrency=${pair.token1.value?.address}`
                    );
                  },
                },
                {
                  icon: <VscArrowSwap />,
                  display: "Swap",
                  onClick: () => {
                    router.push(
                      `/swap?inputCurrency=${pair.token0.value?.address}&outputCurrency=${pair.token1.value?.address}`
                    );
                  },
                },
                optionsPresets.viewOnExplorer({
                  address: pair.address,
                }),
              ]}
            />
          </div>{" "}
        </motion.div>
      </CardContianer>
    );
  }
);

export default PoolLiquidityCardV3;
