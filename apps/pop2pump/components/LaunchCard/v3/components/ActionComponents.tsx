import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/button/button-next";
import Link from "next/link";

export const ClaimAction = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.canClaimLP && (
          <div>
            <Button
              className="w-full"
              onClick={() => {
                pair.claimLP.call();
              }}
              style={{
                backgroundColor: "green",
              }}
            >
              Claim LP
            </Button>
          </div>
        )}
      </>
    );
  }
);

export const RefundAction = observer(({ pair }: { pair: MemePairContract }) => {
  return (
    <>
      {pair.canRefund && (
        <div>
          <Button
            className="w-full"
            onClick={() => {
              pair.refund.call();
            }}
            style={{
              backgroundColor: "green",
            }}
          >
            Refund
          </Button>
        </div>
      )}
    </>
  );
});

export const ToTokenDetailsPage = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <Link href={`/launch-detail/${pair?.launchedToken?.address}`}>
        <Button className="w-full">View Token</Button>
      </Link>
    );
  }
);

export const BuyToken = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.state === 0 && (
          <Link
            href={`/swap?inputCurrency=${pair.raiseToken?.address}&outputCurrency=${pair.launchedToken?.address}`}
          >
            <Button className="w-full">Buy Token</Button>
          </Link>
        )}
      </>
    );
  }
);

export const AddLP = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <>
        {pair.state === 0 && (
          <Link
            href={`/pool?inputCurrency=${pair.launchedToken?.address}&outputCurrency=${pair.raiseToken?.address}`}
          >
            <Button className="w-full">Add LP</Button>
          </Link>
        )}
      </>
    );
  }
);
