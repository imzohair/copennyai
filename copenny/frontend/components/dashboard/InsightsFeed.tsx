"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Info, Sparkles } from "lucide-react";
import { ReasoningDisplay } from "@/components/chat/ReasoningDisplay";

const typeConfig: Record<string, { icon: any, color: string }> = {
  "spending_alert": { icon: AlertTriangle, color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  "savings_opportunity": { icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  "anomaly": { icon: TrendingDown, color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
  "info": { icon: Info, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  "default": { icon: Sparkles, color: "text-primary bg-primary/10 border-primary/20" }
};

export function InsightsFeed() {
  const { insights, isLoadingInsights, loadInsights } = useChatStore();

  useEffect(() => {
    loadInsights();
  }, [loadInsights]);

  if (isLoadingInsights) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="bg-card border-border shadow-sm animate-pulse">
            <CardContent className="p-5 h-32"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="bg-card border-dashed">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Sparkles className="w-8 h-8 mb-3 opacity-50" />
          <p>No insights generated yet. Import some transactions!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight, idx) => {
        const config = typeConfig[insight.type] || typeConfig.default;
        const Icon = config.icon;
        
        return (
          <Card key={idx} className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base truncate">{insight.title}</h3>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-secondary/50">
                      {insight.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <ReasoningDisplay insight={insight} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
