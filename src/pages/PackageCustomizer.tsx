import React from 'react';
import { motion } from 'framer-motion';
import PackageBuilder from '../components/PackageBuilder';
import { Sparkles, ShieldCheck, Clock, Heart } from 'lucide-react';

export const PackageCustomizer = () => {
  return (
    <div className="pt-32 pb-20 bg-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-sm font-bold mb-6"
          >
            <Sparkles size={16} />
            Advanced Package Builder
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Design Your <span className="font-script text-brand-light text-5xl md:text-7xl lowercase animate-float inline-block">Dream</span> Wedding
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Use our interactive tool to select services, add custom requests, and get an instant estimate for your luxury celebration in Dubai.
          </motion.p>
        </div>

        {/* Main Builder Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10"
        >
          <PackageBuilder isFullPage={true} />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          {[
            {
              icon: <ShieldCheck className="text-brand" size={32} />,
              title: "Verified Quality",
              desc: "All services are delivered by our in-house experts and premium partners."
            },
            {
              icon: <Clock className="text-brand" size={32} />,
              title: "Instant Estimate",
              desc: "Get a clear idea of your investment immediately as you build your plan."
            },
            {
              icon: <Heart className="text-brand" size={32} />,
              title: "Tailored for You",
              desc: "Every package is unique. We adjust to your theme, guest count, and vision."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-brand/30 transition-all group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
};

export default PackageCustomizer;
