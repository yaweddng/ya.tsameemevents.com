import React from 'react';
import { X, Save, Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, Type, MousePointer2, Layout, FormInput, List, RefreshCw } from 'lucide-react';
import { WidgetItemPro, WidgetItemProType } from '../../../../types';

interface WidgetProEditorProps {
  item: WidgetItemPro;
  onSave: (item: WidgetItemPro, closeOnSave?: boolean) => void;
  onClose: () => void;
}

export const WidgetProEditor: React.FC<WidgetProEditorProps> = ({ item, onSave, onClose }) => {
  const [editedItem, setEditedItem] = React.useState<WidgetItemPro>({ ...item });

  const updateConfig = (newConfig: any) => {
    setEditedItem({
      ...editedItem,
      config: { ...editedItem.config, ...newConfig }
    });
  };

  const renderBadgeTitleEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Badge Text</label>
        <input
          value={editedItem.config.text || ''}
          onChange={(e) => updateConfig({ text: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Background Color</label>
          <input
            type="color"
            value={editedItem.config.bgColor || '#F27D26'}
            onChange={(e) => updateConfig({ bgColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Text Color</label>
          <input
            type="color"
            value={editedItem.config.textColor || '#141414'}
            onChange={(e) => updateConfig({ textColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderAdvancedTitleEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Text Part 1 (Normal)</label>
        <input
          value={editedItem.config.text1 || ''}
          onChange={(e) => updateConfig({ text1: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Highlight Text</label>
        <input
          value={editedItem.config.highlightText || ''}
          onChange={(e) => updateConfig({ highlightText: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Text Part 2 (Normal)</label>
        <input
          value={editedItem.config.text2 || ''}
          onChange={(e) => updateConfig({ text2: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Text Color</label>
          <input
            type="color"
            value={editedItem.config.textColor || '#FFFFFF'}
            onChange={(e) => updateConfig({ textColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Highlight Color</label>
          <input
            type="color"
            value={editedItem.config.highlightColor || '#F27D26'}
            onChange={(e) => updateConfig({ highlightColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );

  const renderCTAButtonEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Button Style</label>
          <select
            value={editedItem.config.style || 'solid'}
            onChange={(e) => updateConfig({ style: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="solid">Solid</option>
            <option value="transparent">Transparent</option>
            <option value="glassmorphism">Glassmorphism</option>
            <option value="border">Border</option>
            <option value="inline">Inline</option>
            <option value="floating">Floating</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Button Text</label>
          <input
            value={editedItem.config.text || ''}
            onChange={(e) => updateConfig({ text: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">URL / Slug</label>
        <input
          value={editedItem.config.url || ''}
          onChange={(e) => updateConfig({ url: e.target.value })}
          placeholder="/services or https://..."
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>

      {editedItem.config.style === 'advanced' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Left Icon</label>
            <input
              value={editedItem.config.icon1 || ''}
              onChange={(e) => updateConfig({ icon1: e.target.value })}
              placeholder="ArrowRight"
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Middle Text</label>
            <input
              value={editedItem.config.text || ''}
              onChange={(e) => updateConfig({ text: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Right Icon</label>
            <input
              value={editedItem.config.icon2 || ''}
              onChange={(e) => updateConfig({ icon2: e.target.value })}
              placeholder="ChevronRight"
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">BG Color</label>
          <input
            type="color"
            value={editedItem.config.bgColor || '#F27D26'}
            onChange={(e) => updateConfig({ bgColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Text Color</label>
          <input
            type="color"
            value={editedItem.config.textColor || '#141414'}
            onChange={(e) => updateConfig({ textColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Icon Color</label>
          <input
            type="color"
            value={editedItem.config.iconColor || '#141414'}
            onChange={(e) => updateConfig({ iconColor: e.target.value })}
            className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Desktop Position</label>
          <select
            value={editedItem.config.desktopPosition || 'center'}
            onChange={(e) => updateConfig({ desktopPosition: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Mobile Position</label>
          <select
            value={editedItem.config.mobilePosition || 'left'}
            onChange={(e) => updateConfig({ mobilePosition: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {editedItem.config.style === 'floating' && (
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Floating Position</label>
          <select
            value={editedItem.config.floatingPosition || 'bottom-left'}
            onChange={(e) => updateConfig({ floatingPosition: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="bottom-left">Bottom Left</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="bottom-center">Bottom Center</option>
            <option value="top-left">Top Left</option>
            <option value="top-right">Top Right</option>
            <option value="top-center">Top Center</option>
          </select>
        </div>
      )}
    </div>
  );

  const renderSubheadingEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Subheading Text</label>
        <input
          value={editedItem.config.text || ''}
          onChange={(e) => updateConfig({ text: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Text Color</label>
        <input
          type="color"
          value={editedItem.config.textColor || '#8E9299'}
          onChange={(e) => updateConfig({ textColor: e.target.value })}
          className="w-full h-12 bg-dark border border-white/10 rounded-xl px-2 py-1 outline-none cursor-pointer"
        />
      </div>
    </div>
  );

  const renderCarouselEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Carousel Style</label>
          <select
            value={editedItem.config.style || 'slider'}
            onChange={(e) => updateConfig({ style: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="slider">Slider (Promo Style)</option>
            <option value="infinity">Infinity (Testimonials Style)</option>
            <option value="trigger">Trigger (Icon Style)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Autoplay Interval (ms)</label>
          <input
            type="number"
            value={editedItem.config.interval || 5000}
            onChange={(e) => updateConfig({ interval: parseInt(e.target.value) })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          />
        </div>
      </div>

      {editedItem.config.style === 'trigger' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Trigger Icon (Lucide)</label>
            <input
              value={editedItem.config.triggerIcon || 'Play'}
              onChange={(e) => updateConfig({ triggerIcon: e.target.value })}
              placeholder="Play, Info, etc."
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Trigger Icon Position</label>
            <select
              value={editedItem.config.triggerIconPosition || 'bottom-center'}
              onChange={(e) => updateConfig({ triggerIconPosition: e.target.value })}
              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
            >
              <option value="top-left">Top Left</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
            </select>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="responsiveSize"
          checked={editedItem.config.responsiveSize || false}
          onChange={(e) => updateConfig({ responsiveSize: e.target.checked })}
          className="w-4 h-4 rounded border-white/10 bg-dark text-brand focus:ring-brand"
        />
        <label htmlFor="responsiveSize" className="text-xs font-bold text-gray-400 uppercase cursor-pointer">
          Responsive Item Size (Follow content size)
        </label>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-400 uppercase">Carousel Items</label>
          <button 
            onClick={() => {
              const items = editedItem.config.items || [];
              updateConfig({ items: [...items, { id: Math.random().toString(), title: 'New Item', image: '', url: '' }] });
            }}
            className="text-brand flex items-center gap-1 text-xs font-bold"
          >
            <Plus size={14} /> Add Item
          </button>
        </div>
        <div className="space-y-3">
          {(editedItem.config.items || []).map((cItem: any, idx: number) => (
            <div key={cItem.id} className="bg-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Item #{idx + 1}</span>
                <button 
                  onClick={() => {
                    const items = editedItem.config.items.filter((_: any, i: number) => i !== idx);
                    updateConfig({ items });
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Title"
                  value={cItem.title}
                  onChange={(e) => {
                    const items = [...editedItem.config.items];
                    items[idx].title = e.target.value;
                    updateConfig({ items });
                  }}
                  className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  placeholder="URL / Slug"
                  value={cItem.url}
                  onChange={(e) => {
                    const items = [...editedItem.config.items];
                    items[idx].url = e.target.value;
                    updateConfig({ items });
                  }}
                  className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
              <input
                placeholder="Image URL"
                value={cItem.image}
                onChange={(e) => {
                  const items = [...editedItem.config.items];
                  items[idx].image = e.target.value;
                  updateConfig({ items });
                }}
                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFormEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Form URL / Slug</label>
        <input
          value={editedItem.config.formUrl || ''}
          onChange={(e) => updateConfig({ formUrl: e.target.value })}
          placeholder="e.g. contact-form"
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Position</label>
        <select
          value={editedItem.config.position || 'center'}
          onChange={(e) => updateConfig({ position: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  const renderIconListEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Layout</label>
          <select
            value={editedItem.config.layout || 'horizontal'}
            onChange={(e) => updateConfig({ layout: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Position</label>
          <select
            value={editedItem.config.position || 'center'}
            onChange={(e) => updateConfig({ position: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="showExtra"
            checked={editedItem.config.showExtra || false}
            onChange={(e) => updateConfig({ showExtra: e.target.checked })}
            className="w-4 h-4 rounded border-white/10 bg-dark text-brand focus:ring-brand"
          />
          <label htmlFor="showExtra" className="text-xs font-bold text-gray-400 uppercase cursor-pointer">
            Add Extra Content (Title, Subtitle, CTA)
          </label>
        </div>

        {editedItem.config.showExtra && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Title</label>
                <input
                  value={editedItem.config.extraTitle || ''}
                  onChange={(e) => updateConfig({ extraTitle: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Subtitle</label>
                <input
                  value={editedItem.config.extraSubtitle || ''}
                  onChange={(e) => updateConfig({ extraSubtitle: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">CTA Text</label>
                <input
                  value={editedItem.config.extraCtaText || ''}
                  onChange={(e) => updateConfig({ extraCtaText: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">CTA URL</label>
                <input
                  value={editedItem.config.extraCtaUrl || ''}
                  onChange={(e) => updateConfig({ extraCtaUrl: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Content Position</label>
              <select
                value={editedItem.config.extraPosition || 'top'}
                onChange={(e) => updateConfig({ extraPosition: e.target.value })}
                className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-400 uppercase">Icons</label>
          <button 
            onClick={() => {
              const icons = editedItem.config.icons || [];
              updateConfig({ icons: [...icons, { id: Math.random().toString(), icon: 'Facebook', url: '', slug: '' }] });
            }}
            className="text-brand flex items-center gap-1 text-xs font-bold"
          >
            <Plus size={14} /> Add Icon
          </button>
        </div>
        <div className="space-y-3">
          {(editedItem.config.icons || []).map((icon: any, idx: number) => (
            <div key={icon.id} className="bg-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500">Icon #{idx + 1}</span>
                <button 
                  onClick={() => {
                    const icons = editedItem.config.icons.filter((_: any, i: number) => i !== idx);
                    updateConfig({ icons });
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Icon Name (Lucide)"
                  value={icon.icon}
                  onChange={(e) => {
                    const icons = [...editedItem.config.icons];
                    icons[idx].icon = e.target.value;
                    updateConfig({ icons });
                  }}
                  className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                />
                <input
                  placeholder="URL / Slug"
                  value={icon.url}
                  onChange={(e) => {
                    const icons = [...editedItem.config.icons];
                    icons[idx].url = e.target.value;
                    updateConfig({ icons });
                  }}
                  className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const updateAdvancedStyling = (newStyling: any) => {
    setEditedItem({
      ...editedItem,
      advancedStyling: { ...editedItem.advancedStyling, ...newStyling }
    });
  };

  const renderAdvancedStylingEditor = () => (
    <div className="space-y-6 pt-6 border-t border-white/5">
      <h4 className="text-sm font-bold text-brand uppercase tracking-widest">Advanced Styling</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Font Family</label>
          <input
            value={editedItem.advancedStyling?.fontFamily || ''}
            onChange={(e) => updateAdvancedStyling({ fontFamily: e.target.value })}
            placeholder="Inter, serif..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Font Size</label>
          <input
            value={editedItem.advancedStyling?.fontSize || ''}
            onChange={(e) => updateAdvancedStyling({ fontSize: e.target.value })}
            placeholder="16px, 2rem..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Font Weight</label>
          <input
            value={editedItem.advancedStyling?.fontWeight || ''}
            onChange={(e) => updateAdvancedStyling({ fontWeight: e.target.value })}
            placeholder="400, 700..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Height</label>
          <input
            value={editedItem.advancedStyling?.height || ''}
            onChange={(e) => updateAdvancedStyling({ height: e.target.value })}
            placeholder="auto, 500px..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Padding</label>
          <input
            value={editedItem.advancedStyling?.padding || ''}
            onChange={(e) => updateAdvancedStyling({ padding: e.target.value })}
            placeholder="20px, 1rem 2rem..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Margin</label>
          <input
            value={editedItem.advancedStyling?.margin || ''}
            onChange={(e) => updateAdvancedStyling({ margin: e.target.value })}
            placeholder="0 auto, 10px..."
            className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-gray-400 uppercase">Custom CSS Code</label>
        <textarea
          value={editedItem.customCss || ''}
          onChange={(e) => setEditedItem({ ...editedItem, customCss: e.target.value })}
          placeholder=".widget { color: red; }"
          rows={4}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  const renderCustomCodeEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Code Type</label>
        <select
          value={editedItem.config.codeType || 'html'}
          onChange={(e) => updateConfig({ codeType: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        >
          <option value="html">HTML / Full Code</option>
          <option value="shortcode">Shortcode</option>
          <option value="url">URL / External Link</option>
          <option value="slug">Slug (Internal Reference)</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Content / Value</label>
        <textarea
          value={editedItem.config.code || ''}
          onChange={(e) => updateConfig({ code: e.target.value })}
          rows={10}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  const renderMapEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Map Embed URL / Iframe Code</label>
        <textarea
          value={editedItem.config.mapCode || ''}
          onChange={(e) => updateConfig({ mapCode: e.target.value })}
          rows={4}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  const renderImageEditor = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
        <input
          value={editedItem.config.imageUrl || ''}
          onChange={(e) => updateConfig({ imageUrl: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Alt Text</label>
        <input
          value={editedItem.config.alt || ''}
          onChange={(e) => updateConfig({ alt: e.target.value })}
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  const renderFAQEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-400 uppercase">FAQ Items</label>
        <button 
          onClick={() => {
            const items = editedItem.config.items || [];
            updateConfig({ items: [...items, { id: Math.random().toString(), question: 'New Question', answer: '' }] });
          }}
          className="text-brand flex items-center gap-1 text-xs font-bold"
        >
          <Plus size={14} /> Add FAQ
        </button>
      </div>
      <div className="space-y-4">
        {(editedItem.config.items || []).map((faq: any, idx: number) => (
          <div key={faq.id} className="bg-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">FAQ #{idx + 1}</span>
              <button 
                onClick={() => {
                  const items = editedItem.config.items.filter((_: any, i: number) => i !== idx);
                  updateConfig({ items });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => {
                const items = [...editedItem.config.items];
                items[idx].question = e.target.value;
                updateConfig({ items });
              }}
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => {
                const items = [...editedItem.config.items];
                items[idx].answer = e.target.value;
                updateConfig({ items });
              }}
              rows={3}
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabsEditor = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-gray-400 uppercase">Tab Items</label>
        <button 
          onClick={() => {
            const items = editedItem.config.items || [];
            updateConfig({ items: [...items, { id: Math.random().toString(), label: 'New Tab', content: '' }] });
          }}
          className="text-brand flex items-center gap-1 text-xs font-bold"
        >
          <Plus size={14} /> Add Tab
        </button>
      </div>
      <div className="space-y-4">
        {(editedItem.config.items || []).map((tab: any, idx: number) => (
          <div key={tab.id} className="bg-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">Tab #{idx + 1}</span>
              <button 
                onClick={() => {
                  const items = editedItem.config.items.filter((_: any, i: number) => i !== idx);
                  updateConfig({ items });
                }}
                className="text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <input
              placeholder="Tab Label"
              value={tab.label}
              onChange={(e) => {
                const items = [...editedItem.config.items];
                items[idx].label = e.target.value;
                updateConfig({ items });
              }}
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />
            <textarea
              placeholder="Tab Content (HTML supported)"
              value={tab.content}
              onChange={(e) => {
                const items = [...editedItem.config.items];
                items[idx].content = e.target.value;
                updateConfig({ items });
              }}
              rows={3}
              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderToggleEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Option 1 Label</label>
          <input
            value={editedItem.config.label1 || 'Monthly'}
            onChange={(e) => updateConfig({ label1: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">Option 2 Label</label>
          <input
            value={editedItem.config.label2 || 'Yearly'}
            onChange={(e) => updateConfig({ label2: e.target.value })}
            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase">Toggle Action (Slug/URL)</label>
        <input
          value={editedItem.config.action || ''}
          onChange={(e) => updateConfig({ action: e.target.value })}
          placeholder="e.g. pricing-toggle"
          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
        />
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (editedItem.type) {
      case 'badge_title': return renderBadgeTitleEditor();
      case 'advanced_title': return renderAdvancedTitleEditor();
      case 'cta_button': return renderCTAButtonEditor();
      case 'subheading': return renderSubheadingEditor();
      case 'carousel': return renderCarouselEditor();
      case 'form': return renderFormEditor();
      case 'icon_list': return renderIconListEditor();
      case 'custom_code': return renderCustomCodeEditor();
      case 'map': return renderMapEditor();
      case 'image': return renderImageEditor();
      case 'faq': return renderFAQEditor();
      case 'tabs': return renderTabsEditor();
      case 'toggle': return renderToggleEditor();
      default: return <div className="text-gray-500 italic">Editor for {editedItem.type} coming soon...</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-lighter-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <div>
            <h3 className="text-xl font-bold text-brand">Edit Widget Item</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">{editedItem.type.replace('_', ' ')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 max-h-[75vh] overflow-y-auto">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Item Name (Internal)</label>
                <input
                  value={editedItem.name}
                  onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Slug / Shortcode</label>
                <input
                  value={editedItem.slug || ''}
                  onChange={(e) => setEditedItem({ ...editedItem, slug: e.target.value })}
                  placeholder="e.g. hero-button-1"
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Status</label>
                <select
                  value={editedItem.status}
                  onChange={(e) => setEditedItem({ ...editedItem, status: e.target.value as any })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                <select
                  value={editedItem.category}
                  onChange={(e) => setEditedItem({ ...editedItem, category: e.target.value as any })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                >
                  <option value="pro">Pro (All)</option>
                  <option value="general">General</option>
                  <option value="forms">Forms</option>
                  <option value="email">Email</option>
                  <option value="pdf">PDF</option>
                  <option value="cta">CTA</option>
                  <option value="tabs">Tabs</option>
                  <option value="toggle">Toggle</option>
                  <option value="cards">Cards</option>
                  <option value="faq">FAQ</option>
                  <option value="college">College</option>
                </select>
              </div>
            </div>

            <div className="bg-dark/30 p-6 rounded-2xl border border-white/5">
              <h4 className="text-sm font-bold text-brand uppercase tracking-widest mb-6">Content Configuration</h4>
              {renderEditor()}
            </div>

            {renderAdvancedStylingEditor()}
          </div>
        </div>

        <div className="p-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-dark/50">
          <button onClick={onClose} className="w-full sm:w-auto px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all">
            Cancel
          </button>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={() => onSave(editedItem, false)}
              className="flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-2 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              <RefreshCw size={18} /> Save & Continue
            </button>
            <button 
              onClick={() => onSave(editedItem, true)}
              className="flex items-center justify-center gap-2 bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              <Save size={20} /> Save & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
