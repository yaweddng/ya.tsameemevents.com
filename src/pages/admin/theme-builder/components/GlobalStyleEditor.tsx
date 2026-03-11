import React from 'react';
import { Palette, Type, MousePointer2, Layout } from 'lucide-react';

interface GlobalStyleEditorProps {
  config: any;
  onChange: (config: any) => void;
}

export const GlobalStyleEditor: React.FC<GlobalStyleEditorProps> = ({ config, onChange }) => {
  const colors = config.colors || {
    primary: '#00C896',
    secondary: '#0B0F14',
    accent: '#F27D26',
    background: '#0B0F14',
    text: '#FFFFFF'
  };

  const typography = config.typography || {
    headings: 'Inter',
    body: 'Inter',
    script: 'Germania One'
  };

  const buttons = config.buttons || {
    radius: '12px',
    padding: '12px 24px'
  };

  return (
    <div className="space-y-8">
      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2 text-brand">
          <Palette size={20} /> Global Color Palette
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(colors).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider capitalize">{key} Color</label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={value as string}
                  onChange={(e) => onChange({
                    ...config,
                    colors: { ...colors, [key]: e.target.value }
                  })}
                  className="w-12 h-12 bg-transparent border-none cursor-pointer"
                />
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => onChange({
                    ...config,
                    colors: { ...colors, [key]: e.target.value }
                  })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand font-mono text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <h3 className="text-lg font-bold flex items-center gap-2 text-brand">
          <Type size={20} /> Global Typography
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(typography).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider capitalize">{key} Font Family</label>
              <select
                value={value as string}
                onChange={(e) => onChange({
                  ...config,
                  typography: { ...typography, [key]: e.target.value }
                })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand appearance-none"
              >
                <option value="Inter">Inter (Sans-serif)</option>
                <option value="Germania One">Germania One (Script)</option>
                <option value="Playfair Display">Playfair Display (Serif)</option>
                <option value="Space Grotesk">Space Grotesk (Modern)</option>
                <option value="JetBrains Mono">JetBrains Mono (Mono)</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <h3 className="text-lg font-bold flex items-center gap-2 text-brand">
          <MousePointer2 size={20} /> Button Styles
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Border Radius</label>
            <input
              value={buttons.radius}
              onChange={(e) => onChange({
                ...config,
                buttons: { ...buttons, radius: e.target.value }
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
              placeholder="e.g. 12px"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Padding</label>
            <input
              value={buttons.padding}
              onChange={(e) => onChange({
                ...config,
                buttons: { ...buttons, padding: e.target.value }
              })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
              placeholder="e.g. 12px 24px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
