"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, User, Bell, Shield, Palette, LogOut, ChevronRight, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [email] = useState(user?.email ?? "");

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    largeTransactions: true,
    subscriptionReminders: false,
    weeklyReport: true,
    monthlyReport: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Card className="bg-card border-border">
            <CardContent className="p-2">
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === s.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                    {s.label}
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  </button>
                ))}
                <div className="border-t border-border my-2" />
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="col-span-9 space-y-5">
          {activeSection === "profile" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center text-2xl font-bold text-primary">
                    {(displayName || email)[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName || "User"}</p>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Display Name</label>
                    <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="h-10 bg-background/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Email</label>
                    <Input value={email} disabled className="h-10 bg-background/50 opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Currency</label>
                    <Input value="INR — Indian Rupee (₹)" disabled className="h-10 bg-background/50 opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Locale</label>
                    <Input value="en-IN (India)" disabled className="h-10 bg-background/50 opacity-60" />
                  </div>
                </div>
                <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                  {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, val]) => {
                  const labels: Record<string, { title: string; desc: string }> = {
                    budgetAlerts: { title: "Budget Alerts", desc: "Notify when a category exceeds 80% of budget" },
                    largeTransactions: { title: "Large Transactions", desc: "Alert for transactions above ₹10,000" },
                    subscriptionReminders: { title: "Subscription Reminders", desc: "3-day warning before renewals" },
                    weeklyReport: { title: "Weekly Report", desc: "Summary every Sunday evening" },
                    monthlyReport: { title: "Monthly Report", desc: "Full portfolio review on the 1st" },
                  };
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium text-sm">{labels[key].title}</p>
                        <p className="text-xs text-muted-foreground">{labels[key].desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !val }))}
                        className={`w-10 h-5 rounded-full transition-colors relative ${val ? "bg-primary" : "bg-muted"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${val ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <p className="text-sm font-semibold text-primary">🔐 Firebase Authentication Active</p>
                  <p className="text-xs text-muted-foreground mt-1">Your account is secured with Google Firebase Authentication. All sessions are encrypted with JWT tokens.</p>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div>
                    <p className="font-medium text-sm">Sign-in Method</p>
                    <p className="text-xs text-muted-foreground">{user?.photoURL ? "Google OAuth" : "Email & Password"}</p>
                  </div>
                  <span className="text-xs text-primary font-semibold">Active</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-sm">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">Enable</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "appearance" && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base">Appearance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-3">Theme</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border-2 border-primary rounded-xl p-4 cursor-pointer bg-[#121212]">
                      <div className="w-full h-10 rounded bg-[#1e1e1e] border border-[#2a2a2a] mb-2" />
                      <p className="text-xs font-semibold text-[#D4AF37] text-center">Sovereign Dark ✓</p>
                    </div>
                    <div className="border border-border rounded-xl p-4 cursor-pointer opacity-50">
                      <div className="w-full h-10 rounded bg-gray-100 border border-gray-200 mb-2" />
                      <p className="text-xs font-semibold text-gray-700 text-center">Light Mode (Soon)</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Number Format</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2 border border-primary rounded-lg px-4 py-2 cursor-pointer bg-primary/5">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm font-semibold">₹1,00,000 (Indian)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
