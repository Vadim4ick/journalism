"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { cn } from "@/shared/lib/utils";

const Dialog = BaseDialog.Root;
const DialogTrigger = BaseDialog.Trigger;
const DialogClose = BaseDialog.Close;
const DialogTitle = BaseDialog.Title;
const DialogDescription = BaseDialog.Description;

function DialogContent({
  className,
  children,
  ...props
}: BaseDialog.Popup.Props) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
      <BaseDialog.Popup
        className={cn(
          "fixed top-1/2 left-1/2 z-[71] max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background p-5 text-foreground shadow-2xl outline-none transition-[opacity,transform] duration-200 data-[starting-style]:translate-y-[calc(-50%+8px)] data-[starting-style]:opacity-0 data-[ending-style]:translate-y-[calc(-50%+8px)] data-[ending-style]:opacity-0 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogDescription,
};
