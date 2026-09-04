"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, BrainCircuit } from "lucide-react";
import { explainInsight } from "@/lib/api/chat";
import { Insight } from "@/lib/api/chat";

interface ReasoningDisplayProps {
  insight: Insight;
}

export function ReasoningDisplay({ insight }: ReasoningDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleReasoning = async () => {
    if (!isExpanded && !explanation) {
      setIsLoading(true);
      try {
        const text = await explainInsight(insight);
        setExplanation(text);
      } catch (error) {
        setExplanation("Could not load AI reasoning at this time.");
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleReasoning}
        className="text-xs text-muted-foreground hover:text-primary p-0 h-auto font-semibold uppercase tracking-wider"
      >
        <BrainCircuit className="w-3 h-3 mr-1" />
        {isExpanded ? "Hide Reasoning" : "Why?"}
      </Button>

      {isExpanded && (
        <div className="mt-3 p-4 rounded-md bg-secondary/50 border border-border text-sm leading-relaxed animate-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing data...</span>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-muted-foreground">
              {explanation}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
