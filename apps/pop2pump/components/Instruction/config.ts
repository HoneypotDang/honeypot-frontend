export const guideConfigs = [
  {
    path: "/launch-token",
    title:
      "Pot2Pump mode stops rugs by ensuring all tokens are safe and integrate perfectly with PoL",
    desc: "Every token created with Pot2Pump mode is a fair-launch—no presales, no team allocations with a chance to mine BGT and other protocol interests.",
    stepTitle: "How it works",
    buttonText: "I'm ready to pump",
    steps: [
      {
        content: "Pick a coin that you like 💖",
      },
      {
        content:
          "Deposit your coin to create your LP position in the AMM pool 💸",
      },
      {
        content: "Withdraw anytime with no gains or losses🚪",
      },
      {
        content:
          "Once $20k market cap is reached, Liquidity is locked & burned on HenloDEX 🔥 + distribute deployer rewards!",
      },
      {
        content:
          "claim your LP position and earn txn fee, BGT, and other protocol interest",
      },
    ],
  },
  {
    path: "/swap",
    title: "",
    desc: "",
    stepTitle: "How to Swap Tokens",
    buttonText: "Start Swapping",
    steps: [
      {
        content:
          'Select "From" Token: Choose the token you want to sell from the dropdown menu.',
      },
      {
        content: 'Select "To" Token: Pick the token you want to buy.',
      },
      {
        content:
          "Confirm Amount: Input the desired amount to swap, and double-check the details.",
      },
      {
        content:
          "Approve & Swap: Confirm the transaction in your wallet and initiate the swap.",
      },
      {
        content:
          "Wait for Confirmation: The transaction will process on-chain. This may take a few moments depending on network activity.",
      },
      {
        content:
          "Receive Tokens: Once completed, your new tokens will be credited to your wallet!",
      },
    ],
  },
  {
    path: ["/pool", "/pools"],
    title: "Tips for Liquidity Pools",
    desc: "If you’re providing liquidity to earn fees and rewards, here’s what you need to know:",
    stepTitle: "",
    buttonText: "Start Providing Liquidity",
    steps: [
      {
        content: "Understanding Liquidity Pools:",
        steps: [
          {
            content:
              "Liquidity pools allow you to earn rewards by providing pairs of tokens (e.g., Token A and Token B).",
          },
          {
            content:
              "In return, you receive LP (Liquidity Provider) tokens, which represent your share in the pool.",
          },
        ],
      },
      {
        content: "Providing Liquidity:",
        steps: [
          {
            content:
              "Select the token pair and input equal value amounts for both tokens.",
          },
          {
            content: "Confirm and approve the transaction in your wallet.",
          },
          {
            content:
              "Stake the LP tokens to earn additional rewards if applicable.",
          },
        ],
      },
      {
        content: "Risks to Consider:",
        steps: [
          {
            content:
              "Impermanent Loss: If the price ratio of the two tokens changes significantly, you might lose some value compared to holding the tokens individually.",
          },
          {
            content:
              "Network Fees: Ensure you have enough balance to cover gas fees for both depositing and withdrawing liquidity.",
          },
        ],
      },
      {
        content: "Monitor Your Positions:",
        steps: [
          {
            content:
              "Use the dashboard to track your LP token balance, rewards, and pool performance.",
          },
          {
            content: "Withdraw at any time if you want to reclaim your tokens.",
          },
        ],
      },
    ],
  },
  {
    path: "/faucet",
    title: "Faucet (Testnet Only)",
    desc: "For testing purposes, you can use the faucet to get free testnet tokens:",
    stepTitle: "",
    buttonText: "Request Test Tokens",
    steps: [
      {
        content: "Request Test Tokens:",
        steps: [
          {
            content: "Go to the faucet section.",
          },
          {
            content: "Input your wallet address and select the token you need.",
          },
          {
            content:
              'Click "Request" to receive test tokens for testing swaps and providing liquidity.',
          },
        ],
      },
      {
        content: "Confirm Receipt:",
        steps: [
          {
            content:
              "The tokens should appear in your wallet shortly after the request.",
          },
        ],
      },
      {
        content: "Test Away:",
        steps: [
          {
            content:
              "Use these test tokens to explore the platform, including swaps and liquidity provision.",
          },
        ],
      },
    ],
  },
  {
    path: "/meme-launchs",
    title: "Meme Launch States",
    desc: "For our Meme Token Launches, there are three distinct states that govern the process. Here’s how it works:",
    stepTitle: "",
    buttonText: "Participate in Meme Launch",
    steps: [
      {
        content: "Processing State (Deposits Open):",
        steps: [
          {
            content:
              "During this phase, users can deposit the raise token (e.g., ETH, USDT) into the project.",
          },
          {
            content:
              "Deposits accumulate until the project's minimum cap is reached.",
          },
          {
            content:
              "You can monitor the total raised amount in real time on the project detail page.",
          },
          {
            content:
              "Key Action: Deposit tokens to participate in the Meme Token launch.",
          },
        ],
      },
      {
        content: "Success State (Cap Reached):",
        steps: [
          {
            content:
              'Once the project hits its minimum cap, the state changes to "Success."',
          },
          {
            content: "At this point:",
            steps: [
              {
                content: "Deposits are locked.",
              },
              {
                content:
                  "Users can visit the project detail page to claim their LP tokens (representing their share of the Meme Token liquidity pool) in exchange for their deposited raise tokens.",
              },
            ],
          },
          {
            content: "Key Action: Claim your LP tokens on the detail page.",
          },
        ],
      },
      {
        content: "Failed State (Cap Not Reached):",
        steps: [
          {
            content:
              'If the project does not meet its minimum cap before the end time, the launch moves to the "Failed" state.',
          },
          {
            content: "In this case:",
            steps: [
              {
                content:
                  "Depositors are eligible for a full refund of their raise tokens.",
              },
              {
                content:
                  "Refunds can be initiated and claimed on the project detail page.",
              },
            ],
          },
          {
            content: "Key Action: Refund your deposit on the detail page.",
          },
        ],
      },
    ],
  },
];
