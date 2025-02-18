export interface getTokenCurrentPriceTypeDataType {
  getTokenPrices: getTokenCurrentPriceTypeGetTokenPriceType[];
}

export interface getTokenCurrentPriceTypeGetTokenPriceType {
  timestamp?: number;
  priceUsd: number;
}
