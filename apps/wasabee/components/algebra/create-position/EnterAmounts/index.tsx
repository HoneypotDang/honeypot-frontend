import { useNeedAllowance } from "@/lib/algebra/hooks/common/useNeedAllowance";
import { Currency, Field } from "@cryptoalgebra/sdk";
import { useEffect, useMemo } from "react";
import EnterAmountCard from "../EnterAmountsCard";
import { ALGEBRA_POSITION_MANAGER } from "@/config/algebra/addresses";
import {
  IDerivedMintInfo,
  useMintState,
  useMintActionHandlers,
} from "@/lib/algebra/state/mintStore";

interface EnterAmountsProps {
  currencyA: Currency | undefined;
  currencyB: Currency | undefined;
  mintInfo: IDerivedMintInfo;
}

const EnterAmounts = ({
  currencyA,
  currencyB,
  mintInfo,
}: EnterAmountsProps) => {
  const { independentField, typedValue } = useMintState();

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(
    mintInfo.noLiquidity
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [mintInfo.dependentField]:
      mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? "",
  };

  const currencyAError = useMemo(() => {
    if (
      (mintInfo.errorCode !== 4 && mintInfo.errorCode !== 5) ||
      !mintInfo.errorMessage ||
      !currencyA
    )
      return;

    const erroredToken = mintInfo.errorMessage.split(" ")[1];
    const erroredSymbol = currencyA.isNative
      ? currencyA.symbol
      : currencyA.wrapped.symbol;

    if (erroredSymbol === erroredToken) return mintInfo.errorMessage;

    return;
  }, [mintInfo, currencyA]);

  const currencyBError = useMemo(() => {
    if (
      (mintInfo.errorCode !== 5 && mintInfo.errorCode !== 4) ||
      !mintInfo.errorMessage ||
      !currencyB
    )
      return;

    const erroredToken = mintInfo.errorMessage.split(" ")[1];

    if (currencyB.wrapped.symbol === erroredToken) return mintInfo.errorMessage;

    return;
  }, [mintInfo, currencyB]);

  const allowanceA = useNeedAllowance(
    currencyA,
    mintInfo.parsedAmounts[Field.CURRENCY_B],
    ALGEBRA_POSITION_MANAGER
  );

  const allowanceB = useNeedAllowance(
    currencyB,
    mintInfo.parsedAmounts[Field.CURRENCY_B],
    ALGEBRA_POSITION_MANAGER
  );

  useEffect(() => {
    return () => {
      onFieldAInput("");
      onFieldBInput("");
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-col gap-2">
      <div className="flex w-full relative flex-col">
        <EnterAmountCard
          currency={currencyA}
          value={formattedAmounts[Field.CURRENCY_A]}
          valueForApprove={mintInfo.parsedAmounts[Field.CURRENCY_A]}
          handleChange={(value) => onFieldAInput(value)}
          needApprove={allowanceA}
          error={currencyAError}
        />
        {mintInfo.depositADisabled && (
          <div className="flex items-center justify-center w-full h-full bg-card-dark/70 rounded-3xl">
            For selected range this deposit is disabled
          </div>
        )}
      </div>
      <div className="flex w-full relative flex-col">
        <EnterAmountCard
          currency={currencyB}
          value={formattedAmounts[Field.CURRENCY_B]}
          needApprove={allowanceB}
          valueForApprove={mintInfo.parsedAmounts[Field.CURRENCY_B]}
          handleChange={(value) => onFieldBInput(value)}
          error={currencyBError}
        />
        {mintInfo.depositBDisabled && (
          <div className="flex items-center justify-center w-full h-full bg-card-dark/70 rounded-3xl">
            For selected range this deposit is disabled
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterAmounts;
