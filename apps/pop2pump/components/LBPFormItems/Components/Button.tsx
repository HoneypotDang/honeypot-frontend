import { Button, ButtonProps } from "@nextui-org/react";
const LBPButton = (props: ButtonProps) => {
  return (
    <Button
      style={{
        background:
          "linear-gradient(180deg, rgba(232, 211, 124, 0.13) 33.67%, #FCD729 132.5%), #F7931A",
      }}
      className="outline-2 outline-[#F7931A33] text-black font-bold hover:opacity-80 disabled:opacity-40"
      {...props}
    />
  );
};

export default LBPButton;
