import { useContractWrite, useSimulateContract } from "wagmi";
import { useEffect } from "react";
import { useFarmCheckApprove } from "./useFarmCheckApprove";
import { useTransactionAwait } from "../common/useTransactionAwait";
import {
  ALGEBRA_POSITION_MANAGER,
  FARMING_CENTER,
} from "@/config/algebra/addresses";
import { algebraPositionManagerABI } from "@cryptoalgebra/sdk";
import { TransactionType } from "../../state/pendingTransactionsStore";

export function useFarmApprove(tokenId: bigint) {
  const APPROVE = true;

  const { data: config } = useSimulateContract({
    address: tokenId ? ALGEBRA_POSITION_MANAGER : undefined,
    abi: algebraPositionManagerABI,
    functionName: "approveForFarming",
    args: [tokenId, APPROVE, FARMING_CENTER],
  });

  const { data: data, writeContractAsync: onApprove } = useContractWrite();

  const { isLoading, isSuccess } = useTransactionAwait(data, {
    title: `Farm Approve`,
    tokenId: tokenId.toString(),
    type: TransactionType.FARM,
  });

  const { handleCheckApprove } = useFarmCheckApprove(tokenId);

  useEffect(() => {
    if (isSuccess) {
      handleCheckApprove();
    }
  }, [isSuccess]);

  return {
    isLoading,
    isSuccess,
    onApprove: () => config && onApprove(config.request),
  };
}
