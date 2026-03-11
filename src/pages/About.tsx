import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Heart } from 'lucide-react';

import { useCMSData } from '../hooks/useCMSData';
import { CMSWidgets } from '../components/CMSWidgets';

export const About = () => {
  const { settings } = useCMSData('about');

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "YA Wedding",
      "description": "Luxury Wedding and Event Planner in Dubai, UAE.",
      "url": "https://ya.tssmeemevents.com",
      "logo": "https://ya.tssmeemevents.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Abu Hail Center, 2nd Floor - Hor Al Anz - Deira",
        "addressLocality": "Dubai",
        "addressCountry": "UAE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+971505588842",
        "contactType": "customer service"
      }
    }
  };

  return (
    <div className="pt-32 pb-24">
      <script type="application/ld+json">
        {JSON.stringify(aboutSchema)}
      </script>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-block bg-brand/10 text-brand px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h1 className="text-6xl font-bold leading-tight">
              Crafting <span className="font-script text-gradient-brand text-7xl lowercase animate-float inline-block">Luxury</span> <br />
              Dubai Weddings Since 2015
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              YA Wedding is a premier luxury wedding and event planning agency based in the heart of Dubai. 
              We specialize in creating bespoke celebrations that reflect the unique personalities and 
              cultural heritage of our clients.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-brand mt-1" size={20} />
                <div>
                  <h4 className="font-bold">Expert Planners</h4>
                  <p className="text-sm text-gray-400">Certified professionals with years of experience.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-brand mt-1" size={20} />
                <div>
                  <h4 className="font-bold">Luxury Network</h4>
                  <p className="text-sm text-gray-400">Access to the most exclusive venues in the UAE.</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[16/9] md:aspect-[3/2] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src={settings?.aboutImage || "https://tsameemevents.com/wp-content/uploads/working-on-wedding-stage-deocration-in-a-wedding-arch-in-dubai.webp"} 
                alt="YA Wedding Team at Work"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>

        {/* Stats Section - Centered */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-24">
          {(settings?.aboutStats || [
            { label: "Years Experience", value: "10+" },
            { label: "Weddings Planned", value: "500+" },
            { label: "Team Members", value: "20+" },
            { label: "Happy Clients", value: "100%" }
          ]).map((stat: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-brand p-6 md:p-8 rounded-2xl md:rounded-[30px] shadow-xl md:shadow-2xl min-w-[140px] md:min-w-[180px] text-center group hover:scale-105 transition-transform"
            >
              <div className="text-dark">
                <div className="text-3xl md:text-4xl font-black mb-1">{stat.value}</div>
                <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest opacity-80">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: Award, title: "Award Winning", desc: "Recognized as Dubai's top luxury wedding planner for 3 consecutive years." },
            { icon: Users, title: "Client Focused", desc: "We limit our bookings to ensure every couple receives our undivided attention." },
            { icon: Heart, title: "Passion Driven", desc: "We don't just plan events; we create memories that last a lifetime." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="glass-card p-10 rounded-[40px] text-center space-y-4 hover:border-brand/30 transition-all"
            >
              <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <item.icon className="text-brand" size={32} />
              </div>
              <h3 className="text-2xl font-bold">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Planning Process</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">We follow a structured yet flexible approach to ensure your wedding is planned to perfection without the stress.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "We start with a deep dive into your vision, style, and budget requirements." },
              { step: "02", title: "Design & Concept", desc: "Our creative team develops a unique visual concept and moodboard for your approval." },
              { step: "03", title: "Vendor Selection", desc: "We handpick the best vendors in Dubai that align with your style and budget." },
              { step: "04", title: "Execution", desc: "On the big day, we manage every single detail so you can focus on celebrating." }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="relative p-8 glass-card rounded-3xl border border-white/5 hover:border-brand/20 transition-all"
              >
                <div className="text-5xl font-bold text-brand/20 absolute top-4 right-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-4 mt-4">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[60px] p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold">Our Mission</h2>
            <p className="text-xl text-gray-300 italic">
              "To redefine luxury wedding planning in the UAE by blending traditional Emirati values 
              with modern international standards of excellence."
            </p>
            <div className="h-1 w-24 bg-brand mx-auto" />
            <p className="text-gray-400">
              Founded in 2015, YA Wedding has grown from a boutique agency to a full-service event 
              management powerhouse. Our team of 20+ specialists covers everything from floral 
              design to technical production.
            </p>
          </div>
        </div>
      </div>
      <CMSWidgets slug="about" excludeTypes={['about']} />
    </div>
  );
};
