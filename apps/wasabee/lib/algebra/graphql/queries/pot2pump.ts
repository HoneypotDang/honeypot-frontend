import { gql } from "@apollo/client";

export const GET_POT2_PUMP_DETAIL = gql`
  query GetPot2PumpDetail($id: ID!, $accountId: ID) {
    pot2Pump(id: $id) {
      ...Pot2PumpField
      participants(where: { account_: { id: $accountId } }) {
        ...ParticipantFields
      }
    }
  }
`;

export const GET_PARTICIPANT_DETAIL = gql`
  query GetParticipantDetail($accountId: ID!, $pot2PumpId: ID!) {
    participants(
      where: { account_: { id: $accountId }, pot2Pump_: { id: $pot2PumpId } }
    ) {
      ...ParticipantFields
      pot2Pump {
        ...Pot2PumpField
      }
      account {
        ...AccountField
      }
    }
  }
`;

export const POT_2_PUMP_POTTING_NEW_TOKENS = gql`
  query Pot2PumpPottingNewTokens($endTime: BigInt) {
    pot2Pumps(
      first: 25
      orderBy: createdAt
      orderDirection: desc
      where: { raisedTokenReachingMinCap: false, endTime_gt: $endTime }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const POT_2_PUMP_POTTING_NEAR_SUCCESS = gql`
  query Pot2PumpPottingNearSuccess($endTime: BigInt) {
    pot2Pumps(
      first: 25
      orderBy: depositRaisedTokenPercentageToMinCap
      orderDirection: desc
      where: { raisedTokenReachingMinCap: false, endTime_gt: $endTime }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const POT_2_PUMP_PUMPING_HIGH_PRICE = gql`
  query Pot2PumpPottingHighPrice {
    pot2Pumps(
      first: 25
      orderBy: LaunchTokenTVLUSD
      orderDirection: desc
      where: { raisedTokenReachingMinCap: true }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const POT_2_PUMP_POTTING_TRENDING = gql`
  query Pot2PumpPottingTrending {
    pot2Pumps(
      first: 25
      orderBy: launchToken__priceChange24hPercentage
      orderDirection: desc
      where: { raisedTokenReachingMinCap: true }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const POT_2_PUMP_POTTING_MARKET_CAP = gql`
  query Pot2PumpPottingMarketCap {
    pot2Pumps(
      first: 25
      orderBy: LaunchTokenMCAPUSD
      orderDirection: desc
      where: { raisedTokenReachingMinCap: true }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const POT_2_PUMP_POTTING_NEW_TOKENS_BY_ENDTIME = gql`
  query Pot2PumpPottingNewTokensByEndtime($endTime: BigInt) {
    pot2Pumps(
      first: 25
      orderBy: endTime
      orderDirection: asc
      where: { raisedTokenReachingMinCap: true, endTime_gt: $endTime }
    ) {
      ...Pot2PumpField
    }
  }
`;

export const GET_LATEST_PUMPING_TOKEN = gql`
  query GetLatestPumpingToken {
    pot2Pumps(
      first: 1
      orderBy: endTime
      orderDirection: desc
      where: { raisedTokenReachingMinCap: true }
    ) {
      id
      launchToken {
        symbol
        name
      }
    }
  }
`;

export const POT2_PUMP_FRAGMENT = gql`
  fragment Pot2PumpField on Pot2Pump {
    id
    launchTokenInitialPrice
    DepositLaunchToken
    LaunchTokenTVLUSD
    LaunchTokenMCAPUSD
    raisedTokenMinCap
    depositRaisedTokenPercentageToMinCap
    raisedTokenReachingMinCap
    DepositRaisedToken
    creator
    participantsCount
    totalRefundAmount
    totalClaimLpAmount
    buyCount
    sellCount
    createdAt
    endTime
    state
    searchString
    launchToken {
      ...TokenFields
    }
    raisedToken {
      ...TokenFields
    }
    participantTransactionHistorys {
      ...ParticipantTransactionHistoryFields
    }
    # participants {
    #   ...ParticipantFields
    # }
  }
`;

export const PARTICIPANT_TRANSACTION_HISTORY_FRAGMENT = gql`
  fragment ParticipantTransactionHistoryFields on ParticipantTransactionHistory {
    id
  }
`;

export const PARTICIPANT_FRAGMENT = gql`
  fragment ParticipantFields on Participant {
    id
    amount
    totalRefundAmount
    totalclaimLqAmount
    claimed
    refunded
    account {
      ...AccountField
    }
    pot2Pump {
      ...Pot2PumpField
    }
  }
`;

export const CAN_CLAIM_POT2_PUMP_PARTICIPANT = gql`
  query CanClaimPot2PumpParticipant($accountId: ID!) {
    participants(
      where: {
        account_: { id: $accountId }
        claimed: false
        pot2Pump_: { raisedTokenReachingMinCap: true }
      }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...ParticipantFields
    }
  }
`;

export const CAN_REFUND_POT2_PUMP_PARTICIPANT = gql`
  query CanRefundPot2PumpParticipant($accountId: ID!, $timeNow: BigInt!) {
    participants(
      where: {
        account_: { id: $accountId }
        refunded: false
        pot2Pump_: { raisedTokenReachingMinCap: false, endTime_lt: $timeNow }
      }
      orderBy: createdAt
      orderDirection: desc
    ) {
      ...ParticipantFields
    }
  }
`;
