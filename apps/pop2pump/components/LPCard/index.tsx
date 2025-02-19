import { observer, useLocalObservable } from "mobx-react-lite";
import { TokenSelector } from "@/components/TokenSelector";
import { SwapAmount } from "../SwapAmount/index";
import { liquidity } from "@/services/liquidity";
import { Button } from "@/components/button";
import { Token } from "@/services/contract/token";
import { SpinnerContainer } from "../Spinner";
import { PlusSvg } from "../svg/plus";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isEthAddress } from "@/lib/address";
import { wallet } from "@/services/wallet";
import {
  Checkbox,
  Slider,
  Tab,
  Tabs,
  Button as NextButton,
} from "@nextui-org/react";
import { ItemSelect, SelectState } from "../ItemSelect";
import { SelectItem } from "../ItemSelect/index";
import { LoadingDisplay } from "../LoadingDisplay/LoadingDisplay";

const AddLiquidity = observer(() => {
  return (
    <SpinnerContainer
      className="mt-[24px]"
      isLoading={liquidity.currentPair.loading}
    >
      <div className=" flex flex-col justify-center items-start gap-[23px] ">
        <div className="flex justify-between items-center w-full">
          <SwapAmount
            label=""
            inputProps={{
              value: liquidity.fromAmount,
              disabled: !liquidity.fromToken,
              max: liquidity.fromToken?.balance.toNumber(),
              min: 0,
              isInvalid:
                Number(liquidity.fromAmount) >
                  (liquidity.fromToken as Token)?.balance?.toNumber() ||
                Number(liquidity.fromAmount) < 0,
              errorMessage: "Insufficient balance",
              onClear: () => {
                liquidity.setFromAmount("");
              },
              onChange: (e) => {
                liquidity.setFromAmount(e.target.value);
              },
              onInput: (e) => {
                liquidity.onFromAmountInputChange();
              },
            }}
          ></SwapAmount>
          <div className="flex flex-col items-end">
            {!!liquidity.fromToken && (
              <div className="flex items-center">
                <div className="text-sub">
                  Balance: {liquidity.fromToken.balanceFormatted}
                </div>
                <div
                  onClick={() => {
                    liquidity.setFromAmount(
                      (liquidity.fromToken as Token).balance.toFixed()
                    );
                    liquidity.onFromAmountInputChange();
                  }}
                  className="  cursor-pointer text-[color:var(--Button-Gradient,#F7931A)] text-base ml-[8px] font-bold leading-3 tracking-[0.16px] underline"
                >
                  Max
                </div>
              </div>
            )}
            <TokenSelector
              value={liquidity.fromToken}
              onSelect={(token) => {
                liquidity.setFromToken(token);
              }}
            ></TokenSelector>
          </div>
        </div>
        <div className="flex w-full items-center gap-[5px]">
          <div className=" h-px flex-[1_0_0] [background:rgba(247,147,26,0.20)] rounded-[100px]"></div>
          <PlusSvg></PlusSvg>
          <div className=" h-px flex-[1_0_0] [background:rgba(247,147,26,0.20)] rounded-[100px]"></div>
        </div>
        <div className="flex justify-between  items-center w-full">
          <SwapAmount
            label=""
            inputProps={{
              value: liquidity.toAmount,
              disabled: !liquidity.toToken,
              max: liquidity.toToken?.balance.toNumber(),
              min: 0,
              isInvalid:
                Number(liquidity.toAmount) >
                  (liquidity.toToken as Token)?.balance?.toNumber() ||
                Number(liquidity.toAmount) < 0,
              errorMessage: "Insufficient balance",
              onClear: () => {
                liquidity.setToAmount("");
              },
              isClearable: !liquidity.currentPair.value,
              onChange: (e) => {
                liquidity.setToAmount(e.target.value);
              },
              onInput: (e) => {
                liquidity.onToAmountInputChange();
              },
            }}
          ></SwapAmount>
          <div className="flex flex-col items-end">
            {!!liquidity.toToken && (
              <div className="flex items-center">
                <div className="text-sub">
                  Balance: {liquidity.toToken.balanceFormatted}
                </div>
                <div
                  onClick={() => {
                    liquidity.setToAmount(
                      (liquidity.toToken as Token).balance.toFixed()
                    );
                    liquidity.onToAmountInputChange();
                  }}
                  className="  cursor-pointer text-[color:var(--Button-Gradient,#F7931A)] text-base ml-[8px] font-bold leading-3 tracking-[0.16px] underline"
                >
                  Max
                </div>
              </div>
            )}
            <TokenSelector
              value={liquidity.toToken}
              onSelect={(token) => {
                liquidity.setToToken(token);
              }}
            ></TokenSelector>
          </div>
        </div>
        <div>
          <Checkbox
            defaultSelected={liquidity.balanced}
            checked={liquidity.balanced}
            onChange={(e) => {
              liquidity.setIsExactIn(e.target.checked);
              liquidity.onFromAmountInputChange();
            }}
          >
            Balanced
          </Checkbox>
        </div>
        <Button
          isDisabled={liquidity.isDisabled}
          isLoading={liquidity.addLiquidity.loading}
          onClick={async () => {
            liquidity.addLiquidity.call().then(async () => {
              liquidity.myPairPage.addSingleItemToStart(
                liquidity.currentPair.value!
              );

              await Promise.all([
                await liquidity.currentPair.value!.token.getBalance(),
                await liquidity.currentPair.value!.token.getTotalSupply(),
                await liquidity.currentPair.value!.token0.init(),
                await liquidity.currentPair.value!.token1.init(),
              ]);

              liquidity.currentPair.value!.getReserves();
            });
          }}
        >
          {liquidity.buttonContent}
        </Button>
      </div>
    </SpinnerContainer>
  );
});

