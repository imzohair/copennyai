"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Wallet, Plus, ShoppingCart, Utensils, Car, Home, Zap, Heart, Plane, BookOpen, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { CreateBudgetModal } from "@/components/budgets/CreateBudgetModal";

interface Budget {
  id: number;
  category: string;
  limit_amount: string;
  spent_amount: string;
  month: string;
}

const iconMap: Record<string, any> = {
  "Housing": Home,
  "Food & Dining": Utensils,
  "Transport": Car,
  "Shopping": ShoppingCart,
  "Utilities": Zap,
  "Healthcare": Heart,
  "Entertainment": Wallet,
  "Education": BookOpen,
  "Travel": Plane,
};

const colorMap: Record<string, string> = {
  "Housing": "#D4AF37",
  "Food & Dining": "#60a5fa",
  "Transport": "#a78bfa",
  "Shopping": "#f87171",
  "Utilities": "#34d399",
  "Healthcare": "#fb923c",
  "Entertainment": "#f472b6",
  "Education": "#c084fc",
  "Travel": "#22d3ee",
};

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await apiClient.get("/budgets");
      setBudgets(res.data);
    } catch (error) {
      console.error("Failed to fetch budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const totalLimit = budgets.reduce((s, b) => s + Number(b.limit_amount), 0);
  const totalSpent = budgets.reduce((s, b) => s + Number(b.spent_amount), 0);
  const overBudget = budgets.filter(b => Number(b.spent_amount) > Number(b.limit_amount));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Wallet className="w-7 h-7 text-primary" />
            Budgets
          </h1>
          <p className="text-muted-foreground mt-1">Monthly spending envelopes</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> New Budget
        </Button>
      </div>

      <CreateBudgetModal 
        open={showNew} 
        onOpenChange={setShowNew} 
        onSuccess={fetchBudgets} 
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
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
          {budgets.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">No budgets found. Create one above!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((b) => {
                const limit = Number(b.limit_amount);
                const spent = Number(b.spent_amount);
                const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
                const isOver = spent > limit;
                const Icon = iconMap[b.category] || Wallet;
                const color = colorMap[b.category] || "#D4AF37";

                return (
                  <Card key={b.id} className="bg-card border-border shadow-sm">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center">
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <span className="font-bold text-sm">{b.category}</span>
                        </div>
                        <Badge variant="outline" className={`text-[10px] font-bold ${isOver ? "text-destructive border-destructive/30 bg-destructive/10" : "text-muted-foreground"}`}>
                          {pct}%{isOver ? " ⚠" : ""}
                        </Badge>
                      </div>
                      <Progress value={Math.min(pct, 100)} className="h-2 bg-secondary" style={{ "--progress-color": isOver ? "#ef4444" : color } as React.CSSProperties} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Spent: <span className={`font-bold ${isOver ? "text-destructive" : "text-foreground"}`}>{formatINR(spent)}</span></span>
                        <span>Budget: <span className="font-bold text-foreground">{formatINR(limit)}</span></span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
