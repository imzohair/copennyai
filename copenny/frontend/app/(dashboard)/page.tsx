"use client";

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
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { ActionCards } from "@/components/dashboard/ActionCards";
import { InsightsFeed } from "@/components/dashboard/InsightsFeed";
import { ChatInterface } from "@/components/chat/ChatInterface";

const cashFlowData = [
  { month: "Apr", income: 95000, expenses: 42000 },
  { month: "May", income: 102000, expenses: 45000 },
  { month: "Jun", income: 98000, expenses: 48000 },
  { month: "Jul", income: 110000, expenses: 41000 },
  { month: "Aug", income: 114000, expenses: 43000 },
  { month: "Sep", income: 114000, expenses: 48200 },
];

const recentTransactions = [
  { icon: ShoppingCart, name: "Amazon Order", category: "Shopping", amount: -3200, date: "Today" },
  { icon: Utensils, name: "Taj Hotel Dinner", category: "Dining", amount: -4800, date: "Yesterday" },
  { icon: Zap, name: "Salary Credit", category: "Income", amount: 114000, date: "Sep 1" },
  { icon: Car, name: "Petrol — HP", category: "Transport", amount: -2100, date: "Sep 3" },
  { icon: Home, name: "Rent — Sector 15", category: "Housing", amount: -22000, date: "Sep 1" },
  { icon: Film, name: "Netflix + Prime", category: "Entertainment", amount: -1499, date: "Sep 2" },
];

function formatINR(amount: number) {
  const abs = Math.abs(amount);
  if (abs >= 10000000) return `₹${(abs / 10000000).toFixed(2)} Cr`;
  if (abs >= 100000) return `₹${(abs / 100000).toFixed(2)} L`;
  if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
  return `₹${abs}`;
}

export default function DashboardHome() {
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
              Total Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,80,500</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary flex items-center"><ArrowUpRight className="h-3 w-3" />+3.4%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Income
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,14,000</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-primary flex items-center"><ArrowUpRight className="h-3 w-3" />+1.2%</span>
              from last month
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
            <div className="text-2xl font-bold">₹48,200</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-destructive flex items-center"><ArrowUpRight className="h-3 w-3" />+4.1%</span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Savings Rate
            </CardTitle>
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 text-[10px]">Excellent</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">57.7%</div>
            <Progress value={57} className="h-2 mt-3 bg-secondary" />
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
            <CardTitle className="text-base">Cash Flow — 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
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
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#D4AF37" fill="url(#incomeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                    <tx.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none">{tx.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold tabular-nums ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}{formatINR(tx.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
