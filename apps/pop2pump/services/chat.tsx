import { Button } from "@nextui-org/react";
import Link from "next/link";
import { makeAutoObservable } from "mobx";
import { ReactNode, useState } from "react";
import Image from "next/image";

class ChatService {
  chatIsOpen = false;
  messages: Message[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearChat() {
    this.messages = [];
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  agentMessage(message: string | React.ReactNode) {
    this.messages.push({
      id: this.messages.length + 1,
      text: message,
      sender: "agent",
    });
  }

  userMessage(message: string | React.ReactNode) {
    this.messages.push({
      id: this.messages.length + 1,
      text: message,
      sender: "user",
    });
  }

  toggleChat() {
    this.chatIsOpen = !this.chatIsOpen;
  }

  setChatIsOpen(isOpen: boolean) {
    this.chatIsOpen = isOpen;
  }

  getChatIsOpen() {
    return this.chatIsOpen;
  }

  getQuestionRelatedPages(page: string) {
    return questionRelatedPages[page];
  }

  findRelatedQuestionsByPath(path: string) {
    let questions: questionTitles[] | undefined = undefined;
    let paths = path.split("/");

    while (paths.length > 0) {
      const currentPath = paths.join("/");
      const currentQuestions = questionRelatedPages[currentPath];
      if (currentQuestions) {
        questions = currentQuestions;
        break;
      }
      paths.pop();
    }

    return questions;
  }

  getPresetQuestions() {
    return presetQuestions;
  }
}

export type Message = {
  id: number;
  text: string | React.ReactNode;
  sender: "user" | "agent";
};

export type presetQuestionType = {
  quesiton: questionTitles;
  answer: React.ReactNode;
};

export const chatService = new ChatService();

export type questionTitles =
  | "How to Swap Tokens?"
  | "Tips for Liquidity Pools"
  | "How to launch a Meme Token with Pot2Pump?"
  | "Pot2Pump Processing State"
  | "Pot2Pump Success State"
  | "Pot2Pump Failed State";

export const questionRelatedPages: Record<string, questionTitles[]> = {
  "/swap": ["How to Swap Tokens?"],
  "/pools": ["Tips for Liquidity Pools"],
  "/pot2pump": [
    "Pot2Pump Processing State",
    "Pot2Pump Success State",
    "Pot2Pump Failed State",
    "How to launch a Meme Token with Pot2Pump?",
  ],
  "/launch-detail": [
    "Pot2Pump Processing State",
    "Pot2Pump Success State",
    "Pot2Pump Failed State",
  ],
  "/launch-token": ["How to launch a Meme Token with Pot2Pump?"],
};

export const presetQuestions: Record<questionTitles, presetQuestionType> = {
  "How to Swap Tokens?": {
    quesiton: "How to Swap Tokens?",
    answer: (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">How to Swap Tokens?</h2>
        <ol className="list-decimal ml-5">
          <li>
            Select &quot;From&quot; Token: Choose the token you want to sell
            from the dropdown menu.
          </li>
          <li>Select &quot;To&quot; Token: Pick the token you want to buy.</li>
          <li>
            Confirm Amount: Input the desired amount to swap, and double-check
            the details.
          </li>
          <li>
            Approve &amp; Swap: Confirm the transaction in your wallet and
            initiate the swap.
          </li>
          <li>
            Wait for Confirmation: The transaction will process on-chain. This
            may take a few moments depending on network activity.
          </li>
          <li>
            Receive Tokens: Once completed, your new tokens will be credited to
            your wallet!
          </li>
        </ol>
      </div>
    ),
  },
  "Tips for Liquidity Pools": {
    quesiton: "Tips for Liquidity Pools",
    answer: (
      <div className="flex flex-col gap-2">
        <div>
          <h2 className="text-lg font-bold">Tips for Liquidity Pools</h2>
          <ol className="list-decimal m-5">
            <li>
              Understanding Liquidity Pools: Liquidity pools allow you to earn
              rewards by providing pairs of tokens (e.g., Token A and Token B).
              In return, you receive LP (Liquidity Provider) tokens, which
              represent your share in the pool.
            </li>
            <li>
              Providing Liquidity: Select the token pair and input equal value
              amounts for both tokens. Confirm and approve the transaction in
              your wallet. Stake the LP tokens to earn additional rewards if
              applicable.
            </li>
          </ol>
        </div>
      </div>
    ),
  },
  "Pot2Pump Processing State": {
    quesiton: "Pot2Pump Processing State",
    answer: (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Pot2Pump Processing State</h2>
        <div>
          <ol className="list-decimal *:ml-5">
            <li>
              During this phase, users can deposit the raise token (e.g., ETH,
              USDT) into the project. into the project.
            </li>
            <li>
              Deposits accumulate until the project&apos;s minimum cap is
              reached.
            </li>
            <li>
              You can monitor the total raised amount in real time on the
              project detail page.
            </li>
            <li>
              Key Action: Deposit tokens to participate in the Meme Token
              launch.
            </li>
          </ol>
        </div>
      </div>
    ),
  },
  "Pot2Pump Success State": {
    quesiton: "Pot2Pump Success State",
    answer: (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Pot2Pump Success State</h2>
        <ol className="list-decimal ml-5">
          <li>
            Once the project hits its minimum cap, the state changes to
            &quot;Success.&quot;
          </li>
          <li>At this point:</li>
          <li>Deposits are locked.</li>
          <li>
            Users can visit the project detail page to claim their LP tokens
            (representing their share of the Meme Token liquidity pool) in
            exchange for their deposited raise tokens.
          </li>
          <li>Key Action: Claim your LP tokens on the detail page.</li>
        </ol>
      </div>
    ),
  },
  "Pot2Pump Failed State": {
    quesiton: "Pot2Pump Failed State",
    answer: (
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Pot2Pump Failed State</h2>
        <ol className="list-decimal ml-5">
          <li>
            If the project does not meet its minimum cap before the end time,
            the launch moves to the &quot;Failed&quot; state.
          </li>
          <li>In this case:</li>
          <li>
            Depositors are eligible for a full refund of their raise tokens.
          </li>
          <li>
            Refunds can be initiated and claimed on the project detail page.
          </li>
          <li>Key Action: Refund your deposit on the detail page.</li>
        </ol>
      </div>
    ),
  },
  "How to launch a Meme Token with Pot2Pump?": {
    quesiton: "How to launch a Meme Token with Pot2Pump?",
    answer: <HowToLaunchMemeTokenGuide />,
  },
};

function TutorialStepContainer({ steps }: { steps: ReactNode[] }) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      <div className="flex flex-col gap-2 mb-5">{steps[currentStep - 1]}</div>
      <div className="flex justify-between">
        <Button
          isDisabled={currentStep === 1}
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          Previous
        </Button>
        <Button
          isDisabled={currentStep === steps.length}
          onClick={() => setCurrentStep(currentStep + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function HowToLaunchMemeTokenGuide() {
  const steps: ReactNode[] = [
    <div key={1}>
      <h2 className="text-lg font-bold">Step 1: Go to Pot2Pump launch Page</h2>
      <p>Follow this link to launch your Meme Token: </p>
      <Link className="text-blue-500" href="/launch-token?launchType=meme">
        launch Page
      </Link>
    </div>,
    <div key={2}>
      <h2 className="text-lg font-bold">
        Step 2: Fill in the required information
      </h2>
      <p>Currently there are 3 fields are required:</p>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step2.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
      <ul className="list-disc ml-5">
        <li>Token Logo: Upload a logo for your Meme Token</li>
        <li>Token Name: Full name of the Meme Token</li>
        <li>Token Symbol: Symbol/Ticker of the Meme Token</li>
      </ul>
    </div>,
    <div key={3}>
      <h2 className="text-lg font-bold">
        Step 3: Fill in the advanced option (optional)
      </h2>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step3-1.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
      <p>there are basically 2 parts of the advanced option:</p>
      <p>
        First part is choose raise token, this token will be the founding token
        people deposit into the project.
      </p>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step3-2.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
      <p>Second part is fill in project information and social media links</p>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step3-3.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
    </div>,
    <div key={4}>
      <h2 className="text-lg font-bold">Step 4: Submit the project</h2>
      <p>Click the Launch Token button to create the project</p>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step4.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
    </div>,
    <div key={5}>
      <h2 className="text-lg font-bold">Congratulations!</h2>
      <p>
        The project will be created after a few seconds, you will be redirected
        to the project detail page.
      </p>
      <div>
        <Image
          src="/images/tutorial/launch-pot2pump/step5.png"
          alt="Meme Token Info"
          width={500}
          height={500}
        />
      </div>
      <p>There are more tutorials on for pot2pump on the project detail page</p>
    </div>,
  ];
  return <TutorialStepContainer steps={steps} />;
}
