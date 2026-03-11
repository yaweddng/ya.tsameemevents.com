import React from 'react';

export const WidgetManager = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-brand">Widget Manager</h3>
          <p className="text-gray-400">Manage and configure your standard website widgets.</p>
        </div>
        <button className="bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all">
          Add New Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for widget list */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all">
          <h4 className="font-bold mb-2">Hero Section</h4>
          <p className="text-xs text-gray-500 mb-4">Standard hero banner with title and CTA.</p>
          <div className="flex justify-end gap-2">
            <button className="p-2 text-gray-400 hover:text-brand transition-colors"><Layout size={16} /></button>
            <button className="p-2 text-gray-400 hover:text-brand transition-colors"><Settings size={16} /></button>
          </div>
        </div>
      </div>

      <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl flex items-center justify-center text-gray-500 italic">
        Widget List Placeholder
      </div>
    </div>
  );
};

import { Layout, Settings } from 'lucide-react';
