import { Token } from "@cryptoalgebra/sdk";
import { DEFAULT_CHAIN_ID } from "./default-chain-id";

export const STABLECOINS = {
  HONEY: new Token(
    DEFAULT_CHAIN_ID,
    "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce",
    18,
    "HONEY",
    "HONEY"
  ),
  USDC: new Token(
    DEFAULT_CHAIN_ID,
    "0xd6d83af58a19cd14ef3cf6fe848c9a4d21e5727c",
    6,
    "USDC",
    "USDC"
  ),
  USDT: new Token(
    DEFAULT_CHAIN_ID,
    "0x05d0dd5135e3ef3ade32a9ef9cb06e8d37a6795d",
    6,
    "USDT",
    "USDT"
  ),
  THPOT: new Token(
    DEFAULT_CHAIN_ID,
    "0xfc5e3743E9FAC8BB60408797607352E24Db7d65E",
    18,
    "Test Honeypot Finance",
    "tHPOT"
  ),
};
