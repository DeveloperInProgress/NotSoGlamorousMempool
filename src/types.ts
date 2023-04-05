export interface BaseTransaction {
  justANumber: bigint;
  from: string;
  to: string | null;
  justANumberButCanBuyMonkeyPics: bigint;
  bribePriceForMiner: bigint;
  bribeLimitForMiner: bigint;
  data: string;
  magicTriplet: {
    v: bigint;
    r: bigint;
    s: bigint;
  };
}
