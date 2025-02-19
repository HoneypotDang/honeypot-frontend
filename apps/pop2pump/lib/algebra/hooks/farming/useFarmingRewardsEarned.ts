import { useCallback, useEffect, useState } from "react";
import { useRewardEarnedUSD } from "./useRewardEarnedUSD";
import { formatUnits } from "viem";
import { formatAmountWithAlphabetSymbol } from "../../utils/common/formatAmount";
import { Farming } from "@/types/algebra/types/farming-info";
import { Deposit } from "../../graphql/generated/graphql";
import { getFarmingRewards } from "../../utils/farming/getFarmingRewards";

export function useFarmingRewardsEarned({
  farming,
  deposits,
}: {
  farming: Farming;
  deposits: Deposit[];
}) {
  const [rewardEarned, setRewardEarned] = useState<bigint>(BigInt(0));
  const [bonusRewardEarned, setBonusRewardEarned] = useState<bigint>(BigInt(0));

  const fetchAllRewards = useCallback(() => {
    const promises: Promise<{
      reward: bigint;
      bonusReward: bigint;
    }>[] = [];
    deposits.forEach((deposit) => {
      if (deposit.eternalFarming !== null) {
        promises.push(
          getFarmingRewards({
            rewardToken: farming.farming.rewardToken,
            bonusRewardToken: farming.farming.bonusRewardToken,
            pool: farming.farming.pool,
            nonce: farming.farming.nonce,
            tokenId: BigInt(deposit.id),
          })
        );
      }
    });
    if (promises.length === 0) return;
    Promise.all(promises).then((rewards) => {
      setRewardEarned(BigInt(0));
      setBonusRewardEarned(BigInt(0));
      rewards.forEach((reward) => {
        setRewardEarned((prev) => prev + reward.reward);
        setBonusRewardEarned((prev) => prev + reward.bonusReward);
      });
    });
  }, [deposits, farming]);

  const formattedRewardEarned = Number(
    formatUnits(rewardEarned, Number(farming.rewardToken.decimals))
  );

  const formattedBonusRewardEarned = Number(
    formatUnits(bonusRewardEarned, Number(farming.bonusRewardToken?.decimals))
  );

  const formattedTotalEarned =
    formattedRewardEarned + formattedBonusRewardEarned;

  const rewardEarnedUSD = useRewardEarnedUSD({
    token: farming.rewardToken,
    reward: rewardEarned,
  });

  const bonusRewardEarnedUSD = useRewardEarnedUSD({
    token: farming.bonusRewardToken,
    reward: bonusRewardEarned,
  });

  const totalEarnedUSD = (rewardEarnedUSD + bonusRewardEarnedUSD).toFixed(4);

  useEffect(() => {
    fetchAllRewards();
  }, [fetchAllRewards]);

  return {
    rewardEarned: formatAmountWithAlphabetSymbol(
      formattedRewardEarned.toString(),
      2
    ),
    bonusRewardEarned: formatAmountWithAlphabetSymbol(
      formattedBonusRewardEarned.toString(),
      2
    ),
    totalEarned: formatAmountWithAlphabetSymbol(
      formattedTotalEarned.toString(),
      2
    ),
    totalEarnedUSD,
    refetch: fetchAllRewards,
  };
}
