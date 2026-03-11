import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Box, Sparkles, Settings, Mail, FileText } from 'lucide-react';
import { ContainerManager } from './ContainerManager';
import { StandardWidgetManager } from './StandardWidgetManager';
import { WidgetProManager } from './WidgetProManager';
import { EmailTemplateManager } from './EmailTemplateManager';
import { PDFTemplateManager } from './PDFTemplateManager';

type MainTab = 'container' | 'widget' | 'email' | 'pdf';
type WidgetSubTab = 'standard' | 'pro';

export const ContainerWidgetTab = () => {
  const [mainTab, setMainTab] = React.useState<MainTab>('container');
  const [widgetSubTab, setWidgetSubTab] = React.useState<WidgetSubTab>('standard');
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const mainTabs: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: 'container', label: 'Container', icon: Layout },
    { id: 'widget', label: 'Widget', icon: Box },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'pdf', label: 'PDF', icon: FileText },
  ];

  const activeMainTab = mainTabs.find(t => t.id === mainTab)!;

  return (
    <div className="space-y-8">
      {/* Main Toggle: Container vs Widget vs Email vs PDF */}
      <div className="flex flex-col items-center gap-4">
        {/* Mobile Toggle Button */}
        <div className="sm:hidden w-full max-w-[280px] relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between font-bold text-white"
          >
            <div className="flex items-center gap-3">
              <activeMainTab.icon size={20} className="text-brand" />
              {activeMainTab.label}
            </div>
            <motion.div
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Settings size={18} className="text-gray-500" />
            </motion.div>
          </button>

          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl max-h-[60vh] overflow-y-auto no-scrollbar"
            >
              {mainTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setMainTab(t.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-all ${
                    mainTab === t.id ? 'bg-brand text-dark' : 'text-gray-400 hover:bg-white/5'
                  }`}
                >
                  <t.icon size={18} />
                  <span className="font-bold">{t.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="hidden sm:flex bg-white/5 p-1.5 rounded-2xl border border-white/10 gap-2">
          {mainTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setMainTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                mainTab === t.id ? 'bg-brand text-dark' : 'text-gray-400 hover:text-white'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-toggle for Widget: Widget vs Widget Pro */}
      {mainTab === 'widget' && (
        <div className="flex justify-center">
          <div className="bg-white/5 p-1 rounded-xl border border-white/5 flex gap-1 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setWidgetSubTab('standard')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                widgetSubTab === 'standard' ? 'bg-white/10 text-brand' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Settings size={14} />
              Standard Widget
            </button>
            <button
              onClick={() => setWidgetSubTab('pro')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                widgetSubTab === 'pro' ? 'bg-white/10 text-brand' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Sparkles size={14} />
              Widget Pro
            </button>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      <motion.div
        key={`${mainTab}-${widgetSubTab}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {mainTab === 'container' ? (
          <ContainerManager />
        ) : mainTab === 'widget' ? (
          widgetSubTab === 'standard' ? (
            <StandardWidgetManager />
          ) : (
            <WidgetProManager />
          )
        ) : mainTab === 'email' ? (
          <EmailTemplateManager />
        ) : (
          <PDFTemplateManager />
        )}
      </motion.div>
    </div>
  );
};
