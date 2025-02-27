import { useReadAlgebraPositionManagerFarmingApprovals } from "@/wagmi-generated";
import { ADDRESS_ZERO } from "@cryptoalgebra/sdk";
import { useEffect, useState } from "react";

export function useFarmCheckApprove(tokenId: bigint) {
  const [approved, setApproved] = useState<boolean>();

  const {
    data,
    isLoading: isApproveLoading,
    refetch,
  } = useReadAlgebraPositionManagerFarmingApprovals({
    args: [tokenId],
  });

  useEffect(() => {
    setApproved(data !== ADDRESS_ZERO);
  }, [tokenId, data]);

  return {
    approved,
    handleCheckApprove: refetch,
    isLoading: approved === undefined || isApproveLoading,
  };
}
