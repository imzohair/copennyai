"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, Home, GraduationCap, Car, Plane, Gem, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { CreateGoalModal } from "@/components/goals/CreateGoalModal";

interface Goal {
  id: number;
  name: string;
  target_amount: string;
  current_amount: string;
  deadline: string;
  color: string;
  progress_percentage: number;
  category?: string;
}

const iconMap: Record<string, any> = {
  Savings: Gem,
  Investment: TrendingUp,
  Debt: Target,
};

function formatINR(amount: number) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${(amount / 1000).toFixed(0)}K`;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const fetchGoals = async () => {
    try {
      const res = await apiClient.get("/goals");
      setGoals(res.data);
    } catch (error) {
      console.error("Failed to fetch goals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const totalTarget = goals.reduce((s, g) => s + Number(g.target_amount), 0);
  const totalSaved = goals.reduce((s, g) => s + Number(g.current_amount), 0);

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
        <Button onClick={() => setShowNew(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      <CreateGoalModal 
        open={showNew} 
        onOpenChange={setShowNew} 
        onSuccess={fetchGoals} 
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
                <p className="text-2xl font-bold mt-1">{totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%</p>
                <Progress value={totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0} className="h-1.5 mt-2 bg-secondary" />
              </CardContent>
            </Card>
          </div>

          {/* Goals */}
          {goals.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">No goals found. Create one above!</div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => {
                const target = Number(goal.target_amount);
                const current = Number(goal.current_amount);
                const pct = Math.round(goal.progress_percentage);
                const Icon = iconMap[goal.category || 'Savings'] || Target;
                const status = pct >= 100 ? "Completed" : pct >= 50 ? "On Track" : "Behind";
                const statusColor = pct >= 100 ? "text-green-400 border-green-400/30 bg-green-400/10" : 
                                  pct >= 50 ? "text-primary border-primary/30 bg-primary/10" : 
                                  "text-destructive border-destructive/30 bg-destructive/10";

                return (
                  <Card key={goal.id} className="bg-card border-border hover:border-border/80 transition-colors shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                            <Icon className={`w-5 h-5 ${goal.color || 'text-primary'}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-base">{goal.name}</h3>
                            <p className="text-xs text-muted-foreground">Target: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-[10px] font-semibold ${statusColor}`}>
                          {status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{formatINR(current)} saved</span>
                          <span className="font-semibold">{pct}% of {formatINR(target)}</span>
                        </div>
                        <Progress value={pct} className="h-2 bg-secondary" />
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          Remaining: {formatINR(target - current)}
                        </p>
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
