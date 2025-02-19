import { Token } from "../generated/graphql";
import dayjs from "dayjs";
export const calculateToken24hPriceChange: (token: Token) => {
  priceChange: number;
  priceChangePercentage: number;
} = (token: Token) => {
  const tokenHourData = token.tokenHourData;
  if (!tokenHourData) {
    return {
      priceChange: 0,
      priceChangePercentage: 0,
    };
  }

  const timeNow = dayjs().unix();
  const timeHourIndex = Math.floor(Number(timeNow) / 3600);
  const tokenHourNowUnix = timeHourIndex * 3600;

  console.log("calculateToken24hPriceChange time data", {
    timeNow,
    timeHourIndex,
    tokenHourNowUnix,
    tokenHourData,
  });

  let averagePrice24h = 0;
  let averagePrice48h = 0;
  let indexCount24h = 0;
  let indexCount48h = 0;

  //calculate average price of token in the last 24 hours
  for (let i = 0; i < 24; i++) {
    const hourTimestamp = tokenHourNowUnix - i * 3600;
    const hourData = tokenHourData.find((hourData) => {
      return Number(hourData.periodStartUnix) === hourTimestamp;
    });
    if (hourData) {
      averagePrice24h += Number(hourData.priceUSD);
      indexCount24h++;
    }
  }
  if (indexCount24h === 0) {
    averagePrice24h = tokenHourData[0].priceUSD;
  } else {
    averagePrice24h = averagePrice24h / indexCount24h;
  }

  //calculate average price of token in the last 48 hours
  for (let i = 24; i < 48; i++) {
    const hourTimestamp = tokenHourNowUnix - i * 3600;
    const hourData = tokenHourData.find((hourData) => {
      return Number(hourData.periodStartUnix) === hourTimestamp;
    });
    if (hourData) {
      averagePrice48h += Number(hourData.priceUSD);
      indexCount48h++;
    }
  }
  if (indexCount48h === 0) {
    averagePrice48h = token.initialUSD;
  } else {
    averagePrice48h = averagePrice48h / indexCount48h;
  }

  console.log("calculateToken24hPriceChange output data", {
    averagePrice24h,
    averagePrice48h,
    indexCount24h,
    indexCount48h,
  });

  if (averagePrice48h === 0) {
    return {
      priceChange: averagePrice24h,
      priceChangePercentage: 100,
    };
  } else if (averagePrice24h === 0) {
    return {
      priceChange: -averagePrice48h,
      priceChangePercentage: 0,
    };
  } else {
    return {
      priceChange: averagePrice24h - averagePrice48h,
      priceChangePercentage:
        ((averagePrice24h - averagePrice48h) / averagePrice48h) * 100,
    };
  }
};
