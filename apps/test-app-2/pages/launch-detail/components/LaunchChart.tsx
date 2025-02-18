import { trpcClient } from "@/lib/trpc";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { LaunchTokenData } from "@/services/indexer/indexerTypes";
import { useRouter } from "next/router";

interface LaunchChartProps {
  decimals: number;
}

const Chart = dynamic(() => import("react-apexcharts"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const LaunchChart: React.FC<LaunchChartProps> = ({ decimals }) => {
  const router = useRouter();
  const { pair: pairAddress } = router.query;
  const [state, setState] = useState<{
    options: ApexOptions;
    series: ApexAxisChartSeries;
  }>({
    series: [
      {
        data: [],
        color: "#43D9A3",
        name: "amount",
      },
    ],
    options: {
      chart: {
        id: "area-datetime",
        type: "area",
        zoom: {
          autoScaleYaxis: true,
          allowMouseWheelZoom: false,
        },
        foreColor: "#fff",
        toolbar: {
          show: false,
          autoSelected: undefined,
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: "end",
        formatter: function (val, opts) {
          if (opts.dataPointIndex === opts.w.config.series[0].data.length - 1) {
            return (val as any)?.toFixed(5);
          }
        },
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        min: 0,
        max: dayjs().unix() * 1000,
        tickAmount: 6,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: "#fff",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return val?.toFixed(3);
          },
          style: {
            colors: "#fff",
          },
        },
        tickAmount: 4,
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        enabled: true,
        x: {
          format: "dd MMM HH:mm",
        },
        y: {
          formatter: function (val) {
            return val?.toFixed(3);
          },
        },
        theme: "dark",
        fillSeriesColor: true,
        fixed: {
          enabled: true,
          position: "topRight",
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 1,
          opacityTo: 0,
          stops: [],
          colorStops: [
            {
              offset: 0,
              color: "#43D9A3",
              opacity: 1,
            },
            {
              offset: 70,
              color: "#43D9A3",
              opacity: 0.5,
            },
            {
              offset: 100,
              color: "#43D9A3",
              opacity: 0,
            },
          ],
        },
      },
      grid: {
        show: false,
      },
    },
  });

  const [data, setData] = useState<LaunchTokenData[]>([]);

  const updateChartData = useCallback(() => {
    const chartData = data.map((item) => [
      parseInt(item.timestamp) * 1000,
      parseFloat(item.currentAmount) / Math.pow(10, decimals),
    ]);

    setState((prevState) => ({
      ...prevState,
      series: [
        {
          data: chartData,
          color: "#43D9A3",
          name: "amount",
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          min: Math.min(...data.map((item) => parseInt(item.timestamp))) * 1000,
          max: Math.max(...data.map((item) => parseInt(item.timestamp))) * 1000,
          tickAmount: 6,
        },
      },
    }));
  }, [data, decimals]);

  useEffect(() => {
    if (pairAddress) {
      trpcClient.indexerFeedRouter.getMemeGraphData
        .query({
          tokenAddress: pairAddress as string,
        })
        .then((data) => {
          console.log("chart data", data);
          setData(data as any);
        });
    }
  }, [pairAddress]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  return (
    <div className="relative w-full flex-col flex items-center justify-center">
      <div className="w-full">
        <Chart options={state.options} series={state.series} type="area" />
      </div>
    </div>
  );
};

export default LaunchChart;