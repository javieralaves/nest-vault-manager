import { useState } from "react";
import { Vault, Asset } from "./vaults";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface VaultCardProps {
  vault: Vault;
  onAction: (action: string, vault: Vault) => void;
  onUpdatePrice: (id: string, price: number) => void;
  onRebalance: (id: string) => void;
  onUpdateComposition: (id: string, comp: Asset[]) => void;
}

export function VaultCard({
  vault,
  onAction,
  onUpdatePrice,
  onRebalance,
  onUpdateComposition,
}: VaultCardProps) {
  const [editingPrice, setEditingPrice] = useState(false);
  const [priceValue, setPriceValue] = useState(vault.price.toString());

  const [editingComp, setEditingComp] = useState(false);
  const [compRows, setCompRows] = useState<Asset[]>(vault.composition);

  const addRow = () =>
    setCompRows((r) => [...r, { symbol: "", allocation: 0 }]);
  const updateRow = (i: number, field: keyof Asset, value: string) => {
    setCompRows((rows) =>
      rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
  };
  const removeRow = (i: number) =>
    setCompRows((rows) => rows.filter((_, idx) => idx !== i));

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
      <Card className="flex items-center justify-between p-4">
        <div>
          <div className="font-semibold">{vault.name}</div>
          <div className="text-sm text-gray-500">APY: {vault.apy}%</div>
        </div>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">Manage</Button>
        </SheetTrigger>
      </Card>
      <SheetContent className="flex flex-col gap-4 p-6" side="right">
        <div className="font-semibold text-lg mb-2">{vault.name}</div>
        <div className="text-sm">APY: {vault.apy}%</div>
        <div className="text-sm">Price: {vault.price}</div>
        <div className="text-sm">Last price update: {vault.lastPriceUpdate}</div>
        <div className="text-sm">Last rebalance: {vault.lastRebalance}</div>

        {/* Composition Table */}
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
          {vault.staked > 0 && (
            <div className="text-sm mt-2">Pending USDC: {vault.staked}</div>
          )}
        </div>

        {editingPrice ? (
          <div className="flex gap-2">
            <Input
              type="number"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
            />
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
            {compRows.map((row, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  className="flex-1"
                  placeholder="Asset"
                  value={row.symbol}
                  onChange={(e) => updateRow(idx, "symbol", e.target.value)}
                />
                <Input
                  className="w-20"
                  type="number"
                  value={row.allocation}
                  onChange={(e) => updateRow(idx, "allocation", e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeRow(idx)}
                >
                  Remove
                </Button>
              </div>
            ))}
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
