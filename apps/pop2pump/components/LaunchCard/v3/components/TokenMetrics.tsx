import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { LaunchCardComponentContainer } from "..";
import { observer } from "mobx-react-lite";
import { AmountFormat } from "@/components/AmountFormat";

export const TotalLaunched = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <LaunchCardComponentContainer>
        <h6 className="text-xs">Total launched</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {pair?.depositedLaunchedToken
              ? pair?.depositedLaunchedToken?.toFormat(0)
              : "-"}
            &nbsp;
            {pair?.launchedToken?.displayName}
          </span>
        </div>
      </LaunchCardComponentContainer>
    );
  }
);

export const TotalRaised = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <LaunchCardComponentContainer>
        <h6 className="text-xs">Total raised</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {pair?.depositedRaisedToken
              ? pair.depositedRaisedToken.toFormat(3)
              : "-"}
            &nbsp;
            {pair?.raiseToken?.displayName}
          </span>
        </div>
      </LaunchCardComponentContainer>
    );
  }
);

export const Participants = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <LaunchCardComponentContainer>
        <h6 className="text-xs">Participants</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            {pair?.participantsCount ? pair.participantsCount.toFormat(0) : "-"}
          </span>
        </div>
      </LaunchCardComponentContainer>
    );
  }
);

export const TokenPrice = observer(
  ({ pair }: { pair: FtoPairContract | MemePairContract }) => {
    return (
      <div className="flex flex-col items-center gap-1  odd:last:col-span-2">
        <h6 className="text-xs">Token Price</h6>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">
            <AmountFormat amount={pair?.price?.toFixed()}></AmountFormat>{" "}
            {pair?.raiseToken?.displayName}
          </span>
        </div>
      </div>
    );
  }
);

export const UserDeposited = observer(({ pair }: { pair: FtoPairContract }) => {
  return (
    <LaunchCardComponentContainer>
      <h6 className="text-xs">Your Deposit</h6>
      <div className="flex items-center gap-2 text-sm">
        {/* <TotalRaisedSvg /> */}
        <span className="font-bold">
          {pair?.userDepositedRaisedToken
            ? (
                pair.userDepositedRaisedToken.toNumber() /
                Math.pow(10, pair.raiseToken?.decimals ?? 18)
              ).toFixed(3)
            : "-"}
          &nbsp;
          {pair?.raiseToken?.displayName}
        </span>
      </div>
    </LaunchCardComponentContainer>
  );
});
