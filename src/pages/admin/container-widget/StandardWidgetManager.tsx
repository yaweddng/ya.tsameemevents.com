import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, GripVertical, Settings } from 'lucide-react';
import { WidgetItemPro, StandardWidget } from '../../../types';

export const StandardWidgetManager = () => {
  const [widgets, setWidgets] = React.useState<StandardWidget[]>([]);
  const [proItems, setProItems] = React.useState<WidgetItemPro[]>([]);
  const [editingWidget, setEditingWidget] = React.useState<StandardWidget | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [wRes, pRes] = await Promise.all([
        fetch('/api/standard-widgets'),
        fetch('/api/widget-pro')
      ]);
      setWidgets(await wRes.json());
      setProItems(await pRes.json());
    } catch (e) {
      console.error('Failed to fetch data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (widget: StandardWidget) => {
    const newWidgets = widgets.some(w => w.id === widget.id)
      ? widgets.map(w => w.id === widget.id ? widget : w)
      : [...widgets, widget];

    try {
      const res = await fetch('/api/standard-widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ widgets: newWidgets })
      });
      if (res.ok) {
        setWidgets(newWidgets);
        setEditingWidget(null);
      }
    } catch (e) {
      console.error('Failed to save widget:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this standard widget?')) return;
    const newWidgets = widgets.filter(w => w.id !== id);
    try {
      await fetch('/api/standard-widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ widgets: newWidgets })
      });
      setWidgets(newWidgets);
    } catch (e) {
      console.error('Failed to delete widget:', e);
    }
  };

  const startNew = () => {
    setEditingWidget({
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Standard Widget',
      slug: 'new-widget-' + Date.now(),
      items: [],
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand">Standard Widgets</h2>
          <p className="text-gray-400">Combine multiple Pro items into a single reusable widget.</p>
        </div>
        <button 
          onClick={startNew}
          className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Create New
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgets.map((widget) => (
            <div key={widget.id} className="bg-lighter-dark p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{widget.name}</h3>
                  <p className="text-xs text-gray-500 font-mono mt-1">[{widget.slug}]</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingWidget(widget)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(widget.id)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contains {widget.items.length} items</div>
                <div className="flex flex-wrap gap-2">
                  {widget.items.slice(0, 3).map((item, idx) => {
                    const proItem = proItems.find(p => p.id === item.itemId);
                    return (
                      <span key={idx} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">
                        {proItem?.name || 'Unknown'}
                      </span>
                    );
                  })}
                  {widget.items.length > 3 && (
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400">+{widget.items.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingWidget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" onClick={() => setEditingWidget(null)} />
          <div className="relative w-full max-w-4xl bg-lighter-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand">Standard Widget Editor</h3>
              <button onClick={() => setEditingWidget(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Widget Name</label>
                  <input
                    value={editingWidget.name}
                    onChange={(e) => setEditingWidget({ ...editingWidget, name: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Slug / Shortcode</label>
                  <input
                    value={editingWidget.slug}
                    onChange={(e) => setEditingWidget({ ...editingWidget, slug: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest">Included Items</h4>
                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-lg text-xs font-bold hover:bg-brand hover:text-dark transition-all">
                      <Plus size={14} /> Add Pro Item
                    </button>
                    <div className="absolute right-0 mt-2 w-64 bg-dark border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 max-h-60 overflow-y-auto">
                      {proItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setEditingWidget({
                              ...editingWidget,
                              items: [...editingWidget.items, { itemId: item.id, weight: editingWidget.items.length }]
                            });
                          }}
                          className="w-full text-left px-4 py-3 text-xs hover:bg-brand hover:text-dark transition-all border-b border-white/5 last:border-0"
                        >
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[10px] opacity-60">{item.type}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {editingWidget.items.map((item, idx) => {
                    const proItem = proItems.find(p => p.id === item.itemId);
                    return (
                      <div key={idx} className="flex items-center gap-4 bg-dark/50 p-4 rounded-2xl border border-white/5">
                        <div className="cursor-grab text-gray-600">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-grow">
                          <div className="font-bold text-white">{proItem?.name || 'Unknown Item'}</div>
                          <div className="text-[10px] text-gray-500 uppercase">{proItem?.type}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all">
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => {
                              const newItems = editingWidget.items.filter((_, i) => i !== idx);
                              setEditingWidget({ ...editingWidget, items: newItems });
                            }}
                            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {editingWidget.items.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-gray-500 italic">
                      No items added yet. Click "Add Pro Item" to start building.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-dark/50">
              <button onClick={() => setEditingWidget(null)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button 
                onClick={() => handleSave(editingWidget)}
                className="flex items-center gap-2 bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save Widget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
