"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Plus, ToggleRight, Trash2, Bell, CreditCard, TrendingDown, AlertTriangle, PiggyBank, Zap, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface Rule {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  trigger: string;
  action: string;
  active: boolean;
  category: string;
}

const initialRules: Rule[] = [
  {
    id: 1,
    name: "Overspending Alert",
    description: "Notify me when any budget category exceeds 80% of its limit",
    icon: AlertTriangle,
    trigger: "Budget > 80%",
    action: "Push Notification",
    active: true,
    category: "Alerts",
  },
  {
    id: 2,
    name: "Large Transaction Flag",
    description: "Flag any single transaction above ₹10,000 for review",
    icon: CreditCard,
    trigger: "Transaction > ₹10,000",
    action: "Flag + Notify",
    active: true,
    category: "Fraud",
  },
  {
    id: 3,
    name: "Auto-Save on Salary",
    description: "Automatically move ₹20,000 to savings on every salary credit",
    icon: PiggyBank,
    trigger: "Income > ₹50,000",
    action: "Move ₹20,000 to Savings",
    active: true,
    category: "Automation",
  },
  {
    id: 4,
    name: "Subscription Reminder",
    description: "Notify 3 days before any subscription renewal",
    icon: Bell,
    trigger: "Renewal in 3 days",
    action: "Push Notification",
    active: false,
    category: "Alerts",
  },
  {
    id: 5,
    name: "Savings Rate Drop",
    description: "Alert me if my monthly savings rate falls below 30%",
    icon: TrendingDown,
    trigger: "Savings Rate < 30%",
    action: "Email + Notification",
    active: true,
    category: "Goals",
  },
  {
    id: 6,
    name: "Bill Auto-Pay",
    description: "Auto-pay utility bills when balance is above ₹1 Lakh",
    icon: Zap,
    trigger: "Bill Due + Balance > ₹1L",
    action: "Auto-Pay",
    active: false,
    category: "Automation",
  },
];

const categoryColor: Record<string, string> = {
  Alerts: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  Fraud: "text-red-400 border-red-400/30 bg-red-400/10",
  Automation: "text-primary border-primary/30 bg-primary/10",
  Goals: "text-blue-400 border-blue-400/30 bg-blue-400/10",
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get("/rules")
      .then(res => setRules(res.data))
      .catch(err => console.error("Failed to fetch rules", err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const remove = (id: number) => setRules(prev => prev.filter(r => r.id !== id));

  const activeCount = rules.filter(r => r.active).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-primary" />
            Automation Rules
          </h1>
          <p className="text-muted-foreground mt-1">Smart triggers and automated financial actions</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Rule
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Active Rules</p>
            <p className="text-2xl font-bold mt-1 text-primary">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Rules</p>
            <p className="text-2xl font-bold mt-1">{rules.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Triggered This Month</p>
            <p className="text-2xl font-bold mt-1">12</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id} className={`bg-card border-border shadow-sm transition-opacity ${!rule.active ? "opacity-50" : ""}`}>
            <CardContent className="p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <rule.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm">{rule.name}</h3>
                    <Badge variant="outline" className={`text-[10px] font-semibold ${categoryColor[rule.category]}`}>
                      {rule.category}
                    </Badge>
                    {!rule.active && <Badge variant="outline" className="text-[10px] text-muted-foreground">Paused</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                  <div className="flex gap-4 mt-2 text-[11px]">
                    <span className="text-muted-foreground">If: <span className="text-foreground font-medium">{rule.trigger}</span></span>
                    <span className="text-muted-foreground">Then: <span className="text-primary font-medium">{rule.action}</span></span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => toggle(rule.id)} title={rule.active ? "Pause" : "Enable"}>
                  <ToggleRight className={`w-3.5 h-3.5 ${rule.active ? "text-primary" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8 hover:text-destructive hover:border-destructive" onClick={() => remove(rule.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
