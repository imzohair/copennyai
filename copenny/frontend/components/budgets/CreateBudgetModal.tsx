"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateBudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateBudgetModal({ open, onOpenChange, onSuccess }: CreateBudgetModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "Housing",
    limit_amount: "",
    month: new Date().toISOString().slice(0, 7), // YYYY-MM
  });

  const categories = [
    "Housing", "Food & Dining", "Transport", "Shopping", 
    "Utilities", "Healthcare", "Entertainment", "Education", 
    "Travel", "Investment", "Other"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/budgets", {
        category: formData.category,
        limit_amount: Number(formData.limit_amount),
        month: formData.month,
      });
      toast.success("Budget created successfully!");
      onSuccess();
      onOpenChange(false);
      setFormData({ ...formData, limit_amount: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Limit (₹)</label>
            <Input 
              required
              type="number"
              min="1"
              placeholder="10000"
              value={formData.limit_amount}
              onChange={e => setFormData({ ...formData, limit_amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Input 
              required
              type="month"
              value={formData.month}
              onChange={e => setFormData({ ...formData, month: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Budget
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
