"use client";
import { useState } from "react";
import { VaultCard } from "@/components/vault/VaultCard";
import { vaults, Vault, Asset } from "@/components/vault/vaults";

interface LogEntry {
  timestamp: string;
  vault: string;
  action: string;
  hash: string;
}

export default function Dashboard() {
  const [data, setData] = useState<Vault[]>(vaults);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const updatePrice = (id: string, price: number) => {
    setData((d) =>
      d.map((v) =>
        v.id === id
          ? { ...v, price, lastPriceUpdate: new Date().toISOString() }
          : v
      )
    );
  };

  const updateComposition = (id: string, comp: Asset[]) => {
    setData((d) => d.map((v) => (v.id === id ? { ...v, composition: comp } : v)));
  };

  const rebalance = (id: string) => {
    setData((d) =>
      d.map((v) =>
        v.id === id
          ? { ...v, staked: 0, lastRebalance: new Date().toISOString() }
          : v
      )
    );
  };

  function handleAction(action: string, vault: Vault) {
    const hash = "0x" + Math.random().toString(16).slice(2, 10);
    const timestamp = new Date().toISOString();
    setLogs((l) => [
      { timestamp, vault: vault.name, action, hash },
      ...l,
    ]);
  }

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-6 font-sans">
      <h1 className="text-2xl font-semibold">Vault overview</h1>
      <div className="grid gap-4">
        {data.map((v) => (
          <VaultCard
            key={v.id}
            vault={v}
            onAction={handleAction}
            onUpdatePrice={updatePrice}
            onRebalance={rebalance}
            onUpdateComposition={updateComposition}
          />
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-2">Action log</h2>
        <ul className="text-sm space-y-1">
          {logs.map((log, idx) => (
            <li key={idx} className="border rounded-md p-2">
              <span className="font-medium">{log.vault}</span> - {log.action} - {log.hash} - {log.timestamp}
            </li>
          ))}
          {logs.length === 0 && <li className="text-gray-500">No actions yet.</li>}
        </ul>
      </div>
    </div>
  );
}
