import { useCallback, useEffect, useState } from "react";
import { useRewardEarnedUSD } from "./useRewardEarnedUSD";
import { formatUnits } from "viem";
import { formatAmountWithAlphabetSymbol } from "../../utils/common/formatAmount";
import {
  EternalFarming,
  useSingleTokenQuery,
} from "../../graphql/generated/graphql";
import { getFarmingRewards } from "../../utils/farming/getFarmingRewards";

export function useFarmingDepositRewardsEarned({
  farming,
  positionId,
}: {
  farming: EternalFarming;
  positionId: bigint;
}) {
  const [rewardEarned, setRewardEarned] = useState<bigint>(BigInt(0));
  const [bonusRewardEarned, setBonusRewardEarned] = useState<bigint>(BigInt(0));

  const { data: rewardToken } = useSingleTokenQuery({
    variables: {
      tokenId: farming.rewardToken,
    },
  });

  const { data: bonusRewardToken } = useSingleTokenQuery({
    variables: {
      tokenId: farming.bonusRewardToken,
    },
  });

  const fetchDepositRewards = useCallback(() => {
    getFarmingRewards({
      tokenId: positionId,
      rewardToken: farming.rewardToken,
      bonusRewardToken: farming.bonusRewardToken,
      pool: farming.pool,
      nonce: farming.nonce,
    }).then((rewards) => {
      setRewardEarned(rewards.reward);
      setBonusRewardEarned(rewards.bonusReward);
    });
  }, [farming, positionId]);

  const formattedRewardEarned = rewardToken?.token
    ? Number(formatUnits(rewardEarned, Number(rewardToken.token.decimals)))
    : 0;

  const formattedBonusRewardEarned = bonusRewardToken?.token
    ? Number(
        formatUnits(bonusRewardEarned, Number(bonusRewardToken.token.decimals))
      )
    : 0;

  const formattedTotalEarned =
    formattedRewardEarned + formattedBonusRewardEarned;

  const rewardEarnedUSD = useRewardEarnedUSD({
    token: rewardToken?.token,
    reward: rewardEarned,
  });

  const bonusRewardEarnedUSD = useRewardEarnedUSD({
    token: bonusRewardToken?.token,
    reward: bonusRewardEarned,
  });

  const totalEarnedUSD = (rewardEarnedUSD + bonusRewardEarnedUSD).toFixed(4);

  useEffect(() => {
    fetchDepositRewards();
  }, [fetchDepositRewards]);

  return {
    rewardEarned: formatAmountWithAlphabetSymbol(
      formattedRewardEarned.toString(),
      2
    ),
    bonusRewardEarned: formatAmountWithAlphabetSymbol(
      formattedBonusRewardEarned.toString(),
      2
    ),
    rewardEarnedUSD: formatAmountWithAlphabetSymbol(
      rewardEarnedUSD.toString(),
      4
    ),
    bonusRewardEarnedUSD: formatAmountWithAlphabetSymbol(
      bonusRewardEarnedUSD.toString(),
      4
    ),
    totalEarned: formatAmountWithAlphabetSymbol(
      formattedTotalEarned.toString(),
      2
    ),
    totalEarnedUSD,
    refetch: fetchDepositRewards,
  };
}
