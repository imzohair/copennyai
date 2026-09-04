import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  return (
    <aside className="docked left-0 top-0 h-screen w-sidebar-width transition-all duration-300 bg-surface-container-low border-r border-surface-container-high flex flex-col justify-between p-space-md shrink-0 z-30 select-none">
      {/* Top Monogram & Header */}
      <div>
        <div className="flex items-center gap-space-sm pb-space-lg mb-space-sm border-b border-surface-container-high/60">
          <div className="w-10 h-10 rounded-DEFAULT bg-surface-container border border-primary/30 flex items-center justify-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
            <span className="font-headline-sm text-primary tracking-tighter">CP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-title-md font-title-md tracking-wider text-primary uppercase leading-tight">Copenny</span>
            <span className="text-label-caps font-label-caps text-outline tracking-wider uppercase">Family Office &amp; Wealth</span>
          </div>
        </div>

        {/* Quick Action CTA */}
        <button onClick={() => alert('Quick transaction feature is coming soon!')} className="w-full mb-space-lg py-space-xs px-space-sm bg-primary-container text-surface-container-lowest font-title-md rounded-DEFAULT flex items-center justify-between hover:bg-primary transition-colors duration-150 active:scale-[0.98]">
          <span className="font-body-md font-medium text-surface-container-lowest">Quick Transaction</span>
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
        </button>

        {/* Navigation Rail */}
        <nav className="space-y-1">
          <div className="text-[10px] font-label-caps tracking-widest text-outline uppercase px-space-xs mb-space-2xs">Core Modules</div>
          
          <NavLink to="/" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-title-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">timeline</span>
            <span className="flex-1">Financial Timeline</span>
            <span className="px-1.5 py-0.5 rounded-DEFAULT text-[10px] bg-primary/15 text-primary border border-primary/20 tabular-nums">LIVE</span>
          </NavLink>
          
          <NavLink to="/filter" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-body-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">tune</span>
            <span className="flex-1">Filter</span>
          </NavLink>
          
          <NavLink to="/goals" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-body-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">flag</span>
            <span className="flex-1">Goals</span>
            <span className="px-1.5 py-0.5 rounded-DEFAULT text-[10px] bg-surface-container-high text-outline tabular-nums">4</span>
          </NavLink>
          
          <NavLink to="/investments" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-body-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">trending_up</span>
            <span className="flex-1">Investments</span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          </NavLink>
          
          <NavLink to="/reports" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-body-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            <span className="flex-1">Reports</span>
          </NavLink>
          
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-space-sm px-space-sm py-space-xs rounded-DEFAULT font-body-md transition-colors duration-150 active:scale-[0.98] ${isActive ? 'text-primary bg-surface-container border-l-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.08)]' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span className="flex-1">Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* Sidebar Bottom Anchors */}
      <div className="pt-space-md border-t border-surface-container-high/60 space-y-space-sm">
        <div className="p-space-sm rounded-DEFAULT bg-surface-container border border-surface-container-high hover:border-primary/30 transition-all duration-150 cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider">Total Net Worth</span>
            <span className="material-symbols-outlined text-[14px] text-primary">lock</span>
          </div>
          <div className="font-headline-sm text-white font-semibold tabular-nums tracking-tight">₹24,80,500<span className="text-secondary text-body-sm font-normal ml-1">.00</span></div>
          <div className="mt-1 flex items-center justify-between text-body-sm text-outline">
            <span>Tier: Sovereign Prime</span>
            <span className="text-secondary text-body-sm tabular-nums flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">north_east</span>+3.4%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between px-space-xs py-space-2xs text-body-sm text-outline">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
            <span className="text-label-caps font-label-caps uppercase">System Status: All Encrypted</span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
        </div>

        <button className="w-full flex items-center justify-between px-space-xs py-space-2xs text-on-surface-variant hover:text-primary transition-colors duration-150 font-body-md text-left">
          <span className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_left</span>
            <span>Collapse</span>
          </span>
          <span className="text-label-caps font-label-caps text-outline">v2.4.1</span>
        </button>
      </div>
    </aside>
  );
};
