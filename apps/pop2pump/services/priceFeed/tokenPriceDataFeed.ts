import {
  ChartDataResponse,
  PriceFeedProvider,
  TokenCurrentPriceResponseType,
  getChartDataInputsType,
} from "./priceFeedTypes";

export class TokenPriceDataFeed<T extends PriceFeedProvider> {
  dataProvider: T;
  debug: boolean;

  constructor(dataProvider: T, debug: boolean = false) {
    this.dataProvider = dataProvider;
    this.debug = debug;
  }

  getTokenCurrentPrice = async (
    address: string,
    networkId: string
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType>> => {
    const price = await this.dataProvider.getTokenCurrentPrice(
      address,
      networkId
    );
    if (this.debug) {
      console.log(price);
    }

    if (price.status === "error") {
      return {
        status: "error",
        message: price.message,
      };
    } else {
      return {
        status: "success",
        data: price.data,
        message: "Success",
      };
    }
  };

  getChartData = async (
    input: getChartDataInputsType
  ): Promise<ApiResponseType<ChartDataResponse>> => {
    const data = await this.dataProvider.getChartData(input);
    if (this.debug) {
      console.log(data);
    }

    if (data.status === "error") {
      return {
        status: "error",
        message: data.message,
      };
    } else {
      return {
        status: "success",
        data: data.data,
        message: "Success",
      };
    }
  };

  getMultipleTokenCurrentPrice = async (
    addresses: string[],
    networkId: string
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType[]>> => {
    const price = await this.dataProvider.getMultipleTokenCurrentPrice(
      addresses,
      networkId
    );
    if (this.debug) {
      console.log(price);
    }

    if (price.status === "error") {
      return {
        status: "error",
        message: price.message,
      };
    } else {
      return {
        status: "success",
        data: price.data,
        message: "Success",
      };
    }
  };

  getTokenHistoricalPrice = async (
    address: string,
    networkId: string,
    from: number,
    to: number
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType[]>> => {
    const price = await this.dataProvider.getTokenHistoricalPrice(
      address,
      networkId,
      from,
      to
    );
    if (this.debug) {
      console.log(price);
    }

    if (price.status === "error") {
      return {
        status: "error",
        message: price.message,
      };
    } else {
      return {
        status: "success",
        data: price.data,
        message: "Success",
      };
    }
  };
}
