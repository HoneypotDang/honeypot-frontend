type Token = {
  id: string;
  name: string;
  symbol: string;
  decimals: string;
  holderCount: string;
  derivedMatic: string;
  totalSupply: string;
  volumeUSD: string;
  txCount: string;
  totalValueLockedUSD: string;
  derivedUSD: string;
  initialUSD: string;
};

export type Pot2Pump = {
  id: string;
  launchToken: Token;
  raisedToken: Token;
  DepositRaisedToken: string;
  DepositLaunchToken: string;
  createdAt: string;
  endTime: string;
  state: string;
  participantsCount: string;
  raisedTokenReachingMinCap: boolean;
  raisedTokenMinCap: string;
  creator: string;
};
