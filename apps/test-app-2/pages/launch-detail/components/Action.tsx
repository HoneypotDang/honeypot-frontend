import { observer, useLocalObservable } from "mobx-react-lite";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { Button } from "@/components/button/button-next";
import { Input } from "@/components/input";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { useAccount } from "wagmi";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { LaunchDetailSwapCard } from "@/components/SwapCard/MemeSwap";
import PottingModal from "@/components/atoms/Pot2PumpComponents/PottingModal";
import { wallet } from "@/services/wallet";

const SuccessAction = observer(
  ({
    pair,
    refreshTxsCallback,
  }: {
    pair: FtoPairContract | MemePairContract;
    refreshTxsCallback?: () => void;
  }) => {
    return (
      // <div className="flex gap-[16px] justify-center items-center flex-col lg:flex-row">
      //   {wallet.account != pair.provider && (
      //     <Button
      //       className="w-full"
      //       isLoading={pair.claimLP.loading}
      //       onClick={() => {
      //         pair.claimLP.call();
      //       }}
      //       isDisabled={!pair.canClaimLP}
      //     >
      //       {pair.canClaimLP ? "Claim LP" : "Claim LP (Not available)"}
      //     </Button>
      //   )}

      //   <Link
      //     href={`/swap?inputCurrency=${pair.launchedToken?.address}&outputCurrency=${pair.raiseToken?.address}`}
      //     className="text-black font-bold w-full"
      //   >
      //     <Button className="w-full">
      //       <p>BUY Token</p>
      //       <p>
      //         <Copy
      //           onClick={(e) => {
      //             e.preventDefault();
      //           }}
      //           className=" absolute ml-[8px] top-[50%] translate-y-[-50%]"
      //           value={`${window.location.origin}/swap?inputCurrency=${pair.raiseToken?.address}&outputCurrency=${pair.launchedToken?.address}`}
      //         ></Copy>
      //       </p>
      //     </Button>{" "}
      //   </Link>
      // </div>
      <>
        <LaunchDetailSwapCard
          noBoarder
          inputAddress={pair.raiseToken?.address ?? ""}
          outputAddress={pair.launchedToken?.address}
          memePairContract={pair as MemePairContract}
          onSwapSuccess={refreshTxsCallback}
          isInputNative={
            pair.raiseToken?.address.toLowerCase() ===
            wallet.currentChain.nativeToken.address.toLowerCase()
          }
        />
      </>
    );
  }
);

const FailAction = observer(
  ({
    pair,
    refreshTxsCallback,
  }: {
    pair: FtoPairContract | MemePairContract;
    refreshTxsCallback?: () => void;
  }) => {
    console.log(pair);
    if (pair instanceof MemePairContract) {
      pair.getCanRefund();
    }
    return (
      <div className="flex flex-col gap-[16px]">
        {pair instanceof FtoPairContract && pair.isProvider && (
          <Button
            className="w-full"
            isLoading={pair.withdraw.loading}
            onClick={() => {
              pair.withdraw.call();
            }}
          >
            Provider Withdraw
          </Button>
        )}
        {pair instanceof MemePairContract && pair.canRefund ? (
          <Button
            className="w-full"
            onClick={() => {
              pair.refund.call();
            }}
            isLoading={pair.refund.loading}
            style={{
              backgroundColor: "green",
            }}
          >
            Refund LP
          </Button>
        ) : (
          <Button className="w-full bg-gray-500" disabled>
            You have Refunded
          </Button>
        )}
      </div>
    );
  }
);

const ProcessingAction = observer(
  ({
    pair,
    refreshTxsCallback: onSuccess,
  }: {
    pair: FtoPairContract | MemePairContract;
    refreshTxsCallback?: () => void;
  }) => {
    return <PottingModal pair={pair} onSuccess={onSuccess} />;
  }
);

const Action = observer(
  ({
    pair,
    refreshTxsCallback,
  }: {
    pair: FtoPairContract | MemePairContract;
    refreshTxsCallback?: () => void;
  }) => {
    switch (pair.state) {
      case 0:
        return (
          <SuccessAction
            pair={pair}
            refreshTxsCallback={refreshTxsCallback}
          ></SuccessAction>
        );
      case 1:
        return (
          <FailAction
            pair={pair}
            refreshTxsCallback={refreshTxsCallback}
          ></FailAction>
        );
      case 2:
        return <>Case 2</>;
      case 3:
        if (pair.isCompleted) {
          return <></>;
        }
        return (
          <ProcessingAction
            pair={pair}
            refreshTxsCallback={refreshTxsCallback}
          ></ProcessingAction>
        );
    }
  }
);

export default Action;
