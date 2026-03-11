import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  Layout, 
  Type, 
  Palette, 
  FileText, 
  ShoppingBag, 
  Archive, 
  Search, 
  AlertCircle, 
  Globe,
  Settings,
  Eye,
  Copy,
  CheckCircle,
  X,
  ChevronRight,
  Monitor,
  Smartphone,
  Tablet,
  MousePointer2,
  Database,
  Grid
} from 'lucide-react';
import { ThemeTemplate } from '../../../types';
import { GlobalStyleEditor } from './components/GlobalStyleEditor';
import { TemplateBuilder } from './components/TemplateBuilder';
import { CardBuilder } from './components/CardBuilder';
import { DynamicWidgetBuilder } from './components/DynamicWidgetBuilder';
import { PostTypeManager } from './PostTypeManager';

export const ThemeBuilderTab = () => {
  const [templates, setTemplates] = React.useState<ThemeTemplate[]>([]);
  const [activeSubTab, setActiveSubTab] = React.useState<ThemeTemplate['type'] | 'all' | 'post-type' | 'widget'>('all');
  const [isEditing, setIsEditing] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<ThemeTemplate | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/theme-builder');
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = async (template: ThemeTemplate) => {
    const updatedTemplates = editingTemplate?.id 
      ? templates.map(t => t.id === template.id ? template : t)
      : [...templates, { ...template, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString() }];

    try {
      const res = await fetch('/api/theme-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ templates: updatedTemplates })
      });

      if (res.ok) {
        setTemplates(updatedTemplates);
        setIsEditing(false);
        setEditingTemplate(null);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    const updatedTemplates = templates.filter(t => t.id !== id);
    try {
      const res = await fetch('/api/theme-builder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ templates: updatedTemplates })
      });
      if (res.ok) setTemplates(updatedTemplates);
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const filteredTemplates = activeSubTab === 'all' 
    ? templates 
    : templates.filter(t => t.type === activeSubTab);

  const subTabs: { id: ThemeTemplate['type'] | 'all' | 'post-type' | 'widget'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Templates', icon: Globe },
    { id: 'post-type', label: 'Post Types', icon: Database },
    { id: 'widget', label: 'Dynamic Widgets', icon: Grid },
    { id: 'card', label: 'Card Designs', icon: Layout },
    { id: 'header', label: 'Headers', icon: Layout },
    { id: 'footer', label: 'Footers', icon: Layout },
    { id: 'styles', label: 'Global Styles', icon: Palette },
    { id: 'single', label: 'Single Posts', icon: FileText },
    { id: 'archive', label: 'Archives', icon: Archive },
    { id: 'product', label: 'Products', icon: ShoppingBag },
    { id: 'search', label: 'Search Results', icon: Search },
    { id: '404', label: '404 Page', icon: AlertCircle },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Layout className="text-brand" /> Theme Builder
          </h2>
          <p className="text-gray-400 text-sm">Design and manage global website templates</p>
        </div>
        <button 
          onClick={() => {
            setEditingTemplate({
              id: '',
              name: 'New Template',
              type: 'header',
              config: {},
              status: 'Draft',
              conditions: ['entire-site']
            });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          <Plus size={20} /> Create New Template
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto pb-4 gap-2 hide-scrollbar">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border-2 ${
              activeSubTab === tab.id 
                ? 'border-brand bg-brand/10 text-brand' 
                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      {activeSubTab === 'post-type' ? (
        <PostTypeManager />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-3xl border border-white/5 hover:border-brand/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand/10 rounded-2xl text-brand">
                {subTabs.find(t => t.id === template.type)?.icon && React.createElement(subTabs.find(t => t.id === template.type)!.icon, { size: 24 })}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                template.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
              }`}>
                {template.status}
              </div>
            </div>

            <h3 className="text-lg font-bold mb-1">{template.name}</h3>
            <p className="text-gray-400 text-xs mb-4 capitalize">{template.type} Template</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Globe size={14} />
                <span>Conditions: {template.conditions?.join(', ') || 'None'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings size={14} />
                <span>Last Updated: {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setEditingTemplate(template);
                  setIsEditing(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-bold transition-all"
              >
                <Edit2 size={16} /> Edit
              </button>
              <button 
                onClick={() => handleDelete(template.id)}
                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-24 text-center glass-card rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
              <Layout size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-400">No templates found</h3>
            <p className="text-gray-500 text-sm">Start by creating your first theme template</p>
          </div>
        )}
      </div>
      )}

      {/* Template Editor Modal */}
      <AnimatePresence>
        {isEditing && editingTemplate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-dark/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-dark border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Edit2 className="text-brand" size={24} />
                    {editingTemplate.id ? 'Edit Template' : 'Create New Template'}
                  </h3>
                  <p className="text-gray-400 text-sm">Configure your template settings and display rules</p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="p-3 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Info */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Template Name</label>
                      <input
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                        placeholder="e.g. Main Website Header"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Template Type</label>
                      <select
                        value={editingTemplate.type}
                        onChange={(e) => setEditingTemplate({...editingTemplate, type: e.target.value as any})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all appearance-none"
                      >
                        {subTabs.filter(t => t.id !== 'all').map(t => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</label>
                      <div className="flex gap-4">
                        {['Active', 'Draft', 'Archived'].map((status) => (
                          <button
                            key={status}
                            onClick={() => setEditingTemplate({...editingTemplate, status: status as any})}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all border-2 ${
                              editingTemplate.status === status 
                                ? 'border-brand bg-brand/10 text-brand' 
                                : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Display Rules */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Conditions</label>
                      <div className="space-y-3">
                        {['entire-site', 'front-page', 'all-posts', 'all-pages', 'all-archives', '404-page', 'search-results'].map((condition) => (
                          <label key={condition} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all">
                            <input
                              type="checkbox"
                              checked={editingTemplate.conditions?.includes(condition)}
                              onChange={(e) => {
                                const conditions = editingTemplate.conditions || [];
                                const newConditions = e.target.checked 
                                  ? [...conditions, condition]
                                  : conditions.filter(c => c !== condition);
                                setEditingTemplate({...editingTemplate, conditions: newConditions});
                              }}
                              className="w-5 h-5 rounded-lg border-white/10 bg-dark text-brand focus:ring-brand"
                            />
                            <span className="text-sm font-medium capitalize">{condition.replace('-', ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Specific Config */}
                <div className="space-y-4 pt-8 border-t border-white/10">
                   <h4 className="text-sm font-bold text-brand uppercase tracking-wider">Template Configuration</h4>
                   {editingTemplate.type === 'styles' ? (
                     <GlobalStyleEditor 
                       config={editingTemplate.config} 
                       onChange={(config) => setEditingTemplate({...editingTemplate, config})} 
                     />
                   ) : editingTemplate.type === 'card' ? (
                     <CardBuilder 
                       config={editingTemplate.config} 
                       onChange={(config) => setEditingTemplate({...editingTemplate, config})} 
                     />
                   ) : editingTemplate.type === 'widget' ? (
                     <DynamicWidgetBuilder 
                       config={editingTemplate.config} 
                       onChange={(config) => setEditingTemplate({...editingTemplate, config})} 
                     />
                   ) : (
                     <TemplateBuilder 
                       type={editingTemplate.type} 
                       config={editingTemplate.config} 
                       onChange={(config) => setEditingTemplate({...editingTemplate, config})} 
                     />
                   )}
                </div>
              </div>

              <div className="p-8 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleSave(editingTemplate)}
                  className="flex items-center gap-2 bg-brand text-dark px-10 py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  <Save size={20} /> Save Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
