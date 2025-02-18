import { action, makeAutoObservable, reaction } from "mobx";
import { Token } from "./contract/token";
import { PairContract } from "./contract/dex/liquidity/pair-contract";
import { AsyncState } from "./utils";
import { ChartDataResponse, resolutionType } from "./priceFeed/priceFeedTypes";
import { wallet } from "./wallet";
import { trpcClient } from "@/lib/trpc";
import { dayjs } from "@/lib/dayjs";
import { AlgebraPoolContract } from "./contract/algebra/algebra-pool-contract";

type Range = "5M" | "15M" | "30M" | "4H" | "1D";

export const chartColorThemes = {
  default: {
    textColor: "white",
    labelColor: "orange",
  },
  green: {
    textColor: "white",
    labelColor: "#43D9A3",
  },
  red: {
    textColor: "white",
    labelColor: "red",
  },
};

export const chartTimeRanges: {
  [key: string]: {
    label: Range;
    value: number;
    resolution: resolutionType;
  };
} = {
  "5M": {
    label: "5M",
    value: dayjs().unix() - 60 * 5 * 10,
    resolution: "1",
  },
  "15M": {
    label: "15M",
    value: dayjs().unix() - 60 * 15 * 10,
    resolution: "5",
  },
  "30M": {
    label: "30M",
    value: dayjs().unix() - 60 * 30 * 10,
    resolution: "15",
  },
  "4H": {
    label: "4H",
    value: dayjs().unix() - 60 * 60 * 4 * 10,
    resolution: "30",
  },
  "1D": {
    label: "1D",
    value: dayjs().unix() - 60 * 60 * 24 * 10,
    resolution: "60",
  },
};

class Chart {
  isLoading = false;
  showChart = true;
  chartTarget: Token | PairContract | AlgebraPoolContract | undefined =
    undefined;
  tokenNumber: 0 | 1 = 0;
  currencyCode: "USD" | "TOKEN" = "USD";
  range: Range = "5M";
  chartColors = chartColorThemes.default;
  chartLabel = "";
  chartData = new AsyncState<
    () => Promise<ChartDataResponse | undefined>,
    ChartDataResponse | undefined
  >(async () => {
    if (!this.chartTarget) {
      return undefined;
    }

    this.isLoading = true;

    const priceDataRequest = await trpcClient.priceFeed.getChartData.query({
      chainId: wallet.currentChainId.toString(),
      tokenAddress: this.chartTarget.address,
      from: this.timestampsByRange,
      to: dayjs().unix(),
      resolution: chartTimeRanges[this.range].resolution,
      tokenNumber: this.tokenNumber,
      currencyCode: this.currencyCode,
    });

    this.isLoading = false;

    if (priceDataRequest.status === "error") {
      return undefined;
    } else {
      return priceDataRequest.data;
    }
  });

  get currentPrice() {
    if (this.chartData.value?.getBars.c) {
      return this.chartData.value.getBars.c[
        this.chartData.value.getBars.c.length - 1
      ];
    } else {
      return 0;
    }
  }

  get chartPricePercentageChange() {
    if (this.chartData.value?.getBars.c) {
      const firstPrice = this.firstValidPrice;
      const lastPrice = this.lastValidPrice;

      return ((lastPrice - firstPrice) / firstPrice) * 100;
    } else {
      return 0;
    }
  }

  get TargetLogoDisplay(): Token[] {
    if (this.chartTarget instanceof Token) {
      this.chartTarget.init();
      return [this.chartTarget];
    } else if (this.chartTarget instanceof PairContract) {
      this.chartTarget.token0.init();
      this.chartTarget.token1.init();
      return [this.chartTarget.token0, this.chartTarget.token1];
    } else if (this.chartTarget instanceof AlgebraPoolContract) {
      this.chartTarget.init();
      return [this.chartTarget.token0.value!, this.chartTarget.token1.value!];
    } else {
      return [];
    }
  }

  get firstValidPrice() {
    if (
      this.chartData.value?.getBars.c &&
      this.chartData.value.getBars.c.length > 0
    ) {
      let i = 0;
      while (
        (this.chartData.value.getBars.c[i] === undefined ||
          this.chartData.value.getBars.c[i] === null) &&
        i < this.chartData.value.getBars.c.length
      ) {
        i++;
      }

      return this.chartData.value.getBars.c[i] ?? 0;
    } else {
      return 0;
    }
  }

  get lastValidPrice() {
    if (this.chartData.value?.getBars.c) {
      let i = this.chartData.value.getBars.c.length - 1;
      while (
        (this.chartData.value.getBars.c[i] === undefined ||
          this.chartData.value.getBars.c[i] === null) &&
        i > 0
      ) {
        i--;
      }

      return this.chartData.value.getBars.c[i] ?? 0;
    } else {
      return 0;
    }
  }

  get timestampsByRange() {
    return chartTimeRanges[this.range].value;
  }

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => [this.range, this.chartTarget],
      () => {
        this.chartData.call();
      }
    );
  }

  async updateCurrentPrice() {
    if (!this.chartTarget) return;

    const newestPrice = await trpcClient.priceFeed.getChartData.query({
      chainId: wallet.currentChainId.toString(),
      tokenAddress: this.chartTarget.address,
      from: dayjs().unix() - 60,
      to: dayjs().unix(),
      resolution: "1",
      tokenNumber: this.tokenNumber,
      currencyCode: this.currencyCode,
    });

    if (
      newestPrice.status === "success" &&
      newestPrice.data?.getBars?.c[0] !== undefined
    ) {
      this.chartData.value?.getBars.c.push(
        newestPrice.data?.getBars?.c[0] as never
      );
    }
  }

  toggleChart() {
    this.showChart = !this.showChart;
  }

  setChartTarget(
    target: Token | PairContract | AlgebraPoolContract | undefined
  ) {
    this.chartTarget = target;
  }

  setRange(value: Range) {
    this.range = value;
  }

  setTokenNumber(value: 0 | 1) {
    this.tokenNumber = value;
  }

  setCurrencyCode(value: "USD" | "TOKEN") {
    this.currencyCode = value;
  }

  setChartLabel(value: string) {
    this.chartLabel = value;
  }

  setChartColors(value: "default" | "green" | "red") {
    this.chartColors = chartColorThemes[value];
  }
}

export const chart = new Chart();
