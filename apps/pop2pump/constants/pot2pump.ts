import { FilterState } from "./pot2pump.type";

export const defaultFilterState: FilterState = {
    tvl: {
        min: undefined,
        max: undefined
    },
    participants: {
        min: undefined,
        max: undefined
    },
    liquidity: {
        min: undefined,
        max: undefined
    },
    marketcap: {
        min: undefined,
        max: undefined
    },
    daytxns: {
        min: undefined,
        max: undefined
    },
    daybuys: {
        min: undefined,
        max: undefined
    },
    daysells: {
        min: undefined,
        max: undefined
    },
    dayvolume: {
        min: undefined,
        max: undefined
    },
    daychange: {
        min: undefined,
        max: undefined
    },
    depositraisedtoken: {
        min: undefined,
        max: undefined
    }
}