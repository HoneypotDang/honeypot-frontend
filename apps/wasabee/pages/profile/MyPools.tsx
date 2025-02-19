import PoolsList from "@/components/algebra/pools/PoolsList";
import MyAquaberaVaults from "@/components/Aquabera/VaultLists/MyVaults";
import { Tab, Tabs } from "@nextui-org/react";
import { observer } from "mobx-react-lite";

export const MyPools = observer(() => {
  return (
    <div className="w-full relative custom-dashed-3xl bg-white p-6">
      <div className="text-4xl absolute top-8 left-6">My Pools</div>
      <Tabs
        classNames={{
          base: "relative w-full",
          tabList:
            "flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] py-2 px-3.5 mb-6 ml-auto z-10",
          cursor: "bg-[#FFCD4D] border border-black shadow-[2px_2px_0px_0px_#000000] text-sm",
          panel: "w-full",
          tabContent: "!text-[#202020]",
        }}
      >
        <Tab key="algebra" title="Pool">
          <PoolsList defaultFilter="myPools" showOptions={false} />
        </Tab>
        <Tab key="vault" title="Vault">
          <MyAquaberaVaults />
        </Tab>
      </Tabs>
    </div>
  );
});

export default MyPools;
