import {
  createChart,
  ColorType,
  UTCTimestamp,
  LineData,
  IChartApi,
} from "lightweight-charts";
import { useEffect, useRef, useMemo } from "react";

interface PriceChartProps {
  data: LineData<UTCTimestamp>[];
  width?: number;
  height?: number;
  timeRange: "1D" | "1W" | "1M";
  onTimeRangeChange?: (range: "1D" | "1W" | "1M") => void;
}

const generateEmptyTimeData = (timeRange: "1D" | "1W" | "1M"): LineData<UTCTimestamp>[] => {
  const now = Math.floor(Date.now() / 1000);
  const emptyData: LineData<UTCTimestamp>[] = [];
  
  const intervals = {
    "1D": { count: 24, step: 3600 },      // 24 points, 1 hour each
    "1W": { count: 7, step: 86400 },       // 7 points, 1 day each
    "1M": { count: 30, step: 86400 },      // 30 points, 1 day each
  };

  const { count, step } = intervals[timeRange];

  // Generate time points with 0 values
  for (let i = count; i >= 0; i--) {
    emptyData.push({
      time: (now - i * step) as UTCTimestamp,
      value: 0
    });
  }

  return emptyData;
};

export const PriceChart = ({
  data,
  width = 511,
  height = 280,
  timeRange,
  onTimeRangeChange,
}: PriceChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const chartData = useMemo(() => {
    return data.length > 0 ? data : generateEmptyTimeData(timeRange);
  }, [data, timeRange]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#4D4D4D",
      },
      localization: {
        locale: 'en-US',
        dateFormat: 'yyyy/MM/dd',
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      rightPriceScale: {
        visible: true,
        borderColor: "#2D2D2D",
        textColor: "#4D4D4D",
        scaleMargins: {
          top: 0.3,
          bottom: 0.3,
        },
      },
      timeScale: {
        visible: true,
        borderColor: "#2D2D2D",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: UTCTimestamp) => {
          const date = new Date(time * 1000);
          const options: Intl.DateTimeFormatOptions = {
            timeZone: 'UTC'  // Use UTC to avoid locale-specific formatting
          };

          switch (timeRange) {
            case "1D":
              return new Intl.DateTimeFormat('en-US', {
                ...options,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).format(date);
            case "1W":
            case "1M":
              return new Intl.DateTimeFormat('en-US', {
                ...options,
                month: 'short',
                day: 'numeric',
              }).format(date);
          }
        },
      },
      crosshair: {
        vertLine: {
          color: "rgba(255, 255, 255, 0.4)",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: "rgba(255, 255, 255, 0.4)",
          width: 1,
          style: 3,
        },
      },
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addAreaSeries({
      lineWidth: 2,
      lineType: 2,
      lineColor: "#F6BF35",
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
      priceFormat: {
        type: "custom",
        formatter: (price: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(price);
        },
        minMove: 0.01,
      },
      autoscaleInfoProvider: (original: () => { priceRange: { minValue: number; maxValue: number } } | null) => {
        const res = original();
        if (res) {
          return {
            priceRange: {
              minValue: res.priceRange.minValue * 0.7,
              maxValue: res.priceRange.maxValue * 1.3,
            },
          };
        }
        return res;
      },
      lineStyle: 0,
      topColor: "rgba(246, 191, 53, 0.2)",
      bottomColor: "rgba(246, 191, 53, 0.0)",
    });

    series.setData(chartData);
    chart.timeScale().fitContent();
    chartRef.current = chart;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartData, timeRange]);

  return (
    <div 
      className="w-full flex flex-col bg-[#202020] py-6 px-4 rounded-2xl gap-y-4 pb-[30px]
        bg-[url('/images/card-container/dark/honey-border.svg')]
        bg-[position:-85px_bottom]
        bg-[size:auto_30px]
        bg-repeat-x"
      style={{ height: `${height}px` }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-white">Fees Gained</h3>
        <div className="flex items-center p-1 gap-[6px] rounded-[4px] border border-[#202020] bg-white shadow-[1px_1px_0px_0px_#FFCD4D]">
          {["1D", "1W", "1M"].map((range) => (
            <button
              key={range}
              onClick={() => onTimeRangeChange?.(range as "1D" | "1W" | "1M")}
              className={`px-2 py-1 rounded-[4px] text-xs transition-all ${
                timeRange === range
                  ? "bg-[#FFCD4D] text-black"
                  : "text-[#4D4D4D] hover:text-black"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full">
        <style jsx global>{`
          a[id="tv-attr-logo"] {
            display: none !important;
          }
        `}</style>
      </div>
    </div>
  );
};
