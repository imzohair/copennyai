"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateGoalModal({ open, onOpenChange, onSuccess }: CreateGoalModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    deadline: "",
    category: "Savings",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/goals", {
        name: formData.name,
        target_amount: Number(formData.target_amount),
        deadline: formData.deadline || undefined,
        category: formData.category,
        color: "text-primary" // default color
      });
      toast.success("Goal created successfully!");
      onSuccess();
      onOpenChange(false);
      setFormData({ name: "", target_amount: "", deadline: "", category: "Savings" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Goal Name</label>
            <Input 
              required
              placeholder="e.g. House Down Payment"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Amount (₹)</label>
            <Input 
              required
              type="number"
              min="1"
              placeholder="50000"
              value={formData.target_amount}
              onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deadline</label>
            <Input 
              type="date"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select 
              className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Savings">Savings</option>
              <option value="Investment">Investment</option>
              <option value="Debt">Debt</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
