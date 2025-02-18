import { cn } from "@/lib/utils";
import { FtoPairContract } from "@/services/contract/launches/fto/ftopair-contract";
import { MemePairContract } from "@/services/contract/launches/pot2pump/memepair-contract";
import { DiscussionArea } from "@/components/Discussion/DiscussionArea/DiscussionArea";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/button";
import BeraVoteForm from "@/components/beravote/components/NewSpace/Steps/BeraVoteForm";
import { observer } from "mobx-react-lite";
import {
  Modal,
  Tab,
  Tabs as NextUITabs,
  useDisclosure,
} from "@nextui-org/react";
import { UpdateProjectModal } from "../[pair]";
import TransactionHistory from "./TransactionHistory";
import TopHoldersTable from "./TopHoldersTable";

const universalMenuItems = [
  { key: "txs", label: "Transactions" },
  { key: "comment", label: "Comments" },
  //{ key: "priceChart", label: "Price Chart" },
];

const successMenuItems = [
  { key: "votingspace", label: "Voting Space" },
  { key: "holders", label: "Top 10 Holders" },
];

interface Transaction {
  rank: string;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

interface Holder {
  rank: string;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

const Tabs = observer(
  ({
    pair,
    refreshTrigger,
  }: {
    pair: FtoPairContract | MemePairContract | null;
    refreshTrigger?: number;
  }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const options =
      pair?.state === 0
        ? [...universalMenuItems, ...successMenuItems]
        : universalMenuItems;

    return (
      <div className="relative">
        {pair && (
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
              base: "max-h-[70vh] overflow-y-scroll",
            }}
          >
            <UpdateProjectModal pair={pair}></UpdateProjectModal>
          </Modal>
        )}

        <NextUITabs
          aria-label="Project Details"
          classNames={{
            base: "relative w-full",
            tabList:
              "flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] py-2 px-3.5 absolute left-1/2 -translate-x-1/2 z-10 -top-5",
            panel: cn(
              "flex flex-col h-full w-full gap-y-4 justify-center items-center bg-[#FFCD4D] rounded-2xl text-[#202020]",
              "px-8 pt-[70px] pb-[70px]",
              "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
              "bg-[position:-65px_top,_-85px_bottom]",
              "bg-[size:auto_65px,_auto_65px]",
              "bg-repeat-x",
              "!mt-0"
            ),
          }}
        >
          <Tab key="comment" title="Comments">
            <div className="w-full">
              {pair && (
                <DiscussionArea
                  pairDatabaseId={pair.databaseId ?? -1}
                  classNames={{ container: "border-none" }}
                />
              )}
            </div>
          </Tab>
          <Tab key="txs" title="Transactions">
            <TransactionHistory
              pairAddress={pair?.address ?? ""}
              pair={pair as MemePairContract}
              refreshTrigger={refreshTrigger}
            />
          </Tab>

          {pair?.state === 0 && (
            <>
              <Tab key="holders" title="Top 10 Holders">
                <div className="w-full">
                  <h1 className="text-[var(--Heading,#0D0D0D)] text-center text-shadow-[2px_4px_0px_#AF7F3D] webkit-text-stroke-[2px] text-stroke-white font-gliker text-[40px] md:text-[64px] font-normal leading-[110%] tracking-[1.28px] mb-6 md:mb-12">
                    Top 10 Holders
                  </h1>
                  <TopHoldersTable
                    projectPool={pair as MemePairContract}
                    launchedToken={pair?.launchedToken}
                    depositedLaunchedTokenWithoutDecimals={
                      pair?.depositedLaunchedTokenWithoutDecimals || 0
                    }
                  />
                </div>
              </Tab>
              <Tab key="votingspace" title="Voting Space">
                <div className="flex flex-col justify-center items-center gap-2 w-full">
                  {pair &&
                    (pair.beravoteSpaceId ? (
                      <>
                        <iframe
                          className="w-full aspect-video"
                          src={`https://beravote.com/space/${pair.beravoteSpaceId}`}
                        >
                          {" "}
                        </iframe>
                        <Link
                          href={`https://beravote.com/space/${pair.beravoteSpaceId}`}
                        >
                          <Button className="w-full">View On Beravote</Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Image
                          src={"/images/partners/beravote.avif"}
                          width={500}
                          height={500}
                          alt="beravote logo"
                          className="w-full"
                        />
                        {pair.isProvider ? (
                          <BeraVoteForm pair={pair} />
                        ) : (
                          <h3>this project does not have voting space</h3>
                        )}
                      </>
                    ))}
                </div>
              </Tab>
            </>
          )}
        </NextUITabs>
      </div>
    );
  }
);

export default Tabs;
