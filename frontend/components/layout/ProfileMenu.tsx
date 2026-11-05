"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

type ProfileMenuProps = {
  user?: {
    id: string;
    email: string;
  } | null;
};

function getInitial(email?: string) {
  return email?.trim().charAt(0).toUpperCase() || "U";
}

export function ProfileMenu({ user }: ProfileMenuProps) {
  const router = useRouter();

  async function handleLogout() {
    await api.logout();
    router.push("/");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-11 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary outline-none transition hover:bg-primary/20 focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Open profile menu"
      >
        {getInitial(user?.email)}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="block text-foreground">Signed in</span>
          <span className="mt-1 block max-w-44 truncate font-normal">{user?.email || "Loading account"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-destructive data-[highlighted]:text-destructive">
          <LogOut className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
