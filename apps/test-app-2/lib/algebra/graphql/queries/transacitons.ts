import { gql } from "@apollo/client";

export const TRANSACTION_FRAGMENT = gql`
  fragment TransactionFields on Transaction {
    id
    timestamp
    type
    gasLimit
    gasPrice
    blockNumber
    account {
      ...AccountField
    }
    mints {
      ...MintFields
    }
    burns {
      ...BurnFields
    }
    swaps {
      ...SwapFields
    }
    flashed {
      ...FlashedFields
    }
    collects {
      ...CollectFields
    }
    depositRaisedTokens {
      ...DepositRaisedTokenFields
    }
    refunds {
      ...RefundFields
    }
    claimLps {
      ...ClaimLpFields
    }
  }
`;

export const SWAP_FRAGMENT = gql`
  fragment SwapFields on Swap {
    id
    transaction {
      id
    }
    timestamp
    pool {
      id
    }
    token0 {
      id
    }
    token1 {
      id
    }
    sender
    recipient
    liquidity
    origin
    amount0
    amount1
    amountUSD
    price
    tick
    logIndex
  }
`;

export const DEPOSIT_RAISED_TOKEN_FRAGMENT = gql`
  fragment DepositRaisedTokenFields on DepositRaisedToken {
    id
    transaction {
      id
    }
    timestamp
    amount
    origin
    logIndex
    poolAddress
  }
`;

export const REFUND_FRAGMENT = gql`
  fragment RefundFields on Refund {
    id
    transaction {
      id
    }
    timestamp
    amount
    origin
    logIndex
    poolAddress
  }
`;

export const CLAIM_LP_FRAGMENT = gql`
  fragment ClaimLpFields on ClaimLp {
    id
    transaction {
      id
    }
    timestamp
    amount
    origin
    logIndex
    poolAddress
  }
`;

export const FLASHED_FRAGMENT = gql`
  fragment FlashedFields on Flash {
    id
  }
`;

export const COLLECT_FRAGMENT = gql`
  fragment CollectFields on Collect {
    id
  }
`;

export const BURN_FRAGMENT = gql`
  fragment BurnFields on Burn {
    id
  }
`;

export const MINT_FRAGMENT = gql`
  fragment MintFields on Mint {
    id
  }
`;

export const TRANSACTIONS_QUERY = gql`
  query Transactions($where: Transaction_filter, $first: Int, $skip: Int) {
    transactions(
      where: $where
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      ...TransactionFields
    }
  }
`;

export const SWAPS_QUERY = gql`
  query Swaps($where: Swap_filter, $first: Int, $skip: Int) {
    swaps(where: $where, first: $first, skip: $skip) {
      ...SwapFields
    }
  }
`;

export const DEPOSIT_RAISED_TOKEN_QUERY = gql`
  query DepositRaisedToken(
    $where: DepositRaisedToken_filter
    $first: Int
    $skip: Int
  ) {
    depositRaisedTokens(where: $where, first: $first, skip: $skip) {
      ...DepositRaisedTokenFields
    }
  }
`;

export const REFUND_QUERY = gql`
  query Refund($where: Refund_filter, $first: Int, $skip: Int) {
    refunds(where: $where, first: $first, skip: $skip) {
      ...RefundFields
    }
  }
`;

export const CLAIM_LP_QUERY = gql`
  query ClaimLp($where: ClaimLp_filter, $first: Int, $skip: Int) {
    claimLps(where: $where, first: $first, skip: $skip) {
      ...ClaimLpFields
    }
  }
`;

export const FLASH_QUERY = gql`
  query Flashes($where: Flash_filter, $first: Int, $skip: Int) {
    flashes(where: $where, first: $first, skip: $skip) {
      ...FlashedFields
    }
  }
`;

export const COLLECT_QUERY = gql`
  query Collect($where: Collect_filter, $first: Int, $skip: Int) {
    collects(where: $where, first: $first, skip: $skip) {
      ...CollectFields
    }
  }
`;

export const BURN_QUERY = gql`
  query Burn($where: Burn_filter, $first: Int, $skip: Int) {
    burns(where: $where, first: $first, skip: $skip) {
      ...BurnFields
    }
  }
`;

export const MINT_QUERY = gql`
  query Mint($where: Mint_filter, $first: Int, $skip: Int) {
    mints(where: $where, first: $first, skip: $skip) {
      ...MintFields
    }
  }
`;
