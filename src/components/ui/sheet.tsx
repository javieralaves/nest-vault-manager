import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetPortal = (props: DialogPrimitive.DialogPortalProps) => (
  <DialogPrimitive.Portal {...props} />
);
SheetPortal.displayName = DialogPrimitive.Portal.displayName;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "bottom" | "left" | "right";
  }
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      {...props}
      className={cn(
        "fixed z-50 bg-background p-6 shadow-lg transition-transform",
        side === "right" && "inset-y-0 right-0 w-80 transform data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
        side === "left" && "inset-y-0 left-0 w-80 transform data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
        side === "top" && "inset-x-0 top-0 h-1/3 transform data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full",
        side === "bottom" && "inset-x-0 bottom-0 h-1/3 transform data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
        className
      )}
    >
      {children}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

export { Sheet, SheetTrigger, SheetClose, SheetContent };
