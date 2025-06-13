import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const VaultSheet = DialogPrimitive.Root;
const VaultSheetTrigger = DialogPrimitive.Trigger;
const VaultSheetClose = DialogPrimitive.Close;

const VaultSheetPortal = (props: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);
VaultSheetPortal.displayName = DialogPrimitive.Portal.displayName;

const VaultSheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    {...props}
    className={cn(
      "fixed inset-0 z-40 bg-black/50 transition-opacity data-[state=closed]:opacity-0",
      className
    )}
  />
));
VaultSheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const VaultSheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "left" | "right";
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <VaultSheetPortal>
    <VaultSheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "fixed z-50 m-4 max-w-lg rounded-xl bg-white shadow transition-all duration-300 focus:outline-none",
        "data-[state=closed]:opacity-0 data-[state=closed]:pointer-events-none",
        side === "right" &&
          "top-0 bottom-0 right-0 w-full translate-x-full data-[state=open]:translate-x-0",
        side === "left" &&
          "top-0 bottom-0 left-0 w-full -translate-x-full data-[state=open]:translate-x-0",
        className
      )}
    >
      {children}
    </DialogPrimitive.Content>
  </VaultSheetPortal>
));
VaultSheetContent.displayName = "VaultSheetContent";

export { VaultSheet, VaultSheetTrigger, VaultSheetClose, VaultSheetContent };
