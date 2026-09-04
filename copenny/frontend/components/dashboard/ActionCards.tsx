"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function ActionCards() {
  const { actions, isLoadingActions, loadActions, executeAction } = useChatStore();
  const [executingId, setExecutingId] = useState<string | null>(null);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const handleExecute = async (actionId: string) => {
    setExecutingId(actionId);
    try {
      await executeAction(actionId);
      toast.success("Action executed successfully!");
    } catch (error) {
      toast.error("Failed to execute action.");
    } finally {
      setExecutingId(null);
    }
  };

  if (isLoadingActions) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {[1, 2].map(i => (
          <Card key={i} className="min-w-[300px] shrink-0 bg-card border-border shadow-sm animate-pulse">
            <CardContent className="p-5 h-40"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (actions.length === 0) {
    return null; // Don't show anything if there are no suggested actions
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
      {actions.map((action, idx) => (
        <Card key={idx} className="min-w-[300px] max-w-[350px] shrink-0 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm snap-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-primary rotate-12" />
          </div>
          <CardContent className="p-5 relative z-10 flex flex-col h-full justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-primary font-semibold text-sm">
                <Zap className="w-4 h-4" />
                Action Recommended
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{action.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm">
                <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Save up to</span>
                <span className="font-bold text-foreground">₹{action.potentialSavings.toLocaleString('en-IN')}</span>
              </div>
              <Button 
                size="sm" 
                onClick={() => handleExecute(action.type)}
                disabled={executingId === action.type}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                {executingId === action.type ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Take Action <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
