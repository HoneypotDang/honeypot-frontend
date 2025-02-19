export const ftoFacadeABI = [
  {
    inputs: [{ internalType: "address", name: "_factory", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "claimLP",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "claimableLP",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
      { internalType: "uint256", name: "raisedTokenAmount", type: "uint256" },
      { internalType: "uint256", name: "launchedTokenAmount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "factory",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "getFTOPair",
    outputs: [{ internalType: "address", name: "pair", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "getFTOPairProvider",
    outputs: [{ internalType: "address", name: "provider", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "getFTOState",
    outputs: [{ internalType: "uint256", name: "state", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "refundRaisedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "raisedToken", type: "address" },
      { internalType: "address", name: "launchedToken", type: "address" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
