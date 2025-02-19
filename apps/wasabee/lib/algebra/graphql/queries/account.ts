import { gql } from "@apollo/client";

export const All_Accounts = gql`
  query AllAccounts(
    $orderBy: Account_orderBy
    $orderDirection: OrderDirection
  ) {
    accounts(first: 100, orderBy: $orderBy, orderDirection: $orderDirection) {
      ...AccountField
    }
  }
`;

export const SINGLE_ACCOUNT_DETAILS = gql`
  query SingleAccountDetails($accountId: ID!) {
    account(id: $accountId) {
      ...AccountField
    }
  }
`;

export const ACCOUNT_FRAGMENT = gql`
  fragment AccountField on Account {
    id
    swapCount
    memeTokenHoldingCount
    pot2PumpLaunchCount
    participateCount
    platformTxCount
    holdingPoolCount
    totalSpendUSD
    vaultShares {
      ...VaultShareField
    }
    transaction(orderBy: timestamp, orderDirection: desc, first: 100) {
      ...TransactionField
    }
    holder {
      ...HoldingTokenField
    }
    participant {
      ...ParticipantField
    }
  }
`;

export const HOLDING_TOKEN_FRAGMENT = gql`
  fragment HoldingTokenField on HoldingToken {
    id
    holdingValue
    token {
      ...TokenField
    }
  }
`;

export const PARTICIPANT_FRAGMENT = gql`
  fragment ParticipantField on Participant {
    id
    pot2Pump {
      ...AccountPot2PumpField
    }
  }
`;

export const POT2PUMP_FRAGMENT = gql`
  fragment AccountPot2PumpField on Pot2Pump {
    id
  }
`;

export const VAULT_SHARE_FRAGMENT = gql`
  fragment VaultShareField on VaultShare {
    id
    vaultShareBalance
    vault {
      ...AlgebraVaultField
    }
  }
`;

export const VAULT_FRAGMENT = gql`
  fragment AlgebraVaultField on IchiVault {
    id
  }
`;

export const TRANSACTION_FRAGMENT = gql`
  fragment TransactionField on Transaction {
    id
    timestamp
  }
`;

export const TOKEN_FRAGMENT = gql`
  fragment TokenField on Token {
    id
    symbol
    derivedUSD
  }
`;
