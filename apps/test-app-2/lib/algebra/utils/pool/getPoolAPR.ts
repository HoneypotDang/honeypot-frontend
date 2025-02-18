import { Address } from "viem";
import { fetcher } from "@/config/algebra/api";
import { apiOrigin } from "@/config/algebra/api";

export async function getPoolAPR(poolId: Address) {
  if (!poolId) return;

  const poolsAPR = await fetcher(
    `${apiOrigin}/api/APR/pools/?network=berachain`
  )
    .then((v) => v.json())
    .catch((e) => console.error("Failed to fetch pools APR", e));

  if (poolsAPR?.[poolId?.toLowerCase()]) {
    return poolsAPR[poolId.toLowerCase()];
  }

  return 0;
}
