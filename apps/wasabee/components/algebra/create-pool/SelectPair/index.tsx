import TokenCard from "@/components/algebra/swap/TokenCard";
import {
  IDerivedMintInfo,
  useMintActionHandlers,
  useMintState,
} from "@/lib/algebra/state/mintStore";
import { useSwapActionHandlers } from "@/lib/algebra/state/swapStore";
import { SwapField } from "@/types/algebra/types/swap-field";

import { Currency } from "@cryptoalgebra/sdk";
import { ChevronsUpDownIcon } from "lucide-react";
import { useCallback } from "react";
import TokenCardV3 from "../../swap/TokenCard/TokenCardV3";

interface ISelectPair {
  mintInfo: IDerivedMintInfo;
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
}

const SelectPair = ({ mintInfo, currencyA, currencyB }: ISelectPair) => {
  const { onCurrencySelection, onSwitchTokens } = useSwapActionHandlers();

  const { onStartPriceInput } = useMintActionHandlers(mintInfo.noLiquidity);

  const { startPriceTypedValue } = useMintState();

  const handleInputSelect = useCallback(
    (inputCurrency: Currency) => {
      onCurrencySelection(SwapField.INPUT, inputCurrency);
    },
    [onCurrencySelection]
  );

  const handleOutputSelect = useCallback(
    (outputCurrency: Currency) => {
      onCurrencySelection(SwapField.OUTPUT, outputCurrency);
    },
    [onCurrencySelection]
  );

  const handleTypeInput = useCallback(
    (value: string) => {
      onStartPriceInput(value);
    },
    [onStartPriceInput]
  );

  return (
    <div className="relative flex  gap-2 items-center">
      <TokenCardV3
        disabled
        showBalance={false}
        value={"1"}
        currency={currencyA}
        otherCurrency={currencyB}
        handleTokenSelection={handleInputSelect}
        showInput={false}
      />

      {/* 
      <button
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-card-dark w-fit rounded-full border-[5px] border-[#1a1d2b] hover:bg-card-hover duration-200"
        onClick={onSwitchTokens}
      >
        <ChevronsUpDownIcon size={16} />
      </button> */}

      <TokenCardV3
        showBalance={false}
        value={startPriceTypedValue}
        handleTokenSelection={handleOutputSelect}
        currency={currencyB}
        otherCurrency={currencyA}
        handleValueChange={handleTypeInput}
        showInput={false}
      />
    </div>
  );
};

export default SelectPair;
