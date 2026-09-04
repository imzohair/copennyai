"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithGoogle, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <Card className="border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <CardHeader className="space-y-2 pb-6 pt-8 px-8 relative z-10">
        <CardTitle className="text-3xl font-bold tracking-tight text-center text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground font-medium">
          Securely access your wealth portfolio
        </CardDescription>
      </CardHeader>

      <div className="px-8 pb-4 relative z-10">
        <Button
          type="button"
          variant="outline"
          className="w-full font-semibold h-11 bg-background hover:bg-muted/50 border-border/50 text-foreground transition-all duration-300"
          onClick={loginWithGoogle}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2 text-primary" />
          ) : (
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          )}
          Continue with Google
        </Button>
      </div>

      <div className="relative px-8 py-2 z-10 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center px-8">
          <div className="w-full border-t border-border/60"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-muted-foreground font-semibold tracking-widest text-[10px] uppercase">
            Or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <CardContent className="space-y-5 px-8 pt-4">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20 text-center font-medium">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50 h-11 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50 h-11 border-border/50 focus:border-primary/50 transition-colors"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-5 px-8 pb-8 pt-4">
          <Button
            type="submit"
            className="w-full h-11 font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)]"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isLoading ? "Authenticating..." : "Sign In"}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
              Initialize Portfolio
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
