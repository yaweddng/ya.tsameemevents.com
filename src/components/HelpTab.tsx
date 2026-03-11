import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { MessageCircle, X, Send, Phone, Mail, User, Smartphone, ChevronLeft } from 'lucide-react';

const IconRenderer = ({ name, size = 18, className = "", ...props }: { name: string, size?: number, className?: string, [key: string]: any }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} {...props} />;
};

export const HelpTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
  }, []);

  if (!settings?.floatingItems?.helpTabs?.show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Help request submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', contact: '', message: '' });
      setIsOpen(false);
    }, 3000);
  };

  const helpTabs = settings.floatingItems.helpTabs;
  const viewType = helpTabs.viewType || 'button';

  return (
    <>
      {/* Floating Tabs */}
      <div className="fixed inset-y-0 pointer-events-none z-50 flex flex-col justify-center gap-4">
        {helpTabs.items.map((tab: any, idx: number) => {
          const isLeft = tab.position === 'left';
          
          return (
            <div 
              key={idx} 
              className={`fixed top-1/2 -translate-y-1/2 pointer-events-auto ${isLeft ? 'left-0' : 'right-0'}`}
              style={{ top: `${50 + (idx - (helpTabs.items.length - 1) / 2) * 10}%` }}
            >
              <motion.button
                initial={{ x: isLeft ? -5 : 5, opacity: 0.6 }}
                whileHover={{ x: 0, opacity: 1 }}
                onClick={() => setIsOpen(true)}
                className={`flex items-center group py-4 transition-all ${isLeft ? 'pr-4 flex-row-reverse' : 'pl-4'}`}
                aria-label={tab.label}
              >
                {/* Desktop Version */}
                <div className={`hidden md:flex items-center bg-brand text-dark shadow-2xl shadow-brand/30 border-y border-white/20 group-hover:scale-105 transition-all ${isLeft ? 'rounded-r-xl border-r origin-left' : 'rounded-l-xl border-l origin-right'} ${settings?.helpTabSize === 'small' ? 'py-4 px-2.5' : 'py-5 px-3'}`}>
                  <div className={`flex flex-col items-center ${settings?.helpTabSize === 'small' ? 'gap-2' : 'gap-3'}`}>
                    <div className="relative">
                      <IconRenderer name={tab.icon || 'MessageCircle'} size={settings?.helpTabSize === 'small' ? 20 : 24} strokeWidth={2.5} />
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse border-2 border-brand" />
                    </div>
                    <span className={`[writing-mode:vertical-rl] ${isLeft ? '' : 'rotate-180'} font-black uppercase tracking-widest ${settings?.helpTabSize === 'small' ? 'text-[9px]' : 'text-[10px]'}`}>
                      {tab.label || 'Help'}
                    </span>
                  </div>
                </div>

                {/* Mobile Version */}
                <div className="md:hidden flex items-center">
                  {viewType === 'button' ? (
                    <>
                      <div className={`h-12 w-[2px] bg-brand group-hover:h-16 transition-all duration-300 rounded-full ${isLeft ? 'order-2' : ''}`} />
                      <div className={`bg-brand text-dark p-1 rounded-md shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ${isLeft ? 'translate-x-2 group-hover:translate-x-0' : '-translate-x-2 group-hover:translate-x-0'}`}>
                        {isLeft ? <Icons.ChevronRight size={14} strokeWidth={3} /> : <Icons.ChevronLeft size={14} strokeWidth={3} />}
                      </div>
                    </>
                  ) : (
                    <div className={`bg-brand text-dark p-3 shadow-lg flex items-center justify-center transition-all ${isLeft ? 'rounded-r-xl' : 'rounded-l-xl'}`}>
                      <IconRenderer name={tab.icon || 'MessageCircle'} size={20} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content - More compact and slides from right */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="relative w-full max-w-sm md:max-w-md bg-dark-lighter border border-white/10 rounded-2xl shadow-2xl overflow-hidden mx-4"
            >
              {/* Header - Very compact */}
              <div className="p-4 border-b border-white/5 bg-dark/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">Support</h3>
                    <p className="text-[10px] text-gray-400">Quick response team</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body - Compact padding */}
              <div className="p-5">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-6 text-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-full bg-brand/20 mx-auto flex items-center justify-center text-brand">
                      <Send size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-lg font-bold text-white">Sent!</h4>
                      <p className="text-[11px] text-gray-400 px-2">We'll contact you shortly.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                          <User size={10} className="text-brand" />
                          Name
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                          <Smartphone size={10} className="text-brand" />
                          Contact
                        </label>
                        <input
                          required
                          type="text"
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          placeholder="Email or Phone"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="flex items-center gap-1.5 text-[9px] font-semibold text-gray-400 uppercase tracking-wider ml-1">
                        <MessageCircle size={10} className="text-brand" />
                        Message
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help?"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:border-brand/50 focus:ring-1 focus:ring-brand/50 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand hover:bg-brand-light text-dark font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-brand/10 hover:shadow-brand/20 transition-all active:scale-[0.98] text-xs"
                    >
                      <Send size={14} />
                      Submit
                    </button>
                  </form>
                )}
              </div>

              {/* Footer - Minimal */}
              <div className="px-5 py-3 bg-dark/30 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                <a href="tel:+971505588842" className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-brand transition-colors">
                  <Phone size={10} />
                  Call
                </a>
                <a href="mailto:ya@tsameemevents.com" className="flex items-center gap-1 text-[9px] text-gray-400 hover:text-brand transition-colors">
                  <Mail size={10} />
                  Email
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
