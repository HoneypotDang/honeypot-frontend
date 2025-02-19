export interface PriceFeedProvider {
  getMultipleTokenCurrentPrice(
    addresses: string[],
    networkId: string
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType[]>>;
  getTokenCurrentPrice(
    address: string,
    networkId: string
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType>>;

  getChartData(
    input: getChartDataInputsType
  ): Promise<ApiResponseType<ChartDataResponse>>;

  getTokenHistoricalPrice(
    address: string,
    networkId: string,
    from: number,
    to: number
  ): Promise<ApiResponseType<TokenCurrentPriceResponseType[]>>;
}

export type getChartDataInputsType = {
  address: string;
  networkId: string;
  from: number;
  to: number;
  resolution: resolutionType;
  tokenNumber?: number;
  currencyCode?: "USD" | "TOKEN";
};

export type resolutionType =
  | "1"
  | "5"
  | "15"
  | "30"
  | "60"
  | "240"
  | "720"
  | "1D"
  | "7D";

export type TokenCurrentPriceResponseType = {
  address: string;
  price: number;
  lastUpdated?: number;
  timestamp?: number;
};

export interface ChartDataResponse {
  getBars: ChartDataResponseGetBars;
}

export interface ChartDataResponseGetBars {
  o: number[] | undefined[];
  h: number[] | undefined[];
  l: number[] | undefined[];
  c: number[] | undefined[];
  t: number[] | undefined[];
  v: number[] | undefined[];
}
