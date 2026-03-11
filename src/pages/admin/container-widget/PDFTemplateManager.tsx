import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, FileText, Palette, Type, Layout, Droplets, Smartphone, Mail, Globe, MapPin, Phone, Calendar, Hash, Clock, FileDigit, MessageCircle } from 'lucide-react';
import { PDFTemplate } from '../../../types';

export const PDFTemplateManager = () => {
  const [templates, setTemplates] = React.useState<PDFTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = React.useState<PDFTemplate | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pdf-templates');
      setTemplates(await res.json());
    } catch (e) {
      console.error('Failed to fetch pdf templates:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (template: PDFTemplate) => {
    const newTemplates = templates.some(t => t.id === template.id)
      ? templates.map(t => t.id === template.id ? template : t)
      : [...templates, template];

    try {
      const res = await fetch('/api/pdf-templates', {
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
      console.error('Failed to save pdf template:', e);
    }
  };

  const startNew = () => {
    setEditingTemplate({
      id: Math.random().toString(36).substr(2, 9),
      name: 'New PDF Proposal',
      slug: 'pdf-' + Date.now(),
      pageBgColor: '#FFFFFF',
      header: {
        bgColor: '#141414',
        textColor: '#F27D26',
        websiteName: { part1: 'YA', part2: 'WEDDING', color: '#F27D26' },
        contactInfo: {
          whatsapp: '+971 50 558 8842',
          email: 'info@ya.com',
          website: 'www.ya.com',
          color: '#F27D26'
        },
        centerIcon: { text: 'YA', bgColor: '#F27D26', textColor: '#141414' },
        rightInfo: {
          location: 'Dubai, UAE',
          call: '+971 50 558 8842',
          date: '2026-03-08',
          color: '#F27D26'
        },
        customTitle: { text1: 'EVENT', text2: 'PROPOSAL', color: '#F27D26' }
      },
      footer: {
        bgColor: '#F5F5F5',
        textColor: '#8E9299',
        centerText: { text: 'Thank you for choosing YA Wedding', color: '#8E9299' },
        leftInfo: {
          logoText: 'YA WEDDING DUBAI',
          website: 'www.ya.com',
          phone: '+971 50 558 8842',
          color: '#8E9299'
        },
        centerIcon: { text: 'YA', bgColor: '#141414', textColor: '#F27D26' },
        rightInfo: {
          showSubmissionId: true,
          showSubmissionDate: true,
          showPageCount: true,
          color: '#8E9299'
        },
        copyright: { text: '© 2026 YA Wedding. All rights reserved.', color: '#8E9299' }
      },
      body: {
        textColor: '#141414',
        content: ''
      },
      watermark: {
        text: 'CONFIDENTIAL',
        color: '#8E9299',
        opacity: 0.1
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-brand">PDF Proposals</h2>
          <p className="text-gray-400">Configure branding and layout for PDF documents and invoices.</p>
        </div>
        <button onClick={startNew} className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"><Plus size={20} /> Create PDF Design</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-lighter-dark p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-brand/10 rounded-xl text-brand"><FileText size={20} /></div>
                  <div><h3 className="text-lg font-bold text-white group-hover:text-brand transition-colors">{template.name}</h3><p className="text-xs text-gray-500 font-mono">[{template.slug}]</p></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingTemplate(template)} className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-brand transition-all"><Edit2 size={16} /></button>
                  <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-dark/50 rounded-2xl border border-white/5 space-y-2">
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500"><span>Page BG</span><div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: template.pageBgColor }} /></div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500"><span>Header BG</span><div className="w-4 h-4 rounded border border-white/10" style={{ backgroundColor: template.header.bgColor }} /></div>
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
              <h3 className="text-xl font-bold text-brand">PDF Document Designer</h3>
              <button onClick={() => setEditingTemplate(null)} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Editor Side */}
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Design Name</label>
                      <input value={editingTemplate.name} onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                      <input value={editingTemplate.slug} onChange={(e) => setEditingTemplate({ ...editingTemplate, slug: e.target.value })} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                    </div>
                  </div>

                  {/* Header Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2"><Layout size={16} /> Header Branding</h4>
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
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Website Part 1</label>
                          <input value={editingTemplate.header.websiteName.part1} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, websiteName: { ...editingTemplate.header.websiteName, part1: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Website Part 2</label>
                          <input value={editingTemplate.header.websiteName.part2} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, websiteName: { ...editingTemplate.header.websiteName, part2: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Color</label>
                          <input type="color" value={editingTemplate.header.websiteName.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, websiteName: { ...editingTemplate.header.websiteName, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">WhatsApp</label><input value={editingTemplate.header.contactInfo.whatsapp} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, whatsapp: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Email</label><input value={editingTemplate.header.contactInfo.email} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, email: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Website</label><input value={editingTemplate.header.contactInfo.website} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, website: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.header.contactInfo.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, contactInfo: { ...editingTemplate.header.contactInfo, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon Text</label><input value={editingTemplate.header.centerIcon.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon BG</label><input type="color" value={editingTemplate.header.centerIcon.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, bgColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon Color</label><input type="color" value={editingTemplate.header.centerIcon.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, centerIcon: { ...editingTemplate.header.centerIcon, textColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Location</label><input value={editingTemplate.header.rightInfo.location} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, rightInfo: { ...editingTemplate.header.rightInfo, location: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Call</label><input value={editingTemplate.header.rightInfo.call} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, rightInfo: { ...editingTemplate.header.rightInfo, call: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Date</label><input value={editingTemplate.header.rightInfo.date} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, rightInfo: { ...editingTemplate.header.rightInfo, date: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.header.rightInfo.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, rightInfo: { ...editingTemplate.header.rightInfo, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Custom Title 1</label><input value={editingTemplate.header.customTitle.text1} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, customTitle: { ...editingTemplate.header.customTitle, text1: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Custom Title 2</label><input value={editingTemplate.header.customTitle.text2} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, customTitle: { ...editingTemplate.header.customTitle, text2: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.header.customTitle.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, header: { ...editingTemplate.header, customTitle: { ...editingTemplate.header.customTitle, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                    </div>
                  </div>

                  {/* Body & Watermark Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2"><Droplets size={16} /> Body & Watermark</h4>
                    <div className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Page BG</label><input type="color" value={editingTemplate.pageBgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, pageBgColor: e.target.value })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Body Text Color</label><input type="color" value={editingTemplate.body.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, body: { ...editingTemplate.body, textColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Watermark Text</label><input value={editingTemplate.watermark.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, watermark: { ...editingTemplate.watermark, text: e.target.value } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.watermark.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, watermark: { ...editingTemplate.watermark, color: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Opacity</label><input type="number" step="0.01" value={editingTemplate.watermark.opacity} onChange={(e) => setEditingTemplate({ ...editingTemplate, watermark: { ...editingTemplate.watermark, opacity: parseFloat(e.target.value) } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-brand uppercase tracking-widest flex items-center gap-2"><Layout size={16} /> Footer Branding</h4>
                    <div className="bg-dark/30 p-4 rounded-2xl border border-white/5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Footer BG</label><input type="color" value={editingTemplate.footer.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, bgColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Footer Text Color</label><input type="color" value={editingTemplate.footer.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, textColor: e.target.value } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Center Text</label><input value={editingTemplate.footer.centerText.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, centerText: { ...editingTemplate.footer.centerText, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.footer.centerText.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, centerText: { ...editingTemplate.footer.centerText, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Logo Text</label><input value={editingTemplate.footer.leftInfo.logoText} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, leftInfo: { ...editingTemplate.footer.leftInfo, logoText: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.footer.leftInfo.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, leftInfo: { ...editingTemplate.footer.leftInfo, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon Text</label><input value={editingTemplate.footer.centerIcon.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, centerIcon: { ...editingTemplate.footer.centerIcon, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon BG</label><input type="color" value={editingTemplate.footer.centerIcon.bgColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, centerIcon: { ...editingTemplate.footer.centerIcon, bgColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Icon Color</label><input type="color" value={editingTemplate.footer.centerIcon.textColor} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, centerIcon: { ...editingTemplate.footer.centerIcon, textColor: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Copyright</label><input value={editingTemplate.footer.copyright.text} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, copyright: { ...editingTemplate.footer.copyright, text: e.target.value } } })} className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none" /></div>
                        <div className="space-y-2"><label className="text-[10px] font-bold text-gray-500 uppercase">Color</label><input type="color" value={editingTemplate.footer.copyright.color} onChange={(e) => setEditingTemplate({ ...editingTemplate, footer: { ...editingTemplate.footer, copyright: { ...editingTemplate.footer.copyright, color: e.target.value } } })} className="w-full h-10 bg-dark border border-white/10 rounded-lg px-1 py-1 outline-none cursor-pointer" /></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Side */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">PDF Preview</h4>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-black/5 min-h-[700px] flex flex-col relative" style={{ backgroundColor: editingTemplate.pageBgColor }}>
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"><span className="text-9xl font-bold uppercase -rotate-45 select-none" style={{ color: editingTemplate.watermark.color, opacity: editingTemplate.watermark.opacity }}>{editingTemplate.watermark.text}</span></div>

                    {/* Header */}
                    <div className="p-8 space-y-6 relative z-10" style={{ backgroundColor: editingTemplate.header.bgColor, color: editingTemplate.header.textColor }}>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h1 className="text-2xl font-bold leading-none" style={{ color: editingTemplate.header.websiteName.color }}>
                            <span className="font-light">{editingTemplate.header.websiteName.part1}</span>
                            <span className="block">{editingTemplate.header.websiteName.part2}</span>
                          </h1>
                          <div className="space-y-1 text-[8px] uppercase tracking-widest" style={{ color: editingTemplate.header.contactInfo.color }}>
                            <div className="flex items-center gap-1"><MessageCircle size={8} /> {editingTemplate.header.contactInfo.whatsapp}</div>
                            <div className="flex items-center gap-1"><Mail size={8} /> {editingTemplate.header.contactInfo.email}</div>
                            <div className="flex items-center gap-1"><Globe size={12} /> {editingTemplate.header.contactInfo.website}</div>
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg" style={{ backgroundColor: editingTemplate.header.centerIcon.bgColor, color: editingTemplate.header.centerIcon.textColor }}>{editingTemplate.header.centerIcon.text}</div>
                        <div className="text-right space-y-1 text-[8px] uppercase tracking-widest" style={{ color: editingTemplate.header.rightInfo.color }}>
                          <div className="flex items-center justify-end gap-1">{editingTemplate.header.rightInfo.location} <MapPin size={8} /></div>
                          <div className="flex items-center justify-end gap-1">{editingTemplate.header.rightInfo.call} <Phone size={8} /></div>
                          <div className="flex items-center justify-end gap-1">{editingTemplate.header.rightInfo.date} <Calendar size={8} /></div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-white/10 text-center">
                        <h2 className="text-xl font-black tracking-tighter" style={{ color: editingTemplate.header.customTitle.color }}>
                          <span className="opacity-50 font-light">{editingTemplate.header.customTitle.text1} </span>
                          <span>{editingTemplate.header.customTitle.text2}</span>
                        </h2>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-grow p-12 space-y-8 relative z-10" style={{ color: editingTemplate.body.textColor }}>
                      <div className="h-4 w-1/3 bg-current opacity-20 rounded" />
                      <div className="space-y-3"><div className="h-3 w-full bg-current opacity-10 rounded" /><div className="h-3 w-full bg-current opacity-10 rounded" /><div className="h-3 w-4/5 bg-current opacity-10 rounded" /></div>
                      <div className="grid grid-cols-2 gap-8 pt-8"><div className="h-32 bg-current opacity-5 rounded-2xl" /><div className="h-32 bg-current opacity-5 rounded-2xl" /></div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 space-y-6 relative z-10" style={{ backgroundColor: editingTemplate.footer.bgColor, color: editingTemplate.footer.textColor }}>
                      <div className="text-center text-xs font-bold italic" style={{ color: editingTemplate.footer.centerText.color }}>{editingTemplate.footer.centerText.text}</div>
                      <div className="flex justify-between items-end border-t border-black/5 pt-6">
                        <div className="space-y-1 text-[8px] uppercase tracking-widest" style={{ color: editingTemplate.footer.leftInfo.color }}>
                          <div className="font-bold text-[10px] mb-1">{editingTemplate.footer.leftInfo.logoText}</div>
                          <div>{editingTemplate.footer.leftInfo.website}</div>
                          <div>{editingTemplate.footer.leftInfo.phone}</div>
                        </div>
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-md" style={{ backgroundColor: editingTemplate.footer.centerIcon.bgColor, color: editingTemplate.footer.centerIcon.textColor }}>{editingTemplate.footer.centerIcon.text}</div>
                        <div className="text-right space-y-1 text-[8px] uppercase tracking-widest" style={{ color: editingTemplate.footer.rightInfo.color }}>
                          <div>#YA-2026-001 <Hash size={8} className="inline" /></div>
                          <div>2026-03-08 10:15 <Clock size={8} className="inline" /></div>
                          <div>PAGE 1 / 3 <FileDigit size={8} className="inline" /></div>
                        </div>
                      </div>
                      <div className="text-center text-[7px] uppercase tracking-[0.2em] pt-4" style={{ color: editingTemplate.footer.copyright.color }}>{editingTemplate.footer.copyright.text}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-4 bg-dark/50">
              <button onClick={() => setEditingTemplate(null)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={() => handleSave(editingTemplate)} className="flex items-center gap-2 bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"><Save size={20} /> Save Design</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
