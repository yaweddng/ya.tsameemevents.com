import React from 'react';
import { 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Star, 
  DollarSign, 
  MousePointer2, 
  Palette, 
  Plus, 
  Trash2, 
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize,
  Minimize
} from 'lucide-react';

interface CardBuilderProps {
  config: any;
  onChange: (config: any) => void;
}

export const CardBuilder: React.FC<CardBuilderProps> = ({ config, onChange }) => {
  const elements = config.elements || [
    { id: 'image', type: 'image', label: 'Featured Image', visible: true, order: 0 },
    { id: 'badge', type: 'badge', label: 'Category Badge', visible: true, order: 1 },
    { id: 'title', type: 'title', label: 'Post Title', visible: true, order: 2 },
    { id: 'rating', type: 'rating', label: 'Rating Stars', visible: true, order: 3 },
    { id: 'price', type: 'price', label: 'Price Tag', visible: true, order: 4 },
    { id: 'excerpt', type: 'excerpt', label: 'Short Description', visible: true, order: 5 },
    { id: 'cta', type: 'cta', label: 'Action Button', visible: true, order: 6 },
  ];

  const styles = config.styles || {
    borderRadius: '24px',
    padding: '24px',
    gap: '16px',
    shadow: 'shadow-xl',
    border: 'border-white/5',
    bg: 'bg-white/5',
    textAlign: 'left'
  };

  const updateElement = (id: string, updates: any) => {
    const newElements = elements.map((el: any) => el.id === id ? { ...el, ...updates } : el);
    onChange({ ...config, elements: newElements });
  };

  const updateStyle = (updates: any) => {
    onChange({ ...config, styles: { ...styles, ...updates } });
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    const idx = elements.findIndex((el: any) => el.id === id);
    if (direction === 'up' && idx > 0) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      newElements.forEach((el, i) => el.order = i);
      onChange({ ...config, elements: newElements });
    } else if (direction === 'down' && idx < elements.length - 1) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      newElements.forEach((el, i) => el.order = i);
      onChange({ ...config, elements: newElements });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Card Elements & Order</h3>
          <div className="space-y-2">
            {elements.sort((a: any, b: any) => a.order - b.order).map((el: any) => (
              <div key={el.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveElement(el.id, 'up')} className="p-1 hover:text-brand transition-colors"><Move size={14} className="rotate-0" /></button>
                  <button onClick={() => moveElement(el.id, 'down')} className="p-1 hover:text-brand transition-colors"><Move size={14} className="rotate-180" /></button>
                </div>
                <div className="flex-1">
                  <span className="text-sm font-bold">{el.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateElement(el.id, { visible: !el.visible })}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      el.visible ? 'bg-brand/20 text-brand' : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {el.visible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-white/10">
          <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Global Card Styles</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Border Radius</label>
              <input 
                value={styles.borderRadius}
                onChange={(e) => updateStyle({ borderRadius: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                placeholder="24px"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Padding</label>
              <input 
                value={styles.padding}
                onChange={(e) => updateStyle({ padding: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                placeholder="24px"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Alignment</label>
              <div className="flex gap-2">
                {[
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                ].map((align) => (
                  <button
                    key={align.id}
                    onClick={() => updateStyle({ textAlign: align.id })}
                    className={`flex-1 p-2 rounded-xl transition-all ${
                      styles.textAlign === align.id ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    <align.icon size={16} className="mx-auto" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Shadow</label>
              <select
                value={styles.shadow}
                onChange={(e) => updateStyle({ shadow: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand appearance-none"
              >
                <option value="shadow-none">None</option>
                <option value="shadow-sm">Small</option>
                <option value="shadow-md">Medium</option>
                <option value="shadow-lg">Large</option>
                <option value="shadow-xl">Extra Large</option>
                <option value="shadow-2xl">2X Large</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-brand uppercase tracking-wider">Live Preview</h3>
        <div className="p-12 bg-dark/50 rounded-[32px] border border-white/5 flex items-center justify-center min-h-[500px]">
          <div 
            className={`w-full max-w-[350px] overflow-hidden transition-all duration-300 ${styles.bg} ${styles.border} ${styles.shadow}`}
            style={{ 
              borderRadius: styles.borderRadius,
              padding: styles.padding,
              textAlign: styles.textAlign as any,
              display: 'flex',
              flexDirection: 'column',
              gap: styles.gap
            }}
          >
            {elements
              .filter((el: any) => el.visible)
              .sort((a: any, b: any) => a.order - b.order)
              .map((el: any) => {
                switch (el.type) {
                  case 'image':
                    return (
                      <div key={el.id} className="aspect-[4/3] bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                        <ImageIcon size={40} className="text-white/20" />
                      </div>
                    );
                  case 'badge':
                    return (
                      <div key={el.id} className="flex">
                        <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider rounded-full">Category</span>
                      </div>
                    );
                  case 'title':
                    return (
                      <h4 key={el.id} className="text-xl font-bold leading-tight">Sample Post Title</h4>
                    );
                  case 'rating':
                    return (
                      <div key={el.id} className="flex gap-1 text-brand">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                      </div>
                    );
                  case 'price':
                    return (
                      <div key={el.id} className="text-2xl font-bold text-brand">AED 1,500</div>
                    );
                  case 'excerpt':
                    return (
                      <p key={el.id} className="text-gray-400 text-sm line-clamp-2">This is a sample description for your custom post type card preview.</p>
                    );
                  case 'cta':
                    return (
                      <button key={el.id} className="w-full bg-brand text-dark py-3 rounded-xl font-bold text-sm mt-2">View Details</button>
                    );
                  default:
                    return null;
                }
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
