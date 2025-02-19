import { formatAmountWithAlphabetSymbol } from "../../utils/common/formatAmount";
import { Farming } from "@/types/algebra/types/farming-info";
import { useReadAlgebraVirtualPoolRewardRates } from "@/wagmi-generated";
import { formatUnits } from "viem";

export function useFarmingRewardRates(farming: Farming) {
  const { data: rates } = useReadAlgebraVirtualPoolRewardRates({
    address: farming.farming.virtualPool,
  });

  const [rewardRate, bonusRewardRate] = rates || [BigInt(0), BigInt(0)];

  const rewardRatePerDay =
    Number(formatUnits(rewardRate, Number(farming.rewardToken.decimals))) *
    60 *
    60 *
    24;

  const bonusRewardRatePerDay =
    Number(
      formatUnits(bonusRewardRate, Number(farming.bonusRewardToken?.decimals))
    ) *
    60 *
    60 *
    24;

  const sumOfRewardRates = rewardRatePerDay + bonusRewardRatePerDay;

  return {
    sumOfRewardRates: formatAmountWithAlphabetSymbol(
      sumOfRewardRates.toString(),
      4
    ),
    rewardRatePerDay: formatAmountWithAlphabetSymbol(
      rewardRatePerDay.toString(),
      4
    ),
    bonusRewardRatePerDay: formatAmountWithAlphabetSymbol(
      bonusRewardRatePerDay.toString(),
      4
    ),
  };
}
