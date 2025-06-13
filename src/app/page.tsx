"use client";
import { useState } from "react";
import { VaultRow } from "@/components/vault/VaultRow";
import { vaults, Vault, Asset } from "@/components/vault/vaults";
import { formatTimestamp } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface LogEntry {
  timestamp: string;
  vault: string;
  action: string;
  address: string;
  details: string;
}

const userAddress = "0x1234...abcd";

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

  function handleAction(action: string, vault: Vault, details: string) {
    const timestamp = new Date().toISOString();
    setLogs((l) => [
      { timestamp, vault: vault.name, action, address: userAddress, details },
      ...l,
    ]);
  }

  return (
    <div className="min-h-screen p-6 md:p-10 space-y-8 font-sans">
      <h1 className="text-2xl font-semibold">Vault overview</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vault</TableHead>
            <TableHead>APY</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Last price update</TableHead>
            <TableHead>Last rebalance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((v) => (
            <VaultRow
              key={v.id}
              vault={v}
              onAction={handleAction}
              onUpdatePrice={updatePrice}
              onRebalance={rebalance}
              onUpdateComposition={updateComposition}
            />
          ))}
        </TableBody>
      </Table>

      <div>
        <h2 className="text-xl font-semibold mt-8 mb-4">Action log</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vault</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Changes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log, idx) => (
              <TableRow key={idx}>
                <TableCell>{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell>{log.vault}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.address}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-gray-500">
                  No actions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
