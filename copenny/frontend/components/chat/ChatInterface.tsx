"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

export function ChatInterface() {
  const { chatHistory, isChatting, sendMessage } = useChatStore();
  const [query, setQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isChatting) return;
    const currentQuery = query;
    setQuery("");
    await sendMessage(currentQuery);
  };

  const quickActions = [
    "Analyze my spending",
    "Suggest savings",
    "How much did I spend on food?"
  ];

  return (
    <Card className="bg-card border-border shadow-sm flex flex-col h-[500px]">
      <div className="p-4 border-b border-border flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Copenny AI</h3>
          <p className="text-xs text-muted-foreground">Financial Advisor</p>
        </div>
      </div>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col hide-scrollbar">
        {chatHistory.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-70">
            <Bot className="w-12 h-12 mb-2" />
            <p className="text-sm max-w-[250px]">Hello! I'm your AI wealth manager. How can I help you optimize your finances today?</p>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {quickActions.map(action => (
                <Badge 
                  key={action} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-secondary transition-colors font-normal text-xs py-1.5 px-3"
                  onClick={() => sendMessage(action)}
                >
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-secondary' : 'bg-primary/20 text-primary'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-secondary rounded-tl-sm text-foreground'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isChatting && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-secondary rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </CardContent>

      <div className="p-3 border-t border-border bg-background/50 backdrop-blur-sm shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 relative">
          <Input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask about your finances..." 
            className="flex-1 bg-background border-border pr-10 rounded-full"
            disabled={isChatting}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!query.trim() || isChatting} 
            className="absolute right-1 top-1 w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

// Inline Badge for Quick Actions to avoid another import dependency if missing
function Badge({ children, className, variant, onClick }: any) {
  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}
