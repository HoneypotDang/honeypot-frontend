import { gql } from "@apollo/client";

export const ALL_RACERS = gql`
  query AllRacers {
    memeRacers {
      id
      currentScore
      token {
        symbol
        initialUSD
        derivedUSD
        totalSupply
      }
      hourData(orderBy: timestamp, orderDirection: asc) {
        timestamp
        score
        usdAtThisHour
      }
    }
  }
`;