export const RemoveLiquidity = observer(
  ({ noCancelButton = false }: { noCancelButton?: boolean }) => {
    const state = useLocalObservable(() => ({
      selectState: new SelectState({
        value: 0.25,
      }),
    }));

    return liquidity.currentRemovePair ? (
      <div className="flex justify-center">
        <div className="flex flex-col gap-[24px] items-center lg:w-[400px]">
          <div className="w-full"></div>
          <Slider
            value={Number(state.selectState.value)}
            onChange={(value) => {
              state.selectState.value = Number(value);
            }}
            minValue={0}
            maxValue={1}
            step={0.01}
            marks={[
              {
                value: 0,
                label: "0%",
              },
              {
                value: 0.25,
                label: "25%",
              },
              {
                value: 0.5,
                label: "50%",
              },
              {
                value: 0.75,
                label: "75%",
              },
              {
                value: 1,
                label: "100%",
              },
            ]}
          />
          <ItemSelect
            selectState={state.selectState}
            className="gap-[16px] justify-around w-full grid grid-cols-2 lg:grid-cols-4"
          >
            <SelectItem className="rounded-[30px] px-[24px]" value={0.25}>
              25%
            </SelectItem>
            <SelectItem className="rounded-[30px] px-[24px]" value={0.5}>
              50%
            </SelectItem>
            <SelectItem className="rounded-[30px] px-[24px]" value={0.75}>
              75%
            </SelectItem>
            <SelectItem className="rounded-[30px] px-[24px]" value={1}>
              100%
            </SelectItem>
          </ItemSelect>
          <div className="w-full">
            <div className="flex justify-between">
              <div>{liquidity.currentRemovePair?.token0.displayName}</div>
              <div>
                {liquidity.currentRemovePair?.token0LpBalance
                  .multipliedBy(state.selectState.value as number)
                  .toFixed(3)}
              </div>
            </div>
            <div className="mt-[16px] flex justify-between">
              <div>{liquidity.currentRemovePair?.token1.displayName}</div>
              <div>
                {liquidity.currentRemovePair?.token1LpBalance
                  .multipliedBy(state.selectState.value as number)
                  .toFixed(3)}
              </div>
            </div>
          </div>
          <div className="flex w-full gap-[16px] justify-between">
            {!noCancelButton && (
              <Button
                className="flex-1"
                onClick={(e) => {
                  liquidity.setCurrentRemovePair(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              className="flex-1"
              isLoading={liquidity.currentRemovePair?.removeLiquidity.loading}
              onClick={async () => {
                await liquidity.currentRemovePair?.removeLiquidity.call(
                  state.selectState.value as number
                );

                await Promise.all([
                  await liquidity.currentRemovePair?.token.getBalance(),
                  await liquidity.currentRemovePair?.token.getTotalSupply(),
                  await liquidity.currentRemovePair?.token0.getBalance(),
                  await liquidity.currentRemovePair?.token1.getBalance(),
                  await liquidity.currentRemovePair?.getReserves(),
                ]);

                if (
                  liquidity.currentRemovePair &&
                  liquidity.currentRemovePair.token0LpBalance.eq(0)
                ) {
                  liquidity.myPairPage.removeItem(liquidity.currentRemovePair);
                }
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    ) : (
      liquidity.myPairPage.pageItems.value && (
        <div className="flex flex-col justify-center items-center gap-5">
          {liquidity.myPairPage.pageItems.value.map((item) => (
            <div
              key={item.address}
              className="flex w-full justify-between items-center hover:brightness-125 hover:bg-white/50 transition-all p-2 rounded-[10px]"
            >
              <div>{item.poolName}</div>
              <div>
                {item.myLiquidityDisplay.reserve0} /{" "}
                {item.myLiquidityDisplay.reserve1}
              </div>
              <NextButton
                onClick={() => {
                  liquidity.setCurrentRemovePair(item);
                }}
              >
                Remove
              </NextButton>
            </div>
          ))}
        </div>
        // <Table
        //   rowKey="address"
        //   columns={[
        //     {
        //       title: "Pool Name",
        //       dataKey: "poolName",
        //     },
        //     {
        //       title: "Self Liquidity",
        //       dataKey: "myLiquidityDisplay",
        //     },
        //     {
        //       title: "Action",
        //       key: "action",
        //       render: (value, record) => {
        //         return (
        //           <Button
        //             onClick={() => {
        //               liquidity.setCurrentRemovePair(record);
        //             }}
        //           >
        //             Remove
        //           </Button>
        //         );
        //       },
        //     },
        //   ]}
        //   datasource={liquidity.myPairPage.pageItems.value}
        // ></Table>
      )
    );
  }
);

export const LPCard = observer(() => {
  const router = useRouter();

  const { inputCurrency, outputCurrency } = router.query as {
    inputCurrency: string;
    outputCurrency: string;
  };

  useEffect(() => {
    if (!wallet.isInit) return;
    liquidity.initPool();
  }, [wallet.isInit]);

  useEffect(() => {
    if (wallet.isInit && liquidity.isInit) {
      liquidity.pairPage.reloadPage();
      liquidity.myPairPage.reloadPage();
    }
  }, [wallet.isInit, liquidity.isInit]);

  const isinit = wallet.isInit;

  useEffect(() => {
    if (!isinit) {
      liquidity.initPool();
      return;
    }

    if (inputCurrency && isEthAddress(inputCurrency)) {
      liquidity.setFromToken(
        Token.getToken({
          address: inputCurrency,
        })
      );
    }
    if (outputCurrency && isEthAddress(outputCurrency)) {
      liquidity.setToToken(
        Token.getToken({
          address: outputCurrency,
        })
      );
    }
  }, [inputCurrency, outputCurrency, wallet.isInit, liquidity.isInit]);

  return (
    <div className="[background:var(--card-color,#271A0C)]   p-[20px] rounded-[20px] border-2 border-solid border-[rgba(247,147,26,0.10)]">
      {(isinit && (
        <Tabs
          variant="light"
          disableAnimation
          classNames={{
            tabList: "gap-16px p-0 bg-transparent",
            tab: "px-[0.25rem] data-[selected=true]:bg-transparent font-bold text-[1.2rem]",
          }}
        >
          <Tab
            key="addLiquidity"
            title={<span className="text-sm sm:text-base">Add Liquidity</span>}
            className="text-red-500"
          >
            <AddLiquidity></AddLiquidity>
          </Tab>
          <Tab
            key="removeLiquidity"
            title={
              <span className="text-sm sm:text-base">Remove Liquidity</span>
            }
          >
            <RemoveLiquidity></RemoveLiquidity>
          </Tab>
        </Tabs>
      )) || <LoadingDisplay></LoadingDisplay>}
    </div>
  );
});
