// pages/vault/[address].tsx
import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { ICHIVaultContract } from "@/services/contract/aquabera/ICHIVault-contract";
import { Address, isAddress, zeroAddress } from "viem";
import { Button } from "@/components/algebra/ui/button";
import TokenLogo from "@/components/TokenLogo/TokenLogo";
import { DepositToVaultModal } from "@/components/Aquabera/modals/DepositToVaultModal";
import { wallet } from "@/services/wallet";
import { Token as AlgebraToken } from "@cryptoalgebra/sdk";
import { WithdrawFromVaultModal } from "@/components/Aquabera/modals/WithdrawFromVaultModal";
import { getSingleVaultDetails } from "@/lib/algebra/graphql/clients/vaults";
import { SingleVaultDetailsQuery } from "@/lib/algebra/graphql/generated/graphql";
import BigNumber from "bignumber.js";
import { DynamicFormatAmount } from "@/lib/algebra/utils/common/formatAmount";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import CardContainer from "@/components/CardContianer/v3";
import Copy from "@/components/Copy/v3";

export const VaultDetail = observer(() => {
  const router = useRouter();
  const { address } = router.query;
  const [vault, setVault] = useState<ICHIVaultContract | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [tvl, setTvl] = useState<string>("$0");
  const [volume24h, setVolume24h] = useState<string>("$0");
  const [fees24h, setFees24h] = useState<string>("$0");

  useEffect(() => {
    if (
      !wallet.isInit ||
      !wallet.account ||
      !address ||
      !isAddress(address as string) ||
      address === zeroAddress ||
      vault
    )
      return;

    console.log("address", address);

    // Fetch token addresses and pool data
    const loadVaultData = async () => {
      const vaultContract = await getSingleVaultDetails(address as string);

      if (vaultContract) {
        Promise.all([
          vaultContract?.getTotalAmounts(),
          vaultContract?.getTotalSupply(),
          vaultContract?.getBalanceOf(wallet.account),
        ]);

        setTvl(
          Number(vaultContract?.pool?.TVL_USD || 0).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })
        );
        if (vaultContract.pool) {
          setVolume24h(
            Number(vaultContract.pool.volume_24h_USD || 0).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )
          );

          setFees24h(
            Number(vaultContract.pool.fees_24h_USD || 0).toLocaleString(
              "en-US",
              {
                style: "currency",
                currency: "USD",
              }
            )
          );
        }
      }

      setVault(vaultContract);
    };

    loadVaultData();
  }, [address, wallet.isInit]);

  const hasShares = vault?.userShares ?? BigInt(0) > BigInt(0);

  // Add a function to refresh vault data
  const refreshVaultData = useCallback(async () => {
    if (!vault || !wallet.account) return;

    // Refresh subgraph data
    const vaultDetails = await getSingleVaultDetails(vault.address);
    setVault(vaultDetails);
    // Get total supply
    vaultDetails?.getTotalSupply();

    // Get user shares
    vaultDetails?.getBalanceOf(wallet.account);

    vaultDetails?.getTotalAmounts();
  }, [vault, wallet.isInit]);

  // Format number with 18 decimals
  const formatShares = (value: bigint) => {
    const divisor = BigInt(10 ** 18); // Always use 18 decimals for shares
    const integerPart = value / divisor;
    const fractionalPart = value % divisor;

    // Convert to string and pad with zeros if needed
    const fractionalStr = fractionalPart.toString().padStart(18, "0");

    // Show up to 6 decimal places for better readability
    const displayDecimals = 18;
    const formattedFractional = fractionalStr.slice(0, displayDecimals);

    // Remove trailing zeros
    const trimmedFractional = formattedFractional.replace(/0+$/, "");

    return trimmedFractional
      ? `${integerPart}.${trimmedFractional}`
      : integerPart.toString();
  };

  return (
    <div className="container mx-auto p-4 font-gliker">
      {/* Add Back Button */}
      <div className="mb-4">
        <Button
          onClick={() => router.push("/pools")}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Vaults
        </Button>
      </div>

      <CardContainer className="px-8 justify-start">
        {/* Header Section */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {vault?.token0 && vault?.token1 && (
                <>
                  <div className="flex -space-x-2">
                    <TokenLogo token={vault?.token0} size={48} />
                    <TokenLogo token={vault?.token1} size={48} />
                  </div>
                  <span className="text-2xl font-bold text-honey">
                    {vault?.token0?.symbol}/{vault?.token1?.symbol}
                  </span>
                </>
              )}
            </div>
            <div className="inline-flex rounded-[16px] border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] gap-x-3 p-2">
              <Link
                href={`/swap?inputCurrency=${vault?.token0?.address}&outputCurrency=${vault?.token1?.address}`}
              >
                <Button className="rounded-[8px] border border-black bg-[#FFCD4D] p-2 text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none">
                  Swap
                </Button>
              </Link>
              <Button
                onClick={() => setIsDepositModalOpen(true)}
                disabled={!wallet.account}
                className="ml-[-1px] rounded-[8px] border border-black bg-[#FFCD4D] p-2 text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deposit
              </Button>
              {hasShares && (
                <Button
                  onClick={() => setIsWithdrawModalOpen(true)}
                  disabled={!wallet.account}
                  className="ml-[-1px] rounded-[8px] border border-black bg-[#FFCD4D] p-2 text-[#202020] shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_1px_0px_0px_#000] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">Total Supply</h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-[#202020]">
                  {DynamicFormatAmount({
                    amount: BigNumber(
                      vault?.totalAmountsWithoutDecimal.total0.toString() ?? 0
                    )
                      .div(10 ** (vault?.token0?.decimals ?? 18))
                      .toString(),
                    decimals: 3,
                    endWith: vault?.token0?.symbol,
                  })}
                </p>
                <p className="text-2xl font-bold text-[#202020]">
                  {DynamicFormatAmount({
                    amount: BigNumber(
                      vault?.totalAmountsWithoutDecimal.total1.toString() ?? 0
                    )
                      .div(10 ** (vault?.token1?.decimals ?? 18))
                      .toString(),
                    decimals: 3,
                    endWith: vault?.token1?.symbol,
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">Your Asset</h3>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-[#202020]">
                  {DynamicFormatAmount({
                    amount: BigNumber(
                      vault?.userTokenAmounts.total0.toString() ?? 0
                    ).toString(),
                    decimals: 3,
                    endWith: vault?.token0?.symbol,
                  })}
                </p>
                <p className="text-2xl font-bold text-[#202020]">
                  {DynamicFormatAmount({
                    amount: BigNumber(
                      vault?.userTokenAmounts.total1.toString() ?? 0
                    ).toString(),
                    decimals: 3,
                    endWith: vault?.token1?.symbol,
                  })}
                </p>
              </div>
            </div>
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">
                Share Percentage
              </h3>
              <p className="text-2xl font-bold text-[#202020]">
                {vault?.totalsupplyShares &&
                vault?.totalsupplyShares > BigInt(0)
                  ? (
                      (Number(vault?.userShares) /
                        Number(vault?.totalsupplyShares)) *
                      100
                    ).toFixed(2)
                  : "0"}
                %
              </p>
            </div>
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">
                Total Value Locked
              </h3>
              <p className="text-2xl font-bold text-[#202020]">{tvl}</p>
            </div>
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">24h Volume</h3>
              <p className="text-2xl font-bold text-[#202020]">{volume24h}</p>
            </div>
            <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-2">24h Fees</h3>
              <p className="text-2xl font-bold text-[#202020]">{fees24h}</p>
            </div>
          </div>

          {/* Vault Info */}
          <div className="rounded-[24px] border border-black bg-white px-10 py-6 shadow-[4px_4px_0px_0px_#D29A0D]">
            <h3 className="text-white text-[26px] leading-[110%] text-shadow-[1.57px_3.14px_0px_#AF7F3D] text-stroke-1.5 text-stroke-black tracking-[1.04px] font-gliker mb-4">
              Vault Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-[#202020] mb-2">Vault Address</p>
                <div className="flex items-center justify-between rounded-[16px] border-2 border-[#5A4A4A] bg-white px-4 py-2 shadow-[2px_2px_0px_0px_#202020,2px_4px_0px_0px_#202020]">
                  <p className="font-mono text-[#202020] break-all">
                    {address}
                  </p>
                  <Copy value={address as string} />
                </div>
              </div>
              <div>
                <p className="text-sm text-[#202020] mb-2">Token Addresses</p>
                <div className="flex items-center justify-between rounded-[16px] border-2 border-[#5A4A4A] bg-white px-4 py-2 shadow-[2px_2px_0px_0px_#202020,2px_4px_0px_0px_#202020] mb-2">
                  <p className="font-mono text-[#202020] break-all">
                    {vault?.token0?.address}
                  </p>
                  <Copy value={vault?.token0?.address as string} />
                </div>
                <div className="flex items-center justify-between rounded-[16px] border-2 border-[#5A4A4A] bg-white px-4 py-2 shadow-[2px_2px_0px_0px_#202020,2px_4px_0px_0px_#202020]">
                  <p className="font-mono text-[#202020] break-all">
                    {vault?.token1?.address}
                  </p>
                  <Copy value={vault?.token1?.address as string} />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {vault && (
            <div className="rounded-[24px] border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#D29A0D]">
              <h3 className="text-base text-[#202020] mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {vault.recentTransactions.slice(0, 10).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2 min-w-[100px]">
                      {tx.__typename === "VaultDeposit" && (
                        <span className="text-[#202020] font-medium">
                          Deposit
                        </span>
                      )}
                      {tx.__typename === "VaultWithdraw" && (
                        <span className="text-[#202020] font-medium">
                          Withdraw
                        </span>
                      )}
                    </div>

                    <div className="text-[#202020] min-w-[200px]">
                      <div className=" text-sm text-[#202020]">
                        {tx.__typename === "VaultDeposit" && (
                          <div className="flex flex-col  gap-2">
                            <div>
                              <span className="text-sm text-[#202020]">
                                {DynamicFormatAmount({
                                  amount: BigNumber(tx.amount0.toString())
                                    .div(10 ** (vault?.token0?.decimals ?? 18))
                                    .toString(),
                                  decimals: 3,
                                  endWith: vault?.token0?.symbol,
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-[#202020]">
                                {DynamicFormatAmount({
                                  amount: BigNumber(tx.amount1.toString())
                                    .div(10 ** (vault?.token1?.decimals ?? 18))
                                    .toString(),
                                  decimals: 3,
                                  endWith: vault?.token1?.symbol,
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                        {tx.__typename === "VaultWithdraw" && (
                          <div className="flex flex-col gap-2">
                            <div>
                              <span className="text-sm text-[#202020]">
                                {DynamicFormatAmount({
                                  amount: BigNumber(tx.amount0.toString())
                                    .div(10 ** (vault?.token0?.decimals ?? 18))
                                    .toString(),
                                  decimals: 3,
                                  endWith: vault?.token0?.symbol,
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-[#202020]">
                                {DynamicFormatAmount({
                                  amount: BigNumber(tx.amount1.toString())
                                    .div(10 ** (vault?.token1?.decimals ?? 18))
                                    .toString(),
                                  decimals: 3,
                                  endWith: vault?.token1?.symbol,
                                })}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[#202020] flex-grow">
                      <Link
                        target="_blank"
                        href={`https://berascan.com/tx/${tx.id.split("-")[0]}`}
                        className="text-[#202020] underline hover:text-[#202020]/80"
                      >
                        {tx.id.split("-")[0]}
                      </Link>
                    </div>
                    <div className="text-sm text-[#202020]">
                      {new Date(
                        Number(tx.createdAtTimestamp) * 1000
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContainer>

      {/* Modals */}
      {vault && vault?.token0 && vault?.token1 && (
        <>
          <DepositToVaultModal
            isOpen={isDepositModalOpen}
            onClose={() => {
              setIsDepositModalOpen(false);
              refreshVaultData(); // Refresh after closing deposit modal
            }}
            vault={vault}
            tokenA={
              new AlgebraToken(
                wallet.currentChainId,
                vault?.token0?.address as `0x${string}`,
                Number(vault?.token0?.decimals ?? 18),
                vault?.token0?.symbol,
                vault?.token0?.name
              )
            }
            tokenB={
              new AlgebraToken(
                wallet.currentChainId,
                vault?.token1?.address as `0x${string}`,
                Number(vault?.token1?.decimals ?? 18),
                vault?.token1?.symbol,
                vault?.token1?.name
              )
            }
          />
          <WithdrawFromVaultModal
            isOpen={isWithdrawModalOpen}
            onClose={() => {
              setIsWithdrawModalOpen(false);
              refreshVaultData(); // Refresh after closing withdraw modal
            }}
            vault={vault}
            maxShares={vault?.userShares ?? BigInt(0)}
          />
        </>
      )}
    </div>
  );
});

export default VaultDetail;
