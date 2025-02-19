import { Switch } from "@/components/algebra/ui/switch";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/algebra/ui/popover";
import React, { useState } from "react";
import { Button } from "@/components/algebra/ui/button";
import { cn } from "@/lib/tailwindcss";
import { usePositionFilterStore } from "@/lib/algebra/state/positionFilterStore";
import { PositionsStatus } from "@/types/algebra/types/position-filter-status";

const FilterPopover = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    filterStatus,
    actions: { setFilterStatus },
  } = usePositionFilterStore();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          size={"md"}
          className={cn(
            "bg-transparent border border-card-border/60",
            isOpen && "bg-card"
          )}
          aria-label="Update dimensions"
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={5}>
        <div className="flex flex-col gap-2">
          <label className="flex justify-between items-center">
            Open
            <Switch
              id="Open"
              checked={Boolean(filterStatus[PositionsStatus.OPEN])}
              onCheckedChange={() => setFilterStatus(PositionsStatus.OPEN)}
            />
          </label>
          <label className="flex justify-between items-center">
            On Farming
            <Switch
              id="On Farming"
              checked={Boolean(filterStatus[PositionsStatus.ON_FARMING])}
              onCheckedChange={() =>
                setFilterStatus(PositionsStatus.ON_FARMING)
              }
            />
          </label>
          <label className="flex justify-between items-center">
            Closed
            <Switch
              id="Closed"
              checked={Boolean(filterStatus[PositionsStatus.CLOSED])}
              onCheckedChange={() => setFilterStatus(PositionsStatus.CLOSED)}
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;
