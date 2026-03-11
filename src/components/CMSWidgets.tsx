import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { CheckCircle2, ArrowRight, Star, Tag, CheckCircle, Gift, CreditCard, Calendar, Camera, Check, Download, Sparkles } from 'lucide-react';
import { Page, Widget, Service, Blog, Promo, BookingForm as BookingFormType, Rating } from '../types';
import { BookingForm } from './BookingForm';
import PackageBuilder from './PackageBuilder';
import { useCMSData } from '../hooks/useCMSData';

export const DecoratedHeadline = ({ title, subtitle, centered = false, className = "", size = "normal" }: { title: string, subtitle?: string, centered?: boolean, className?: string, size?: "normal" | "large" }) => {
  const words = title.split(' ');
  const lastWord = words.pop();
  const mainText = words.join(' ');

  const titleClasses = size === "large" 
    ? "text-5xl md:text-7xl font-bold mb-6 leading-tight"
    : "text-4xl md:text-5xl font-bold mb-4 leading-tight";
  
  const scriptClasses = size === "large"
    ? "font-script text-gradient-brand text-6xl md:text-8xl lowercase animate-float inline-block ml-2"
    : "font-script text-gradient-brand text-5xl md:text-6xl lowercase animate-float inline-block ml-2";

  return (
    <div className={`${centered ? 'text-center' : ''} ${className || 'mb-12'}`}>
      <h2 className={titleClasses}>
        {mainText}{' '}
        <span className={scriptClasses}>
          {lastWord}
        </span>
      </h2>
      {subtitle && (
        <p className={`text-gray-400 text-lg max-w-2xl ${centered ? 'mx-auto' : ''} leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

const iconMap: Record<string, React.ReactNode> = {
  Tag: <Tag className="w-6 h-6 text-brand" />,
  Gift: <Gift className="w-6 h-6 text-brand" />,
  CreditCard: <CreditCard className="w-6 h-6 text-brand" />,
  Calendar: <Calendar className="w-6 h-6 text-brand" />,
  Star: <Star className="w-6 h-6 text-brand" />
};

interface CMSWidgetsProps {
  slug: string;
  excludeTypes?: string[];
}

const PromosCarousel = ({ promos, config }: { promos: Promo[], config: any }) => {
  const [index, setIndex] = React.useState(0);
  const limit = config.limit || 10;
  const displayPromos = promos.slice(0, limit);
  
  React.useEffect(() => {
    if (displayPromos.length === 0) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayPromos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [displayPromos.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-center mb-6 gap-2">
        {displayPromos.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${index === i ? 'bg-brand w-6' : 'bg-white/20'}`}
          />
        ))}
      </div>
      <div className="relative h-[280px] sm:h-[300px]">
        <motion.div 
          className="flex gap-4 h-full"
          animate={{ x: `calc(10% - ${index * 80}% - ${index * 16}px)` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {displayPromos.map((promo) => (
            <div 
              key={promo.id}
              className="w-[80%] shrink-0 h-full"
            >
              <div className="w-full h-full glass-card rounded-2xl p-6 relative group hover:border-brand/30 transition-colors flex flex-col">
                {promo.badge && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand/10 text-brand px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-brand/20">
                      {promo.badge}
                    </span>
                  </div>
                )}
                <div className="bg-white/5 w-10 h-10 rounded-lg flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform">
                  {iconMap[promo.icon] || <Tag className="w-5 h-5 text-brand" />}
                </div>
                <h3 className="text-2xl sm:text-[30px] font-bold mb-2 leading-tight">{promo.title}</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4 line-clamp-3">{promo.description}</p>
                <Link 
                  to={`/discounts#${promo.id}`}
                  className="text-brand font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all w-fit mt-auto"
                >
                  Claim Offer <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export const CMSWidgets: React.FC<CMSWidgetsProps> = ({ slug, excludeTypes = [] }) => {
  const { page, services, blogs, promos, bookingForms, ratings, loading } = useCMSData(slug);

  if (loading || !page || !page.widgets) return null;

  const renderWidget = (widget: Widget) => {
    if (excludeTypes.includes(widget.type)) return null;

    const { type, config } = widget;

    const getSectionPadding = (config: any) => {
      if (config.heightType === 'pixel') {
        const desktopPadding = config.desktopCustomHeight || config.customHeight || 80;
        const mobilePadding = config.mobileCustomHeight || config.customHeight || 80;
        return {
          className: 'section-custom-padding',
          style: {
            '--padding-desktop': `${desktopPadding}px`,
            '--padding-mobile': `${mobilePadding}px`,
          } as React.CSSProperties
        };
      }
      return { className: 'py-20', style: {} };
    };

    const sectionPadding = getSectionPadding(config);

    switch (type) {
      case 'hero':
        return (
          <section key={widget.id} className={`relative pt-32 pb-20 overflow-hidden flex items-center min-h-[60vh] ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="absolute inset-0 z-0">
              <img src={config.image} alt={config.title} className="w-full h-full object-cover opacity-40" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark" />
            </div>
            <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {config.badge && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 backdrop-blur-md mb-8">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                    <span className="text-brand font-bold tracking-widest uppercase text-xs">
                      {config.badge}
                    </span>
                  </div>
                )}
                <DecoratedHeadline 
                  title={config.title} 
                  subtitle={config.subtitle} 
                  centered={true} 
                  size="large"
                  className="mb-10"
                />
                {config.ctaText && (
                  <Link 
                    to={config.ctaLink} 
                    className="relative group overflow-hidden bg-brand text-dark px-10 py-4 rounded-2xl font-bold text-lg transition-all inline-flex items-center gap-2 shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_50px_rgba(0,200,150,0.5)] hover:scale-[1.02]"
                  >
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{config.ctaText}</span>
                    <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </motion.div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-4xl mx-auto px-4">
              {(config.title || config.subtitle) && (
                <DecoratedHeadline 
                  title={config.title || ""} 
                  subtitle={config.subtitle} 
                  centered={config.centered} 
                />
              )}
              <div className="markdown-body prose prose-invert prose-brand max-w-none">
                <Markdown>{config.content}</Markdown>
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        const displayRatings = config.items && config.items.length > 0 ? config.items : ratings.slice(0, 6);
        if (displayRatings.length === 0) return null;

        // Duplicate items for infinite loop
        const marqueeItems = [...displayRatings, ...displayRatings, ...displayRatings];

        return (
          <section key={widget.id} className={`bg-dark-lighter ${sectionPadding.className} overflow-hidden`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 mb-12">
              <DecoratedHeadline 
                title={config.title || "What Our Clients Say"} 
                subtitle={config.subtitle || "Read what our happy couples have to say about their luxury wedding experiences in Dubai."}
                centered={true}
              />
            </div>
            
            <div className="relative w-full">
              {/* Gradient masks for smooth edges */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-lighter to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-lighter to-transparent z-10 pointer-events-none" />
              
              <motion.div 
                className="flex gap-4 md:gap-8 lg:gap-12 px-4"
                animate={{ x: ["-66.66%", "-33.33%"] }}
                transition={{
                  duration: 60,
                  ease: "linear",
                  repeat: Infinity,
                }}
                style={{ width: "max-content" }}
              >
                {marqueeItems.map((rating: any, idx: number) => (
                    <div 
                      key={rating.id ? `${rating.id}-${idx}` : idx} 
                      className="p-6 md:p-8 lg:p-10 glass-card rounded-[32px] md:rounded-[40px] text-center sm:text-left relative flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.3)] border-white/10 hover:border-brand/30 transition-all w-[300px] h-[480px] md:w-[400px] md:h-[520px] lg:w-[450px] lg:h-[550px] shrink-0 overflow-hidden"
                    >
                    <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-8">
                      <div className="flex text-brand gap-1 justify-center sm:justify-start">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={18} fill={s <= (rating.stars || 5) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 justify-center sm:justify-start max-w-full">
                        <CheckCircle size={18} className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)] shrink-0" />
                        <span className="px-3 py-1 bg-brand/10 text-brand text-[10px] font-bold uppercase rounded-lg border border-brand/20 truncate">
                          {rating.badge === 'Custom Writing' ? rating.customBadgeText : (rating.badge || "Verified")}
                        </span>
                      </div>
                    </div>
                    
                    <p 
                      className="text-gray-200 italic mb-6 flex-grow overflow-hidden"
                      style={{ 
                        fontSize: 'clamp(15px, 2vw, 20px)', 
                        lineHeight: 'clamp(20px, 2.2vw, 22px)',
                        display: '-webkit-box',
                        WebkitLineClamp: 6,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      "{(rating.content || rating.text || "").slice(0, 200)}{(rating.content || rating.text || "").length > 200 ? '...' : ''}"
                    </p>

                    {rating.showReviewImage && rating.reviewImage && (
                      <div className="mb-8 rounded-xl overflow-hidden aspect-video mx-auto sm:mx-0 max-w-md w-full">
                        <img src={rating.reviewImage} alt="Review" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mt-auto pt-6 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold overflow-hidden shrink-0 border border-brand/20">
                        {rating.showProfileImage && rating.profileImage ? (
                          <img src={rating.profileImage} alt={rating.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          rating.name?.charAt(0) || "U"
                        )}
                      </div>
                      <div className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="space-y-1">
                            <p className="font-bold text-white leading-none">{rating.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{rating.location || "Dubai"}</p>
                          </div>
                          {rating.budgetRange && (
                            <div className="sm:text-right">
                              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">Estimated</p>
                              <p className="text-[10px] text-brand font-bold">{rating.budgetRange}</p>
                            </div>
                          )}
                        </div>
                        {rating.services && rating.services.length > 0 && (
                          <div className="flex items-center justify-center sm:justify-start gap-1 mt-3 text-gray-400 max-w-full overflow-hidden">
                            <Tag size={10} className="text-brand shrink-0" />
                            <span className="text-[10px] font-medium truncate">{rating.services.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </section>
        );

      case 'booking_form':
        const form = bookingForms.find(f => f.id === config.formId);
        if (!form) return null;
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4">
              <DecoratedHeadline 
                title={config.title || form.name} 
                subtitle={config.subtitle || "Fill out the form below and our luxury event specialists will get back to you shortly."}
                centered={true}
              />
              <BookingForm form={form} />
            </div>
          </section>
        );

      case 'promos':
        return (
          <section key={widget.id} className={`bg-dark-lighter border-b border-white/5 overflow-hidden ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
                <DecoratedHeadline 
                  title={config.title || "On-going Promos & Discounts"} 
                  subtitle={config.subtitle || "Exclusive offers for your luxury wedding in Dubai."}
                  centered={false}
                  className="mb-0"
                />
                <Link to="/discounts" className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm md:mb-6 shrink-0">
                  View All Offers <ArrowRight size={16} />
                </Link>
              </div>

              <PromosCarousel promos={promos} config={config} />
            </div>
          </section>
        );

      case 'services':
        const displayServices = config.category 
          ? services.filter(s => s.category === config.category)
          : services.slice(0, config.limit || 3);

        return (
          <section key={widget.id} className={`bg-dark ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
                <DecoratedHeadline 
                  title={config.title || "Our Core Services"} 
                  subtitle={config.subtitle || "We offer a comprehensive range of services tailored to meet the highest standards of luxury and sophistication."}
                  centered={false}
                  className="mb-0"
                />
                <Link to="/services" className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all md:mb-6 shrink-0">
                  View All <ArrowRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {displayServices.map((service, idx) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="group glass-card rounded-3xl overflow-hidden hover:border-brand/30 transition-all relative flex flex-col h-full min-h-[550px]"
                  >
                    {service.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="relative overflow-hidden bg-brand text-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-xl border border-white/20 animate-border-glow">
                          <div className="absolute inset-0 shimmer-effect opacity-50" />
                          <span className="relative z-10">{service.badge}</span>
                        </span>
                      </div>
                    )}
                    <div className="h-64 overflow-hidden relative shrink-0">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                        <span className="bg-white/10 backdrop-blur-md text-white px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest w-fit">
                          {service.category}
                        </span>
                        <div className="bg-brand text-dark px-4 py-1 rounded-full text-xs font-bold shadow-xl">
                          From {service.currency} {service.price}
                        </div>
                      </div>
                      <div className="absolute top-4 left-4">
                        <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-white/10">
                          <Star size={10} className="text-brand fill-brand" />
                          {service.rating} ({service.reviewCount?.toLocaleString()} Reviews)
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold mb-3 line-clamp-2 min-h-[4rem]">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-3 min-h-[4.5rem]">{service.description}</p>
                      <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/5">
                        <Link
                          to={`/services/${service.id}`}
                          className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-2xl font-bold text-xs text-center transition-all border border-white/10"
                        >
                          Details
                        </Link>
                        <a
                          href={`https://wa.me/971505588842?text=${encodeURIComponent(`Hello, I want to book the ${service.name} service.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-brand text-dark px-4 py-3 rounded-2xl font-bold text-xs text-center transition-all border border-brand/20 hover:shadow-[0_0_15px_rgba(0,200,150,0.3)]"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  to="/services"
                  className="relative group overflow-hidden bg-brand text-dark px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(0,200,150,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">More Services</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        );

      case 'package_builder':
        return (
          <section key={widget.id} className={`bg-dark relative overflow-hidden ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <DecoratedHeadline 
                title={config.title || "Build Your Custom Package"} 
                subtitle={config.subtitle || "Select your preferred services and get an instant estimate for your luxury wedding in Dubai."}
                centered={true}
              />
              <PackageBuilder />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />
          </section>
        );

      case 'blogs':
        return (
          <section key={widget.id} className={`bg-dark ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 gap-6">
                <DecoratedHeadline 
                  title={config.title || "Latest from Our Blog"} 
                  subtitle={config.subtitle || "Discover the latest trends, tips, and inspiration for your luxury wedding in Dubai."}
                  centered={false}
                  className="mb-0"
                />
                <Link to="/blog" className="text-brand font-bold flex items-center gap-2 hover:gap-3 transition-all md:mb-6 shrink-0">
                  View All <ArrowRight size={18} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {blogs.slice(0, config.limit || 2).map((blog, idx) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="glass-card rounded-3xl overflow-hidden border border-white/5 h-full"
                  >
                    <Link to={`/blog/${blog.id}`} className="group flex flex-col xl:flex-row items-stretch h-full">
                      <div className="w-full xl:w-1/2 aspect-video xl:aspect-auto overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="w-full xl:w-1/2 p-6 md:p-8 xl:pr-10 xl:py-10 flex flex-col justify-center">
                        <span className="text-brand text-xs font-bold uppercase tracking-widest mb-3 block">{blog.date}</span>
                        <h3 className="text-xl md:text-2xl font-bold mb-4 group-hover:text-brand transition-colors leading-tight">{blog.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                        <span className="text-white font-bold text-sm border-b border-brand pb-1 w-fit">Read Article</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center">
                <Link
                  to="/blog"
                  className="relative group overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md hover:border-brand/50 px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  <span className="relative z-10">Read More</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section key={widget.id} className={`py-24 relative overflow-hidden ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="absolute inset-0 z-0">
              <img
                src={config.image || "https://tsameemevents.com/wp-content/uploads/luxury-mansion-wedding-decor-outdoor-lighting.webp"}
                alt={config.title}
                className="w-full h-full object-cover opacity-30"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/70" />
            </div>
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <DecoratedHeadline 
                  title={config.title || "Ready to Start Planning Your Perfect Day?"} 
                  subtitle={config.subtitle || "Contact our luxury event specialists today for a personalized consultation."}
                  centered={true}
                />
                <Link
                  to={config.link || "/contact"}
                  className="relative group overflow-hidden bg-brand text-dark px-12 py-5 rounded-2xl font-bold text-xl hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_50px_rgba(0,200,150,0.5)]"
                >
                  <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10">{config.buttonText || "Contact Us Now"}</span>
                  <ArrowRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </section>
        );

      case 'pwa_install':
        return (
          <section key={widget.id} className={`bg-dark py-24 relative overflow-hidden ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="flex justify-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20">
                  <Sparkles size={16} className="text-brand" />
                  <span className="text-brand text-xs font-bold uppercase tracking-widest">Get your mobile app now</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
                {/* Left Side: Phone Mockup */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="flex justify-start md:justify-end"
                >
                  <div className="relative scale-[0.9] sm:scale-95 md:scale-100 origin-left md:origin-center">
                    {/* Phone Mockup */}
                    <div className="relative w-[160px] h-[310px] sm:w-[180px] sm:h-[380px] md:w-[250px] md:h-[470px] bg-dark-lighter border-[6px] border-zinc-800 rounded-[1.5rem] shadow-2xl overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-zinc-800 rounded-b-xl z-20" />
                      <div className="absolute inset-0 p-1.5 pt-4">
                        <div className="w-full h-full bg-dark rounded-lg overflow-hidden border border-white/5 flex flex-col">
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
                            <div 
                              onClick={() => window.dispatchEvent(new Event('show-pwa-install'))}
                              className="p-1.5 md:p-2 rounded-xl md:rounded-2xl bg-brand/10 border border-brand/30 flex items-center gap-2 md:gap-3 relative overflow-hidden group shadow-[0_0_15px_rgba(0,200,150,0.1)] cursor-pointer hover:bg-brand/20 transition-colors"
                            >
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

                          <div className="h-8 md:h-10 border-t border-white/5 bg-dark-lighter/50 flex items-center justify-around px-2">
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-brand/40" />
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/10" />
                            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Right Side: Installation Steps */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-dark-lighter/50 backdrop-blur-sm p-4 sm:p-6 md:p-10 rounded-2xl md:rounded-[1.5rem] border border-white/5 relative overflow-hidden group h-[240px] md:h-[360px] lg:h-[420px] flex flex-col justify-center"
                >
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors" />
                  <h2 className="text-sm sm:text-xl md:text-2xl font-bold mb-2 md:mb-8 relative z-10">{config.title || "How to Install"}</h2>
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
                        className="w-full bg-brand text-dark px-2 py-1.5 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 hover:scale-[1.02] transition-transform hover:opacity-90"
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
        );

      case 'features':
        return (
          <section key={widget.id} className={`bg-lighter-dark/30 ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4">
              <DecoratedHeadline 
                title={config.title || "Our Features"} 
                subtitle={config.subtitle} 
                centered={config.centered !== false}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(config.items || []).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-8 rounded-3xl hover:border-brand/50 transition-all group"
                  >
                    <div className="mb-6 transform group-hover:scale-110 transition-transform">
                      {item.icon && iconMap[item.icon] ? iconMap[item.icon] : <CheckCircle2 className="text-brand" size={24} />}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-4xl mx-auto px-4">
              <DecoratedHeadline 
                title={config.title || "Frequently Asked Questions"} 
                subtitle={config.subtitle || "Find answers to common questions about our luxury event planning services."}
                centered={true}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(config.items || [
                  { q: "How do I book a consultation?", a: "You can book a consultation through our contact page or by calling us directly." },
                  { q: "What areas do you serve?", a: "We primarily serve Dubai and the surrounding Emirates." }
                ]).map((item: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-8 rounded-3xl border border-white/5 hover:border-brand/30 transition-all"
                  >
                    <h4 className="text-xl font-bold mb-4 text-brand">{item.q}</h4>
                    <p className="text-gray-400 leading-relaxed">{item.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={widget.id} className={`bg-dark-lighter ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4">
              <DecoratedHeadline 
                title={config.title || "Our Portfolio"} 
                subtitle={config.subtitle || "A glimpse into the luxury weddings and events we've brought to life in Dubai."}
                centered={true}
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(config.images || [
                  "https://tsameemevents.com/wp-content/uploads/luxury-rose-gold-wedding-decor-dubai-skyline.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxurious-gold-and-white-wedding-stage-decoration.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxury-evening-event-dubai-burj-khalifa.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxury-rose-gold-wedding-decor-dubai-skyline.webp"
                ]).map((img: string, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="aspect-square rounded-2xl overflow-hidden group relative"
                  >
                    <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Gallery" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-brand/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Sparkles className="text-white" size={32} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'stats':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-8">
                {(config.stats || [
                  { label: "Experience", value: "10+" },
                  { label: "Events", value: "500+" },
                  { label: "Team", value: "20+" }
                ]).map((stat: any, idx: number) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-brand p-8 rounded-[30px] min-w-[200px] text-center shadow-2xl relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-dark relative z-10">
                      <div className="text-4xl font-black mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="cms-widgets">
      {page.widgets.sort((a, b) => a.weight - b.weight).map(renderWidget)}
    </div>
  );
};
