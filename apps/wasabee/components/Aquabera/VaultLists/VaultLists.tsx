import { Tab, Tabs } from "@nextui-org/react";
import MyAquaberaVaults from "./MyVaults";
import AllAquaberaVaults from "./AllVaults";
import { Search } from "lucide-react";
import { useState } from "react";

export function AquaberaList() {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="w-[200px]">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key.toString())}
            classNames={{
              base: "w-full",
              tabList:
                "flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[2px_2px_0px_0px_#000] py-2 px-3.5 z-10",
              cursor:
                "bg-[#FFCD4D] border border-black shadow-[2px_2px_0px_0px_#000000] text-sm",
              panel: "w-full",
              tabContent: "!text-[#202020]",
            }}
          >
            <Tab key="all" title="Vaults" />
            <Tab key="my" title="My Vaults" />
          </Tabs>
        </div>
        <div className="relative">
          <input
            placeholder="Search"
            value={search}
            type="text"
            onChange={(event) => handleSearch(event.target.value)}
            className="border border-[#2D2D2D] bg-white text-black pl-10 pr-4 py-2 h-12 w-[319px] rounded-2xl shadow-[2px_2px_0px_0px_#000] placeholder:text-[#4D4D4D]/70 focus:outline-none"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4D4D4D]"
            size={20}
          />
        </div>
      </div>
      <div className="custom-dashed-3xl w-full p-6 bg-white">
        {selectedTab === "all" ? (
          <AllAquaberaVaults searchString={search} />
        ) : (
          <MyAquaberaVaults searchString={search} />
        )}
      </div>
    </div>
  );
}

export default AquaberaList;
