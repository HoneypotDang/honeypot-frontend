import AmountsSection from "@/components/algebra/create-position/AmountsSection";
import { Button } from "@/components/algebra/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/algebra/ui/dialog";
import { IDerivedMintInfo } from "@/lib/algebra/state/mintStore";
import { ManageLiquidity } from "@/types/algebra/types/manage-liquidity";
import { Currency } from "@cryptoalgebra/sdk";
import { useState } from "react";

interface IncreaseLiquidityModalProps {
  tokenId: number;
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
}

export function IncreaseLiquidityModal({
  tokenId,
  currencyA,
  currencyB,
  mintInfo,
}: IncreaseLiquidityModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={false}
          className="whitespace-nowrap w-full text-black rounded-md border-6 border-[rgba(225,138,32,0.40)] bg-gradient-to-b from-[rgba(232,211,124,0.13)] to-[#FCD729] bg-[#F7931A]"
        >
          Add liquidity
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[500px] rounded-3xl bg-[#322111] border-none"
        style={{ borderRadius: "32px" }}
      >
        <DialogHeader>
          <DialogTitle className="font-bold select-none mt-2 max-md:mx-auto">
            Enter Amounts
          </DialogTitle>
        </DialogHeader>
        <AmountsSection
          handleCloseModal={handleCloseModal}
          tokenId={tokenId}
          currencyA={currencyA}
          currencyB={currencyB}
          mintInfo={mintInfo}
          manageLiquidity={ManageLiquidity.INCREASE}
        />
      </DialogContent>
    </Dialog>
  );
}
