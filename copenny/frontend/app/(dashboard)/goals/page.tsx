import { Target } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border border-border">
        <Target className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Goals</h2>
      <p className="text-muted-foreground max-w-md">
        This module is under construction. Future updates will allow you to track and manage your financial goals.
      </p>
    </div>
  );
}
