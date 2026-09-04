"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Pause, Play, Trash2, Tv, Music, Cloud, BookOpen, Dumbbell, Coffee } from "lucide-react";

interface Subscription {
  id: number;
  name: string;
  icon: React.ElementType;
  amount: number;
  cycle: string;
  nextBilling: string;
  category: string;
  active: boolean;
  color: string;
}

const initialSubs: Subscription[] = [
  { id: 1, name: "Netflix", icon: Tv, amount: 649, cycle: "Monthly", nextBilling: "Sep 15", category: "Entertainment", active: true, color: "text-red-500" },
  { id: 2, name: "Spotify Premium", icon: Music, amount: 119, cycle: "Monthly", nextBilling: "Sep 12", category: "Music", active: true, color: "text-green-500" },
  { id: 3, name: "Google One 2TB", icon: Cloud, amount: 220, cycle: "Monthly", nextBilling: "Sep 22", category: "Storage", active: true, color: "text-blue-400" },
  { id: 4, name: "Amazon Prime", icon: BookOpen, amount: 1499, cycle: "Yearly", nextBilling: "Dec 1", category: "Shopping", active: true, color: "text-yellow-400" },
  { id: 5, name: "Cult.fit Pro", icon: Dumbbell, amount: 999, cycle: "Monthly", nextBilling: "Sep 18", category: "Health", active: false, color: "text-orange-400" },
  { id: 6, name: "Blue Tokai Coffee", icon: Coffee, amount: 1200, cycle: "Monthly", nextBilling: "Sep 30", category: "Food", active: true, color: "text-amber-700" },
];

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(initialSubs);

  const toggle = (id: number) => setSubs(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const remove = (id: number) => setSubs(prev => prev.filter(s => s.id !== id));

  const activeSubs = subs.filter(s => s.active);
  const monthlyTotal = activeSubs.reduce((acc, s) => acc + (s.cycle === "Yearly" ? s.amount / 12 : s.amount), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <CreditCard className="w-7 h-7 text-primary" />
            Subscriptions
          </h1>
          <p className="text-muted-foreground mt-1">Track and control your recurring expenses</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Subscription
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Monthly Burn</p>
            <p className="text-2xl font-bold mt-1 text-primary">₹{Math.round(monthlyTotal).toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Yearly Total</p>
            <p className="text-2xl font-bold mt-1">₹{Math.round(monthlyTotal * 12).toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Active Count</p>
            <p className="text-2xl font-bold mt-1">{activeSubs.length} <span className="text-base text-muted-foreground font-normal">of {subs.length}</span></p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <div className="space-y-3">
        {subs.map((sub) => (
          <Card key={sub.id} className={`bg-card border-border shadow-sm transition-opacity ${!sub.active ? "opacity-50" : ""}`}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                  <sub.icon className={`w-5 h-5 ${sub.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{sub.name}</h3>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">{sub.category}</Badge>
                    {!sub.active && <Badge variant="outline" className="text-[10px] text-muted-foreground">Paused</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub.cycle} · Next: {sub.nextBilling}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-sm">₹{sub.amount.toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-muted-foreground">{sub.cycle === "Yearly" ? "per year" : "per month"}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => toggle(sub.id)}>
                    {sub.active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 hover:text-destructive hover:border-destructive" onClick={() => remove(sub.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
