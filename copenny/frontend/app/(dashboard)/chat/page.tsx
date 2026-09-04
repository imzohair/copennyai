"use client";

let msgCounter = 0;
function nextId() { return ++msgCounter; }

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const suggestions = [
  "How much did I spend this month?",
  "Where can I cut costs?",
  "What is my savings rate?",
  "Show me my biggest expenses",
];

const getTime = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const aiResponses: Record<string, string> = {
  default: "I'm Copenny AI, your personal wealth assistant. I can analyse your spending patterns, help optimize your budget, and provide insights tailored to your portfolio. What would you like to know?",
  spend: "In September 2026, you have spent ₹48,200 so far — primarily on housing (₹22,000), dining (₹8,500), and shopping (₹9,400). You are 4.1% over your monthly average.",
  cut: "Based on your spending patterns, here are 3 areas to optimise:\n\n1. **Shopping** — ₹9,400 spent vs ₹8,000 budget. Review Amazon orders.\n2. **Dining** — ₹8,500 on food. Consider cooking at home 2 extra days per week.\n3. **Subscriptions** — You have 6 active. Consider pausing Cult.fit if unused.",
  saving: "Your savings rate this month is **57.7%**, which is excellent. You are saving ₹65,800 from a gross income of ₹1,14,000. At this rate, you will add approximately ₹7.9 lakhs to your net worth this year.",
  expense: "Your top 5 expenses for September:\n1. 🏠 Housing — ₹22,000\n2. 🛍 Shopping — ₹9,400\n3. 🍽 Food & Dining — ₹8,500\n4. 🚗 Transport — ₹5,200\n5. ⚡ Utilities — ₹2,800",
};

function getResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("spend") || lower.includes("spent")) return aiResponses.spend;
  if (lower.includes("cut") || lower.includes("reduce") || lower.includes("save more")) return aiResponses.cut;
  if (lower.includes("saving") || lower.includes("savings rate")) return aiResponses.saving;
  if (lower.includes("biggest") || lower.includes("expense") || lower.includes("top")) return aiResponses.expense;
  return aiResponses.default;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: aiResponses.default, time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    const userMsg: Message = { id: nextId(), role: "user", content: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const aiMsg: Message = { id: nextId(), role: "assistant", content: getResponse(msg), time: getTime() };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Copenny AI
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Your intelligent wealth advisor
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-none"
                : "bg-card border border-border rounded-bl-none"
            }`}>
              <p>{msg.content}</p>
              <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>
                {msg.time}
              </p>
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 py-3">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/50 hover:text-primary transition-colors text-muted-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 pt-2 border-t border-border">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask Copenny anything about your finances..."
          className="bg-card border-border focus:border-primary/50 h-11"
        />
        <Button onClick={() => send()} className="h-11 w-11 p-0 bg-primary hover:bg-primary/90 shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
