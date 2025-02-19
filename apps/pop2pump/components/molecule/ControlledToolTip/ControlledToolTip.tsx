import { Tooltip } from "@nextui-org/react";
import { useState } from "react";

export function ControlledToolTip({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  const [isTooltipOpen, setTooltipOpen] = useState(false);

  return (
    <Tooltip isOpen={isTooltipOpen} content={content}>
      <div
        onMouseEnter={() => {
          setTooltipOpen(true);
        }}
        onMouseLeave={() => {
          setTooltipOpen(false);
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
}
