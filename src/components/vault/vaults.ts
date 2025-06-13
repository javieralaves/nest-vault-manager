export type Vault = {
  id: string;
  name: string;
  apy: number;
  lastPriceUpdate: string;
  lastRebalance: string;
};

export const vaults: Vault[] = [
  {
    id: "1",
    name: "Stable Growth",
    apy: 5.2,
    lastPriceUpdate: "2024-06-01 10:00",
    lastRebalance: "2024-05-28 08:30",
  },
  {
    id: "2",
    name: "Aggressive",
    apy: 12.8,
    lastPriceUpdate: "2024-06-01 11:15",
    lastRebalance: "2024-05-27 18:20",
  },
  {
    id: "3",
    name: "Income",
    apy: 3.1,
    lastPriceUpdate: "2024-05-31 16:45",
    lastRebalance: "2024-05-25 09:00",
  },
  {
    id: "4",
    name: "Speculative",
    apy: 20.4,
    lastPriceUpdate: "2024-06-01 12:00",
    lastRebalance: "2024-05-20 14:50",
  },
];
