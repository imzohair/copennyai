"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateSubscriptionModal({ open, onOpenChange, onSuccess }: CreateSubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    billing_cycle: "monthly",
    next_billing_date: "",
    category: "Subscriptions",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/subscriptions", {
        name: formData.name,
        amount: Number(formData.amount),
        billing_cycle: formData.billing_cycle,
        next_billing_date: formData.next_billing_date,
        category: formData.category,
      });
      toast.success("Subscription added successfully!");
      onSuccess();
      onOpenChange(false);
      setFormData({ name: "", amount: "", billing_cycle: "monthly", next_billing_date: "", category: "Subscriptions" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to add subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input 
              required
              placeholder="e.g. Netflix"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (₹)</label>
            <Input 
              required
              type="number"
              min="1"
              placeholder="499"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <select 
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.billing_cycle}
              onChange={e => setFormData({ ...formData, billing_cycle: e.target.value })}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Next Billing Date</label>
            <Input 
              required
              type="date"
              value={formData.next_billing_date}
              onChange={e => setFormData({ ...formData, next_billing_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Input 
              placeholder="Entertainment"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
