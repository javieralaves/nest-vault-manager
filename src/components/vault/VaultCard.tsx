import { Vault } from "./vaults";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface VaultCardProps {
  vault: Vault;
  onAction: (action: string, vault: Vault) => void;
}

export function VaultCard({ vault, onAction }: VaultCardProps) {
  return (
    <Sheet>
      <div className="border rounded-md p-4 flex justify-between items-center">
        <div>
          <div className="font-semibold">{vault.name}</div>
          <div className="text-sm text-gray-500">APY: {vault.apy}%</div>
        </div>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">Manage</Button>
        </SheetTrigger>
      </div>
      <SheetContent className="flex flex-col gap-4" side="right">
        <div className="font-semibold text-lg mb-2">{vault.name}</div>
        <div className="text-sm">APY: {vault.apy}%</div>
        <div className="text-sm">Last price update: {vault.lastPriceUpdate}</div>
        <div className="text-sm">Last rebalance: {vault.lastRebalance}</div>
        <div className="mt-4 flex flex-col gap-2">
          <Button onClick={() => onAction("update_price", vault)}>Update price</Button>
          <Button onClick={() => onAction("rebalance", vault)}>Rebalance now</Button>
          <Button onClick={() => onAction("update_composition", vault)}>
            Update composition
          </Button>
          <SheetClose asChild>
            <Button variant="secondary">Close</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
