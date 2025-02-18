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
import { LaunchCardV3 } from "@/components/LaunchCard/v3";
import { Filter } from "@/components/pot2pump/FilterModal";
import { Pot2PumpTracker } from "@/components/MemeWarBanner/Pot2PumpTracker";
import { Pot2PumpPumpingService } from "@/services/launchpad/pot2pump/pumping";
import { WrappedNextInputSearchBar } from "@/components/wrappedNextUI/SearchBar/WrappedInputSearchBar";
import { FilterState } from "@/constants/pot2pump.type";
import { defaultFilterState } from "@/constants/pot2pump";
import HoneyContainer from "@/components/CardContianer/HoneyContainer";
import { hasValue, removeEmptyFields } from "@/lib/utils";
import { PAGE_LIMIT } from "@/services/launchpad";
import search from "./api/udf-data-feed/search";

const MemeLaunchPage: NextLayoutPage = observer(() => {
  const [pumpingProjects, setPumpingProjects] =
    useState<Pot2PumpPumpingService>();
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  const [search, setSearch] = useState("");

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

    // memewarStore.reloadParticipants();

    const newPumpingProjects = new Pot2PumpPumpingService();
    setPumpingProjects(newPumpingProjects);
    newPumpingProjects.projectsPage.reloadPage();
  }, [wallet.isInit]);

  const onChangeFilter = (data: any) => {
    setFilters(data);
  };

  useEffect(() => {
    if (pumpingProjects) {
      console.log("hasValue(filters)", hasValue(filters), filters);
      if (hasValue(filters)) {
        pumpingProjects.projectsPage.updateFilter({
          search: search.length > 0 ? search : undefined,
          currentPage: 0,
          status: "success",
          limit: PAGE_LIMIT,
          hasNextPage: true,
          orderBy: "endTime",
          orderDirection: "desc",
          ...filters,
        });
      } else {
        pumpingProjects.projectsPage.updateFilter({
          search: search.length > 0 ? search : undefined,
          currentPage: 0,
          status: "success",
          limit: PAGE_LIMIT,
          hasNextPage: true,
          orderBy: "endTime",
          orderDirection: "desc",
          ...defaultFilterState,
        });
      }
    }
  }, [filters, pumpingProjects, search]);

  return (
    <div className="w-full grow flex flex-col font-gliker">
      <div className="px-4 md:px-6 w-full xl:max-w-[1200px] mx-auto flex flex-col sm:gap-y-4">
        <HoneyContainer>
          <Pot2PumpTracker />
        </HoneyContainer>

        <div>
          <div
            id="filter"
            className="flex flex-col sm:flex-row items-center gap-2 my-4 sm:my-0"
          >
            <WrappedNextInputSearchBar
              value={search}
              placeholder="Search by token name, symbol or address"
              className="border border-[#FFCD4D] shadow-[1px_2px_0px_0px_#9B7D2F] placeholder:text-xs"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full relative">
          <div className="py-2 sm:py-0 sm:absolute right-0 top-0 flex gap-2">
            <Filter
              filtersList={[
                {
                  key: 0,
                  label: "TVL (USD)",
                  category: "tvl",
                },
                {
                  key: 1,
                  label: "Liquidity",
                  category: "liquidity",
                },
                {
                  key: 3,
                  label: "Market cap",
                  category: "marketcap",
                },
                {
                  key: 4,
                  label: "24H txns",
                  category: "daytxns",
                },
                {
                  key: 5,
                  label: "24H buys",
                  category: "daybuys",
                },
                {
                  key: 6,
                  label: "24H sells",
                  category: "daysells",
                },
                {
                  key: 7,
                  label: "24H volume",
                  category: "dayvolume",
                },
                {
                  key: 8,
                  label: "24H change (%)",
                  category: "daychange",
                },
              ]}
              filters={filters}
              setFilters={onChangeFilter}
              pumpingProjects={pumpingProjects}
            />
            <Link
              href="/launch-token?launchType=meme"
              className="text-black font-bold"
            >
              <Button className="w-full">Launch Token</Button>
            </Link>
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
                  render={(pair) => (
                    <LaunchCardV3
                      pair={pair}
                      action={<></>}
                      key={pair.address}
                      type="simple"
                    />
                  )}
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
