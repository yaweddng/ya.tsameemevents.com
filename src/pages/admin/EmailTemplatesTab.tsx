import React from 'react';
import { Mail, Plus, Trash2, Edit2, Save, CheckCircle, AlertCircle } from 'lucide-react';

export const EmailTemplatesTab = () => {
  const [templates, setTemplates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingTemplate, setEditingTemplate] = React.useState<any>(null);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const fetchData = async () => {
    try {
      const res = await fetch('/api/email-templates');
      const data = await res.json();
      setTemplates(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ templates })
      });
      if (res.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (e) {
      setSaveStatus('error');
    }
  };

  const handleAddTemplate = () => {
    const newTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Template',
      subject: 'Subject Line',
      header: {
        bgColor: '#0B0F14',
        textColor: '#00C896',
        centerIcon: { text: 'YA', bgColor: '#00C896', textColor: '#141414' },
        contactInfo: { whatsapp: '+971...', email: 'info@...', website: 'www...', color: '#00C896' }
      },
      body: {
        bgColor: '#FFFFFF',
        textColor: '#141414',
        title: { part1: 'Hello', part2: 'User', color: '#00C896' },
        subheading: { text: 'Welcome to our platform', color: '#9CA3AF' },
        overlayIcon: { show: true, color: '#141414', opacity: 0.05 }
      },
      cta: {
        buttons: [
          { text: 'View Details', url: '#', bgColor: '#00C896', textColor: '#141414', show: true }
        ]
      },
      footer: {
        bgColor: '#0B0F14',
        textColor: '#9CA3AF',
        platformName: { text: 'YA WEDDING', color: '#00C896' },
        shortDescription: { text: 'Luxury Event Planning', color: '#9CA3AF' },
        copyright: { text: '© 2026 YA Wedding', color: '#9CA3AF' },
        links: [
          { label: 'Privacy', url: '#', color: '#00C896', show: true }
        ]
      }
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  if (loading) return <div className="p-20 text-center text-brand font-bold">Loading Templates...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Templates</h2>
          <p className="text-gray-400 text-sm">Manage transactional and notification emails</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleAddTemplate}
            className="flex items-center gap-2 bg-white/5 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
          >
            <Plus size={20} /> Add Template
          </button>
          <button 
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {saveStatus === 'saving' ? 'Saving...' : (
              <>
                <Save size={20} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {saveStatus === 'saved' && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-2 font-bold">
          <CheckCircle size={20} /> Templates saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template, idx) => (
          <div key={template.id} className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                  <Mail size={24} />
                </div>
                <div>
                  <input 
                    className="bg-transparent border-none text-xl font-bold outline-none focus:text-brand"
                    value={template.name}
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].name = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                  <input 
                    className="bg-transparent border-none text-sm text-gray-500 outline-none w-full"
                    value={template.subject}
                    placeholder="Subject Line"
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].subject = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleDelete(template.id)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Header & Branding</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Brand Color</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={template.header.textColor}
                      onChange={(e) => {
                        const newTemplates = [...templates];
                        newTemplates[idx].header.textColor = e.target.value;
                        newTemplates[idx].header.centerIcon.bgColor = e.target.value;
                        newTemplates[idx].header.contactInfo.color = e.target.value;
                        newTemplates[idx].body.title.color = e.target.value;
                        newTemplates[idx].cta.buttons[0].bgColor = e.target.value;
                        newTemplates[idx].footer.platformName.color = e.target.value;
                        setTemplates(newTemplates);
                      }}
                    />
                    <input 
                      className="flex-1 bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs"
                      value={template.header.textColor}
                      onChange={(e) => {
                        const newTemplates = [...templates];
                        newTemplates[idx].header.textColor = e.target.value;
                        setTemplates(newTemplates);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Body Content</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Title Part 1</label>
                  <input 
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs"
                    value={template.body.title.part1}
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].body.title.part1 = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Title Part 2 (Accent)</label>
                  <input 
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs"
                    value={template.body.title.part2}
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].body.title.part2 = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Footer Info</h4>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Platform Name</label>
                  <input 
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs"
                    value={template.footer.platformName.text}
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].footer.platformName.text = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 uppercase font-bold">Copyright Text</label>
                  <input 
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1 text-xs"
                    value={template.footer.copyright.text}
                    onChange={(e) => {
                      const newTemplates = [...templates];
                      newTemplates[idx].footer.copyright.text = e.target.value;
                      setTemplates(newTemplates);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
