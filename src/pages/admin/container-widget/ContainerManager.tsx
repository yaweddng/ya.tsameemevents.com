import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Layout, Columns, AlignLeft, AlignCenter, AlignRight, ArrowRight, ArrowDown } from 'lucide-react';
import { Container, ContainerSlot, Widget, StandardWidget } from '../../../types';

export const ContainerManager = () => {
  const [containers, setContainers] = React.useState<Container[]>([]);
  const [standardWidgets, setStandardWidgets] = React.useState<StandardWidget[]>([]);
  const [proItems, setProItems] = React.useState<any[]>([]);
  const [editingContainer, setEditingContainer] = React.useState<Container | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cRes, sRes, pRes] = await Promise.all([
        fetch('/api/containers'),
        fetch('/api/standard-widgets'),
        fetch('/api/widget-pro')
      ]);
      setContainers(await cRes.json());
      setStandardWidgets(await sRes.json());
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

  const handleSave = async (container: Container) => {
    const newContainers = containers.some(c => c.id === container.id)
      ? containers.map(c => c.id === container.id ? container : c)
      : [...containers, container];

    try {
      const res = await fetch('/api/containers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ containers: newContainers })
      });
      if (res.ok) {
        setContainers(newContainers);
        setEditingContainer(null);
      }
    } catch (e) {
      console.error('Failed to save container:', e);
    }
  };

  const startNew = () => {
    setEditingContainer({
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Container',
      slug: 'container-' + Date.now(),
      layout: 'split-50-50',
      direction: 'row',
      alignment: 'center',
      slots: [
        { id: 'slot-1', name: 'Left Box', width: '50%', widgets: [] },
        { id: 'slot-2', name: 'Right Box', width: '50%', widgets: [] }
      ],
      widgets: [], // Compatibility
      weight: containers.length
    });
  };

  const updateLayout = (layout: Container['layout']) => {
    if (!editingContainer) return;
    let slots: ContainerSlot[] = [];
    switch (layout) {
      case 'split-50-50':
        slots = [
          { id: 'slot-1', name: 'Box 1', width: '50%', widgets: [] },
          { id: 'slot-2', name: 'Box 2', width: '50%', widgets: [] }
        ];
        break;
      case 'split-30-70':
        slots = [
          { id: 'slot-1', name: 'Sidebar', width: '30%', widgets: [] },
          { id: 'slot-2', name: 'Main Content', width: '70%', widgets: [] }
        ];
        break;
      case 'flex':
        slots = [{ id: 'slot-1', name: 'Main Slot', width: '100%', widgets: [] }];
        break;
      // Add more as needed
    }
    setEditingContainer({ ...editingContainer, layout, slots });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand">Containers & Layouts</h2>
          <p className="text-gray-400">Create complex section layouts with multiple slots and widgets.</p>
        </div>
        <button 
          onClick={startNew}
          className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Create Container
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {containers.map((container) => (
            <div key={container.id} className="bg-lighter-dark p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{container.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded font-bold uppercase">{container.layout.replace('-', ' ')}</span>
                    <span className="text-xs text-gray-500 font-mono">[{container.slug}]</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingContainer(container)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2 h-12 bg-dark/50 rounded-xl p-1 border border-white/5">
                {container.slots.map((slot, idx) => (
                  <div 
                    key={idx} 
                    style={{ width: slot.width }} 
                    className="h-full bg-white/5 rounded-lg flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase"
                  >
                    {slot.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editingContainer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" onClick={() => setEditingContainer(null)} />
          <div className="relative w-full max-w-5xl bg-lighter-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand">Container Layout Editor</h3>
              <button onClick={() => setEditingContainer(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Container Name</label>
                  <input
                    value={editingContainer.name}
                    onChange={(e) => setEditingContainer({ ...editingContainer, name: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                  <input
                    value={editingContainer.slug || ''}
                    onChange={(e) => setEditingContainer({ ...editingContainer, slug: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Layout Template</label>
                  <select
                    value={editingContainer.layout}
                    onChange={(e) => updateLayout(e.target.value as any)}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  >
                    <option value="split-50-50">Split 50/50</option>
                    <option value="split-30-70">Split 30/70</option>
                    <option value="split-70-30">Split 70/30</option>
                    <option value="flex">Single Column (Full Width)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase">Direction & Alignment</label>
                  <div className="flex gap-4">
                    <div className="flex-grow space-y-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingContainer({ ...editingContainer, direction: 'row' })}
                          className={`flex-grow p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${editingContainer.direction === 'row' ? 'bg-brand border-brand text-dark' : 'bg-dark border-white/10 text-gray-400'}`}
                        >
                          <ArrowRight size={16} /> Row
                        </button>
                        <button 
                          onClick={() => setEditingContainer({ ...editingContainer, direction: 'column' })}
                          className={`flex-grow p-3 rounded-xl border transition-all flex items-center justify-center gap-2 ${editingContainer.direction === 'column' ? 'bg-brand border-brand text-dark' : 'bg-dark border-white/10 text-gray-400'}`}
                        >
                          <ArrowDown size={16} /> Column
                        </button>
                      </div>
                    </div>
                    <div className="flex-grow space-y-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setEditingContainer({ ...editingContainer, alignment: 'start' })}
                          className={`p-3 rounded-xl border transition-all ${editingContainer.alignment === 'start' ? 'bg-brand border-brand text-dark' : 'bg-dark border-white/10 text-gray-400'}`}
                        >
                          <AlignLeft size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingContainer({ ...editingContainer, alignment: 'center' })}
                          className={`p-3 rounded-xl border transition-all ${editingContainer.alignment === 'center' ? 'bg-brand border-brand text-dark' : 'bg-dark border-white/10 text-gray-400'}`}
                        >
                          <AlignCenter size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingContainer({ ...editingContainer, alignment: 'end' })}
                          className={`p-3 rounded-xl border transition-all ${editingContainer.alignment === 'end' ? 'bg-brand border-brand text-dark' : 'bg-dark border-white/10 text-gray-400'}`}
                        >
                          <AlignRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest">Configure Slots</h4>
                <div className="flex flex-col md:flex-row gap-6">
                  {editingContainer.slots.map((slot, sIdx) => (
                    <div key={slot.id} style={{ width: slot.width }} className="bg-dark/50 p-6 rounded-3xl border border-white/5 flex flex-col min-h-[300px]">
                      <div className="flex justify-between items-center mb-6">
                        <input
                          value={slot.name}
                          onChange={(e) => {
                            const newSlots = [...editingContainer.slots];
                            newSlots[sIdx].name = e.target.value;
                            setEditingContainer({ ...editingContainer, slots: newSlots });
                          }}
                          className="bg-transparent border-b border-white/10 font-bold text-brand outline-none focus:border-brand"
                        />
                        <span className="text-[10px] font-mono text-gray-500">{slot.width}</span>
                      </div>

                      <div className="flex-grow space-y-3">
                        {slot.widgets.map((widget, wIdx) => (
                          <div key={wIdx} className="bg-lighter-dark p-3 rounded-xl border border-white/5 flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-white">{widget.type.toUpperCase()}</span>
                              <span className="text-[10px] text-gray-500">{widget.config.name || widget.id}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const newSlots = [...editingContainer.slots];
                                newSlots[sIdx].widgets = newSlots[sIdx].widgets.filter((_, i) => i !== wIdx);
                                setEditingContainer({ ...editingContainer, slots: newSlots });
                              }}
                              className="text-gray-500 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <div className="relative group/add">
                          <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-gray-600 hover:border-brand/30 hover:text-brand transition-all">
                            <Plus size={20} />
                          </button>
                          <div className="absolute left-0 bottom-full mb-2 w-64 bg-dark border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/add:opacity-100 group-hover/add:visible transition-all z-20 max-h-60 overflow-y-auto">
                            <div className="p-2 border-b border-white/5 text-[10px] font-bold uppercase text-gray-500 bg-white/5">Standard Widgets</div>
                            {standardWidgets.map(sw => (
                              <button
                                key={sw.id}
                                onClick={() => {
                                  const newSlots = [...editingContainer.slots];
                                  newSlots[sIdx].widgets.push({
                                    id: Math.random().toString(36).substr(2, 9),
                                    type: 'standard',
                                    config: { standardWidgetId: sw.id, name: sw.name },
                                    weight: newSlots[sIdx].widgets.length
                                  });
                                  setEditingContainer({ ...editingContainer, slots: newSlots });
                                }}
                                className="w-full text-left px-4 py-2 text-xs hover:bg-brand hover:text-dark transition-all border-b border-white/5"
                              >
                                {sw.name}
                              </button>
                            ))}
                            <div className="p-2 border-b border-white/5 text-[10px] font-bold uppercase text-gray-500 bg-white/5">Pro Items</div>
                            {proItems.map(pi => (
                              <button
                                key={pi.id}
                                onClick={() => {
                                  const newSlots = [...editingContainer.slots];
                                  newSlots[sIdx].widgets.push({
                                    id: Math.random().toString(36).substr(2, 9),
                                    type: 'pro',
                                    config: { proItemId: pi.id, name: pi.name },
                                    weight: newSlots[sIdx].widgets.length
                                  });
                                  setEditingContainer({ ...editingContainer, slots: newSlots });
                                }}
                                className="w-full text-left px-4 py-2 text-xs hover:bg-brand hover:text-dark transition-all border-b border-white/5 last:border-0"
                              >
                                <div className="font-bold">{pi.name}</div>
                                <div className="text-[10px] opacity-60">{pi.type}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-dark/50">
              <button onClick={() => setEditingContainer(null)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button 
                onClick={() => handleSave(editingContainer)}
                className="flex items-center gap-2 bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save Container
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
