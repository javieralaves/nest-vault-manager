import { useState } from "react";
import { Vault, Asset } from "./vaults";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TableRow, TableCell } from "@/components/ui/table";
import { formatTimestamp } from "@/lib/utils";

interface VaultRowProps {
  vault: Vault;
  onAction: (action: string, vault: Vault) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onRebalance: (id: string) => void;
  onUpdateComposition: (id: string, comp: Asset[]) => void;
}

export function VaultRow({
  vault,
  onAction,
  onUpdatePrice,
  onRebalance,
  onUpdateComposition,
}: VaultRowProps) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState(vault.price.toString());

  const [editingComp, setEditingComp] = useState(false);
  const [compRows, setCompRows] = useState<Asset[]>(vault.composition);

  const addRow = () => setCompRows((r) => [...r, { symbol: "", allocation: 0 }]);
  const updateRow = (i: number, field: keyof Asset, value: string) => {
    setCompRows((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  };
  const updateAllocation = (i: number, value: number) => {
    setCompRows((rows) => {
      const otherSum = rows.reduce(
        (sum, r, idx) => sum + (idx === i ? 0 : Number(r.allocation)),
        0
      );
      const maxAllowed = 100 - otherSum;
      const capped = Math.min(value, maxAllowed);
      return rows.map((r, idx) =>
        idx === i ? { ...r, allocation: capped } : r
      );
    });
  };
  const removeRow = (i: number) => setCompRows((rows) => rows.filter((_, idx) => idx !== i));

  const savePrice = () => {
    onUpdatePrice(vault.id, parseFloat(priceValue));
    onAction("update_price", vault);
    setEditingPrice(false);
  };

  const saveComp = () => {
    onUpdateComposition(
      vault.id,
      compRows.map((r) => ({ ...r, allocation: Number(r.allocation) }))
    );
    onAction("update_composition", vault);
    setEditingComp(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <TableRow className="cursor-pointer">
          <TableCell className="font-medium">{vault.name}</TableCell>
          <TableCell>{vault.apy}%</TableCell>
          <TableCell>{vault.price}</TableCell>
          <TableCell>{formatTimestamp(vault.lastPriceUpdate)}</TableCell>
          <TableCell>{formatTimestamp(vault.lastRebalance)}</TableCell>
        </TableRow>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 p-6" side="right">
        <div className="font-semibold text-lg mb-2">{vault.name}</div>
        <div className="text-sm">APY: {vault.apy}%</div>
        <div className="text-sm">Price: {vault.price}</div>
        <div className="text-sm">Last price update: {formatTimestamp(vault.lastPriceUpdate)}</div>
        <div className="text-sm">Last rebalance: {formatTimestamp(vault.lastRebalance)}</div>

        <div className="mt-2">
          <table className="w-full text-sm border rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="border-b p-1 text-left">Asset</th>
                <th className="border-b p-1 text-left">Allocation %</th>
              </tr>
            </thead>
            <tbody>
              {vault.composition.map((a, i) => (
                <tr key={i}>
                  <td className="border-b p-1">{a.symbol}</td>
                  <td className="border-b p-1">{a.allocation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {vault.staked > 0 && <div className="text-sm mt-2">Pending USDC: {vault.staked}</div>}
        </div>

        {editingPrice ? (
          <div className="flex gap-2">
            <Input type="number" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} />
            <Button onClick={savePrice}>Save</Button>
            <Button variant="secondary" onClick={() => setEditingPrice(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button onClick={() => setEditingPrice(true)}>Update price</Button>
        )}

        {editingComp ? (
          <div className="space-y-2">
            {compRows.map((row, idx) => {
              const max = 100 - compRows.reduce((s, r, j) => s + (j === idx ? 0 : Number(r.allocation)), 0);
              return (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    className="flex-1"
                    placeholder="Asset"
                    value={row.symbol}
                    onChange={(e) => updateRow(idx, "symbol", e.target.value)}
                  />
                  <div className="flex items-center gap-2 w-40">
                    <Slider
                      value={[row.allocation]}
                      max={max}
                      min={0}
                      step={1}
                      onValueChange={(v) => updateAllocation(idx, v[0])}
                    />
                    <span className="w-8 text-right">{row.allocation}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeRow(idx)}>
                    Remove
                  </Button>
                </div>
              );
            })}
            <Button variant="outline" size="sm" onClick={addRow}>
              Add asset
            </Button>
            <div className="flex gap-2">
              <Button onClick={saveComp}>Save</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditingComp(false);
                  setCompRows(vault.composition);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setEditingComp(true)}>Update composition</Button>
        )}

        <Button
          onClick={() => {
            onRebalance(vault.id);
            onAction("rebalance", vault);
          }}
        >
          Rebalance now
        </Button>
        <SheetClose asChild>
          <Button variant="secondary">Close</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
