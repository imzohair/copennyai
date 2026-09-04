import React from 'react';

const PagePlaceholder: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <main className="flex-1 overflow-y-auto px-gutter-desktop py-space-3xl relative flex items-center justify-center">
    <div className="text-center space-y-space-md opacity-50">
      <span className="material-symbols-outlined text-[64px] text-primary">{icon}</span>
      <h2 className="text-display-hero-mobile font-display-hero-mobile text-on-surface">{title}</h2>
      <p className="text-body-lg text-outline">This module is under construction.</p>
    </div>
  </main>
);

export const Filter = () => <PagePlaceholder title="Filter" icon="tune" />;
export const Goals = () => <PagePlaceholder title="Goals" icon="flag" />;
export const Investments = () => <PagePlaceholder title="Investments" icon="trending_up" />;
export const Reports = () => <PagePlaceholder title="Reports" icon="analytics" />;
export const Settings = () => <PagePlaceholder title="Settings" icon="settings" />;
