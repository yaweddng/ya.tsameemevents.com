import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Save, 
  Globe, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Settings, 
  Type, 
  FileText,
  Sparkles,
  Image as ImageIcon, 
  Square, 
  Layout, 
  Columns, 
  MousePointer2,
  Eye,
  Code,
  Layers,
  Palette,
  ArrowLeft
} from 'lucide-react';
import { VisualLayout, VisualSection, VisualColumn, VisualComponent, Page } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';

interface VisualEditorProps {
  pageId: string;
  type?: 'page' | 'blog';
  onClose: () => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({ pageId, type = 'page', onClose }) => {
  const [page, setPage] = useState<Page | null>(null);
  const [layout, setLayout] = useState<VisualLayout>({ sections: [] });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'components' | 'structure' | 'properties'>('components');
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/page/${pageId}?type=${type}`);
      if (res.ok) {
        const data = await res.json();
        setPage(data);
        if (data.visualLayout) {
          setLayout(data.visualLayout);
        } else {
          // Initialize with an empty section if no layout exists
          setLayout({ sections: [] });
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  const handleSave = async (publish = false) => {
    if (!page) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/page/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({
          pageId: page.id,
          visualLayout: layout,
          type
        })
      });

      if (res.ok && publish) {
        await fetch('/api/page/publish', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ya-admin-secret'
          },
          body: JSON.stringify({
            pageId: page.id,
            publish: true
          })
        });
      }
      
      if (res.ok) {
        alert(publish ? 'Page published successfully!' : 'Page saved successfully!');
      }
    } catch (error) {
      console.error('Error saving page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = () => {
    const newSection: VisualSection = {
      id: `section-${Date.now()}`,
      columns: [
        {
          id: `column-${Date.now()}`,
          width: '100%',
          components: []
        }
      ],
      style: {
        paddingTop: '80px',
        paddingBottom: '80px',
        background: '#0a0a0a'
      }
    };
    setLayout({ ...layout, sections: [...(layout.sections || []), newSection] });
  };

  const addComponent = (sectionId: string, columnId: string, type: string) => {
    const newComponent: VisualComponent = {
      id: `comp-${Date.now()}`,
      type: type as any,
      content: type === 'heading' ? 'New Heading' : type === 'text' ? 'New text content...' : '',
      style: {},
      settings: {}
    };

    const newSections = (layout.sections || []).map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          columns: s.columns.map(c => {
            if (c.id === columnId) {
              return { ...c, components: [...c.components, newComponent] };
            }
            return c;
          })
        };
      }
      return s;
    });

    setLayout({ ...layout, sections: newSections });
    setSelectedId(newComponent.id);
    setActivePanel('properties');
  };

  const removeComponent = (id: string) => {
    const newSections = (layout.sections || []).map(s => ({
      ...s,
      columns: s.columns.map(c => ({
        ...c,
        components: c.components.filter(comp => comp.id !== id)
      }))
    }));
    setLayout({ ...layout, sections: newSections });
    setSelectedId(null);
  };

  const updateComponent = (id: string, updates: Partial<VisualComponent>) => {
    const newSections = (layout.sections || []).map(s => ({
      ...s,
      columns: s.columns.map(c => ({
        ...c,
        components: c.components.map(comp => comp.id === id ? { ...comp, ...updates } : comp)
      }))
    }));
    setLayout({ ...layout, sections: newSections });
  };

  const findComponent = (id: string): VisualComponent | null => {
    for (const s of (layout.sections || [])) {
      for (const c of s.columns) {
        const comp = c.components.find(cp => cp.id === id);
        if (comp) return comp;
      }
    }
    return null;
  };

  const selectedComponent = selectedId ? findComponent(selectedId) : null;

  const componentTypes = [
    { type: 'heading', label: 'Heading', icon: Type },
    { type: 'text', label: 'Text Block', icon: FileText },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'button', label: 'Button', icon: MousePointer2 },
    { type: 'form', label: 'Contact Form', icon: Square },
    { type: 'cta_block', label: 'CTA Block', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-dark flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-dark/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <h1 className="font-bold text-sm">{page?.title || 'Loading...'}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Visual Editor</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button 
              onClick={() => setPreviewMode(false)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${!previewMode ? 'bg-brand text-dark' : 'text-gray-400 hover:text-white'}`}
            >
              <Code size={14} /> Edit
            </button>
            <button 
              onClick={() => setPreviewMode(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${previewMode ? 'bg-brand text-dark' : 'text-gray-400 hover:text-white'}`}
            >
              <Eye size={14} /> Preview
            </button>
          </div>

          <div className="h-6 w-px bg-white/10" />

          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-brand text-dark rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50"
          >
            <Globe size={18} /> {isSaving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!previewMode && (
          <div className="w-72 border-r border-white/10 flex flex-col bg-dark/50">
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setActivePanel('components')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activePanel === 'components' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-white'}`}
              >
                Components
              </button>
              <button 
                onClick={() => setActivePanel('structure')}
                className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${activePanel === 'structure' ? 'border-brand text-brand' : 'border-transparent text-gray-500 hover:text-white'}`}
              >
                Structure
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {activePanel === 'components' && (
                <div className="grid grid-cols-2 gap-3">
                  {componentTypes.map((comp) => (
                    <button
                      key={comp.type}
                      onClick={() => {
                        if ((layout.sections || []).length === 0) {
                          addSection();
                          return;
                        }
                        const lastSection = (layout.sections || [])[(layout.sections || []).length - 1];
                        const lastColumn = lastSection.columns[0];
                        addComponent(lastSection.id, lastColumn.id, comp.type);
                      }}
                      className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-brand/30 rounded-2xl transition-all group"
                    >
                      <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand group-hover:scale-110 transition-transform">
                        <comp.icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-white">{comp.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {activePanel === 'structure' && (
                <div className="space-y-2">
                  {(layout.sections || []).map((section, sIdx) => (
                    <div key={section.id} className="space-y-1">
                      <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold uppercase text-gray-400">Section {sIdx + 1}</span>
                        <button 
                          onClick={() => {
                            const newSections = (layout.sections || []).filter(s => s.id !== section.id);
                            setLayout({ ...layout, sections: newSections });
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      {section.columns.map((column, cIdx) => (
                        <div key={column.id} className="ml-4 space-y-1">
                          <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Column {cIdx + 1}</span>
                          </div>
                          {column.components.map((comp) => (
                            <button
                              key={comp.id}
                              onClick={() => {
                                setSelectedId(comp.id);
                                setActivePanel('properties');
                              }}
                              className={`w-full ml-4 p-2 text-left rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-between ${selectedId === comp.id ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                              <span>{comp.type}</span>
                              <Trash2 size={10} onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }} />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}
                  <button 
                    onClick={addSection}
                    className="w-full py-3 border border-dashed border-white/20 rounded-xl text-[10px] font-bold uppercase text-gray-500 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Add Section
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Canvas */}
        <div className={`flex-1 overflow-y-auto bg-[#151515] relative ${previewMode ? 'p-0' : 'p-12'}`}>
          <div className={`mx-auto bg-dark shadow-2xl transition-all ${previewMode ? 'w-full min-h-full' : 'max-w-5xl min-h-[800px] rounded-3xl overflow-hidden border border-white/5'}`}>
            {(layout.sections || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[600px] text-center p-12">
                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-gray-600 mb-6">
                  <Layout size={40} />
                </div>
                <h2 className="text-xl font-bold text-gray-400">Your Canvas is Empty</h2>
                <p className="text-gray-500 mt-2 max-w-xs">Start by adding a section or dragging components from the sidebar.</p>
                <button 
                  onClick={addSection}
                  className="mt-8 px-8 py-3 bg-brand text-dark rounded-xl font-bold hover:shadow-lg hover:shadow-brand/20 transition-all"
                >
                  Add Your First Section
                </button>
              </div>
            ) : (
              <div className="visual-layout">
                {(layout.sections || []).map((section) => (
                  <section 
                    key={section.id} 
                    style={{ 
                      ...section.style,
                      paddingTop: section.style?.paddingTop || '80px',
                      paddingBottom: section.style?.paddingBottom || '80px'
                    }}
                    className={`relative group/section ${!previewMode ? 'hover:outline hover:outline-2 hover:outline-brand/30' : ''}`}
                  >
                    {!previewMode && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover/section:opacity-100 transition-opacity flex gap-2 z-10">
                        <button onClick={() => {
                          const newSections = (layout.sections || []).filter(s => s.id !== section.id);
                          setLayout({ ...layout, sections: newSections });
                        }} className="p-2 bg-red-500 text-white rounded-lg shadow-lg"><Trash2 size={14} /></button>
                      </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="flex flex-wrap -mx-4">
                        {(section.columns || []).map((column) => (
                          <div 
                            key={column.id} 
                            className="px-4 relative group/column min-h-[50px]" 
                            style={{ 
                              width: column.width || '100%',
                              ...column.style
                            }}
                          >
                            {(column.components || []).map((comp) => (
                              <div 
                                key={comp.id}
                                onClick={(e) => {
                                  if (previewMode) return;
                                  e.stopPropagation();
                                  setSelectedId(comp.id);
                                  setActivePanel('properties');
                                }}
                                className={`relative group/comp transition-all ${!previewMode ? 'cursor-pointer hover:outline hover:outline-2 hover:outline-brand' : ''} ${selectedId === comp.id && !previewMode ? 'outline outline-2 outline-brand ring-4 ring-brand/10' : ''}`}
                              >
                                {!previewMode && selectedId === comp.id && (
                                  <div className="absolute -top-10 left-0 bg-brand text-dark px-3 py-1 rounded-t-lg text-[10px] font-bold uppercase flex items-center gap-2 z-20">
                                    <span>{comp.type}</span>
                                    <button onClick={(e) => { e.stopPropagation(); removeComponent(comp.id); }} className="hover:text-red-700"><Trash2 size={12} /></button>
                                  </div>
                                )}

                                {comp.type === 'heading' && <h2 style={comp.style} className={comp.className}>{comp.content}</h2>}
                                {comp.type === 'text' && <div style={comp.style} className={`markdown-body prose prose-invert max-w-none ${comp.className || ''}`}><Markdown>{comp.content}</Markdown></div>}
                                {comp.type === 'image' && <img src={comp.content || 'https://picsum.photos/seed/placeholder/800/400'} alt="" style={comp.style} className={`w-full h-auto rounded-xl ${comp.className || ''}`} referrerPolicy="no-referrer" />}
                                {comp.type === 'button' && (
                                  <div className="py-4">
                                    <button style={comp.style} className={`px-8 py-3 rounded-full font-bold bg-brand text-dark ${comp.className || ''}`}>
                                      {comp.content || 'Button Text'}
                                    </button>
                                  </div>
                                )}
                                {comp.type === 'form' && (
                                  <div className={`p-8 bg-white/5 rounded-3xl border border-white/10 text-center ${comp.className || ''}`}>
                                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand mx-auto mb-4">
                                      <Square size={24} />
                                    </div>
                                    <h4 className="font-bold">Contact Form Widget</h4>
                                    <p className="text-sm text-gray-500 mt-1">Form ID: {comp.settings?.formId || 'Default'}</p>
                                  </div>
                                )}
                                {comp.type === 'cta_block' && (
                                  <div style={comp.style} className={`p-12 rounded-[2.5rem] text-center bg-brand/5 border border-brand/10 ${comp.className || ''}`}>
                                    <h3 className="text-3xl font-bold mb-4">{comp.content?.title || 'Ready to Start?'}</h3>
                                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">{comp.content?.subtitle || 'Join hundreds of luxury event planners today.'}</p>
                                    <button className="bg-brand text-dark px-10 py-4 rounded-full font-bold hover:shadow-xl transition-all">
                                      {comp.content?.buttonText || 'Get Started Now'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {!previewMode && (
                              <button 
                                onClick={() => addComponent(section.id, column.id, 'text')}
                                className="w-full py-4 mt-2 border border-dashed border-white/10 rounded-xl text-[10px] font-bold uppercase text-gray-600 hover:border-brand/50 hover:text-brand transition-all opacity-0 group-hover/column:opacity-100"
                              >
                                <Plus size={14} className="mx-auto" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        {!previewMode && (
          <div className="w-80 border-l border-white/10 flex flex-col bg-dark/50">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand">Properties</h3>
              {selectedId && (
                <button onClick={() => setSelectedId(null)} className="text-gray-500 hover:text-white">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {selectedComponent ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Content</h4>
                    
                    {selectedComponent.type === 'cta_block' ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-400 uppercase">Title</label>
                          <input 
                            value={selectedComponent.content?.title || ''} 
                            onChange={(e) => updateComponent(selectedId!, { content: { ...selectedComponent.content, title: e.target.value } })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-400 uppercase">Subtitle</label>
                          <textarea 
                            value={selectedComponent.content?.subtitle || ''} 
                            onChange={(e) => updateComponent(selectedId!, { content: { ...selectedComponent.content, subtitle: e.target.value } })}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] text-gray-400 uppercase">Button Text</label>
                          <input 
                            value={selectedComponent.content?.buttonText || ''} 
                            onChange={(e) => updateComponent(selectedId!, { content: { ...selectedComponent.content, buttonText: e.target.value } })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 uppercase">{selectedComponent.type === 'image' ? 'Image URL' : 'Text Content'}</label>
                        {selectedComponent.type === 'text' ? (
                          <textarea 
                            value={selectedComponent.content as string} 
                            onChange={(e) => updateComponent(selectedId!, { content: e.target.value })}
                            rows={6}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand font-mono"
                          />
                        ) : (
                          <input 
                            value={selectedComponent.content as string} 
                            onChange={(e) => updateComponent(selectedId!, { content: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Style</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 uppercase">Color</label>
                        <input 
                          type="color"
                          value={selectedComponent.style?.color || '#ffffff'} 
                          onChange={(e) => updateComponent(selectedId!, { style: { ...selectedComponent.style, color: e.target.value } })}
                          className="w-full h-10 bg-white/5 border border-white/10 rounded-xl outline-none cursor-pointer"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-gray-400 uppercase">Font Size</label>
                        <input 
                          value={selectedComponent.style?.font_size || ''} 
                          onChange={(e) => updateComponent(selectedId!, { style: { ...selectedComponent.style, font_size: e.target.value } })}
                          placeholder="24px"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase">Alignment</label>
                      <div className="flex bg-white/5 rounded-xl p-1">
                        {['left', 'center', 'right'].map((align) => (
                          <button
                            key={align}
                            onClick={() => updateComponent(selectedId!, { style: { ...selectedComponent.style, alignment: align } })}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${selectedComponent.style?.alignment === align ? 'bg-brand text-dark' : 'text-gray-500 hover:text-white'}`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-gray-400 uppercase">Custom Classes</label>
                      <input 
                        value={selectedComponent.className || ''} 
                        onChange={(e) => updateComponent(selectedId!, { className: e.target.value })}
                        placeholder="e.glass-card text-gradient-brand"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <button 
                      onClick={() => removeComponent(selectedId!)}
                      className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Delete Component
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-600">
                  <MousePointer2 size={32} className="mb-4 opacity-20" />
                  <p className="text-xs">Select a component on the canvas to edit its properties.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
