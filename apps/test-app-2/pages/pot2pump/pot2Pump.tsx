import Link from "next/link";
import Image from "next/image";
import { observer } from "mobx-react-lite";
import { wallet } from "@/services/wallet";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { NextLayoutPage } from "@/types/nextjs";
import { memewarStore } from "@/services/memewar";
import { FaExternalLinkAlt } from "react-icons/fa";
import { Button } from "@/components/button/button-next";
import Pagination from "@/components/Pagination/Pagination";
import { LaunchCardV3 } from "@/components/LaunchCard/v3/pot2Pump";
import { Filter } from "@/components/pot2pump/FilterModal";
import { Pot2PumpTracker } from "@/components/MemeWarBanner/Pot2PumpTracker";
import { Pot2PumpPumpingService } from "@/services/launchpad/pot2pump/pot2Pump";
import { WrappedNextInputSearchBar } from "@/components/wrappedNextUI/SearchBar/WrappedInputSearchBar";
import { FilterState } from "@/constants/pot2pump.type";
import { defaultFilterState } from "@/constants/pot2pump";

const MemeLaunchPage: NextLayoutPage = observer(() => {
  const [pumpingProjects, setPumpingProjects] =
    useState<Pot2PumpPumpingService>();
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }

    // launchpad.setCurrentLaunchpadType("meme");
    // launchpad.showNotValidatedPairs = true;
    // launchpad.myLaunches.reloadPage();
    // launchpad.projectsPage.updateFilter({
    //   status: "success",
    // });

    memewarStore.reloadParticipants();

    const newPumpingProjects = new Pot2PumpPumpingService();
    setPumpingProjects(newPumpingProjects);
    newPumpingProjects.projectsPage.reloadPage();
  }, [wallet.isInit]);

  return (
    <div className="w-full grow flex flex-col font-gliker">
      <div className="px-4 md:px-6 w-full xl:max-w-[1200px] mx-auto flex flex-col sm:gap-y-4">
        <Pot2PumpTracker />

        <div>
          <div
            id="filter"
            className="flex flex-col sm:flex-row items-center gap-2 my-4 sm:my-0"
          >
            {/* <WrappedNextInputSearchBar
              value={filters}
              placeholder="Search by token name, symbol or address"
              className="border border-[#FFCD4D] shadow-[1px_2px_0px_0px_#9B7D2F] placeholder:text-xs"
              onChange={(e) => {
                const newFilters = {
                  ...filters,
                  search: e.target.value,
                };
                setFilters(newFilters);

                if (pumpingProjects) {
                  pumpingProjects.projectsPage.updateFilter({
                    search: newFilters.search,
                    tvlRange: {
                      min: newFilters.tvl.min
                        ? Number(newFilters.tvl.min)
                        : undefined,
                      max: newFilters.tvl.max
                        ? Number(newFilters.tvl.max)
                        : undefined,
                    },
                    participantsRange: {
                      min: newFilters.participants.min
                        ? Number(newFilters.participants.min)
                        : undefined,
                      max: newFilters.participants.max
                        ? Number(newFilters.participants.max)
                        : undefined,
                    },
                  });
                }
              }}
            /> */}
          </div>
        </div>

        <div className="w-full relative">
          <div className="py-2 sm:py-0 sm:absolute right-0 top-0 flex gap-2">
            {/* <Filter
              filters={filters}
              setFilters={setFilters}
              pumpingProjects={pumpingProjects}
            /> */}
            <Button className="w-full">
              <Link
                href="/launch-token?launchType=meme"
                className="text-black font-bold"
              >
                Launch Token
              </Link>
            </Button>
          </div>

          <Tabs
            // destroyInactiveTabPanel={false}
            aria-label="Options"
            classNames={{
              tabList: "bg-transparent",
              tab: "flex flex-col items-center gap-2.5 border-0  backdrop-blur-[100px] p-2.5 rounded-[10px]",
            }}
            className="next-tab"
            onSelectionChange={(key) => {
              if (key === "all") {
                pumpingProjects?.projectsPage.reloadPage();
              }
            }}
          >
            <Tab key="all" title="All MEMEs">
              {pumpingProjects && (
                <Pagination
                  paginationState={pumpingProjects.projectsPage}
                  render={(pair) => <LaunchCardV3 pair={pair} action={<></>} />}
                  classNames={{
                    itemsContainer:
                      "grid gap-8 grid-cols-1 md:grid-cols-2 xl:gap-6 xl:grid-cols-3",
                  }}
                />
              )}
            </Tab>
            <Tab key="my" title="My MEMEs" href="/profile" />
            <Tab
              key="participated-launch"
              title="Participated MEMEs"
              href="/profile"
            />
            {/* <Tab href="/launch" title="To Fto projects->" /> */}
            {/* <Tab
              href="https://bartio.bonds.yeetit.xyz/"
              target="_blank"
              title={
                <div className="flex items-center text-yellow-400">
                  <Image
                    className="size-4"
                    src="/images/partners/yeet_icon.png"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <span className="flex items-center justify-center gap-2">
                    Try Yeet Bond <FaExternalLinkAlt className="inline-block" />
                  </span>
                </div>
              }
            /> */}
            {/* <Tab
              title={
                <Link
                  href="/memewar"
                  className="flex items-center text-rose-600"
                >
                  <span className="flex items-center justify-center gap-2">
                    Meme War ⚔️
                  </span>
                </Link>
              }
            /> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
});

export default MemeLaunchPage;
