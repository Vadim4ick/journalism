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
  fullscreen = false,
  ...props
}: BaseDialog.Popup.Props & { fullscreen?: boolean }) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none" />
      <BaseDialog.Popup
        className={cn(
          "fixed z-[71] bg-background text-foreground shadow-2xl outline-none duration-200 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 motion-reduce:transition-none",
          fullscreen
            ? "inset-0 h-dvh max-h-dvh w-screen overflow-hidden rounded-none border-0 p-0 transition-opacity"
            : "top-1/2 left-1/2 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border p-5 transition-[opacity,transform] data-[starting-style]:translate-y-[calc(-50%+8px)] data-[ending-style]:translate-y-[calc(-50%+8px)]",
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
