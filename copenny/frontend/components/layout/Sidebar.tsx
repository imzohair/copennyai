"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Target, 
  CreditCard, 
  Wallet, 
  MessageSquare, 
  ShieldCheck, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Timeline", href: "/", icon: Activity },
  { name: "Import Data", href: "/transactions/import", icon: CreditCard },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Budgets", href: "/budgets", icon: Wallet },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Rules", href: "/rules", icon: ShieldCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col h-full shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="font-bold text-primary text-sm tracking-tighter">CP</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-primary uppercase leading-tight text-sm">Copenny</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
          Modules
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium",
                isActive 
                  ? "bg-primary/10 text-primary border-l-2 border-primary" 
                  : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-card border border-border rounded-md p-3 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <div className="text-xs text-muted-foreground">
                System Status: <br/>
                <span className="text-foreground font-medium uppercase text-[10px]">All Encrypted</span>
              </div>
            </div>
            <div className="w-full h-[1px] bg-border my-1"></div>
            <LiveStatusIndicator />
        </div>
      </div>
    </aside>
  );
}

// Extract hook usage to a sub-component to prevent the entire Sidebar from re-rendering
import { useWebSocket } from "@/hooks/useWebSocket";
function LiveStatusIndicator() {
  const { isConnected } = useWebSocket();
  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-destructive")} />
      <span className="text-muted-foreground">{isConnected ? 'Live updates active' : 'Connecting...'}</span>
    </div>
  );
}
