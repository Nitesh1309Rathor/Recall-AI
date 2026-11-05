"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";

function DropdownMenu(props: Menu.Root.Props) {
  return <Menu.Root {...props} />;
}

function DropdownMenuTrigger({ className, ...props }: Menu.Trigger.Props) {
  return <Menu.Trigger className={cn(className)} {...props} />;
}

function DropdownMenuContent({ className, sideOffset = 8, align = "end", ...props }: Menu.Popup.Props & Menu.Positioner.Props) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={sideOffset} align={align} className="z-50">
        <Menu.Popup
          className={cn(
            "min-w-48 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg outline-none",
            "data-[ending-style]:animate-out data-[starting-style]:animate-in data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

function DropdownMenuItem({ className, ...props }: Menu.Item.Props) {
  return (
    <Menu.Item
      className={cn(
        "flex min-h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 text-sm outline-none transition",
        "data-[highlighted]:bg-muted data-[highlighted]:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuLabel({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-2.5 py-2 text-xs font-semibold text-muted-foreground", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: Menu.Separator.Props) {
  return <Menu.Separator className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger };
