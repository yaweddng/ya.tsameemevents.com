import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Gift, CreditCard, ArrowRight, CheckCircle2, AlertCircle, Share2, X, FileText, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Promo } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Tag: <Tag className="w-8 h-8 text-brand" />,
  Gift: <Gift className="w-8 h-8 text-brand" />,
  CreditCard: <CreditCard className="w-8 h-8 text-brand" />,
  Calendar: <Calendar className="w-8 h-8 text-brand" />,
  Star: <Star className="w-8 h-8 text-brand" />
};

export const Discounts = () => {
  const [selectedOffer, setSelectedOffer] = useState<Promo | null>(null);
  const [offers, setOffers] = useState<Promo[]>([]);

  useEffect(() => {
    fetch('/api/promos').then(res => res.json()).then(data => setOffers(data));
  }, []);

  const handleShare = async (offer: Promo, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `${offer.title} | YA Wedding Dubai`,
      text: offer.description,
      url: `${window.location.origin}/discounts#${offer.id}`
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Promo link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": offers.map((offer, index) => ({
              "@type": "Offer",
              "position": index + 1,
              "name": offer.title,
              "description": offer.description,
              "url": `https://ya.tssmeemevents.com/discounts#${offer.id}`,
              "availability": "https://schema.org/InStock"
            }))
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6"
          >
            Exclusive <span className="font-script text-gradient-brand text-6xl lowercase">Offers</span> & Promos
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Make your dream luxury wedding more accessible with our curated seasonal offers and exclusive discounts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-20">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              id={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:border-brand/50 transition-colors flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full -z-10 group-hover:bg-brand/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  {iconMap[offer.icon] || <Tag className="w-8 h-8 text-brand" />}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {offer.badge && (
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                      {offer.badge}
                    </span>
                  )}
                  <button 
                    onClick={(e) => handleShare(offer, e)}
                    className="p-2 text-gray-400 hover:text-brand bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                    title="Share Promo"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed flex-grow">
                {offer.description}
              </p>

              <div className="space-y-3 mb-8">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-brand" /> Quick Terms
                </h4>
                {offer.terms.slice(0, 2).map((term, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 mt-auto">
                <button 
                  onClick={() => setSelectedOffer(offer)}
                  className="w-full py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> View Full Details
                </button>
                <Link 
                  to={offer.link}
                  className="w-full py-3 rounded-xl bg-brand text-dark font-bold hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all flex items-center justify-center gap-2"
                >
                  Claim Offer <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-brand text-dark rounded-[40px] p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 shimmer-effect opacity-50" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to plan your luxury wedding?</h2>
            <p className="text-dark/80 text-lg mb-8">
              Contact our senior planners today to discuss your vision and learn how you can apply these exclusive offers to your bespoke wedding package.
            </p>
            <Link 
              to="/contact"
              className="inline-flex items-center gap-2 bg-dark text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all hover:scale-105"
            >
              Book Free Consultation <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Full View Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedOffer(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button 
                onClick={() => setSelectedOffer(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand/10 p-4 rounded-2xl">
                  {iconMap[selectedOffer.icon] || <Tag className="w-8 h-8 text-brand" />}
                </div>
                <div>
                  <h2 className="text-3xl font-bold">{selectedOffer.title}</h2>
                  {selectedOffer.badge && (
                    <span className="inline-block mt-2 bg-brand/10 text-brand px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand/20">
                      {selectedOffer.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-3 text-brand">Offer Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedOffer.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-brand">Terms & Conditions</h3>
                  <ul className="space-y-2">
                    {selectedOffer.terms.map((term: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle2 className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-3 text-brand">Detailed Agreements & Cancellation Policy</h3>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm">
                      {selectedOffer.fullDetails.trim()}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
                  <Link 
                    to={selectedOffer.link}
                    className="flex-1 py-4 rounded-xl bg-brand text-dark font-bold hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    Claim This Offer <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button 
                    onClick={(e) => handleShare(selectedOffer, e)}
                    className="py-4 px-8 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
