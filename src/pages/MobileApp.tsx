import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Shield, Cloud, Download, Smartphone as PhoneIcon, Layout, Sparkles, Heart, Calendar, Image as ImageIcon, Camera, Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const MobileApp = () => {
  const features = [
    {
      icon: <Zap className="text-brand" />,
      title: "Instant Loading",
      description: "Our PWA technology ensures the app loads instantly, even on slow connections, by caching essential data locally."
    },
    {
      icon: <Cloud className="text-brand" />,
      title: "Offline Access",
      description: "Browse your wedding plans and our portfolio even when you're offline. Your data is always with you."
    },
    {
      icon: <Shield className="text-brand" />,
      title: "Secure & Private",
      description: "Enterprise-grade security for your personal wedding data, stored safely on your device."
    },
    {
      icon: <Layout className="text-brand" />,
      title: "Native Experience",
      description: "Enjoy a smooth, app-like interface with gestures and transitions optimized for mobile devices."
    }
  ];

  return (
    <div className="pt-20 bg-dark min-h-screen text-white">
      <Helmet>
        <title>Mobile App Experience | YA Wedding</title>
        <meta name="description" content="Experience YA Wedding on your mobile device with our new high-performance PWA." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-6">
              <Sparkles size={16} className="text-brand" />
              <span className="text-brand text-xs font-bold uppercase tracking-widest">Get your mobile app now</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
              The Future of <span className="text-brand">Wedding Planning</span> is in Your Pocket
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              We've completely rebuilt our mobile experience. Faster, smoother, and more intuitive than ever before. Install the YA Wedding PWA today.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
            {/* Left Side: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-start md:justify-end"
            >
              <div className="relative scale-[0.9] sm:scale-95 md:scale-100 origin-left md:origin-center">
                {/* Phone Mockup */}
                <div className="relative w-[160px] h-[310px] sm:w-[180px] sm:h-[380px] md:w-[250px] md:h-[470px] bg-dark-lighter border-[6px] border-zinc-800 rounded-[1.5rem] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-800 rounded-b-xl z-20" />
                  <div className="absolute inset-0 p-1.5 pt-4">
                    <div className="w-full h-full bg-dark rounded-lg overflow-hidden border border-white/5 flex flex-col">
                      {/* Replaced Image with Icon and Design - Live Feed Look */}
                      <div className="w-full h-20 md:h-32 bg-dark-lighter flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand via-transparent to-transparent" />
                        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center relative z-10 shadow-[0_0_20px_rgba(0,200,150,0.1)]">
                          <Camera size={18} className="text-brand/80" />
                        </div>
                        <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                          <div className="w-0.5 h-0.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-[5px] font-bold text-red-500 uppercase">Live</span>
                        </div>
                      </div>
                      
                      <div className="p-2 md:p-3 space-y-2 md:space-y-3 flex-grow">
                        {/* Redesigned Selected Div (Selector 4) - Booking Confirmation Widget */}
                        <div className="p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-brand/10 border border-brand/30 flex items-center gap-2 md:gap-3 relative overflow-hidden group shadow-[0_0_15px_rgba(0,200,150,0.1)]">
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-brand flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,200,150,0.4)]">
                            <Check size={12} className="text-dark" />
                          </div>
                          <div className="flex-grow space-y-1">
                            <div className="h-1.5 md:h-2 w-16 md:w-24 bg-brand/60 rounded-full" />
                            <div className="h-1 md:h-1.5 w-10 md:w-16 bg-brand/20 rounded-full" />
                          </div>
                        </div>

                        <div className="space-y-1.5 md:space-y-2 px-1">
                          <div className="h-1 w-full bg-white/5 rounded" />
                          <div className="h-1 w-3/4 bg-white/5 rounded" />
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 md:gap-2 pt-1">
                          <div className="h-8 md:h-14 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center group">
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand/20 group-hover:bg-brand/40 transition-colors" />
                          </div>
                          <div className="h-8 md:h-14 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center group">
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand/20 group-hover:bg-brand/40 transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Nav Bar */}
                      <div className="h-8 md:h-10 border-t border-white/5 bg-dark-lighter/50 flex items-center justify-around px-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand/40" />
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/10" />
                        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-brand/10 rounded-full blur-xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand/5 rounded-full blur-2xl" />
              </div>
            </motion.div>

            {/* Right Side: Installation Steps */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-dark-lighter/50 backdrop-blur-sm p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] border border-white/5 relative overflow-hidden group h-[240px] md:h-[360px] lg:h-[420px] flex flex-col justify-center"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors" />
              <h2 className="text-sm sm:text-xl md:text-2xl font-bold mb-2 md:mb-8 relative z-10">How to Install</h2>
              <div className="space-y-2 md:space-y-6 relative z-10">
                <div className="flex gap-2 md:gap-4">
                  <div className="w-4 h-4 md:w-8 md:h-8 rounded-full bg-brand text-dark flex items-center justify-center font-bold shrink-0 text-[8px] md:text-sm">1</div>
                  <div>
                    <h4 className="text-[10px] md:text-base font-bold">Open Site</h4>
                    <p className="text-gray-400 text-[8px] md:text-sm leading-tight">Visit us on your mobile browser.</p>
                  </div>
                </div>
                <div className="flex gap-2 md:gap-4">
                  <div className="w-4 h-4 md:w-8 md:h-8 rounded-full bg-brand text-dark flex items-center justify-center font-bold shrink-0 text-[8px] md:text-sm">2</div>
                  <div>
                    <h4 className="text-[10px] md:text-base font-bold">Add to Home</h4>
                    <p className="text-gray-400 text-[8px] md:text-sm leading-tight">Tap "Add to Home Screen" in menu.</p>
                  </div>
                </div>
                <div className="flex gap-2 md:gap-4">
                  <div className="w-4 h-4 md:w-8 md:h-8 rounded-full bg-brand text-dark flex items-center justify-center font-bold shrink-0 text-[8px] md:text-sm">3</div>
                  <div>
                    <h4 className="text-[10px] md:text-base font-bold">Launch App</h4>
                    <p className="text-gray-400 text-[8px] md:text-sm leading-tight">Open directly from your home screen.</p>
                  </div>
                </div>
                <div className="pt-2 md:pt-4">
                  <button 
                    onClick={() => window.dispatchEvent(new Event('show-pwa-install'))}
                    className="w-full bg-brand text-dark px-2 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 hover:scale-[1.02] transition-transform"
                  >
                    <Download size={12} />
                    Install
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-dark-lighter">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use the Mobile App?</h2>
            <p className="text-gray-400">Optimized for your luxury wedding planning journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="p-8 rounded-3xl bg-dark border border-white/5 hover:border-brand/30 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
