import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-4">
            <span className="font-bold text-primary text-xl tracking-tighter">CP</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-primary uppercase leading-tight">Copenny</h1>
          <p className="text-muted-foreground text-sm mt-2 text-center uppercase tracking-widest font-medium text-[10px]">
            Sovereign Family Office
          </p>
        </div>
        
        {children}
      </div>
    </div>
  );
}
