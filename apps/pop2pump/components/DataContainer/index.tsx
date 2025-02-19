import clsx from "clsx";
import { HTMLAttributes } from "react";
import HoneyStickSvg from "../svg/HoneyStick";
import { LoadingDisplay } from "../LoadingDisplay/LoadingDisplay";

export type DataContainerProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  hasData?: boolean;
  isInit?: boolean;
} & HTMLAttributes<any>;

export const DataContainer = ({
  children,
  isLoading = false,
  className,
  hasData = true,
  isInit = true,
  ...props
}: DataContainerProps) => {
  const noData = !hasData && isInit;
  return (
    <div className={clsx(" relative", className)} {...props}>
      {noData ? (
        <div className="flex flex-col justify-center items-center min-h-[200px]  pt-5">
          <HoneyStickSvg />
          <p className="text-[#FAFAFC] text-5xl pt-5">No Data</p>
        </div>
      ) : (
        children
      )}
      {isLoading && (
        // <Spinner className=" absolute  left-0  m-auto right-0 top-0 bottom-0"></Spinner>
        <LoadingDisplay />
      )}
    </div>
  );
};
