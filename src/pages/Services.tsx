import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, Phone, MessageSquare, Info, Share2, X, ChevronRight, ChevronLeft, Send, Tag, MapPin, Star, Calendar, User, DollarSign, Plus, Minus, Mail, Upload, RefreshCw } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { Service, Rating } from '../types';

import { useCMSData } from '../hooks/useCMSData';
import { CMSWidgets } from '../components/CMSWidgets';

export const Services = () => {
  const { services } = useCMSData('services');

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">
            Our <span className="font-script text-gradient-brand text-6xl lowercase">Luxury</span> Services
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover our curated selection of premium wedding and event services in Dubai. Every detail is crafted to perfection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group glass-card rounded-3xl overflow-hidden flex flex-col relative"
            >
              {service.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`relative overflow-hidden px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl animate-border-glow ${
                    service.badge === 'Best Seller' ? 'bg-brand text-dark' :
                    service.badge === 'Trending' ? 'bg-violet-500 text-white' :
                    service.badge === 'Price Drop' ? 'bg-rose-500 text-white' :
                    'bg-emerald-500 text-white'
                  }`}>
                    <div className="absolute inset-0 shimmer-effect opacity-30" />
                    <span className="relative z-10">{service.badge}</span>
                  </span>
                </div>
              )}
              <div className="h-72 overflow-hidden relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit">
                      {service.category}
                    </span>
                    <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/10">
                      <Star size={10} className="text-brand fill-brand" />
                      {service.rating} ({service.reviewCount?.toLocaleString()} Reviews)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-brand text-dark px-4 py-1 rounded-full text-sm font-bold shadow-xl">
                      {service.currency} {service.price}
                    </div>
                    {service.oldPrice && (
                      <div className="bg-white/20 backdrop-blur-md text-white/60 px-3 py-1 rounded-full text-xs line-through">
                        {service.currency} {service.oldPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{service.name}</h3>
                  {service.discount && (
                    <span className="text-brand text-xs font-bold">-{service.discount}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-1">{service.description}</p>
                <div className="space-y-3 mb-8">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                      <CheckCircle size={14} className="text-brand" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-center py-3 rounded-xl text-sm font-bold transition-all border border-white/5"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/services/${service.id}?book=true`}
                    className="relative group overflow-hidden flex-1 bg-brand text-dark text-center py-3 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all animate-fast-pulse"
                  >
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">Book Now</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <CMSWidgets slug="services" excludeTypes={['services']} />
    </div>
  );
};

export const ServiceDetail = () => {
  const { id } = useParams();
  const { services: allServices } = useCMSData('services');
  const [isBookingOpen, setIsBookingOpen] = React.useState(new URLSearchParams(window.location.search).get('book') === 'true');
  const [bookingStep, setBookingStep] = React.useState(1);
  const [openFaqIndex, setOpenFaqIndex] = React.useState<number | null>(0);
  const [bookingData, setBookingData] = React.useState<any>({});

  const service = allServices.find((s: Service) => s.id === id);

  const relatedServices = allServices
    .filter(s => s.category === service?.category && s.id !== service?.id)
    .slice(0, 4);

  const recommendedServices = allServices
    .filter(s => s.id !== service?.id && (s.badge === 'Best Seller' || s.badge === 'Trending' || s.rating >= 4.8))
    .slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `YA Wedding - ${service?.name}`,
          text: service?.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get geotag if possible
    let geotag = 'Not provided';
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      geotag = `${pos.coords.latitude}, ${pos.coords.longitude}`;
    } catch (err) {
      console.warn('Geolocation failed:', err);
    }

    const bookingDetails = {
      packageTitle: service?.name,
      isCustomForm: false,
      pageLocation: window.location.href,
      geotag,
      ...bookingData
    };

    // 1. Send to backend (email notification)
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingDetails)
      });
    } catch (err) {
      console.error('Email notification failed:', err);
    }

    // 2. Prepare WhatsApp Message
    const formattedData = Object.entries(bookingData)
      .filter(([key]) => !['name', 'phone', 'email'].includes(key))
      .map(([key, value]) => `• *${key}:* ${value}`)
      .join('%0A');

    const message = `*NEW BOOKING REQUEST*%0A` +
      `--------------------------%0A` +
      `*Service:* ${service?.name}%0A` +
      `*Client:* ${bookingData.name}%0A` +
      `*Email:* ${bookingData.email}%0A` +
      `*Phone:* ${bookingData.phone}%0A` +
      `--------------------------%0A` +
      `*Details:*%0A${formattedData}%0A%0A` +
      `_Sent from ya.tssmeemevents.com_`;

    // 3. Show success and redirect
    alert('Booking details saved! Redirecting to WhatsApp to finalize your request...');
    window.open(`https://wa.me/971505588842?text=${message}`, '_blank');
    
    setIsBookingOpen(false);
    setBookingStep(1);
    setBookingData({});
  };

  if (!service) return <div className="pt-40 text-center">Loading...</div>;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <Link to="/services" className="text-brand flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                <ArrowRight className="rotate-180" size={16} /> Back to Services
              </Link>
              <button onClick={handleShare} className="text-gray-400 hover:text-brand flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">
                <Share2 size={18} /> Share
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-brand/10 text-brand px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {service.category}
                </span>
                {service.badge && (
                  <span className="bg-white/5 text-gray-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
                    {service.badge}
                  </span>
                )}
              </div>
              <h1 className="text-5xl font-bold leading-tight">
                {service.name.split(' ').map((word, i) => (
                  i === 0 ? <span key={i}>{word} </span> : <span key={i} className={i === 1 ? "font-script text-gradient-brand text-6xl lowercase" : ""}>{word} </span>
                ))}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex text-brand">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      size={16} 
                      fill={s <= Math.round(service.rating || 0) ? "currentColor" : "none"} 
                      className={s <= Math.round(service.rating || 0) ? "" : "text-gray-600"}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">
                  {service.rating} ({service.reviewCount?.toLocaleString()} Reviews)
                </span>
              </div>
              <p className="text-brand font-medium italic">{service.shortDescription}</p>
              
              <div className="flex flex-wrap gap-4 py-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-brand" />
                  <span>Available in: {service.serviceAreas.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Tag size={16} className="text-brand" />
                  <div className="flex gap-2">
                    {service.tags.map(tag => (
                      <span key={tag} className="hover:text-brand transition-colors cursor-default">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-brand">{service.currency} {service.price}</span>
                  <span className="text-gray-500 text-[10px] uppercase tracking-widest">Starting Price</span>
                </div>
                {service.oldPrice && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-500 line-through">{service.currency} {service.oldPrice}</span>
                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">Save {service.discount}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed">
              {service.description}
            </p>

            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">What's Included:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle size={20} className="text-brand shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="relative group overflow-hidden bg-brand text-dark px-10 py-4 rounded-full font-bold text-lg text-center hover:shadow-[0_0_30px_rgba(0,200,150,0.4)] transition-all animate-fast-pulse"
              >
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Book This Service</span>
              </button>
              <a
                href={`https://wa.me/971505588842?text=I'm interested in ${service.name}`}
                target="_blank"
                rel="noreferrer"
                className="border border-white/20 hover:bg-white/10 px-10 py-4 rounded-full font-bold text-lg text-center transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={20} /> WhatsApp Us
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-[40px] overflow-hidden shadow-2xl"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
            <div className="absolute bottom-10 left-10 right-10 p-8 glass-card rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-brand/20 p-3 rounded-full">
                  <Info className="text-brand" size={24} />
                </div>
                <h4 className="font-bold text-lg">Dubai's Most Demanded</h4>
              </div>
              <p className="text-sm text-gray-300">
                This service is highly sought after in Dubai's luxury wedding market. We recommend booking at least 1-3 Weeks in advance.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Multi-step Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md rounded-[32px] overflow-hidden relative max-h-[85vh] flex flex-col"
            >
              {/* Sticky Header */}
              <div className="p-6 pb-4 border-b border-white/5 flex justify-between items-center bg-dark/50 backdrop-blur-md sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-1 w-8 bg-brand rounded-full" />
                    <span className="text-brand font-bold text-[10px] uppercase tracking-[0.2em]">Step {bookingStep} of 2</span>
                  </div>
                  <h2 className="text-xl font-bold">Book {service.name}</h2>
                </div>
                <button 
                  onClick={() => setIsBookingOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  {bookingStep === 1 ? (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            required
                            type="text"
                            value={bookingData.name || ''}
                            onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand transition-all"
                            placeholder="Your Name"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            required
                            type="email"
                            value={bookingData.email || ''}
                            onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand transition-all"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            required
                            type="tel"
                            value={bookingData.phone || ''}
                            onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-brand transition-all"
                            placeholder="+971 50 000 0000"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button 
                          type="button"
                          onClick={() => bookingData.name && bookingData.phone && bookingData.email && setBookingStep(2)}
                          className="w-full bg-brand text-dark py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all active:scale-[0.98]"
                        >
                          Next Step <ChevronRight size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {service.bookingOptions?.map((opt, i) => (
                        <div key={i} className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">{opt.label}</label>
                          {opt.type === 'select' ? (
                            <div className="relative">
                              <select
                                required={opt.required}
                                value={bookingData[opt.label] || ''}
                                onChange={(e) => setBookingData({...bookingData, [opt.label]: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all appearance-none"
                              >
                                <option value="" className="bg-dark">Select Option</option>
                                {opt.options?.map((o, idx) => <option key={idx} value={o} className="bg-dark">{o}</option>)}
                              </select>
                              <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                            </div>
                          ) : (
                            <input 
                              required={opt.required}
                              type={opt.type}
                              value={bookingData[opt.label] || ''}
                              onChange={(e) => setBookingData({...bookingData, [opt.label]: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all"
                            />
                          )}
                        </div>
                      ))}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Budget (AED)</label>
                          <div className="relative">
                            <select
                              required
                              value={bookingData.budget || ''}
                              onChange={(e) => setBookingData({...bookingData, budget: e.target.value})}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all appearance-none"
                            >
                              <option value="" className="bg-dark">Select Budget</option>
                              <option value="Under 10,000" className="bg-dark">Under 10,000</option>
                              <option value="10,000 - 25,000" className="bg-dark">10,000 - 25,000</option>
                              <option value="25,000 - 50,000" className="bg-dark">25,000 - 50,000</option>
                              <option value="50,000 - 100,000" className="bg-dark">50,000 - 100,000</option>
                              <option value="100,000+" className="bg-dark">100,000+</option>
                            </select>
                            <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 rotate-90 pointer-events-none" />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Custom Price</label>
                          <input 
                            type="text"
                            value={bookingData.customPrice || ''}
                            onChange={(e) => setBookingData({...bookingData, customPrice: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-all"
                            placeholder="e.g. 15,000 AED"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 sticky bottom-0 bg-dark/50 backdrop-blur-md -mx-6 -mb-6 p-6 border-t border-white/5">
                        <button 
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="flex-1 bg-white/5 hover:bg-white/10 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <ChevronLeft size={18} /> Back
                        </button>
                        <button 
                          type="submit"
                          className="flex-[2] bg-brand text-dark py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all active:scale-[0.98]"
                        >
                          Complete Booking <Send size={18} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Service FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="mt-32 pt-24 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Service FAQ</h2>
              <p className="text-gray-400">Common questions about {service.name}.</p>
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq: any, idx: number) => (
                <div 
                  key={idx}
                  className="glass-card rounded-3xl overflow-hidden border border-white/5"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold pr-8">{faq.question}</span>
                    <div className="flex-shrink-0 text-brand">
                      {openFaqIndex === idx ? <Minus size={20} /> : <Plus size={20} />}
                    </div>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed">
                      <div className="h-px bg-white/10 mb-4" />
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

            {/* Rating Form Section */}
            <section className="mt-32 pt-24 border-t border-white/5 bg-dark-lighter/30">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4">Leave a Review</h2>
                  <p className="text-gray-400">Your feedback helps us maintain our luxury standards in Dubai.</p>
                </div>
                <RatingForm serviceId={service.id} serviceName={service.name} />
              </div>
            </section>

            {/* Related Services Carousel */}
            {relatedServices.length > 0 && (
              <section className="mt-32 pt-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-3xl font-bold mb-4">Related Services</h2>
                      <p className="text-gray-400">Other premium options in the {service.category} category.</p>
                    </div>
                    <Link to="/services" className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      View All <ArrowRight size={18} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedServices.map((rel) => (
                      <Link 
                        key={rel.id} 
                        to={`/services/${rel.id}`}
                        className="glass-card rounded-2xl overflow-hidden group block"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img src={rel.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rel.name} />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-3 left-3">
                            <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1 border border-white/10">
                              <Star size={8} className="text-brand fill-brand" />
                              {rel.rating}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{rel.name}</h4>
                          <p className="text-brand font-bold text-sm">{rel.currency} {rel.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Recommended Services Carousel */}
            {recommendedServices.length > 0 && (
              <section className="mt-32 pt-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-3xl font-bold mb-4">Recommended For You</h2>
                      <p className="text-gray-400">Popular services frequently booked by our customers.</p>
                    </div>
                    <Link to="/services" className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      View All <ArrowRight size={18} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedServices.map((rec) => (
                      <Link 
                        key={rec.id} 
                        to={`/services/${rec.id}`}
                        className="glass-card rounded-2xl overflow-hidden group block relative"
                      >
                        {rec.badge && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className={`relative overflow-hidden px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter shadow-xl ${
                              rec.badge === 'Best Seller' ? 'bg-brand text-dark' :
                              rec.badge === 'Trending' ? 'bg-violet-500 text-white' :
                              'bg-emerald-500 text-white'
                            }`}>
                              <span className="relative z-10">{rec.badge}</span>
                            </span>
                          </div>
                        )}
                        <div className="h-40 overflow-hidden relative">
                          <img src={rec.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rec.name} />
                          <div className="absolute inset-0 bg-black/20" />
                          <div className="absolute top-3 left-3">
                            <div className="bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] font-bold flex items-center gap-1 border border-white/10">
                              <Star size={8} className="text-brand fill-brand" />
                              {rec.rating}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-1 group-hover:text-brand transition-colors">{rec.name}</h4>
                          <p className="text-brand font-bold text-sm">{rec.currency} {rec.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
    </div>
  );
};

const RatingForm = ({ serviceId, serviceName }: { serviceId: string; serviceName: string }) => {
  const [rating, setRating] = React.useState(5);
  const [hover, setHover] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState<string>('');
  const [servicePhoto, setServicePhoto] = React.useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      location: formData.get('location'),
      stars: rating,
      content: formData.get('content'),
      services: [serviceName],
      budgetRange: formData.get('budgetRange') || 'Premium',
      badge: formData.get('package') || 'Elite',
      profileImage: profileImage,
      reviewImage: servicePhoto,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 rounded-[2.5rem] text-center space-y-6"
      >
        <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto text-brand">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold">Thank You!</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Your review has been submitted and is currently pending approval by our team.
        </p>
      </motion.div>
    );
  }

  return (
    <section className="glass-card p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] -z-10" />
      
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">Leave a Review</h2>
          <p className="text-gray-400">Share your experience with {serviceName}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={star <= (hover || rating) ? 'text-brand fill-brand' : 'text-gray-600'}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-brand uppercase tracking-widest">
              {rating === 5 ? 'Exceptional' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : 'Poor'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Name</label>
              <input
                name="name"
                required
                className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</label>
              <input
                name="location"
                required
                className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                placeholder="Dubai, UAE"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Write Review</label>
            <textarea
              name="content"
              required
              rows={4}
              className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all resize-none"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Advanced Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div>
              <h4 className="font-bold text-sm">Advanced Options</h4>
              <p className="text-xs text-gray-400">Add more details and photos to your review</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${showAdvanced ? 'bg-brand' : 'bg-gray-600'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${showAdvanced ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-6 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Packages</label>
                  <select
                    name="package"
                    className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all appearance-none"
                  >
                    <option value="">Select a Package (Optional)</option>
                    {['Elite', 'Traditional', 'Premium', 'Luxury', 'Emarati', 'Indian', 'Asian', 'Western', 'African', 'Basic'].map(pkg => (
                      <option key={pkg} value={pkg}>{pkg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Budget Range</label>
                  <input
                    name="budgetRange"
                    className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                    placeholder="e.g. 50k - 100k AED"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  label="Your Profile Photo"
                  value={profileImage}
                  onChange={setProfileImage}
                />
                <ImageUpload
                  label="Service Photo"
                  value={servicePhoto}
                  onChange={setServicePhoto}
                />
              </div>
            </motion.div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-brand text-dark py-5 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="animate-spin" size={20} />
                Submitting...
              </>
            ) : (
              'Submit Review'
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
