// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chains, chainsMap } from "@/lib/chain";

type Data = {
  symbol: string[];
  description: string[];
  "exchange-listed": string;
  "exchange-traded": string;
  minmovement: number;
  minmovement2: number;
  pricescale: number[];
  "has-dwm": boolean;
  "has-intraday": boolean;
  type: string[];
  ticker: string[];
  timezone: string;
  "session-regular": string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({
    symbol: ["AAPL", "MSFT", "SPX"],
    description: ["Apple Inc", "Microsoft corp", "S&P 500 index"],
    "exchange-listed": "NYSE",
    "exchange-traded": "NYSE",
    minmovement: 1,
    minmovement2: 0,
    pricescale: [1, 1, 100],
    "has-dwm": true,
    "has-intraday": true,
    type: ["stock", "stock", "index"],
    ticker: ["AAPL~0", "MSFT~0", "$SPX500"],
    timezone: "America/New_York",
    "session-regular": "0000-2400",
  });
}
