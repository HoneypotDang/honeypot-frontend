import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { observer } from "mobx-react-lite";
import { Pot2PumpPumpingService } from "@/services/launchpad/pot2pump/pumping";
import { Pot2PumpPumpingService as Pot2PumpService } from "@/services/launchpad/pot2pump/pot2Pump";
import { Button } from "@/components/button/button-next";
import { FaSlidersH } from "react-icons/fa";
import { FilterState } from "@/constants/pot2pump.type";
import FilterItem from "./components/FilterItem";
import { defaultFilterState } from "@/constants/pot2pump";
import { useState } from "react";

interface FilterProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  pumpingProjects?: Pot2PumpPumpingService | Pot2PumpService;
  filtersList: {
    key: number;
    label: string;
    category: category;
  }[];
}

type category =
  | "tvl"
  | "participants"
  | "liquidity"
  | "marketcap"
  | "daytxns"
  | "daybuys"
  | "daysells"
  | "dayvolume"
  | "daychange"
  | "depositraisedtoken";

export const Filter = observer(
  ({ filters, setFilters, pumpingProjects, filtersList }: FilterProps) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [filterState, setFilterState] = useState(filters);

    const onChange =
      (category: category) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /^\d*\.?\d*$/;
        if (regex.test(e.target.value)) {
          setFilterState((prev) => ({
            ...prev,
            [category]: {
              ...prev[category],
              [e.target.name]: e.target.value,
            },
          }));
        }
      };

    return (
      <>
        <Button
          className="!px-4"
          onClick={onOpen}
        >
          <FaSlidersH className="!text-black size-4" />
          {/* FIXME: display text */}
          {/* <span className="!text-black">Filters</span> */}
        </Button>

        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          hideCloseButton={true}
          classNames={{
            base: "bg-transparent",
            wrapper: "bg-transparent",
            closeButton:
              "absolute right-4 top-6 z-50 text-white w-8 h-8 flex items-center justify-center",
          }}
        >
          <ModalContent className="bg-[#FFCD4D] relative overflow-hidden">
            {(onClose) => (
              <>
                <div className="bg-[url('/images/pumping/outline-border.png')] h-[50px] absolute top-0 left-0 w-full bg-contain bg-[left_-90px_top] bg-repeat-x"></div>

                <ModalHeader className="pt-14 bg-[#FFCD4D] flex justify-between items-center">
                  <h3 className="text-xl font-bold text-black">
                    Customize Filters
                  </h3>
                  <div
                    className="!font-normal text-black cursor-pointer p-1"
                    onClick={() => {
                      setFilterState(defaultFilterState);
                      onOpenChange();
                    }}
                  >
                    x
                  </div>
                </ModalHeader>

                <ModalBody className="px-6 bg-[#FFCD4D]">
                  <div className="w-full rounded-[32px] bg-white space-y-4 px-4 py-6 custom-dashed h-[60vh] overflow-auto">
                    {filtersList.map((filter) => (
                      <FilterItem
                        key={filter.key}
                        label={filter.label}
                        onChange={onChange(filter.category)}
                        min={filterState[filter.category].min}
                        max={filterState[filter.category].max}
                      />
                    ))}
                  </div>
                </ModalBody>

                <ModalFooter className="pb-10 bg-[#FFCD4D]">
                  <Button
                    className="w-full"
                    onPress={() => {
                      setFilters(filterState);
                      onClose();
                    }}
                  >
                    Apply
                  </Button>
                </ModalFooter>

                <div className="bg-[url('/images/card-container/honey/bottom-border.svg')] bg-left-top h-6 absolute -bottom-1 left-0 w-full bg-contain"></div>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
);
