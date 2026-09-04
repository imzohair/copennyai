"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Activity,
  ShoppingCart,
  Utensils,
  Car,
  Home,
  Zap,
  Film,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { ActionCards } from "@/components/dashboard/ActionCards";
import { InsightsFeed } from "@/components/dashboard/InsightsFeed";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { apiClient } from "@/lib/api/client";

function formatINR(amount: number) {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${abs}`;
}

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingCart,
  "Dining Out": Utensils,
  Transport: Car,
  Housing: Home,
  Utilities: Zap,
  Entertainment: Film,
  Income: Activity,
  Other: Wallet,
};

export default function DashboardHome() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/transactions?limit=1000")
      .then((res) => {
        setTransactions(res.data.transactions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Compute real metrics
  const totalIncome = transactions.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpenses = transactions.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

  // Build cash-flow chart data from transactions
  const monthMap: Record<string, { income: number; expenses: number }> = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    if (!monthMap[month]) monthMap[month] = { income: 0, expenses: 0 };
    if (t.type === "credit") monthMap[month]!.income += Number(t.amount);
    else monthMap[month]!.expenses += Number(t.amount);
  });
  const cashFlowData = Object.entries(monthMap).map(([month, v]) => ({ month, ...v }));

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
        <p className="text-muted-foreground">Your financial command centre</p>
      </div>

      {/* Action Cards (AI Suggestions) */}
      <ActionCards />

      {/* Metrics Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Income
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary flex items-center"><ArrowUpRight className="h-3 w-3" />Credits</span>
              from your transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Expenses
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-destructive flex items-center"><ArrowDownRight className="h-3 w-3" />Debits</span>
              from your transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Net Savings
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatINR(totalIncome - totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1">Income minus expenses</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Savings Rate
            </CardTitle>
            <Badge variant="outline" className={`text-[10px] ${savingsRate > 30 ? 'text-primary border-primary/30 bg-primary/10' : 'text-destructive border-destructive/30'}`}>
              {savingsRate > 30 ? 'Excellent' : savingsRate > 10 ? 'Fair' : 'Low'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savingsRate}%</div>
            <Progress value={savingsRate} className="h-2 mt-3 bg-secondary" />
          </CardContent>
        </Card>
      </div>

      {/* AI Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">AI Insights</h2>
          <InsightsFeed />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Chat with Copenny</h2>
          <ChatInterface />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Cash Flow Chart */}
        <Card className="col-span-4 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Cash Flow</CardTitle>
          </CardHeader>
          <CardContent>
            {cashFlowData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
                Import transactions to see your cash flow chart
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={cashFlowData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={(v) => formatINR(v)} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={55} />
                  <Tooltip
                    formatter={(val) => [formatINR(Number(val ?? 0))]}
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="income" name="Income" stroke="#D4AF37" fill="url(#incomeGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#expGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                <p>No transactions yet.</p>
                <a href="/import" className="text-primary underline text-xs">Import CSV to get started →</a>
              </div>
            ) : (
              transactions.slice(0, 6).map((tx, i) => {
                const Icon = categoryIcons[tx.category] || Wallet;
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{tx.description}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{tx.category} · {new Date(tx.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold tabular-nums ${tx.type === "credit" ? "text-primary" : "text-foreground"}`}>
                      {tx.type === "credit" ? "+" : "-"}{formatINR(Number(tx.amount))}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
