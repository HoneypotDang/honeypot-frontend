import { Button } from "@/components/button/button-next";
import { SelectState, ItemSelect } from "@/components/ItemSelect";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { cn, SelectItem } from "@nextui-org/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { Input } from "@/components/input";
import { TokenSelector } from "@/components/TokenSelector/v3";
import { WNATIVE_EXTENDED } from "@/config/algebra/routing";
import { wallet } from "@/services/wallet";
import { Token } from "@/services/contract/token";
import { useEffect, useState } from "react";
import TokenCardV3 from "@/components/algebra/swap/TokenCard/TokenCardV3";
import { Address } from "viem";
import { useBalance } from "wagmi";
import BigNumber from "bignumber.js";
import { ContractWrite } from "@/services/utils";

export const PottingModal = observer(
  ({
    pair,
    onSuccess,
    boarderLess,
  }: {
    pair: MemePairContract | FtoPairContract;
    onSuccess?: () => void;
    boarderLess?: boolean;
  }) => {
    const [selectedToken, setSelectedToken] = useState<Token | null>(
      pair.raiseToken &&
        pair.raiseToken.address.toLowerCase() ===
          wallet?.currentChain.nativeToken.address.toLowerCase()
        ? wallet.currentChain.nativeToken
        : (pair.raiseToken ?? null)
    );

    useEffect(() => {
      if (pair.raiseToken) {
        pair.raiseToken.init();
        if (pair.raiseToken.isNative) {
          console.log("init native token");
          wallet.currentChain.nativeToken.init();
        }
      }
    }, [pair]);

    const state = useLocalObservable(() => ({
      depositAmount: "",
      setDepositAmount(val: string) {
        this.depositAmount = val;
      },
    }));

    const selectState = useLocalObservable(
      () =>
        new SelectState({
          onSelectChange: (value) => {
            if (value === "max") {
              state.setDepositAmount(selectedToken?.balance.toFixed() ?? "0");
              selectedToken?.getBalance();
            } else {
              state.setDepositAmount(value.toString());
            }
          },
        })
    );

    return (
      pair.raiseToken && (
        <div
          className={cn(
            "flex flex-col w-full z-[100] items-center gap-2 bg-[#FFCD4D] rounded-2xl px-4 py-3 relative pt-4 md:pt-12 pb-[90px] text-black",
            boarderLess && "border-none"
          )}
        >
          <div className="bg-[url('/images/pumping/outline-border.png')] bg-left-top bg-contain bg-repeat-x h-4 md:h-12 absolute top-0 left-0 w-full rounded-t-2xl"></div>
          <div className="flex flex-col gap-[16px] w-full">
            <div className="bg-white custom-dashed px-[18px] py-6 w-full rounded-[16px]">
              <div className="text-black flex items-center justify-between mb-4">
                <div></div>
                <div className="flex items-center gap-x-2">
                  <div>
                    <span>Balance: </span>
                    <span>{selectedToken?.balanceFormatted}</span>
                  </div>
                  <button
                    className="cursor-pointer text-[#63b4ff]"
                    onClick={() => {
                      state.setDepositAmount(
                        pair.raiseToken?.balance.toFixed() ?? "0"
                      );
                      pair.raiseToken?.getBalance();
                    }}
                  >
                    Max
                  </button>
                </div>
              </div>

              <div className="w-full rounded-2xl border bg-card-dark shadow-[0px_332px_93px_0px_rgba(0,0,0,0.00),0px_212px_85px_0px_rgba(0,0,0,0.01),0px_119px_72px_0px_rgba(0,0,0,0.05),0px_53px_53px_0px_rgba(0,0,0,0.09),0px_13px_29px_0px_rgba(0,0,0,0.10)] flex items-center justify-between px-4 py-2.5 gap-x-2">
                <TokenSelector
                  staticTokenList={[
                    pair.raiseToken,
                    ...(pair.raiseToken &&
                    pair.raiseToken.address.toLowerCase() ===
                      wallet?.currentChain.nativeToken.address.toLowerCase()
                      ? [wallet.currentChain.nativeToken]
                      : []),
                  ]}
                  onSelect={(token) => {
                    setSelectedToken(token);
                    token.getBalance();
                  }}
                  value={selectedToken}
                />
                <Input
                  className="flex-1 text-right !bg-transparent [&_*]:!bg-transparent data-[invalid=true]:!bg-transparent"
                  classNames={{
                    inputWrapper:
                      "!bg-transparent border-none shadow-none !transition-none data-[invalid=true]:!bg-transparent group-data-[invalid=true]:!bg-transparent",
                    input:
                      "!bg-transparent !text-[#202020] text-right text-xl !pr-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none data-[invalid=true]:!bg-transparent",
                  }}
                  value={state.depositAmount}
                  placeholder="0.0"
                  min={0}
                  type="number"
                  isClearable={false}
                  max={selectedToken?.balance.toFixed()}
                  onChange={(e) => {
                    state.setDepositAmount(e.target.value);
                  }}
                  onBlur={() => {
                    state.setDepositAmount(
                      Number(state.depositAmount).toString()
                    );
                  }}
                />
              </div>

              <ItemSelect
                selectState={selectState}
                className="grid grid-cols-[repeat(4,auto)] gap-4 w-full mt-4 justify-content-end"
              >
                {selectedToken?.balance.gte(10) && (
                  <SelectItem key="10" value="10">
                    10 {selectedToken?.symbol}
                  </SelectItem>
                )}
                {selectedToken?.balance.gte(100) && (
                  <SelectItem key="100" value="100">
                    100 {selectedToken?.symbol}
                  </SelectItem>
                )}
                {selectedToken?.balance.gte(1000) && (
                  <SelectItem key="1000" value="1000">
                    1000 {selectedToken?.symbol}
                  </SelectItem>
                )}
                <SelectItem key="max" value="max">
                  Max
                </SelectItem>
              </ItemSelect>
            </div>

            <Button
              className="w-full"
              isDisabled={!Number(state.depositAmount)}
              isLoading={pair.deposit.loading}
              onPress={async () => {
                try {
                  const amount = new BigNumber(state.depositAmount)
                    .multipliedBy(
                      new BigNumber(10).pow(selectedToken?.decimals ?? 18)
                    )
                    .toFixed();

                  if (
                    selectedToken?.address.toLowerCase() ===
                    wallet.currentChain.nativeToken.address.toLowerCase() &&
                    selectedToken.isNative
                  ) {
                    console.log("amount", amount);
                    // @ts-ignore
                    await new ContractWrite(
                      wallet.currentChain.nativeToken.contract.write.deposit
                    ).call({
                      value: BigInt(amount),
                      account: wallet.account as `0x${string}`,
                      chain: wallet.currentChain.chain,
                    });
                  }

                  await pair.deposit.call({
                    amount: state.depositAmount,
                  });

                  state.setDepositAmount("");
                  selectedToken?.getBalance();
                  pair.getDepositedRaisedToken().then((res) => {
                    if (
                      pair.depositedLaunchedTokenWithoutDecimals &&
                      (pair as MemePairContract).raisedTokenMinCap &&
                      pair.depositedLaunchedTokenWithoutDecimals >
                        ((pair as MemePairContract).raisedTokenMinCap ?? 0)
                    ) {
                      //refresh page
                      window.location.reload();
                    }
                  });

                  onSuccess?.();
                } catch (error) {
                  console.error("Deposit failed:", error);
                }
              }}
            >
              Deposit
            </Button>
          </div>
          <div className="bg-[url('/images/swap/bottom-border.svg')] bg-[size:100%_150%] bg-no-repeat bg-left-bottom h-[50px] absolute bottom-0 left-0 w-full"></div>
        </div>
      )
    );
  }
);

export default PottingModal;
