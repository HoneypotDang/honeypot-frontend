import { useContractWrite, useSimulateContract } from "wagmi";
import { encodeFunctionData } from "viem";
import { useTransactionAwait } from "../common/useTransactionAwait";
import { Address } from "viem";
import { FARMING_CENTER } from "@/config/algebra/addresses";
import { farmingCenterABI } from "@/lib/abis/algebra-contracts/ABIs";
import { Deposit } from "../../graphql/generated/graphql";
import { TransactionType } from "../../state/pendingTransactionsStore";
import { getRewardsCalldata } from "../../utils/farming/getRewardsCalldata";

export function useFarmHarvest({
  tokenId,
  rewardToken,
  bonusRewardToken,
  pool,
  nonce,
  account,
}: {
  tokenId: bigint;
  rewardToken: Address;
  bonusRewardToken: Address;
  pool: Address;
  nonce: bigint;
  account: Address;
}) {
  const calldata = getRewardsCalldata({
    rewardToken,
    bonusRewardToken,
    pool,
    nonce,
    tokenId,
    account,
  });

  const { data: config } = useSimulateContract({
    address: account && tokenId ? FARMING_CENTER : undefined,
    abi: farmingCenterABI,
    functionName: "multicall",
    args: [calldata],
  });

  const { data: data, writeContractAsync: onHarvest } = useContractWrite();

  const { isLoading, isSuccess } = useTransactionAwait(data, {
    title: `Farm Harvest`,
    tokenId: tokenId.toString(),
    type: TransactionType.FARM,
  });

  return {
    isLoading,
    isSuccess,
    onHarvest: () => config && onHarvest(config.request),
  };
}

export function useFarmHarvestAll(
  {
    rewardToken,
    bonusRewardToken,
    pool,
    nonce,
    account,
  }: {
    rewardToken: Address;
    bonusRewardToken: Address;
    pool: Address;
    nonce: bigint;
    account: Address;
  },
  deposits: Deposit[]
) {
  const calldatas: Address[] = [];

  deposits.forEach((deposit) => {
    if (deposit.eternalFarming !== null) {
      const rewardsCalldata = getRewardsCalldata({
        rewardToken,
        bonusRewardToken,
        pool,
        nonce,
        tokenId: BigInt(deposit.id),
        account,
      });

      const calldata = encodeFunctionData({
        abi: farmingCenterABI,
        functionName: "multicall",
        args: [rewardsCalldata],
      });
      calldatas.push(calldata);
    }
  });

  const { data: config } = useSimulateContract({
    address: FARMING_CENTER,
    abi: farmingCenterABI,
    functionName: "multicall",
    args: [calldatas],
  });

  const { data: data, writeContractAsync: onHarvestAll } = useContractWrite();

  const { isLoading, isSuccess } = useTransactionAwait(data, {
    title: `Harvest All Positions`,
    type: TransactionType.FARM,
    tokenId: "0",
  });

  return {
    isLoading,
    isSuccess,
    onHarvestAll: () => config && onHarvestAll(config.request),
  };
}
