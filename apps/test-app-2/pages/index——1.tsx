import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { NextLayoutPage } from '@/types/nextjs';
import { useEffect, useState } from 'react';
import { LaunchCardV3 } from '@/components/LaunchCard/v3';
import { itemPopUpVariants } from '@/lib/animation';
import { pot2PumpListToMemePairList } from '@/lib/algebra/graphql/clients/pair';
import { MemePairContract } from '@/services/contract/launches/pot2pump/memepair-contract';
import { wallet } from '@/services/wallet';
import { Button } from '@/components/button';
import Link from 'next/link';
import {
  Pot2Pump,
  usePot2PumpPottingHighPriceQuery,
  usePot2PumpPottingNearSuccessQuery,
  usePot2PumpPottingNewTokensQuery,
  usePot2PumpPottingTrendingQuery,
  usePot2PumpPottingMarketCapQuery,
  usePot2PumpPottingNewTokensByEndtimeQuery,
} from '@/lib/algebra/graphql/generated/graphql';
import { LoadingDisplay } from 'honeypot-ui';
import CardContainer from '@/components/CardContianer/v3';
import { NetworkStatus } from '@apollo/client';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Tab, Tabs } from '@nextui-org/react';
// 在组件外部定义常量

const POT_TABS = {
  NEW: 'New POTs',
  ALMOST: 'Almost',
  MOON: 'Moon 🚀',
  TRENDING: 'Trending',
  MARKET_CAP: 'Market Cap',
  NEW_PUMPS: 'New Pumps',
} as const;

type TabType = (typeof POT_TABS)[keyof typeof POT_TABS];

const STORAGE_KEY = 'pot2pump_selected_tabs';

