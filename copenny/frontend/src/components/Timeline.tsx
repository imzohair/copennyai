import React from 'react';

export const Timeline: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto px-gutter-desktop py-space-lg relative">
      <div className="max-w-4xl mx-auto space-y-space-lg pb-space-3xl">
        
        {/* Feed Control & Timeline Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md pb-space-md border-b border-surface-container-high">
          
          {/* Left: Chronological Range Selectors */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-DEFAULT border border-surface-container-high">
            <button className="px-space-sm py-1 rounded-DEFAULT text-body-sm font-medium bg-[#121212] text-primary border border-primary/30 shadow-sm transition-all">Today</button>
            <button className="px-space-sm py-1 rounded-DEFAULT text-body-sm text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors">This Week</button>
            <button className="px-space-sm py-1 rounded-DEFAULT text-body-sm text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors">May 2024</button>
            <button className="px-space-sm py-1 rounded-DEFAULT text-body-sm text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1">
              <span>Custom Range</span>
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            </button>
          </div>
          
          {/* Right: Category Tag Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-label-caps font-label-caps text-outline uppercase tracking-wider mr-1">Filter by:</span>
            <button className="px-2.5 py-1 text-label-caps font-label-caps uppercase rounded-DEFAULT bg-primary/15 text-primary border border-primary/30 font-semibold tracking-wider">All</button>
            <button className="px-2.5 py-1 text-label-caps font-label-caps uppercase rounded-DEFAULT bg-surface-container text-outline hover:text-on-surface border border-surface-container-high hover:border-outline/40 transition-colors">Insights</button>
            <button className="px-2.5 py-1 text-label-caps font-label-caps uppercase rounded-DEFAULT bg-surface-container text-outline hover:text-on-surface border border-surface-container-high hover:border-outline/40 transition-colors">Actions</button>
            <button className="px-2.5 py-1 text-label-caps font-label-caps uppercase rounded-DEFAULT bg-surface-container text-outline hover:text-on-surface border border-surface-container-high hover:border-outline/40 transition-colors">Transactions</button>
            <button className="px-2.5 py-1 text-label-caps font-label-caps uppercase rounded-DEFAULT bg-surface-container text-outline hover:text-on-surface border border-surface-container-high hover:border-outline/40 transition-colors">Goals</button>
          </div>
        </div>

        {/* Vertical Timeline Feed Spine Wrapper */}
        <div className="relative pl-8 md:pl-10 space-y-space-lg">
          
          {/* Continuous Vertical Spine Guideline */}
          <div className="absolute left-3 md:left-4 top-2 bottom-6 w-px bg-surface-container-high"></div>
          
          {/* EVENT CARD 1: INSIGHT CARD */}
          <div className="relative group">
            
            {/* Spine Node Indicator */}
            <div className="absolute -left-8 md:-left-10 top-5 w-6 h-6 rounded-full bg-[#121212] border-2 border-primary flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
            </div>
            
            {/* Card Body */}
            <div className="bg-[#181818] border border-white/5 hover:border-primary/30 rounded-DEFAULT p-space-lg transition-all duration-200 shadow-sm hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
              
              {/* Header Row */}
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="px-2 py-0.5 rounded-DEFAULT text-label-caps font-label-caps uppercase bg-primary/10 text-primary border border-primary/25 tracking-widest">INSIGHT</span>
                  <span className="text-body-sm text-outline tabular-nums">Today, 2:15 PM</span>
                </div>
                <button className="text-outline hover:text-on-surface transition-colors" title="Bookmark">
                  <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                </button>
              </div>
              
              {/* Main Statement */}
              <p className="text-body-lg text-on-surface font-normal leading-relaxed mb-space-md">
                Your dining out spending is <span className="text-primary font-semibold">28% higher</span> than last month. You've spent <span className="tabular-nums font-semibold text-white">₹34,200</span> on restaurants so far in May, compared to <span className="tabular-nums font-medium text-outline">₹26,800</span> in April.
              </p>
              
              {/* Micro Comparison Chart */}
              <div className="bg-[#141414] border border-[#2a2a2a] p-space-md rounded-DEFAULT mb-space-md">
                <div className="flex items-center justify-between text-label-caps font-label-caps text-outline uppercase tracking-wider mb-2">
                  <span>Spend Delta Breakdown</span>
                  <span className="text-primary tabular-nums font-semibold">+ ₹7,400.00 Over Baseline</span>
                </div>
                
                {/* Dual comparison bars */}
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-body-sm text-outline mb-1 tabular-nums">
                      <span>April Total</span>
                      <span>₹26,800.00</span>
                    </div>
                    <div className="w-full bg-[#201f1f] h-2 rounded-DEFAULT overflow-hidden">
                      <div className="bg-outline/50 h-full rounded-DEFAULT" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-body-sm text-white mb-1 tabular-nums font-medium">
                      <span>May (Current)</span>
                      <span className="text-primary">₹34,200.00</span>
                    </div>
                    <div className="w-full bg-[#201f1f] h-2 rounded-DEFAULT overflow-hidden">
                      <div className="bg-primary h-full rounded-DEFAULT" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interactive 'Why?' Expand Section */}
              <details className="group/why">
                <summary className="inline-flex items-center gap-1.5 text-body-sm font-medium text-primary hover:text-white cursor-pointer select-none transition-colors">
                  <span className="material-symbols-outlined text-[16px] transition-transform group-open/why:rotate-90">arrow_right</span>
                  <span>Why? Analytical Reasoning</span>
                </summary>
                <div className="mt-space-sm p-space-sm bg-[#1e1e1e] border-l-2 border-primary wire-border text-body-md text-on-surface-variant leading-relaxed">
                  3 dinners at <strong className="text-white">L'Arpège</strong> and <strong className="text-white">Nobu</strong> accounted for 64% of this delta. Your typical weekday lunch spend remains steady at ₹1,800/day.
                </div>
              </details>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
};
