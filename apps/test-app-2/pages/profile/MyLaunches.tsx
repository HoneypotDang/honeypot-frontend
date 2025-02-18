import { LaunchCardV3 } from "@/components/LaunchCard/v3";
import launchpad from "@/services/launchpad";
import { Pot2PumpService } from "@/services/launchpad/pot2pump";
import { wallet } from "@/services/wallet";
import { Button as NextButton } from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination/Pagination";

export const MyLaunches = observer(() => {
  const [myProjects, setMyProjects] = useState<Pot2PumpService>();

  useEffect(() => {
    if (!wallet.isInit) {
      return;
    }
    const newPumpingProjects = new Pot2PumpService();
    setMyProjects(newPumpingProjects);
    newPumpingProjects.myLaunches.reloadPage();
  }, [wallet.isInit]);

  return (
    <div className="custom-dashed-3xl w-full p-6 bg-white space-y-8">
      <h4 className="flex justify-center text-4xl">MEME</h4>
      {myProjects && (
        <Pagination
          paginationState={myProjects.myLaunches}
          render={(project) => (
            <LaunchCardV3
              key={project.address}
              pair={project}
              action={<></>}
              theme="dark"
              className="w-full h-full"
            />
          )}
          classNames={{
            base: "",
            itemsContainer:
              "grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gap-6",
            item: "",
          }}
        />
      )}
    </div>
  );
});

export default MyLaunches;
