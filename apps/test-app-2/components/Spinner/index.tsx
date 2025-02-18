import { Spinner } from "@nextui-org/react";
import clsx from "clsx";
import { HTMLAttributes } from "react";

export const SpinnerContainer = ({
  children,
  isLoading,
  className,
  ...props
}: {
  children: React.ReactNode;
  isLoading: boolean;
} & HTMLAttributes<any>) => {
  return (
    <div className={clsx(' relative', className)} {...props}>
      {isLoading ? (
        <Spinner className=" absolute  left-0  m-auto right-0 top-0 bottom-0"></Spinner>
      ) : (
        <></>
      )}
      {children}
    </div>
  );
};
