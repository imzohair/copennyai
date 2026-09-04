"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, Plus, ShoppingCart, Utensils, Car, Home, Zap, Heart, Plane, BookOpen } from "lucide-react";

interface Budget {
  id: number;
  category: string;
  icon: React.ElementType;
  limit: number;
  spent: number;
  color: string;
}

const initialBudgets: Budget[] = [
  { id: 1, category: "Housing", icon: Home, limit: 25000, spent: 22000, color: "#D4AF37" },
  { id: 2, category: "Food & Dining", icon: Utensils, limit: 12000, spent: 8500, color: "#60a5fa" },
  { id: 3, category: "Transport", icon: Car, limit: 6000, spent: 5200, color: "#a78bfa" },
  { id: 4, category: "Shopping", icon: ShoppingCart, limit: 8000, spent: 9400, color: "#f87171" },
  { id: 5, category: "Utilities", icon: Zap, limit: 4000, spent: 2800, color: "#34d399" },
  { id: 6, category: "Healthcare", icon: Heart, limit: 3000, spent: 1200, color: "#fb923c" },
  { id: 7, category: "Travel", icon: Plane, limit: 10000, spent: 0, color: "#22d3ee" },
  { id: 8, category: "Education", icon: BookOpen, limit: 5000, spent: 2100, color: "#c084fc" },
];

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function BudgetsPage() {
  const [budgets] = useState<Budget[]>(initialBudgets);

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const overBudget = budgets.filter(b => b.spent > b.limit);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wallet className="w-7 h-7 text-primary" />
            Budgets
          </h1>
          <p className="text-muted-foreground mt-1">Monthly spending envelopes — September 2026</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Budget
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Monthly Allocated</p>
            <p className="text-2xl font-bold mt-1">{formatINR(totalLimit)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Spent</p>
            <p className="text-2xl font-bold mt-1 text-primary">{formatINR(totalSpent)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Remaining</p>
            <p className={`text-2xl font-bold mt-1 ${totalLimit - totalSpent < 0 ? "text-destructive" : ""}`}>
              {formatINR(totalLimit - totalSpent)}
            </p>
            {overBudget.length > 0 && (
              <Badge variant="outline" className="text-[10px] mt-1 text-destructive border-destructive/30 bg-destructive/10">
                {overBudget.length} Over Budget
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.limit) * 100);
          const isOver = b.spent > b.limit;
          return (
            <Card key={b.id} className="bg-card border-border shadow-sm">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                      <b.icon className="w-4 h-4" style={{ color: b.color }} />
                    </div>
                    <span className="font-bold text-sm">{b.category}</span>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-bold ${isOver ? "text-destructive border-destructive/30 bg-destructive/10" : "text-muted-foreground"}`}>
                    {pct}%{isOver ? " ⚠" : ""}
                  </Badge>
                </div>
                <Progress value={Math.min(pct, 100)} className="h-2 bg-secondary" style={{ "--progress-color": isOver ? "#ef4444" : b.color } as React.CSSProperties} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spent: <span className={`font-bold ${isOver ? "text-destructive" : "text-foreground"}`}>{formatINR(b.spent)}</span></span>
                  <span>Budget: <span className="font-bold text-foreground">{formatINR(b.limit)}</span></span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
