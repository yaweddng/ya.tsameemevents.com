import React from 'react';
import { motion } from 'framer-motion';

const images = [
  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-white-gold-wedding-stage-decoration-marble-floral-arch.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-marquee-tent-fairy-lights.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-mansion-wedding-decor-outdoor-lighting.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-gold-white-outdoor-wedding-stage-decor.webp",
  "https://tsameemevents.com/wp-content/uploads/dubai-corporate-event-outdoor-venue-burj-khalifa.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-dinner-party-geodesic-dome-sunset.webp",
  "https://tsameemevents.com/wp-content/uploads/luxury-middle-eastern-desert-gala-dinner-event-setup.webp",
  "https://tsameemevents.com/wp-content/uploads/ramadan-iftar-outdoor-luxury-dinner-celebration.webp"
];

export const Gallery = () => {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">Our <span className="font-script text-gradient-brand text-6xl lowercase animate-float inline-block">Portfolio</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A glimpse into the luxury events and weddings we've crafted across Dubai.
          </p>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="relative group rounded-3xl overflow-hidden cursor-zoom-in hover:shadow-[0_0_30px_rgba(0,200,150,0.3)] transition-all"
            >
              <img
                src={src}
                alt={src.split('/').pop()?.replace('.webp', '').replace(/-/g, ' ') || `Luxury wedding gallery image ${idx + 1}`}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-dark px-6 py-2 rounded-full font-bold text-sm">View Project</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
