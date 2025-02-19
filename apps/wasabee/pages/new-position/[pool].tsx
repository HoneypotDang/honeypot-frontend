import PageContainer from "@/components/algebra/common/PageContainer";
import PageTitle from "@/components/algebra/common/PageTitle";
import LiquidityChart from "@/components/algebra/create-position/LiquidityChart";
import RangeSelector from "@/components/algebra/create-position/RangeSelector";
import PresetTabs from "@/components/algebra/create-position/PresetTabs";
import { Bound } from "@cryptoalgebra/sdk";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Address } from "viem";
import AmountsSection from "@/components/algebra/create-position/AmountsSection";
import { useCurrency } from "@/lib/algebra/hooks/common/useCurrency";
import { ManageLiquidity } from "@/types/algebra/types/manage-liquidity";
import {
  useDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
  useRangeHopCallbacks,
} from "@/lib/algebra/state/mintStore";
import {
  useReadAlgebraPoolToken0,
  useReadAlgebraPoolToken1,
} from "@/wagmi-generated";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";

type NewPositionPageParams = Record<"pool", Address>;

const NewPositionPage = () => {
  const router = useRouter();
  const { pool: poolAddress } = router.query as { pool: Address };

  const { data: token0 } = useReadAlgebraPoolToken0({
    address: poolAddress,
  });

  const { data: token1 } = useReadAlgebraPoolToken1({
    address: poolAddress,
  });

  const currencyA = useCurrency(token0, true);
  const currencyB = useCurrency(token1, true);

  const mintInfo = useDerivedMintInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    poolAddress,
    100,
    currencyA ?? undefined,
    undefined
  );

  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } =
    mintInfo.pricesAtTicks;

  const price = useMemo(() => {
    if (!mintInfo.price) return;

    return mintInfo.invertPrice
      ? mintInfo.price.invert().toSignificant(5)
      : mintInfo.price.toSignificant(5);
  }, [mintInfo]);
  const a = 1;

  const currentPrice = useMemo(() => {
    if (!mintInfo.price) return;
    return DynamicFormatAmount({
      amount: price ?? "",
      decimals: 5,
      endWith: currencyB?.symbol,
    });
  }, [mintInfo.price, price]);

  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(() => {
    return mintInfo.ticks;
  }, [mintInfo]);

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
  } = useRangeHopCallbacks(
    currencyA ?? undefined,
    currencyB ?? undefined,
    mintInfo.tickSpacing,
    tickLower,
    tickUpper,
    mintInfo.pool
  );

  const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(
    mintInfo.noLiquidity
  );

  const { startPriceTypedValue } = useMintState();

  useEffect(() => {
    return () => {
      onLeftRangeInput("");
      onRightRangeInput("");
    };
  }, []);

  return (
    <PageContainer>
      <div className="max-w-[1200px] w-full mx-auto bg-[#FFCD4D] rounded-3xl relative overflow-hidden">
        {/* 顶部装饰边框 */}
        <div className="bg-[url('/images/pumping/outline-border.png')] bg-contain bg-repeat-x bg-left-top h-[90px] absolute -top-1 left-0 w-full"></div>

        <div className="max-w-[1200px] w-full mx-auto px-6 pt-[90px] pb-[70px]">
          <PageTitle title={"Create Position"} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-0 gap-y-8 w-full lg:gap-8 text-left">
            <div className="col-span-2">
              <div className="flex max-md:flex-col md:items-center justify-between w-full mb-6 gap-4">
                <h2 className="font-semibold text-2xl text-[#202020]">
                  1. Select Range
                </h2>
                <PresetTabs
                  currencyA={currencyA}
                  currencyB={currencyB}
                  mintInfo={mintInfo}
                />
              </div>

              <div className="flex flex-col w-full">
                <div className="w-full rounded-[32px] bg-white space-y-4 px-6 py-8 custom-dashed">
                  <div className="flex w-full flex-col md:flex-row gap-4">
                    <RangeSelector
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      getDecrementLower={getDecrementLower}
                      getIncrementLower={getIncrementLower}
                      getDecrementUpper={getDecrementUpper}
                      getIncrementUpper={getIncrementUpper}
                      onLeftRangeInput={onLeftRangeInput}
                      onRightRangeInput={onRightRangeInput}
                      currencyA={currencyA}
                      currencyB={currencyB}
                      mintInfo={mintInfo}
                      disabled={!startPriceTypedValue && !mintInfo.price}
                    />
                    <div className="md:ml-auto md:text-right">
                      <div className="font-medium text-sm mb-3 text-black/70">
                        CURRENT PRICE
                      </div>
                      <div className="font-bold text-xl text-black">
                        {currentPrice}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <LiquidityChart
                      currencyA={currencyA}
                      currencyB={currencyB}
                      currentPrice={price ? parseFloat(price) : undefined}
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="font-semibold text-2xl text-[#202020] mb-6 leading-[44px]">
                2. Enter Amounts
              </h2>
              <div className="w-full rounded-[32px] bg-white space-y-4 px-6 py-8 custom-dashed">
                <AmountsSection
                  currencyA={currencyA}
                  currencyB={currencyB}
                  mintInfo={mintInfo}
                  manageLiquidity={ManageLiquidity.ADD}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰边框 */}
        <div className="absolute -bottom-1 left-0 w-full">
          <div className="bg-[url('/images/pool-detail/bottom-border.svg')] bg-contain bg-repeat-x bg-left-bottom h-[70px] w-full"></div>
        </div>
      </div>
    </PageContainer>
  );
};

export default NewPositionPage;
