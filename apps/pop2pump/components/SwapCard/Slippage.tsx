import {
  Button,
  Popover,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { DropdownSvg } from "../svg/dropdown";
import { Observer, observer, useLocalObservable } from "mobx-react-lite";
import { HTMLAttributes } from "react";
import clsx from "clsx";
import { Input } from "../input/index";
import { ItemSelect, SelectItem, SelectState } from "../ItemSelect";
import { swap } from "@/services/swap";
import { ValueState } from "@/services/utils";

export const Slippage = observer(({ ...props }: {} & Partial<PopoverProps>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const state = useLocalObservable(() => ({
    selectState: new SelectState({
      onSelectChange(value) {
        if (typeof value === "number") {
          swap.setSlippage(value);
        }
        if (value === "custom") {
          swap.setSlippage(state.customSlippage.value);
        }
      },
      value: 0,
    }),
    customSlippage: new ValueState<number>({
      value: 1,
    }),
  }));
  // console.log('state.customSlippage.value', state.customSlippage.value)
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        isOpen ? onOpen() : onClose();
      }}
      placement="bottom"
      classNames={{
        base: [
          // arrow color
          "before:bg-default-200",
        ],
        content: [
          "py-3 px-4 border border-default-200",
          "bg-gradient-to-br from-white to-default-300",
          "dark:from-default-100 dark:to-default-50",
        ],
      }}
      {...props}
    >
      <PopoverTrigger>
        <Button className="inline-flex h-10 justify-between items-center shrink-0 [background:rgba(247,147,26,0.05)] px-[14.369px] py-[7.184px] rounded-[30px] border-solid border-[rgba(247,147,26,0.10)] text-[#202020]">
          {`Slippage  ${swap.slippage}%`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex max-w-full flex-col items-center gap-4 border border-[color:var(--card-stroke,#F7931A)] [background:var(--card-color,#271A0C)] rounded-xl border-solid">
        <Observer>
          {() => (
            <div className="w-full flex flex-col gap-[12px]">
              <div className="text-[#D9D7E0]  text-md font-bold leading-[normal]">
                Setting
              </div>
              <div className="flex items-center">
                <div className="text-[color:var(--Neutral-300,#D9D7E0)] text-xs font-normal leading-[normal]">
                  Slippage
                </div>
                <ItemSelect
                  selectState={state.selectState}
                  className=" ml-[24px]"
                >
                  <SelectItem value={0.5}>0.5%</SelectItem>
                  <SelectItem value={1}>1%</SelectItem>
                  <SelectItem value={"custom"}>
                    <Input
                      type="number"
                      max={100}
                      min={0}
                      value={String(state.customSlippage.value)}
                      classNames={{
                        input: "w-[50px]",
                      }}
                      placeholder="0.5%"
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(100, Number(e.target.value))
                        );
                        state.customSlippage.setValue(value);
                        swap.setSlippage(value);
                      }}
                      endContent="%"
                    ></Input>
                  </SelectItem>
                </ItemSelect>
              </div>
              <div className="flex items-center">
                <div className="text-[color:var(--Neutral-300,#D9D7E0)] text-xs font-normal leading-[normal]">
                  Transaction Deadline
                </div>
                <SelectItem className="ml-[12px] flex-1 w-[150px]">
                  <Input
                    type="number"
                    placeholder="30"
                    value={String(swap.deadline)}
                    onChange={(e) => {
                      swap.setDeadline(Number(e.target.value));
                    }}
                    endContent={"minutes"}
                  ></Input>
                </SelectItem>
              </div>
            </div>
          )}
        </Observer>
      </PopoverContent>
    </Popover>
  );
});
