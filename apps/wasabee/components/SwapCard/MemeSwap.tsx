import { observer, useLocalObservable } from "mobx-react-lite";
import { SwapAmount } from "../SwapAmount/v3";
import { swap } from "@/services/swap";
import { Button } from "@/components/button/button-next";
import { Token } from "@/services/contract/token";
import { SpinnerContainer } from "../Spinner";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isEthAddress } from "@/lib/address";
import { wallet } from "@/services/wallet";
import { amountFormatted } from "../../lib/format";
import { liquidity } from "@/services/liquidity";
import { LoadingContainer } from "../LoadingDisplay/LoadingDisplay";
import { ItemSelect, SelectItem, SelectState } from "../ItemSelect/v3";
import { cn, Slider } from "@nextui-org/react";
import { FaLongArrowAltRight } from "react-icons/fa";
import TokenLogo from "../TokenLogo/TokenLogo";
import { Slippage } from "./Slippage";
import BigNumber from "bignumber.js";
import { useInterval } from "@/lib/hooks";
import { Trigger } from "../Trigger";
import Link from "next/link";
import { BsLightningChargeFill } from "react-icons/bs";
import { VaultAmount } from "../VaultAmount/VaultAmount";
import { ICHIVaultContract } from "@/services/contract/aquabera/ICHIVault-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { chart } from "@/services/chart";
import { V3SwapCard } from "../algebra/swap/V3SwapCard";
import { HoneyContainer } from "../CardContianer";
import { getSingleVaultDetails } from "@/lib/algebra/graphql/clients/vaults";
import { DOMAIN_MAP } from "@/config/allAppPath";

