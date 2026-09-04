"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, Home, GraduationCap, Car, Plane, Gem } from "lucide-react";

const goals = [
  {
    id: 1,
    name: "Emergency Fund",
    icon: Gem,
    target: 300000,
    current: 220000,
    deadline: "Dec 2026",
    color: "text-yellow-500",
    status: "On Track",
  },
  {
    id: 2,
    name: "House Down Payment",
    icon: Home,
    target: 5000000,
    current: 1800000,
    deadline: "Jun 2028",
    color: "text-blue-400",
    status: "On Track",
  },
  {
    id: 3,
    name: "MBA Fund",
    icon: GraduationCap,
    target: 2000000,
    current: 450000,
    deadline: "Mar 2027",
    color: "text-purple-400",
    status: "Behind",
  },
  {
    id: 4,
    name: "New Car",
    icon: Car,
    target: 1200000,
    current: 780000,
    deadline: "Sep 2026",
    color: "text-green-400",
    status: "Almost Done",
  },
  {
    id: 5,
    name: "Europe Trip",
    icon: Plane,
    target: 250000,
    current: 80000,
    deadline: "Apr 2027",
    color: "text-cyan-400",
    status: "On Track",
  },
];

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}

const statusColor: Record<string, string> = {
  "On Track": "text-primary border-primary/30 bg-primary/10",
  "Behind": "text-destructive border-destructive/30 bg-destructive/10",
  "Almost Done": "text-green-400 border-green-400/30 bg-green-400/10",
};

export default function GoalsPage() {
  const [showNew, setShowNew] = useState(false);

  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const totalSaved = goals.reduce((s, g) => s + g.current, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Target className="w-7 h-7 text-primary" />
            Financial Goals
          </h1>
          <p className="text-muted-foreground mt-1">Track your wealth milestones with precision</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Targeted</p>
            <p className="text-2xl font-bold mt-1">{formatINR(totalTarget)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Total Saved</p>
            <p className="text-2xl font-bold mt-1 text-primary">{formatINR(totalSaved)}</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Overall Progress</p>
            <p className="text-2xl font-bold mt-1">{Math.round((totalSaved / totalTarget) * 100)}%</p>
            <Progress value={(totalSaved / totalTarget) * 100} className="h-1.5 mt-2 bg-secondary" />
          </CardContent>
        </Card>
      </div>

      {/* Goals */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <Card key={goal.id} className="bg-card border-border hover:border-border/80 transition-colors shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                      <goal.icon className={`w-5 h-5 ${goal.color}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">{goal.name}</h3>
                      <p className="text-xs text-muted-foreground">Target: {goal.deadline}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-semibold ${statusColor[goal.status]}`}>
                    {goal.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatINR(goal.current)} saved</span>
                    <span className="font-semibold">{pct}% of {formatINR(goal.target)}</span>
                  </div>
                  <Progress value={pct} className="h-2 bg-secondary" />
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    Remaining: {formatINR(goal.target - goal.current)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
