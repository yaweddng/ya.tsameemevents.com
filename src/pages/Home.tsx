import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Tag, Gift, CreditCard, Calendar, Smartphone } from 'lucide-react';
import { Service, Blog, Promo, Rating } from '../types';
import PackageBuilder from '../components/PackageBuilder';

import { CMSWidgets } from '../components/CMSWidgets';

import { useCMSData } from '../hooks/useCMSData';

const iconMap: Record<string, React.ReactNode> = {
  Tag: <Tag className="w-6 h-6 text-brand" />,
  Gift: <Gift className="w-6 h-6 text-brand" />,
  CreditCard: <CreditCard className="w-6 h-6 text-brand" />,
  Calendar: <Calendar className="w-6 h-6 text-brand" />,
  Star: <Star className="w-6 h-6 text-brand" />
};

export const Home = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [ratings, setRatings] = React.useState<Rating[]>([]);
  const { settings, page: cmsPage } = useCMSData('home');

  React.useEffect(() => {
    fetch('/api/services').then(res => res.json()).then(data => setServices(data.slice(0, 3)));
    fetch('/api/blogs').then(res => res.json()).then(data => setBlogs(data.slice(0, 4)));
    fetch('/api/promos').then(res => res.json()).then(data => setPromos(data));
    fetch('/api/ratings').then(res => res.json()).then(data => setRatings(data));
  }, []);

  const heroWidget = cmsPage?.widgets?.find((w: any) => w.type === 'hero');
  const heroConfig = heroWidget?.config || {};

  return (
    <div className="pt-20">
      <Helmet>
        <title>{settings?.siteName || 'Tsameem Events'} | Luxury Wedding & Event Planner Dubai</title>
        <meta name="description" content={settings?.siteDescription} />
        {ratings.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": settings?.siteName || "Tsameem Events",
              "review": ratings.map(r => ({
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": r.name
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": r.stars,
                  "bestRating": "5"
                },
                "reviewBody": r.content
              }))
            })}
          </script>
        )}
      </Helmet>
      {/* Hero Section */}
      <section 
        className="relative flex items-center overflow-hidden py-16 md:py-12"
        style={{ 
          minHeight: settings?.heroHeightMobile || '75vh',
          '--tablet-height': settings?.heroHeightTablet || '60vh',
          '--desktop-height': settings?.heroHeightDesktop || '50vh'
        } as React.CSSProperties}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 640px) { section { min-height: var(--tablet-height) !important; } }
          @media (min-width: 768px) { section { min-height: var(--desktop-height) !important; } }
        `}} />
        <div className="absolute inset-0 z-0">
          <img
            src={heroConfig.image || settings?.heroBackgroundImage || "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"}
            alt={heroConfig.title || "Luxury Outdoor Wedding Reception"}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Dark background overlay for better text visibility */}
          <div className="absolute inset-0 bg-dark/70" />
          <div className="absolute inset-0 luxury-gradient" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              <span className="text-brand font-bold tracking-widest uppercase text-xs">
                {heroConfig.badge || "Luxury Wedding Planner Dubai"}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {heroConfig.title ? (
                (() => {
                  const words = heroConfig.title.split(' ');
                  const lastWord = words.pop();
                  const mainText = words.join(' ');
                  return (
                    <>
                      {mainText}{' '}
                      <span className="font-script text-gradient-brand text-6xl md:text-8xl lowercase animate-float inline-block ml-2">
                        {lastWord}
                      </span>
                    </>
                  );
                })()
              ) : (
                <>
                  Crafting Your Dream Wedding with{' '}
                  <span className="font-script text-gradient-brand text-6xl md:text-8xl lowercase animate-float inline-block ml-2">
                    Elegance
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              {heroConfig.subtitle || "From intimate gatherings to grand celebrations, we bring your vision to life in the heart of Dubai."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={heroConfig.ctaLink || "/services"}
                className="relative group overflow-hidden bg-brand text-dark px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,200,150,0.3)] hover:shadow-[0_0_50px_rgba(0,200,150,0.5)] hover:scale-[1.02]"
              >
                <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">{heroConfig.ctaText || "Explore Services"}</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/mobile-app"
                onClick={() => window.dispatchEvent(new Event('show-pwa-install'))}
                className="relative group overflow-hidden border border-white/20 bg-white/5 backdrop-blur-md hover:border-brand/50 hover:bg-brand/20 px-10 py-4 rounded-2xl font-bold text-lg transition-all text-center flex items-center justify-center gap-2"
              >
                <Smartphone size={20} className="text-brand" />
                <span>Get Mobile App</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CMS Dynamic Content */}
      <CMSWidgets slug="home" excludeTypes={['hero']} />
    </div>
  );
};
