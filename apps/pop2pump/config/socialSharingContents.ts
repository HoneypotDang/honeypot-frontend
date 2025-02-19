import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { DOMAIN_MAP } from "honeypot-sdk";

type platformMap = "telegram" | "twitter";

export const pot2pumpShareLink = (pair: MemePairContract) =>
  `${DOMAIN_MAP.POT2PUMP}/launch-detail/${pair.launchedToken?.address}`;

// $BM now trading on @honeypotfinance - #Berachain  #Meteora.
// 📈 24h Change: +X%
// 💰 Current Price: $X.XXXX
// CA: 0x3a276a32ac70eca4dea823e1624b5f17935f3333
//  🔹concentrated liquidity + ALM 🔹m3m3 staking together with #berachain POL
// Trade here:

export const pot2PumpPumpingShareTwitterContent = (pair: MemePairContract) => {
  return `
🚀 "${pair.launchedToken?.symbol}" now trading on @honeypotfinance - #Berachain  #Meteora.

📈 24h Change: ${Number(pair.launchedToken?.priceChange24hPercentage).toFixed(2)}%
💰 Current Price: $${Number(pair.launchedToken?.derivedUSD).toExponential(3)} 
CA: ${pair.launchedToken?.address}

🔹concentrated liquidity + ALM 🔹m3m3 staking together with #berachain POL

Trade now on:
`;
};

export const pot2PumpPottingShareTwitterContent = (pair: MemePairContract) => `
🚀$${pair.launchedToken?.symbol} now launched on @honeypotfinance pot2pump - #Berachain #Meteora.

📈 potting progress: ${pair.pottingPercentageNumber.toFixed(4)}%
CA: ${pair.launchedToken?.address}

🔹concentrated liquidity + ALM 🔹m3m3 staking together with #berachain POL

Trade here:
`;

export const pot2PumpPumpingShareTelegramContent = (pair: MemePairContract) => `
🚀 Pot2Pump
💥 Ticker: ${pair.launchedToken?.symbol} 
🔹 Full Name: ${pair.launchedToken?.displayName}  

📈 Price Growth since Launch: ${Number(pair.launchedToken?.priceChange24hPercentage).toFixed(2)}%     
💵 USD Price: $${Number(pair.launchedToken?.derivedUSD).toExponential(3)} 
🔄 Transactions: 🟢 ${pair.launchedTokenBuyCount} / 🔴 ${pair.launchedTokenSellCount}

🔗 ${window.location.origin}/launch-detail/${pair.launchedToken?.address}
`;

export const pot2PumpPottingShareTelegramContent = (pair: MemePairContract) => `
🚀 Pot2Pump
💥 Ticker: ${pair.launchedToken?.symbol} 
🔹 Full Name: ${pair.launchedToken?.displayName} 

📈 Potting Percentage: ${Number(pair.pottingPercentageDisplay).toFixed(2)}%    
💵 Total Raised: $${Number(pair.depositedRaisedToken).toExponential(3)}    
👥 Participants count: ${Number(pair.participantsCount).toExponential(2)}  

🔗 ${window.location.origin}/launch-detail/${pair.launchedToken?.address}
`;

export const pot2PumpShareContent = (
  pair: MemePairContract,
  platform: platformMap
) => {
  return encodeURIComponent(
    platform === "twitter"
      ? pair.state === 0
        ? pot2PumpPumpingShareTwitterContent(pair)
        : pot2PumpPottingShareTwitterContent(pair)
      : pair.state === 0
        ? pot2PumpPumpingShareTelegramContent(pair)
        : pot2PumpPottingShareTelegramContent(pair)
  );
};
