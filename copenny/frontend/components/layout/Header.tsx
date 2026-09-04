"use client";

import { Search, Bell, ChevronDown, TrendingUp, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Ask Copenny anything..."
            className="w-full bg-sidebar border border-border rounded-md pl-10 pr-12 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-background border border-border rounded text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 justify-end">
        <div className="hidden md:flex items-center gap-6 border-r border-border pr-6">
          <div className="text-right">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Burn
            </div>
            <div className="text-sm font-bold text-foreground">
              ₹4,820<span className="text-muted-foreground font-normal">/mo</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Savings Rate
            </div>
            <div className="text-sm font-bold text-primary flex items-center justify-end gap-1">
              42%
              <TrendingUp className="w-3 h-3" />
            </div>
          </div>
        </div>

        <button className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-background"></span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-3 cursor-pointer group pl-2 outline-none">
              <Avatar className="w-8 h-8 border border-primary/40 group-hover:border-primary transition-colors">
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-none">
                  {displayName}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                  {user?.email ?? "Portfolio Member"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground hidden lg:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={logout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
