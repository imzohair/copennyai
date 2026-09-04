"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Pause, Play, Trash2, Tv, Music, Cloud, BookOpen, Dumbbell, Coffee, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { CreateSubscriptionModal } from "@/components/subscriptions/CreateSubscriptionModal";

interface Subscription {
  id: number;
  name: string;
  amount: string;
  billing_cycle: string;
  next_billing_date: string;
  category: string;
  status: string;
}

const iconMap: Record<string, any> = {
  Entertainment: Tv,
  Music: Music,
  Storage: Cloud,
  Shopping: BookOpen,
  Health: Dumbbell,
  Food: Coffee,
  Subscriptions: CreditCard,
};

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);

  const fetchSubs = async () => {
    try {
      const res = await apiClient.get("/subscriptions");
      setSubs(res.data);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const toggle = async (id: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await apiClient.put(`/subscriptions/${id}`, { status: newStatus });
      fetchSubs();
    } catch (error) {
      console.error("Failed to toggle subscription status:", error);
    }
  };

  const remove = async (id: number) => {
    try {
      await apiClient.delete(`/subscriptions/${id}`);
      fetchSubs();
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    }
  };

  const activeSubs = subs.filter(s => s.status === "active");
  const monthlyTotal = activeSubs.reduce((acc, s) => acc + (s.billing_cycle === "yearly" ? Number(s.amount) / 12 : Number(s.amount)), 0);

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
        <Button onClick={() => setShowNew(true)} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Subscription
        </Button>
      </div>

      <CreateSubscriptionModal 
        open={showNew} 
        onOpenChange={setShowNew} 
        onSuccess={fetchSubs} 
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
          {subs.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">No subscriptions found. Add one above!</div>
          ) : (
            <div className="space-y-3">
              {subs.map((sub) => {
                const Icon = iconMap[sub.category] || CreditCard;
                const isActive = sub.status === "active";
                return (
                  <Card key={sub.id} className={`bg-card border-border shadow-sm transition-opacity ${!isActive ? "opacity-50" : ""}`}>
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                          <Icon className={`w-5 h-5 text-primary`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm">{sub.name}</h3>
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">{sub.category}</Badge>
                            {!isActive && <Badge variant="outline" className="text-[10px] text-muted-foreground">Paused</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{sub.billing_cycle} · Next: {new Date(sub.next_billing_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold text-sm">₹{Number(sub.amount).toLocaleString("en-IN")}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">per {sub.billing_cycle.replace("ly", "")}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => toggle(sub.id, sub.status)}>
                            {isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                          <Button variant="outline" size="icon" className="w-8 h-8 hover:text-destructive hover:border-destructive" onClick={() => remove(sub.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
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
