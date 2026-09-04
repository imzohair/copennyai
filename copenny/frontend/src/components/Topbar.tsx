import React from 'react';

export const Topbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-gutter-desktop h-16 border-b border-surface-container-high w-full bg-surface shrink-0 z-20">
      {/* Breadcrumb & Brand Identity */}
      <div className="flex items-center gap-space-md min-w-[280px]">
        <span className="text-title-md font-title-md font-bold text-on-surface tracking-tight">Copenny Command Center</span>
        <span className="text-outline/40 font-light">/</span>
        <div className="flex items-center gap-1.5 text-body-md text-primary font-medium">
          <span className="material-symbols-outlined text-[18px]">timeline</span>
          <span>Financial Timeline</span>
        </div>
      </div>

      {/* Search Command Input */}
      <div className="flex-1 max-w-2xl px-space-lg">
        <div className="relative flex items-center group">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px] group-focus-within:text-secondary transition-colors">search</span>
          <input 
            className="w-full bg-[#181818] text-body-md text-on-surface placeholder:text-outline/60 pl-10 pr-20 py-2 rounded-DEFAULT border border-surface-container-high focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/40 transition-all font-body-md" 
            placeholder="Ask Copenny anything... e.g., 'How can I save $500 this month?'" 
            type="text"
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-outline hover:text-on-surface cursor-pointer p-0.5">mic</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-label-caps bg-surface-container text-outline border border-surface-container-high rounded-DEFAULT">⌘K</kbd>
          </div>
        </div>
      </div>

      {/* Right Utility Actions & Profile */}
      <div className="flex items-center gap-space-md justify-end">
        {/* Quick Stats Telemetry */}
        <div className="hidden xl:flex items-center gap-space-lg px-space-sm border-r border-surface-container-high">
          <div className="text-right">
            <div className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Monthly Burn</div>
            <div className="text-body-md font-title-md text-on-surface tabular-nums font-medium">$4,820<span className="text-outline text-body-sm font-normal">/mo</span></div>
          </div>
          <div className="text-right">
            <div className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Savings Rate</div>
            <div className="text-body-md font-title-md text-secondary tabular-nums font-semibold flex items-center justify-end gap-0.5">
              <span>42%</span>
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
            </div>
          </div>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors rounded-DEFAULT hover:bg-surface-container" title="Notifications">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
        </button>

        {/* VIP Portfolio Director Profile */}
        <div className="flex items-center gap-2.5 pl-space-xs border-l border-surface-container-high/60 cursor-pointer group">
          <div className="relative">
            <img 
              className="w-8 h-8 rounded-DEFAULT object-cover border border-primary/40 group-hover:border-primary transition-colors" 
              alt="Lord Harrington Profile" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfmgi2jz64UTY6-XIk4OHKruX9tJN3uRxgxlftZAn5_2NUzBdT8PDbkOVbVPAzD5PiNW-csP_P6n6vZVPRa1OdAD3yGr0rNqylJ0hetKKwvP3-pEq2kr2sneEVbqqTbHekXOdBnZLC4ofoYsqronu6CSPVJLLp2GTS2ZbrWd1eUqbNgneiHq_2EXZfllv6rKVkN0cRnUEGu1JWAXM17MPVFhJHoojSTAIKyLNE5xgdgNV-2QYy6gtz"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-secondary border-2 border-surface rounded-full"></span>
          </div>
          <div className="hidden 2xl:flex flex-col text-left">
            <span className="text-title-md font-title-md text-on-surface leading-none group-hover:text-primary transition-colors">Lord Harrington</span>
            <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider mt-0.5">VIP Portfolio Director</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-on-surface">expand_more</span>
        </div>
      </div>
    </header>
  );
};