const Pot2PumpOverviewPage: NextLayoutPage = observer(() => {
  const [newTokensList, setNewTokensList] = useState<MemePairContract[]>([]);
  const [nearSuccessTokensList, setNearSuccessTokensList] = useState<
    MemePairContract[]
  >([]);
  const [highPriceTokensList, setHighPriceTokensList] = useState<
    MemePairContract[]
  >([]);
  const [trendingTokensList, setTrendingTokensList] = useState<
    MemePairContract[]
  >([]);
  const [marketCapTokensList, setMarketCapTokensList] = useState<
    MemePairContract[]
  >([]);
  const [endTimeTokensList, setEndTimeTokensList] = useState<
    MemePairContract[]
  >([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>(POT_TABS.NEW);
  const [currentTime, setCurrentTime] = useState(
    Math.floor(new Date().getTime() / 1000)
  );
  const [selectedTabs, setSelectedTabs] = useState<TabType[]>(() => {
    // 从 localStorage 读取保存的标签，如果没有则使用默认值
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? JSON.parse(saved)
        : [POT_TABS.NEW, POT_TABS.ALMOST, POT_TABS.NEW_PUMPS];
    }
    return [POT_TABS.NEW, POT_TABS.ALMOST, POT_TABS.NEW_PUMPS];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(new Date().getTime() / 1000));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { data: pottingNewTokens, networkStatus: newTokensNetworkStatus } =
    usePot2PumpPottingNewTokensQuery({
      variables: {
        endTime: currentTime,
      },
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      skip: !wallet.isInit,
    });

  const isNewTokensInitialLoading =
    newTokensNetworkStatus === NetworkStatus.loading;

  const {
    data: pottingNearSuccessTokens,
    networkStatus: nearSuccessNetworkStatus,
  } = usePot2PumpPottingNearSuccessQuery({
    variables: {
      endTime: currentTime,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !wallet.isInit,
  });

  const isNearSuccessInitialLoading =
    nearSuccessNetworkStatus === NetworkStatus.loading;

  const {
    data: pottingHighPriceTokens,
    networkStatus: highPriceNetworkStatus,
  } = usePot2PumpPottingHighPriceQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000,
    skip: !wallet.isInit,
  });

  const isHighPriceInitialLoading =
    highPriceNetworkStatus === NetworkStatus.loading;

  const { data: pottingTrendingTokens, networkStatus: trendingNetworkStatus } =
    usePot2PumpPottingTrendingQuery({
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
      pollInterval: 5000,
      skip: !wallet.isInit,
    });

  const isTrendingInitialLoading =
    trendingNetworkStatus === NetworkStatus.loading;

  const {
    data: pottingMarketCapTokens,
    networkStatus: marketCapNetworkStatus,
  } = usePot2PumpPottingMarketCapQuery({
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000,
    skip: !wallet.isInit,
  });

  const isMarketCapInitialLoading =
    marketCapNetworkStatus === NetworkStatus.loading;

  const {
    data: pottingNewTokensByEndtime,
    networkStatus: newTokensByEndtimeNetworkStatus,
  } = usePot2PumpPottingNewTokensByEndtimeQuery({
    variables: {
      endTime: currentTime,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    skip: !wallet.isInit,
  });

  const isNewTokensByEndtimeInitialLoading =
    newTokensByEndtimeNetworkStatus === NetworkStatus.loading;

  useEffect(() => {
    if (!pottingNewTokens) return;

    const list = pot2PumpListToMemePairList(
      (pottingNewTokens?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!list.length || list.length == 0) return;
    if (!newTokensList.length) {
      setNewTokensList(list);
      return;
    }

    setNewTokensList((prev) => {
      prev.map((item) => {
        const i = list.find((item2) => item.address === item2.address);
        if (!i) {
          prev.splice(prev.indexOf(item), 1);
        }
      });

      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.push(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );
          if (existItem) {
            Object.assign(existItem, {
              depositedRaisedTokenWithoutDecimals:
                item.depositedRaisedTokenWithoutDecimals,
            });
          }
        }
      });
      return prev;
    });
  }, [newTokensList.length, pottingNewTokens]);

  useEffect(() => {
    if (!pottingNearSuccessTokens) return;

    const list = pot2PumpListToMemePairList(
      (pottingNearSuccessTokens?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!list.length || list.length == 0) return;

    if (!nearSuccessTokensList.length) {
      setNearSuccessTokensList(list);
      return;
    }

    setNearSuccessTokensList((prev) => {
      prev.map((item2) => {
        const i = list.find((item) => item.address == item2.address);
        if (!i) {
          prev.splice(prev.indexOf(item2), 1);
        }
      });

      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.unshift(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );

          if (existItem) {
            Object.assign(existItem, {
              depositedRaisedTokenWithoutDecimals:
                item.depositedRaisedTokenWithoutDecimals,
            });
          }
        }
      });

      return prev;
    });
  }, [nearSuccessTokensList.length, pottingNearSuccessTokens]);

  useEffect(() => {
    if (!pottingHighPriceTokens) return;

    const list = pot2PumpListToMemePairList(
      (pottingHighPriceTokens?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!highPriceTokensList.length) {
      setHighPriceTokensList(list);
      return;
    }

    setHighPriceTokensList((prev) => {
      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.push(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );
          if (existItem) {
            Object.assign(existItem, {
              launchedToken: item.launchedToken,
            });
          }
        }
      });
      return prev;
    });
  }, [highPriceTokensList.length, pottingHighPriceTokens]);

  useEffect(() => {
    const list = pot2PumpListToMemePairList(
      (pottingTrendingTokens?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!trendingTokensList.length) {
      setTrendingTokensList(list);
      return;
    }

    setTrendingTokensList((prev) => {
      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.push(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );

          if (existItem) {
            Object.assign(existItem, {
              launchedToken: item.launchedToken,
            });
          }
        }
      });
      return prev;
    });
  }, [pottingTrendingTokens, trendingTokensList.length]);

  useEffect(() => {
    if (!pottingMarketCapTokens) return;

    const list = pot2PumpListToMemePairList(
      (pottingMarketCapTokens?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!marketCapTokensList.length) {
      setMarketCapTokensList(list);
      return;
    }

    setMarketCapTokensList((prev) => {
      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.push(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );
          if (existItem) {
            Object.assign(existItem, {
              launchedToken: item.launchedToken,
            });
          }
        }
      });
      return prev;
    });
  }, [marketCapTokensList.length, pottingMarketCapTokens]);

  useEffect(() => {
    if (!pottingNewTokensByEndtime) return;

    const list = pot2PumpListToMemePairList(
      (pottingNewTokensByEndtime?.pot2Pumps as Partial<Pot2Pump>[]) ?? []
    );

    if (!list.length || list.length == 0) return;
    if (!endTimeTokensList.length) {
      setEndTimeTokensList(list);
      return;
    }

    setEndTimeTokensList((prev) => {
      prev.map((item) => {
        const i = list.find((item2) => item.address === item2.address);
        if (!i) {
          prev.splice(prev.indexOf(item), 1);
        }
      });

      list.map((item) => {
        if (!prev.find((item2) => item.address === item2.address)) {
          prev.push(item);
        } else {
          const existItem = prev.find(
            (item2) => item.address === item2.address
          );
          if (existItem) {
            Object.assign(existItem, {
              depositedRaisedTokenWithoutDecimals:
                item.depositedRaisedTokenWithoutDecimals,
            });
          }
        }
      });
      return prev;
    });
  }, [endTimeTokensList.length, pottingNewTokensByEndtime]);

  // Auto scroll effect
  useEffect(() => {
    if (!highPriceTokensList?.length) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev >= Math.min(4, highPriceTokensList?.length - 1) ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [highPriceTokensList]);

  const handleTabClick = (tab: TabType) => {
    setSelectedTabs((prev) => {
      let newTabs;
      // Only add new tab if not already selected and we haven't reached max tabs (3)
      if (!prev.includes(tab) && prev.length < 3) {
        newTabs = [...prev, tab];
        // 保存到 localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTabs));
        return newTabs;
      }
      return prev;
    });
  };

  const handleCloseTab = (tabToRemove: TabType, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTabs((prev) => {
      const newTabs = prev.filter((tab) => tab !== tabToRemove);
      // 保存到 localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTabs));
      return newTabs;
    });
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-4 font-gliker">
      <CardContainer className="xl:max-w-[1200px]">
        <div className="flex flex-col justify-center w-full rounded-2xl relative">
          {/* Featured Slideshow */}
          <div className="relative">
            <div className="user-select-none opacity-0 min-h-[200px]">
              <LaunchCardV3
                type="featured"
                pair={highPriceTokensList?.[currentSlide]}
                action={<></>}
              />
            </div>
            {trendingTokensList.length > 0 ? (
              trendingTokensList
                ?.sort(
                  (a, b) =>
                    Number(b.launchedToken?.priceChange24hPercentage) -
                    Number(a.launchedToken?.priceChange24hPercentage)
                )
                ?.slice(0, 5)
                ?.map((token, index) => (
                  <div
                    key={index}
                    className={`transition-opacity duration-500 absolute inset-0 ${
                      currentSlide === index
                        ? 'opacity-100 z-10'
                        : 'opacity-0 z-0'
                    }`}
                  >
                    <LaunchCardV3 type="featured" pair={token} action={<></>} />
                  </div>
                ))
            ) : (
              <LoadingDisplay />
            )}
          </div>
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 absolute bottom-1 left-0 right-0 z-20">
            {trendingTokensList?.slice(0, 5).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-black' : 'bg-gray-400'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </CardContainer>
      <div className="w-full relative flex justify-center mt-16 mb-20">
        <div className="w-full max-w-[600px]">
          <Link
            href="/launch-token?launchType=meme"
            className="text-black font-bold block"
          >
            <Button className="w-full text-xl md:text-3xl py-3 md:py-5 font-gliker">
              🍯 Launch Your Token 🍯
            </Button>
          </Link>
        </div>
      </div>
      {/* Mobile View */}
      <Tabs
        aria-label="Options"
        classNames={{
          base: 'relative w-full sm:hidden',
          tabList:
            'flex rounded-2xl border border-[#202020] bg-white p-4 shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] py-1 px-2 absolute left-1/2 -translate-x-1/2 z-10 -top-5 overflow-x-auto max-w-[90vw]',
          tab: 'px-1.5 py-1 rounded-lg whitespace-nowrap',
          tabContent: 'group-data-[selected=true]:text-white text-xs',
          cursor:
            'bg-[#020202] border border-black shadow-[2px_2px_0px_0px_#000000]',
          panel: cn(
            'flex flex-col h-full w-full gap-y-4 justify-center items-center bg-[#FFCD4D] rounded-2xl text-[#202020]',
            'px-4 pt-[60px] pb-[60px]',
            "bg-[url('/images/card-container/honey/honey-border.png'),url('/images/card-container/dark/bottom-border.svg')]",
            'bg-[position:-65px_top,_-85px_bottom]',
            'bg-[size:auto_65px,_auto_65px]',
            'bg-repeat-x',
            '!mt-0',
            'sm:hidden'
          ),
        }}
      >
        <Tab key="new" title="New POTs">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full  max-h-[600px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isNewTokensInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {newTokensList
                  .sort((a, b) => Number(b.startTime) - Number(a.startTime))
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
        <Tab key="almost" title="Almost">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full  max-h-[600px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isNearSuccessInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {nearSuccessTokensList
                  ?.sort(
                    (a, b) =>
                      Number(b.pottingPercentageNumber) -
                      Number(a.pottingPercentageNumber)
                  )
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
        <Tab key="moon" title="Moon 🚀">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full  max-h-[600px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isHighPriceInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {highPriceTokensList
                  ?.sort(
                    (a, b) =>
                      Number(b.launchedToken?.derivedUSD) -
                      Number(a.launchedToken?.derivedUSD)
                  )
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
        <Tab key="trending" title="Trending">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full ma x-h-[400px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isTrendingInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {trendingTokensList
                  ?.sort(
                    (a, b) =>
                      Number(b.launchedToken?.priceChange24hPercentage) -
                      Number(a.launchedToken?.priceChange24hPercentage)
                  )
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
        <Tab key="market-cap" title="Market Cap">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full  max-h-[600px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isMarketCapInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {marketCapTokensList
                  ?.sort(
                    (a, b) =>
                      Number(b.launchedToken?.marketCap) -
                      Number(a.launchedToken?.marketCap)
                  )
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
        <Tab key="new-pumps" title="New Pumps">
          <div className="bg-white rounded-3xl p-4 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full  max-h-[600px] flex flex-col">
            <CardContainer
              className="h-full flex-1"
              loading={isNewTokensByEndtimeInitialLoading}
              bordered={false}
              type="default"
              loadingText="Loading..."
            >
              <div className="flex flex-col gap-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2">
                {endTimeTokensList
                  ?.sort((a, b) => Number(a.endTime) - Number(b.endTime))
                  ?.map((pot2pump, index) => (
                    <motion.div key={index} variants={itemPopUpVariants}>
                      <LaunchCardV3
                        type="simple"
                        pair={pot2pump}
                        action={<></>}
                        theme="dark"
                      />
                    </motion.div>
                  ))}
              </div>
            </CardContainer>
          </div>
        </Tab>
      </Tabs>
      {/* Desktop View */}
      <CardContainer className="w-full max-w-[1200px] bg-[#FFCD4D] rounded-2xl relative px-8 pt-[60px] pb-[75px] sm:block hidden">
        {/* Tab Selector */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[60%] z-10">
          <div className="flex gap-2 rounded-2xl border border-[#202020] bg-white shadow-[4px_4px_0px_0px_#202020,-4px_4px_0px_0px_#202020] py-1.5 px-2">
            {Object.values(POT_TABS).map((tab) => {
              const isSelected = selectedTabs.includes(tab);
              const isDisabled = selectedTabs.length >= 3 && !isSelected;

              return (
                <button
                  key={tab}
                  onClick={() => !isDisabled && handleTabClick(tab)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-sm flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#020202] text-white border border-black shadow-[2px_2px_0px_0px_#000000]'
                      : isDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-default-500 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                  {isSelected && (
                    <span
                      onClick={(e) => handleCloseTab(tab, e)}
                      className="ml-1 hover:bg-gray-700 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl p-8 border border-black shadow-[4px_4px_0px_0px_#D29A0D] w-full">
          {selectedTabs.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[200px] space-y-5">
              <Image
                width={250}
                height={250}
                alt="No Data"
                src={'/images/honey-stick.svg'}
              />
              <p className="text-[#FFCD4D] text-5xl">Please select a pool</p>
            </div>
          ) : (
            <>
              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-3 min-h-[600px] h-[calc(100vh-300px)] gap-2">
                {selectedTabs.map((tab) => (
                  <section
                    key={tab}
                    className="relative flex flex-col px-2 overflow-hidden gap-y-2"
                  >
                    <div>
                      <div className="rounded-small dark:bg-default bg-[#FFCD4D] border border-black shadow-[2px_2px_0px_0px_#000000] text-sm inline-block p-2">
                        {tab}
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 py-4 overflow-y-auto h-full [&::-webkit-scrollbar]:w-1  [&::-webkit-scrollbar-track]:bg-white [-webkit-scrollbar]:mr-0 [&::-webkit-scrollbar]:mr-2 pr-2 shadow-inner px-2">
                      {(() => {
                        switch (tab) {
                          case POT_TABS.NEW:
                            return (
                              <CardContainer
                                className="h-auto"
                                loading={isNewTokensInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!newTokensList?.length}
                              >
                                {newTokensList
                                  .sort(
                                    (a, b) =>
                                      Number(b.startTime) - Number(a.startTime)
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );
                          case POT_TABS.ALMOST:
                            return (
                              <CardContainer
                                className="h-auto"
                                loading={isNearSuccessInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!nearSuccessTokensList?.length}
                              >
                                {nearSuccessTokensList
                                  ?.sort(
                                    (a, b) =>
                                      Number(b.pottingPercentageNumber) -
                                      Number(a.pottingPercentageNumber)
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );
                          case POT_TABS.MOON:
                            return (
                              <CardContainer
                                loading={isHighPriceInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!highPriceTokensList?.length}
                                className="h-auto"
                              >
                                {highPriceTokensList
                                  ?.sort(
                                    (a, b) =>
                                      Number(b.launchedToken?.derivedUSD) -
                                      Number(a.launchedToken?.derivedUSD)
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );

                          case POT_TABS.TRENDING:
                            return (
                              <CardContainer
                                className="h-auto"
                                loading={isTrendingInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!trendingTokensList?.length}
                              >
                                {trendingTokensList
                                  ?.sort(
                                    (a, b) =>
                                      Number(
                                        b.launchedToken
                                          ?.priceChange24hPercentage
                                      ) -
                                      Number(
                                        a.launchedToken
                                          ?.priceChange24hPercentage
                                      )
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );
                          case POT_TABS.MARKET_CAP:
                            return (
                              <CardContainer
                                className="h-auto"
                                loading={isMarketCapInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!marketCapTokensList?.length}
                              >
                                {marketCapTokensList
                                  ?.sort(
                                    (a, b) =>
                                      Number(b.launchedToken?.marketCap) -
                                      Number(a.launchedToken?.marketCap)
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );
                          case POT_TABS.NEW_PUMPS:
                            return (
                              <CardContainer
                                className="h-auto"
                                loading={isNewTokensByEndtimeInitialLoading}
                                bordered={false}
                                type="default"
                                loadingText="Loading..."
                                empty={!endTimeTokensList?.length}
                              >
                                {endTimeTokensList
                                  ?.sort(
                                    (a, b) =>
                                      Number(a.endTime) - Number(b.endTime)
                                  )
                                  ?.map((pot2pump, index) => (
                                    <motion.div
                                      key={index}
                                      variants={itemPopUpVariants}
                                    >
                                      <LaunchCardV3
                                        type="simple"
                                        pair={pot2pump}
                                        action={<></>}
                                        theme="dark"
                                      />
                                    </motion.div>
                                  ))}
                              </CardContainer>
                            );
                          default:
                            return null;
                        }
                      })()}
                    </div>
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContainer>
    </div>
  );
});

export default Pot2PumpOverviewPage;
