import React from 'react';
import { 
  Layout, 
  Menu, 
  Image as ImageIcon, 
  Type, 
  MousePointer2, 
  Columns, 
  Grid, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Monitor,
  Smartphone,
  Tablet,
  Plus,
  Trash2,
  Settings,
  Move,
  Database,
  FileText,
  Archive as ArchiveIcon,
  Star,
  DollarSign
} from 'lucide-react';

interface TemplateBuilderProps {
  type: string;
  config: any;
  onChange: (config: any) => void;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({ type, config, onChange }) => {
  const [activeDevice, setActiveDevice] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const renderHeaderConfig = () => (
    <div className="space-y-8">
      {/* Header Layout */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Header Layout</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'standard', label: 'Standard', icon: AlignLeft },
            { id: 'centered', label: 'Centered', icon: AlignCenter },
            { id: 'split', label: 'Split Menu', icon: Columns },
          ].map((layout) => (
            <button
              key={layout.id}
              onClick={() => onChange({ ...config, layout: layout.id })}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                config.layout === layout.id 
                  ? 'border-brand bg-brand/10 text-brand' 
                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
              }`}
            >
              <layout.icon size={24} />
              <span className="text-xs font-bold uppercase">{layout.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Header Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sticky Header</label>
          <div className="flex gap-4">
            {[true, false].map((val) => (
              <button
                key={val.toString()}
                onClick={() => onChange({ ...config, sticky: val })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${
                  config.sticky === val 
                    ? 'border-brand bg-brand/10 text-brand' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {val ? 'Enabled' : 'Disabled'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Transparent on Hero</label>
          <div className="flex gap-4">
            {[true, false].map((val) => (
              <button
                key={val.toString()}
                onClick={() => onChange({ ...config, transparent: val })}
                className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${
                  config.transparent === val 
                    ? 'border-brand bg-brand/10 text-brand' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {val ? 'Enabled' : 'Disabled'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Configuration */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Logo Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo Type</label>
            <div className="flex gap-4">
              {['text', 'image'].map((lType) => (
                <button
                  key={lType}
                  onClick={() => onChange({ ...config, logo: { ...config.logo, type: lType } })}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${
                    config.logo?.type === lType 
                      ? 'border-brand bg-brand/10 text-brand' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {lType === 'text' ? 'Text Logo' : 'Image Logo'}
                </button>
              ))}
            </div>
          </div>
          {config.logo?.type === 'image' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo Image URL</label>
              <input
                value={config.logo?.url || ''}
                onChange={(e) => onChange({ ...config, logo: { ...config.logo, url: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="https://..."
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo Text</label>
              <input
                value={config.logo?.text || ''}
                onChange={(e) => onChange({ ...config, logo: { ...config.logo, text: e.target.value } })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                placeholder="Site Name"
              />
            </div>
          )}
        </div>
      </div>

      {/* Menu Configuration */}
      <div className="space-y-4 pt-8 border-t border-white/10">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Menu Configuration</h3>
          <button 
            onClick={() => {
              const menu = config.menuItems || [];
              onChange({ ...config, menuItems: [...menu, { id: Math.random().toString(36).substr(2, 9), label: 'New Item', url: '#' }] });
            }}
            className="text-xs text-brand hover:underline flex items-center gap-1 font-bold uppercase"
          >
            <Plus size={14} /> Add Menu Item
          </button>
        </div>
        <div className="space-y-3">
          {(config.menuItems || []).map((item: any, idx: number) => (
            <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-center">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <input
                  value={item.label}
                  onChange={(e) => {
                    const newMenu = [...config.menuItems];
                    newMenu[idx].label = e.target.value;
                    onChange({ ...config, menuItems: newMenu });
                  }}
                  className="bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                  placeholder="Label"
                />
                <input
                  value={item.url}
                  onChange={(e) => {
                    const newMenu = [...config.menuItems];
                    newMenu[idx].url = e.target.value;
                    onChange({ ...config, menuItems: newMenu });
                  }}
                  className="bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                  placeholder="URL"
                />
              </div>
              <button 
                onClick={() => {
                  const newMenu = config.menuItems.filter((_: any, i: number) => i !== idx);
                  onChange({ ...config, menuItems: newMenu });
                }}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {(!config.menuItems || config.menuItems.length === 0) && (
            <p className="text-center text-gray-500 text-xs py-4 italic">No menu items added yet</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderFooterConfig = () => (
    <div className="space-y-8">
      {/* Footer Columns */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Footer Columns</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((cols) => (
            <button
              key={cols}
              onClick={() => onChange({ ...config, columns: cols })}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                config.columns === cols 
                  ? 'border-brand bg-brand/10 text-brand' 
                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
              }`}
            >
              <Grid size={24} />
              <span className="text-xs font-bold uppercase">{cols} Columns</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Copyright Text</label>
          <input
            value={config.copyright || ''}
            onChange={(e) => onChange({ ...config, copyright: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            placeholder="© 2026 Site Name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Background Color</label>
          <input
            type="color"
            value={config.bgColor || '#0B0F14'}
            onChange={(e) => onChange({ ...config, bgColor: e.target.value })}
            className="w-full h-12 bg-transparent border-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderSingleConfig = () => {
    const sections = config.sections || [
      { id: 'hero', type: 'hero', label: 'Hero Section', visible: true, order: 0 },
      { id: 'meta', type: 'meta', label: 'Metadata (Date, Author)', visible: true, order: 1 },
      { id: 'content', type: 'content', label: 'Content Area', visible: true, order: 2 },
      { id: 'gallery', type: 'gallery', label: 'Media Gallery', visible: true, order: 3 },
      { id: 'rating', type: 'rating', label: 'Reviews/Ratings', visible: true, order: 4 },
      { id: 'cta', type: 'cta', label: 'CTA Section', visible: true, order: 5 },
      { id: 'related', type: 'related', label: 'Related Content', visible: true, order: 6 },
    ];

    const moveSection = (id: string, direction: 'up' | 'down') => {
      const idx = sections.findIndex((s: any) => s.id === id);
      if (direction === 'up' && idx > 0) {
        const newSections = [...sections];
        [newSections[idx], newSections[idx - 1]] = [newSections[idx - 1], newSections[idx]];
        newSections.forEach((s, i) => s.order = i);
        onChange({ ...config, sections: newSections });
      } else if (direction === 'down' && idx < sections.length - 1) {
        const newSections = [...sections];
        [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
        newSections.forEach((s, i) => s.order = i);
        onChange({ ...config, sections: newSections });
      }
    };

    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Single Page Layout & Order</h3>
          <div className="space-y-2">
            {sections.sort((a: any, b: any) => a.order - b.order).map((section: any) => (
              <div key={section.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveSection(section.id, 'up')} className="p-1 hover:text-brand transition-colors"><Move size={14} /></button>
                  <button onClick={() => moveSection(section.id, 'down')} className="p-1 hover:text-brand transition-colors"><Move size={14} className="rotate-180" /></button>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold">{section.label}</span>
                </div>
                <button 
                  onClick={() => {
                    const newSections = sections.map((s: any) => s.id === section.id ? { ...s, visible: !s.visible } : s);
                    onChange({ ...config, sections: newSections });
                  }}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    section.visible ? 'bg-brand/20 text-brand' : 'bg-white/5 text-gray-500'
                  }`}
                >
                  {section.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderArchiveConfig = () => (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Archive Display Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Layout Style</label>
            <div className="flex gap-4">
              {['grid', 'list', 'masonry'].map((l) => (
                <button
                  key={l}
                  onClick={() => onChange({ ...config, layout: l })}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 capitalize ${
                    config.layout === l 
                      ? 'border-brand bg-brand/10 text-brand' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Columns</label>
            <input
              type="number"
              value={config.columns || 3}
              onChange={(e) => onChange({ ...config, columns: parseInt(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
              min="1"
              max="6"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenericConfig = () => (
    <div className="space-y-8">
      <div className="p-12 text-center glass-card rounded-[32px] border border-dashed border-white/10">
        <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
          <Layout size={40} />
        </div>
        <h3 className="text-2xl font-bold mb-2">Visual Page Builder Coming Soon</h3>
        <p className="text-gray-400 max-w-md mx-auto">
          We are currently integrating the visual builder for {type} templates. 
          You can manage basic settings and display rules for now.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Device Preview Toggle */}
      <div className="flex justify-center gap-4">
        {[
          { id: 'desktop', icon: Monitor },
          { id: 'tablet', icon: Tablet },
          { id: 'mobile', icon: Smartphone },
        ].map((device) => (
          <button
            key={device.id}
            onClick={() => setActiveDevice(device.id as any)}
            className={`p-3 rounded-xl transition-all ${
              activeDevice === device.id 
                ? 'bg-brand text-dark shadow-lg shadow-brand/20' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <device.icon size={20} />
          </button>
        ))}
      </div>

      <div className="glass-card p-8 rounded-[32px] border border-white/5">
        {type === 'header' && renderHeaderConfig()}
        {type === 'footer' && renderFooterConfig()}
        {type === 'single' && renderSingleConfig()}
        {type === 'archive' && renderArchiveConfig()}
        {type !== 'header' && type !== 'footer' && type !== 'single' && type !== 'archive' && renderGenericConfig()}
      </div>
    </div>
  );
};
