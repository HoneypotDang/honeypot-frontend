const MULTICALL_ADDRESS = "0xb9Ace5D41e131906F53237e01119FC42d77bb831";
import { Multicall, ContractCallContext } from "ethereum-multicall";
import { type Config, getClient } from "@wagmi/core";
import { providers } from "ethers";
import type { Client, Chain, Transport } from "viem";
import { config } from "@/config/wagmi";
import { useQuery } from "@tanstack/react-query";

function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<Transport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );
  return new providers.JsonRpcProvider(transport.url, network);
}

type Payload = {
  queryKey: any[];
  enabled?: boolean;
  contractCallContext: ContractCallContext[];
  select?: (data: any) => any;
};

const useMulticall3 = ({
  queryKey,
  contractCallContext,
  select,
  enabled = true,
}: Payload) => {
  // @ts-ignore
  const client = getClient(config, { chainId: config.chains[0].id });

  const data = useQuery({
    queryKey: ["multicall3", ...queryKey],
    queryFn: async () => {
      const multicall = new Multicall({
        ethersProvider: clientToProvider(client!),
        multicallCustomContractAddress: MULTICALL_ADDRESS,
      });

      const result = await multicall.call(contractCallContext);
      return result;
    },
    enabled: Boolean(client) && enabled,
    select: select
      ? (data) => {
          if (data && select) {
            return select(data.results);
          }
          return data;
        }
      : undefined,
  });

  return data;
};

export default useMulticall3;
