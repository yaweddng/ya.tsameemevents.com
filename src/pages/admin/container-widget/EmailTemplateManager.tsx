import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Mail, Palette, Type, MousePointer2, Layout, Smartphone, Globe, Info, Share2, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { EmailTemplate } from '../../../types';

export const EmailTemplateManager = () => {
  const [templates, setTemplates] = React.useState<EmailTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = React.useState<EmailTemplate | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/email-templates');
      setTemplates(await res.json());
    } catch (e) {
      console.error('Failed to fetch email templates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (template: EmailTemplate) => {
    const newTemplates = templates.some(t => t.id === template.id)
      ? templates.map(t => t.id === template.id ? template : t)
      : [...templates, template];

    try {
      const res = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ templates: newTemplates })
      });
      if (res.ok) {
        setTemplates(newTemplates);
        setEditingTemplate(null);
      }
    } catch (e) {
      console.error('Failed to save email template:', e);
    }
  };

  const startNew = () => {
    setEditingTemplate({
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Email Template',
      slug: 'email-' + Date.now(),
      header: {
        bgColor: '#141414',
        textColor: '#F27D26',
        centerIcon: { text: 'YA', bgColor: '#F27D26', textColor: '#141414', show: true },
        contactInfo: {
          whatsapp: '+971 50 558 8842',
          email: 'info@ya.com',
          website: 'www.ya.com',
          show: true,
          color: '#F27D26'
        }
      },
      body: {
        bgColor: '#FFFFFF',
        textColor: '#141414',
        title: { part1: 'New', part2: 'Notification', color: '#141414' },
        subheading: { text: 'You have received a new update.', color: '#8E9299' },
        content: '',
        overlayIcon: { icon: 'Mail', opacity: 0.05, color: '#141414', show: true }
      },
      cta: {
        buttons: [
          { text: 'Click Here', url: '#', show: true, bgColor: '#F27D26', textColor: '#141414' }
        ]
      },
      footer: {
        bgColor: '#F5F5F5',
        textColor: '#8E9299',
        links: [
          { label: 'Facebook', url: '#', show: true, color: '#F27D26' },
          { label: 'Instagram', url: '#', show: true, color: '#F27D26' },
          { label: 'WhatsApp', url: '#', show: true, color: '#F27D26' }
        ],
        platformName: { text: 'YA Wedding', color: '#F27D26' },
        shortDescription: { text: 'Luxury Event Planning & Design', color: '#8E9299' },
        copyright: { text: '© 2026 Your Agency.', color: '#8E9299' }
      },
      advanced: {
        responsive: true
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand">Email Templates</h2>
          <p className="text-gray-400">Design and manage branding for all system emails.</p>
        </div>
        <button 
          onClick={startNew}
          className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Create Template
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-lighter-dark p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{template.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">[{template.slug}]</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingTemplate(template)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all">
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-dark/50 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Header BG</span>
                  <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: template.header.bgColor }} />
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                  <span>Body BG</span>
                  <div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: template.body.bgColor }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingTemplate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm" onClick={() => setEditingTemplate(null)} />
          <div className="relative w-full max-w-6xl bg-lighter-dark rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-brand">Email Template Designer</h3>
              <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Editor Side */}
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Template Name</label>
                      <input
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Slug / Shortcode</label>
                      <input
                        value={editingTemplate.slug}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, slug: e.target.value })}
                        className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                      />
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                      <Layout size={16} /> Header Branding
                    </h4>
                    <div className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Header BG</label>
                          <input type="color" value={editingTemplate.header.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, bgColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Header Text Color</label>
                          <input type="color" value={editingTemplate.header.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, textColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Text</label>
                          <input value={editingTemplate.header.centerIcon.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Icon BG</label>
                          <input type="color" value={editingTemplate.header.centerIcon.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, bgColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Color</label>
                          <input type="color" value={editingTemplate.header.centerIcon.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, textColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">WhatsApp</label>
                          <input value={editingTemplate.header.contactInfo.whatsapp} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, whatsapp: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Email</label>
                          <input value={editingTemplate.header.contactInfo.email} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, email: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Website</label>
                          <input value={editingTemplate.header.contactInfo.website} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, website: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Contact Info Color</label>
                        <input type="color" value={editingTemplate.header.contactInfo.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  {/* Body Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                      <Type size={16} /> Body Content
                    </h4>
                    <div className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Body BG</label>
                          <input type="color" value={editingTemplate.body.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, bgColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Body Text Color</label>
                          <input type="color" value={editingTemplate.body.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, textColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Title Part 1</label>
                          <input value={editingTemplate.body.title.part1} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, title: { ...editingTemplate.body.title, part1: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Title Part 2</label>
                          <input value={editingTemplate.body.title.part2} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, title: { ...editingTemplate.body.title, part2: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Title Color</label>
                        <input type="color" value={editingTemplate.body.title.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, title: { ...editingTemplate.body.title, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Subheading Text</label>
                          <input value={editingTemplate.body.subheading.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, subheading: { ...editingTemplate.body.subheading, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Subheading Color</label>
                          <input type="color" value={editingTemplate.body.subheading.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, subheading: { ...editingTemplate.body.subheading, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Overlay Icon</label>
                          <input value={editingTemplate.body.overlayIcon.icon} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, overlayIcon: { ...editingTemplate.body.overlayIcon, icon: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Opacity</label>
                          <input type="number" step="0.01" value={editingTemplate.body.overlayIcon.opacity} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, overlayIcon: { ...editingTemplate.body.overlayIcon, opacity: parseFloat(e.target.value) } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Color</label>
                          <input type="color" value={editingTemplate.body.overlayIcon.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, overlayIcon: { ...editingTemplate.body.overlayIcon, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                      <MousePointer2 size={16} /> Call to Action
                    </h4>
                    <div className="space-y-4">
                      {editingTemplate.cta.buttons.map((btn, idx) => (
                        <div key={idx} className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">Button {idx + 1}</span>
                            <button onClick={() => {
                              const newBtns = editingTemplate.cta.buttons.filter((_, i) => i !== idx);
                              setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: newBtns } });
                            }} className="text-red-400 hover:text-red-300"><Trash2 size={14} /></button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input placeholder="Text" value={btn.text} onChange={(e) => {
                              const newBtns = [...editingTemplate.cta.buttons];
                              newBtns[idx].text = e.target.value;
                              setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: newBtns } });
                            }} className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                            <input placeholder="URL" value={btn.url} onChange={(e) => {
                              const newBtns = [...editingTemplate.cta.buttons];
                              newBtns[idx].url = e.target.value;
                              setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: newBtns } });
                            }} className="bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase text-gray-500">BG Color</label>
                              <input type="color" value={btn.bgColor} onChange={(e) => {
                                const newBtns = [...editingTemplate.cta.buttons];
                                newBtns[idx].bgColor = e.target.value;
                                setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: newBtns } });
                              }} className="w-full h-8 bg-dark border border-white/10 rounded px-1 py-1 outline-none cursor-pointer" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[8px] uppercase text-gray-500">Text Color</label>
                              <input type="color" value={btn.textColor} onChange={(e) => {
                                const newBtns = [...editingTemplate.cta.buttons];
                                newBtns[idx].textColor = e.target.value;
                                setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: newBtns } });
                              }} className="w-full h-8 bg-dark border border-white/10 rounded px-1 py-1 outline-none cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button onClick={() => setEditingTemplate({ ...editingTemplate, cta: { ...editingTemplate.cta, buttons: [...editingTemplate.cta.buttons, { text: 'New Button', url: '#', show: true, bgColor: '#F27D26', textColor: '#141414' }] } })} className="w-full py-2 border border-dashed border-white/10 rounded-xl text-xs text-gray-400 hover:text-brand transition-all">+ Add Button</button>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                      <Share2 size={16} /> Footer Branding
                    </h4>
                    <div className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Footer BG</label>
                          <input type="color" value={editingTemplate.footer.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, bgColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Footer Text Color</label>
                          <input type="color" value={editingTemplate.footer.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, textColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Platform Name</label>
                          <input value={editingTemplate.footer.platformName.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, platformName: { ...editingTemplate.footer.platformName, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                          <input type="color" value={editingTemplate.footer.platformName.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, platformName: { ...editingTemplate.footer.platformName, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Short Description</label>
                          <textarea value={editingTemplate.footer.shortDescription.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, shortDescription: { ...editingTemplate.footer.shortDescription, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none h-20" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                          <input type="color" value={editingTemplate.footer.shortDescription.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, shortDescription: { ...editingTemplate.footer.shortDescription, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Copyright</label>
                          <input value={editingTemplate.footer.copyright.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, copyright: { ...editingTemplate.footer.copyright, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                          <input type="color" value={editingTemplate.footer.copyright.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, copyright: { ...editingTemplate.footer.copyright, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Side */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">Live Preview</h4>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-black/5 min-h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="p-8 flex flex-col items-center gap-6" style={{ backgroundColor: editingTemplate.header.bgColor }}>
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg" style={{ backgroundColor: editingTemplate.header.centerIcon.bgColor, color: editingTemplate.header.centerIcon.textColor }}>
                        {editingTemplate.header.centerIcon.text}
                      </div>
                      <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest" style={{ color: editingTemplate.header.contactInfo.color }}>
                        <div className="flex items-center gap-1"><MessageCircle size={12} /> {editingTemplate.header.contactInfo.whatsapp}</div>
                        <div className="flex items-center gap-1"><Mail size={12} /> {editingTemplate.header.contactInfo.email}</div>
                        <div className="flex items-center gap-1"><Globe size={12} /> {editingTemplate.header.contactInfo.website}</div>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="flex-grow p-10 space-y-8 relative overflow-hidden" style={{ backgroundColor: editingTemplate.body.bgColor, color: editingTemplate.body.textColor }}>
                      {editingTemplate.body.overlayIcon.show && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: editingTemplate.body.overlayIcon.opacity, color: editingTemplate.body.overlayIcon.color }}>
                          <Mail size={400} />
                        </div>
                      )}
                      <div className="relative z-10 text-center space-y-4">
                        <h2 className="text-4xl leading-tight">
                          <span className="font-light" style={{ color: editingTemplate.body.textColor }}>{editingTemplate.body.title.part1} </span>
                          <span className="font-black text-5xl block mt-2" style={{ color: editingTemplate.body.title.color }}>{editingTemplate.body.title.part2}</span>
                        </h2>
                        <p className="text-lg italic" style={{ color: editingTemplate.body.subheading.color }}>{editingTemplate.body.subheading.text}</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        {editingTemplate.cta.buttons.map((btn, i) => btn.show && (
                          <button key={i} className="px-8 py-3 rounded-xl font-bold shadow-lg" style={{ backgroundColor: btn.bgColor, color: btn.textColor }}>{btn.text}</button>
                        ))}
                      </div>
                      <div className="py-12 border-2 border-dashed border-black/5 rounded-2xl flex items-center justify-center text-black/20 italic">
                        [ {editingTemplate.body.content || 'Body Content Area'} ]
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="p-10 text-center space-y-6" style={{ backgroundColor: editingTemplate.footer.bgColor, color: editingTemplate.footer.textColor }}>
                      <div className="flex justify-center gap-4 text-sm font-bold">
                        {editingTemplate.footer.links.map((link, i) => link.show && (
                          <React.Fragment key={i}>
                            <a href={link.url} className="hover:opacity-70" style={{ color: link.color }}>{link.label}</a>
                            {i < editingTemplate.footer.links.length - 1 && <span>●</span>}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold uppercase tracking-widest" style={{ color: editingTemplate.footer.platformName.color }}>{editingTemplate.footer.platformName.text}</h4>
                        <p className="text-xs max-w-xs mx-auto leading-relaxed" style={{ color: editingTemplate.footer.shortDescription.color }}>{editingTemplate.footer.shortDescription.text}</p>
                      </div>
                      <div className="pt-6 border-t border-black/5 text-[10px] uppercase tracking-widest" style={{ color: editingTemplate.footer.copyright.color }}>
                        {editingTemplate.footer.copyright.text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-dark/50">
              <button onClick={() => setEditingTemplate(null)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => handleSave(editingTemplate)} className="flex items-center gap-2 bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"><Save size={20} /> Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
