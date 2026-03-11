import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Sparkles, Share, PlusSquare } from 'lucide-react';

export const PWAInstallPopup = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Show popup after 10 seconds to encourage installation, unless already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    
    let timer: NodeJS.Timeout;
    if (!isStandalone) {
      timer = setTimeout(() => {
        setShow(true);
      }, 10000);
    }

    // Custom event to trigger from other pages
    const handleShowEvent = () => {
      setShow(true);
      setShowInstructions(false);
    };
    window.addEventListener('show-pwa-install', handleShowEvent);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('show-pwa-install', handleShowEvent);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShow(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show manual instructions instead of alert
      setShowInstructions(true);
    }
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[100]"
        >
          <div className="bg-dark-lighter border border-brand/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/10 rounded-full blur-2xl" />
            
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {!showInstructions ? (
              <>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Smartphone className="text-brand" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles size={14} className="text-brand" />
                      <span className="text-brand text-[10px] font-bold uppercase tracking-widest">Mobile Experience</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Install YA Wedding</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Get the best experience with our mobile app. Fast, offline-ready, and secure.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleInstall}
                    className="flex-grow bg-brand text-dark font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Download size={18} />
                    Install App
                  </button>
                  <button
                    onClick={() => setShow(false)}
                    className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-medium hover:bg-white/5 transition-colors"
                  >
                    Not now
                  </button>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Download className="text-brand" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">How to Install</h3>
                </div>
                
                {isIOS ? (
                  <div className="space-y-4 text-sm text-gray-300">
                    <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="bg-white/10 p-1.5 rounded-lg shrink-0"><Share size={16} className="text-brand" /></div>
                      <p>1. Tap the <strong>Share</strong> button at the bottom of your screen.</p>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="bg-white/10 p-1.5 rounded-lg shrink-0"><PlusSquare size={16} className="text-brand" /></div>
                      <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-sm text-gray-300">
                    <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="bg-white/10 p-1.5 rounded-lg shrink-0"><Smartphone size={16} className="text-brand" /></div>
                      <p>Tap the menu icon (⋮) in your browser and select <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</p>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setShow(false)}
                  className="w-full mt-6 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Got it
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
