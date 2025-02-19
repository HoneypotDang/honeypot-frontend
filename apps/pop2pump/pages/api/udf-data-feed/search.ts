// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {
  LibrarySymbolInfo,
  SearchSymbolResultItem,
  SearchSymbolsCallback,
} from "@/public/static/charting_library/charting_library";
import { chains, chainsMap } from "@/lib/chain";
import { Network, networks, networksMap } from "@/services/chain";
import { appRouter, caller } from "@/server/_app";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchSymbolResultItem[]>
) {
  Object.entries(req.query).forEach(([key, value]) => {
    console.log(key, value);
  });

  const query = req.query.query as string;
  const limit = req.query.limit as string;

  const symbols: SearchSymbolResultItem[] = [];

  networks.forEach(async (network) => {
    networksMap[network.chain.id].faucetTokens.map((token) => {
      symbols.push({
        ticker: token.symbol + ":" + network.chain.id + ":" + token.address,
        description: token.symbol + ":" + network.chain.name,
        type: "token",
        exchange: network.chain.name,
        symbol: token.symbol,
        full_name: token.symbol + ":" + network.chain.name,
      });
    });

    const pairs = await caller.pair.getPairs({
      chainId: network.chain.id as number,
    });

    if (pairs) {
      Object.values(pairs).map((pair) => {
        symbols.push({
          ticker:
            pair.token0.symbol +
            "/" +
            pair.token1.symbol +
            ":" +
            network.chain.id +
            ":" +
            pair.address,
          description:
            pair.token0.symbol +
            "/" +
            pair.token1.symbol +
            ":" +
            network.chain.id,
          type: "pair",
          exchange: network.chain.name,
          symbol: pair.token0.symbol + "/" + pair.token1.symbol,
          full_name:
            pair.token0.symbol +
            "/" +
            pair.token1.symbol +
            ":" +
            network.chain.id,
        });
      });
    }

    res
      .status(200)
      .json(
        symbols
          .filter((symbol) => symbol.symbol.includes(query))
          .slice(0, parseInt(limit))
      );
  });
}
