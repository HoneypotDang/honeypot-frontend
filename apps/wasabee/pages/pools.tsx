import { cn } from "@/lib/utils";
import { observer } from "mobx-react-lite";
import { wallet } from "@/services/wallet";
import { Tab, Tabs } from "@nextui-org/react";
import { NextLayoutPage } from "@/types/nextjs";
import { liquidity } from "@/services/liquidity";
import { useCallback, useEffect, useState } from "react";
import PoolsList from "@/components/algebra/pools/PoolsList";
import AquaberaList from "@/components/Aquabera/VaultLists/VaultLists";

const PoolsPage: NextLayoutPage = observer(() => {
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<"all" | "my">("all");

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }
    liquidity.initPool();
  }, [wallet.isInit]);

  useEffect(() => {
    if (wallet.isInit && liquidity.isInit) {
      setLoading(false);
      liquidity.pairPage.reloadPage();
      liquidity.myPairPage.reloadPage();
    }
  }, [wallet.isInit, liquidity.isInit]);

  const searchStringChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentTab === "all") {
        liquidity.pairPage.updateFilter({
          searchString: e.target.value,
        });
      } else {
        liquidity.myPairPage.updateFilter({
          searchString: e.target.value,
        });
      }
    },
    [currentTab]
  );

  const clearSearchString = useCallback(() => {
    if (currentTab === "all") {
      liquidity.pairPage.updateFilter({
        searchString: "",
      });
    } else {
      liquidity.myPairPage.updateFilter({
        searchString: "",
      });
    }
  }, [currentTab]);

  const tabChangeHandler = (key: string) => {
    if (key === "all") {
      setCurrentTab("all");
      clearSearchString();
    } else {
      setCurrentTab("my");
      clearSearchString();
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 xl:px-0 font-gliker w-full">
      {/* TODO: Add pool bg img */}
      <Tabs
        classNames={{
          tab: "h-12",
          base: "relative w-full",
          cursor: "bg-[#202020] !text-white/80 px-2 py-3",
          tabList:
            "flex rounded-[16px] border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] p-3 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10",
          // TODO: Update top border img
          panel: cn(
            "flex flex-col h-full w-full gap-y-4 items-center bg-[#FFCD4D] rounded-2xl text-[#202020]",
            "px-8 pt-[70px] pb-[70px]",
            "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
            "bg-[position:-65px_top,_-85px_bottom]",
            "bg-[size:auto_65px,_auto_65px]",
            "bg-repeat-x",
            "!mt-0",
            "h-auto",
          ),
          tabContent: "text-[#202020]",
        }}
      >
        <Tab key="algebra" title="Concentrated Liquidity">
          <PoolsList />
        </Tab>
        <Tab key="aquabera" title="POGE Vault">
          <AquaberaList />
        </Tab>
      </Tabs>
    </div>
  );
});

export default PoolsPage;
