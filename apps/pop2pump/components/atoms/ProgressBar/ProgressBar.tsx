import { Progress, ProgressProps } from "@nextui-org/react";

interface Props extends ProgressProps {
  trackColor?: string;
  indicatorColor?: string;
}

export function ProgressBar({
  trackColor = "bg-white",
  indicatorColor = "bg-[#FFCD4D]",
  ...props
}: Props) {
  return (
    <Progress
      classNames={{
        base: "relative",
        track: `${trackColor} h-4`,
        indicator: `${indicatorColor} h-4`,
        label:
          "absolute top-0 left-0 w-full h-full flex items-end justify-center text-white text-xs text-center z-10",
      }}
      {...props}
    />
  );
}

export default ProgressBar;
