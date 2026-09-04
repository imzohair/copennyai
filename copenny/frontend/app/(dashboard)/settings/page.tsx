import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
      <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border border-border">
        <Settings className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      <p className="text-muted-foreground max-w-md">
        This module is under construction. Manage your account settings and preferences.
      </p>
    </div>
  );
}
