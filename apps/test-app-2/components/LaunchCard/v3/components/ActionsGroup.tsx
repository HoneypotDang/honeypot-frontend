import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { observer } from "mobx-react-lite";
import {
  ClaimAction,
  RefundAction,
  ToTokenDetailsPage,
  BuyToken,
  AddLP,
} from "./ActionComponents";
import { launchCardVariants } from "..";

export const MemeProjectActions = observer(
  ({ pair, type }: { pair: MemePairContract; type: launchCardVariants }) => {
    return (
      <>
        <ClaimAction pair={pair} />
        <RefundAction pair={pair} />
        <ToTokenDetailsPage pair={pair} />
        {/* <BuyToken pair={pair} />
        <AddLP pair={pair} /> */}
      </>
    );
  }
);

export const FtoProjectActions = ({
  pair,
  type,
}: {
  pair: FtoPairContract;
  type: launchCardVariants;
}) => {
  return (
    <>
      <ClaimAction pair={pair} />
      <ToTokenDetailsPage pair={pair} />
      <BuyToken pair={pair} />
      <AddLP pair={pair} />
    </>
  );
};
