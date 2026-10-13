"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/shared/lib/utils";

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetTitle = Dialog.Title;
const SheetDescription = Dialog.Description;

function SheetContent({ className, children, ...props }: Dialog.Popup.Props) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
      <Dialog.Popup
        className={cn(
          "fixed inset-y-0 right-0 z-[71] h-dvh w-full overflow-y-auto overscroll-contain bg-background text-foreground shadow-xl outline-none transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
