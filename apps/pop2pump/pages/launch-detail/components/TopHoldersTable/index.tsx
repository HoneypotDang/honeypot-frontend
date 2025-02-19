import React, { ReactNode, useEffect, useState } from 'react';
import { Copy } from '@/components/Copy';
import { truncate } from '@/lib/format';
import { LoadingDisplay } from '@/components/LoadingDisplay/LoadingDisplay';
import { getTokenTop10Holders } from '@/lib/algebra/graphql/clients/token';
import BigNumber from 'bignumber.js';
import { MemePairContract } from '@/services/contract/launches/pot2pump/memepair-contract';
import Image from 'next/image';
import pot2pumpIcon from '@/public/images/bera/smoking_bera.png';

interface Holder {
  rank: string;
  address: string;
  quantity: string;
  percentage: string;
  value: string;
}

interface TopHoldersTableProps {
  launchedToken:
    | {
        address: string;
        decimals: number;
        derivedUSD: string;
      }
    | null
    | undefined;
  depositedLaunchedTokenWithoutDecimals: string | number | BigNumber;
  projectPool: MemePairContract | null | undefined;
}

const TopHoldersTable = ({
  projectPool,
  launchedToken,
  depositedLaunchedTokenWithoutDecimals,
}: TopHoldersTableProps) => {
  const [holders, setHolders] = useState<Holder[]>([]);
  const [loading, setLoading] = useState(false);

  const holderAddressDisplay = (address: string): ReactNode => {
    if (address.toLowerCase() === projectPool?.address.toLowerCase()) {
      return (
        <span className="text-black flex items-center gap-2">
          <Image
            src="/images/empty-logo.png"
            alt="Pot2Pump Pool"
            width={16}
            height={16}
          />
          Pot2Pump Pool
        </span>
      );
    }
    if (address.toLowerCase() === projectPool?.provider.toLowerCase()) {
      return (
        <span className="text-black flex items-center gap-2">
          <Image
            width={16}
            height={16}
            src={pot2pumpIcon}
            alt="pot2pump"
            className="size-4 cursor-pointer"
          />
          Launcher
        </span>
      );
    } else {
      return address;
    }
  };

  useEffect(() => {
    const fetchHolders = async () => {
      if (launchedToken?.address) {
        try {
          setLoading(true);
          const holdersData = await getTokenTop10Holders(launchedToken.address);

          const formattedHolders =
            holdersData.token?.holders.map((holder, index) => ({
              rank: (index + 1).toString(),
              address: holder.account.id,
              quantity: BigNumber(holder.holdingValue)
                .dividedBy(10 ** (launchedToken.decimals || 0))
                .toFixed(2),
              percentage: (
                (Number(holder.holdingValue) /
                  Number(depositedLaunchedTokenWithoutDecimals)) *
                100
              ).toFixed(2),
              value: BigNumber(holder.holdingValue)
                .dividedBy(10 ** (launchedToken.decimals || 0))
                .multipliedBy(Number(launchedToken.derivedUSD))
                .toFixed(2),
            })) || [];
          setHolders(formattedHolders);
        } catch (error) {
          console.error('Error fetching holders:', error);
          setHolders([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHolders();
  }, [launchedToken, depositedLaunchedTokenWithoutDecimals]);

  return (
    <div className="custom-dashed-3xl w-full p-6 bg-white">
      {!loading ? (
        <table className="w-full">
          <thead>
            <tr className="text-left border-b-2 border-[#202020]">
              <th className="py-4 px-6 font-gliker text-[#4D4D4D]">Rank</th>
              <th className="py-4 px-6 font-gliker text-[#4D4D4D]">Address</th>
              <th className="py-4 px-6 font-gliker text-[#4D4D4D] text-right">
                Quantity
              </th>
              <th className="py-4 px-6 font-gliker text-[#4D4D4D] text-right">
                Percentage
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4D4D4D]/10">
            {!holders.length ? (
              <tr className="hover:bg-white border-white h-full">
                <td colSpan={4} className="h-24 text-center text-black">
                  No results.
                </td>
              </tr>
            ) : (
              holders.map((holder, index) => (
                <tr
                  key={index}
                  className="transition-colors bg-white text-black hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-black">{holder.rank}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <a
                      href={`https://berascan.com/address/${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3"
                    >
                      <Copy
                        className="hover:text-black"
                        content={holder.address}
                        value={holder.address}
                        displayContent={holderAddressDisplay(holder.address)}
                      />
                    </a>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col">
                      <span className="text-black">{holder.quantity}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex flex-col">
                      <span className="text-black">{holder.percentage}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      ) : (
        <LoadingDisplay />
      )}
    </div>
  );
};

export default TopHoldersTable;