export const LaunchDetailSwapCard = observer(
  ({
    inputAddress,
    outputAddress,
    extraTokenAction,
    noBoarder,
    memePairContract,
    onSwapSuccess,
    isInputNative,
    isOutputNative,
  }: {
    inputAddress?: string;
    outputAddress?: string;
    extraTokenAction?: React.ReactNode;
    noBoarder?: boolean;
    memePairContract: MemePairContract;
    onSwapSuccess?: () => void;
    isInputNative?: boolean;
    isOutputNative?: boolean;
  }) => {
    const [values, setValues] = useState<{ amount0: string; amount1: string }>({
      amount0: "0",
      amount1: "0",
    });
    const [currentTab, setCurrentTab] = useState<"Swap" | "LP">("Swap");
    const router = useRouter();
    const isInit = wallet.isInit && liquidity.isInit;
    const [operate, setOperate] = useState<string>("Swap");
    const state = useLocalObservable(() => ({
      selectState: new SelectState({
        value: 0,
        onSelectChange: (value) => {
          swap.setFromAmount(
            (swap.fromToken as Token).balance.times(value).toFixed()
          );
        },
      }),
    }));
    const [vaultContract, setVaultContract] =
      useState<ICHIVaultContract | null>(null);

    const onAmountChange = (amount0: string, amount1: string) => {
      setValues({ amount0, amount1 });
    };

    useEffect(() => {
      if (!wallet.isInit) {
        return;
      }

      const loadVaultContract = async () => {
        try {
          const lpTokenAddress = await memePairContract.contract.read.lpToken();
          console.log("lpTokenAddress", lpTokenAddress);
          const vaultContract = await getSingleVaultDetails(lpTokenAddress);
          console.log("vaultContract", vaultContract);
          setVaultContract(vaultContract);
        } catch (error) {
          console.error("Failed to load vault contract:", error);
        }
      };
      loadVaultContract();
    }, [inputAddress, outputAddress, wallet.isInit]);

    const { inputCurrency, outputCurrency } = router.query as {
      inputCurrency: string;
      outputCurrency: string;
    };

    useEffect(() => {
      if (!isInit) {
        liquidity.initPool();
        return;
      }

      if (inputCurrency && isEthAddress(inputCurrency)) {
        swap.setFromToken(
          Token.getToken({
            address: inputCurrency,
            isNative: isInputNative,
          })
        );
      } else {
        swap.setFromToken(
          Token.getToken({
            address:
              inputAddress || "0xfc5e3743e9fac8bb60408797607352e24db7d65e",
            isNative: isInputNative,
          })
        );
      }

      if (outputCurrency && isEthAddress(outputCurrency)) {
        swap.setToToken(
          Token.getToken({
            address: outputCurrency,
            isNative: isOutputNative,
          })
        );
      } else {
        swap.setToToken(
          Token.getToken({
            address: outputAddress ?? "",
            isNative: isOutputNative,
          })
        );
      }
    }, [
      isInit,
      inputCurrency,
      outputCurrency,
      inputAddress,
      outputAddress,
      isInputNative,
      isOutputNative,
    ]);

    useInterval(() => {
      swap.onFromAmountChange();
    }, 3000);

    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
      if (swap.toToken) {
        chart.setChartLabel(
          `${Token.getToken({ address: swap.toToken.address }).symbol}`
        );
        chart.setChartTarget(Token.getToken({ address: swap.toToken.address }));
        chart.setCurrencyCode("USD");
      } else if (swap.fromToken) {
        chart.setChartLabel(
          `${Token.getToken({ address: swap.fromToken.address }).symbol}`
        );
        chart.setChartTarget(
          Token.getToken({ address: swap.fromToken.address })
        );
        chart.setCurrencyCode("USD");
      }
      console.log("chart.getChartTarget()", chart.chartTarget);
    }, [swap.fromToken, swap.toToken]);

    return (
      <SpinnerContainer
        className={cn(
          "flex flex-1 justify-around items-center flex-col gap-2 w-full"
        )}
        isLoading={false}
      >
        <div
          className={cn(
            " w-full flex flex-1 flex-col justify-center items-start gap-[23px] bg-[#FFCD4D] rounded-3xl border-3 border-solid border-[#F7931A10] hover:border-[#F7931A] transition-all relative",
            noBoarder && "border-0"
          )}
        >
          <Trigger
            tab={operate}
            capitalize={true}
            setTab={setOperate}
            options={["Swap", "LP"]}
            callback={(tab) => setCurrentTab(tab as "Swap" | "LP")}
            className="w-[308px] z-10 absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2"
            notification={memePairContract.canClaimLP ? ["LP"] : []}
          />

          {currentTab === "Swap" && (
            <LoadingContainer isLoading={!isInit}>
              <V3SwapCard
                fromTokenAddress={inputAddress}
                toTokenAddress={outputAddress}
                bordered={false}
                isInputNative={isInputNative}
                isOutputNative={isOutputNative}
                onSwapSuccess={onSwapSuccess}
                disableToSelection={true}
              />
            </LoadingContainer>
          )}

          {currentTab === "LP" && (
            <LoadingContainer isLoading={!isInit}>
              <HoneyContainer>
                {memePairContract.canClaimLP && (
                  <Button
                    className="w-full relative overflow-visible"
                    isLoading={memePairContract.claimLP.loading}
                    onClick={() => {
                      memePairContract.claimLP.call();
                    }}
                    isDisabled={!memePairContract.canClaimLP}
                  >
                    Claim LP
                    {memePairContract.canClaimLP && (
                      <div className="absolute -top-0 -right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-red-500 rounded-full z-10" />
                    )}
                  </Button>
                )}
                <div className=" w-full flex gap-x-2 justify-around *:flex-grow-[1]">
                  <Button
                    className="w-full"
                    onClick={async () => {
                      const lpTokenAddress =
                        await memePairContract.contract.read.lpToken();
                      window.location.href = `/vault/${lpTokenAddress}`;
                    }}
                  >
                    Visit Vault
                  </Button>
                  <Link
                    className="w-full"
                    href={`${DOMAIN_MAP.WASABEE}/pool-detail/${vaultContract?.pool?.address}`}
                  >
                    <Button className="w-full">Customize Position</Button>
                  </Link>
                </div>
                <div className="w-full rounded-[32px] bg-white space-y-2 px-4 py-6 custom-dashed">
                  {vaultContract && (
                    <VaultAmount
                      vaultContract={vaultContract}
                      onAmountChange={onAmountChange}
                      values={values}
                    />
                  )}
                </div>

                <Button
                  className="w-full"
                  isDisabled={!vaultContract?.isInitialized}
                  isLoading={vaultContract?.transactionPending}
                  onClick={async () => {
                    await vaultContract?.deposit(
                      BigInt(values.amount0),
                      BigInt(values.amount1),
                      wallet.account
                    );
                  }}
                >
                  {vaultContract?.transactionPending ? "Pending..." : "Deposit"}
                </Button>
              </HoneyContainer>
            </LoadingContainer>
          )}
        </div>
        {extraTokenAction}
      </SpinnerContainer>
    );
  }
);
