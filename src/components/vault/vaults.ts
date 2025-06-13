export type Asset = {
  symbol: string;
  allocation: number;
  amount?: number;
  price?: number;
};

export type Vault = {
  id: string;
  name: string;
  apy: number;
  price: number;
  lastPriceUpdate: string;
  lastRebalance: string;
  composition: Asset[];
  staked: number; // pending USDC
};

export const vaults: Vault[] = [
  {
    id: "1",
    name: "Stable Growth",
    apy: 5.2,
    price: 100,
    lastPriceUpdate: "2024-06-01 10:00",
    lastRebalance: "2024-05-28 08:30",
    composition: [
      { symbol: "ETH", allocation: 50, amount: 10, price: 3000 },
      { symbol: "BTC", allocation: 50, amount: 0.5, price: 65000 },
    ],
    staked: 500,
  },
  {
    id: "2",
    name: "Aggressive",
    apy: 12.8,
    price: 150,
    lastPriceUpdate: "2024-06-01 11:15",
    lastRebalance: "2024-05-27 18:20",
    composition: [
      { symbol: "SOL", allocation: 40, amount: 100, price: 25 },
      { symbol: "AVAX", allocation: 60, amount: 80, price: 40 },
    ],
    staked: 0,
  },
  {
    id: "3",
    name: "Income",
    apy: 3.1,
    price: 80,
    lastPriceUpdate: "2024-05-31 16:45",
    lastRebalance: "2024-05-25 09:00",
    composition: [
      { symbol: "USDT", allocation: 70, amount: 7000, price: 1 },
      { symbol: "DAI", allocation: 30, amount: 3000, price: 1 },
    ],
    staked: 200,
  },
  {
    id: "4",
    name: "Speculative",
    apy: 20.4,
    price: 200,
    lastPriceUpdate: "2024-06-01 12:00",
    lastRebalance: "2024-05-20 14:50",
    composition: [
      { symbol: "DOGE", allocation: 50, amount: 20000, price: 0.2 },
      { symbol: "PEPE", allocation: 50, amount: 500000, price: 0.00001 },
    ],
    staked: 0,
  },
];
