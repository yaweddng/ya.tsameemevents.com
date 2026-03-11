import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Type, 
  FormInput, 
  Mail, 
  FileText, 
  MousePointer2, 
  Layout, 
  ToggleLeft, 
  CreditCard, 
  HelpCircle, 
  Sparkles, 
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  X,
  List
} from 'lucide-react';
import { General } from './features/General';
import { Forms } from './features/Forms';
import { Email } from './features/Email';
import { PDF } from './features/PDF';
import { CTA } from './features/CTA';
import { Tabs } from './features/Tabs';
import { Toggle } from './features/Toggle';
import { Cards } from './features/Cards';
import { FAQ } from './features/FAQ';
import { Pro } from './features/Pro';
import { College } from './features/College';
import { WidgetItemPro } from '../../../types';
import { WidgetProEditor } from './components/WidgetProEditor';

type ProTab = 'general' | 'forms' | 'email' | 'pdf' | 'cta' | 'tabs' | 'toggle' | 'cards' | 'faq' | 'pro' | 'college';

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-8 right-8 z-[10000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
      type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
    } backdrop-blur-xl`}
  >
    {type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
    <span className="font-bold text-sm">{message}</span>
    <button onClick={onClose} className="ml-4 hover:opacity-70 transition-opacity">
      <X size={14} />
    </button>
  </motion.div>
);

export const WidgetProManager = () => {
  const [activeTab, setActiveTab] = React.useState<ProTab>('pro');
  const [items, setItems] = React.useState<WidgetItemPro[]>([]);
  const [editingItem, setEditingItem] = React.useState<WidgetItemPro | null>(null);
  const [showTypeSelector, setShowTypeSelector] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [toast, setToast] = React.useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/widget-pro');
      const data = await res.json();
      setItems(data);
    } catch (e) {
      console.error('Failed to fetch widget items:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  const handleSaveItem = async (updatedItem: WidgetItemPro, closeOnSave: boolean = true) => {
    const newItems = items.some(i => i.id === updatedItem.id)
      ? items.map(i => i.id === updatedItem.id ? updatedItem : i)
      : [...items, updatedItem];
    
    try {
      const res = await fetch('/api/widget-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ items: newItems })
      });
      
      if (res.ok) {
        setItems(newItems);
        if (closeOnSave) {
          setEditingItem(null);
        }
        showToast('Widget item saved successfully!');
      } else {
        showToast('Failed to save widget item', 'error');
      }
    } catch (e) {
      console.error('Failed to save widget item:', e);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this widget item?')) return;
    
    const newItems = items.filter(i => i.id !== id);
    try {
      const res = await fetch('/api/widget-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ items: newItems })
      });
      
      if (res.ok) {
        setItems(newItems);
        showToast('Widget item deleted successfully!');
      } else {
        showToast('Failed to delete widget item', 'error');
      }
    } catch (e) {
      console.error('Failed to delete widget item:', e);
    }
  };

  const handleDuplicateItem = async (id: string) => {
    const itemToDuplicate = items.find(i => i.id === id);
    if (!itemToDuplicate) return;

    const newItem: WidgetItemPro = {
      ...itemToDuplicate,
      id: Math.random().toString(36).substr(2, 9),
      name: `${itemToDuplicate.name} (Copy)`,
      slug: itemToDuplicate.slug ? `${itemToDuplicate.slug}-copy` : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newItems = [...items, newItem];
    
    try {
      const res = await fetch('/api/widget-pro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ya-admin-secret'
        },
        body: JSON.stringify({ items: newItems })
      });
      
      if (res.ok) {
        setItems(newItems);
        showToast('Widget item duplicated successfully!');
      } else {
        showToast('Failed to duplicate widget item', 'error');
      }
    } catch (e) {
      console.error('Failed to duplicate widget item:', e);
    }
  };

  const handleAddItem = (type: string) => {
    if (!type) {
      setShowTypeSelector(true);
      return;
    }
    const newItem: WidgetItemPro = {
      id: Math.random().toString(36).substr(2, 9),
      name: `New ${type.replace('_', ' ')}`,
      type: type as any,
      config: {},
      status: 'Draft',
      category: activeTab,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditingItem(newItem);
    setShowTypeSelector(false);
  };

  const tabs = [
    { id: 'pro', label: 'Pro (All)', icon: Sparkles },
    { id: 'general', label: 'General', icon: Type },
    { id: 'forms', label: 'Forms', icon: FormInput },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'pdf', label: 'PDF', icon: FileText },
    { id: 'cta', label: 'CTA', icon: MousePointer2 },
    { id: 'tabs', label: 'Tabs', icon: Layout },
    { id: 'toggle', label: 'Toggle', icon: ToggleLeft },
    { id: 'cards', label: 'Cards', icon: CreditCard },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'college', label: 'College', icon: GraduationCap },
  ];

  const renderContent = () => {
    const categoryItems = activeTab === 'pro' ? items : items.filter(i => i.category === activeTab);
    const props = { 
      items: categoryItems, 
      onEdit: (id: string) => setEditingItem(items.find(i => i.id === id) || null),
      onDelete: handleDeleteItem,
      onAdd: handleAddItem,
      onAddClick: () => handleAddItem(''),
      onDuplicate: handleDuplicateItem
    };

    switch (activeTab) {
      case 'general': return <General {...props} />;
      case 'forms': return <Forms {...props} />;
      case 'email': return <Email {...props} />;
      case 'pdf': return <PDF {...props} />;
      case 'cta': return <CTA {...props} />;
      case 'tabs': return <Tabs {...props} />;
      case 'toggle': return <Toggle {...props} />;
      case 'cards': return <Cards {...props} />;
      case 'faq': return <FAQ {...props} />;
      case 'pro': return <Pro {...props} />;
      case 'college': return <College {...props} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Horizontal Scrollable Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${
              activeTab === tab.id 
                ? 'bg-brand border-brand text-dark shadow-lg shadow-brand/20' 
                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:border-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="glass-card p-4 sm:p-8 rounded-3xl min-h-[600px] border border-white/5">
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
              <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Pro Widgets...</p>
            </div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        )}
      </div>

      {editingItem && (
        <WidgetProEditor 
          item={editingItem} 
          onSave={handleSaveItem} 
          onClose={() => setEditingItem(null)} 
        />
      )}

      <AnimatePresence>
        {showTypeSelector && (
          <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark/95 backdrop-blur-md" 
              onClick={() => setShowTypeSelector(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-lighter-dark rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-dark/50">
                <div>
                  <h4 className="text-2xl font-bold text-brand uppercase tracking-widest">Select Widget Type</h4>
                  <p className="text-gray-400 text-sm mt-1">Choose the type of widget you want to create for <span className="text-brand font-bold">{activeTab}</span></p>
                </div>
                <button onClick={() => setShowTypeSelector(false)} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-gray-400 hover:text-white">
                  <X size={28} />
                </button>
              </div>
              <div className="p-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto no-scrollbar bg-dark/30">
                {tabs.find(t => t.id === activeTab)?.id === 'pro' || activeTab === 'pro' ? (
                  // Show all types if in Pro tab
                  [
                    { id: 'badge_title', label: 'Badge Title', icon: Sparkles },
                    { id: 'advanced_title', label: 'Advanced Title', icon: Type },
                    { id: 'subheading', label: 'Subheading', icon: Type },
                    { id: 'cta_button', label: 'CTA Button', icon: MousePointer2 },
                    { id: 'carousel', label: 'Carousel', icon: Layout },
                    { id: 'form', label: 'Pro Form', icon: FormInput },
                    { id: 'icon_list', label: 'Icon List', icon: List },
                    { id: 'custom_code', label: 'Custom Code', icon: FileText },
                    { id: 'map', label: 'Google Map', icon: Layout },
                    { id: 'image', label: 'Single Image', icon: Layout },
                    { id: 'card', label: 'Simple Card', icon: CreditCard },
                    { id: 'faq', label: 'FAQ Widget', icon: HelpCircle },
                    { id: 'tabs', label: 'Tabs Widget', icon: Layout },
                    { id: 'toggle', label: 'Toggle Widget', icon: ToggleLeft },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleAddItem(type.id)}
                      className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-brand hover:bg-brand/5 transition-all group text-center"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-dark transition-all group-hover:rotate-6">
                        <type.icon size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-brand">{type.label}</span>
                    </button>
                  ))
                ) : (
                  // Show specific types for other tabs (simplified for now, can be refined)
                  [
                    { id: 'badge_title', label: 'Badge Title', icon: Sparkles },
                    { id: 'advanced_title', label: 'Advanced Title', icon: Type },
                    { id: 'subheading', label: 'Subheading', icon: Type },
                    { id: 'cta_button', label: 'CTA Button', icon: MousePointer2 },
                    { id: 'carousel', label: 'Carousel', icon: Layout },
                    { id: 'icon_list', label: 'Icon List', icon: List },
                    { id: 'faq', label: 'FAQ Widget', icon: HelpCircle },
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleAddItem(type.id)}
                      className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 border border-white/10 rounded-[2rem] hover:border-brand hover:bg-brand/5 transition-all group text-center"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-brand group-hover:text-dark transition-all group-hover:rotate-6">
                        <type.icon size={28} />
                      </div>
                      <span className="text-sm font-bold text-gray-300 group-hover:text-brand">{type.label}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
