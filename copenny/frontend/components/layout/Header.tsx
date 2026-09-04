import { Search, Bell, ChevronDown, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
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

        <div className="flex items-center gap-3 cursor-pointer group pl-2">
          <Avatar className="w-8 h-8 border border-primary/40 group-hover:border-primary transition-colors">
            <AvatarImage src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfmgi2jz64UTY6-XIk4OHKruX9tJN3uRxgxlftZAn5_2NUzBdT8PDbkOVbVPAzD5PiNW-csP_P6n6vZVPRa1OdAD3yGr0rNqylJ0hetKKwvP3-pEq2kr2sneEVbqqTbHekXOdBnZLC4ofoYsqronu6CSPVJLLp2GTS2ZbrWd1eUqbNgneiHq_2EXZfllv6rKVkN0cRnUEGu1JWAXM17MPVFhJHoojSTAIKyLNE5xgdgNV-2QYy6gtz" />
            <AvatarFallback>LH</AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col">
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-none">
              Lord Harrington
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-1">
              VIP Portfolio Director
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground hidden lg:block" />
        </div>
      </div>
    </header>
  );
}
