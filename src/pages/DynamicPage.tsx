import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Page, Widget, Service, Blog, Promo, VisualLayout, VisualSection, VisualColumn, VisualComponent } from '../types';
import Markdown from 'react-markdown';
import { CheckCircle2, ArrowRight } from 'lucide-react';

import { About } from './About';
import { Discounts } from './Discounts';
import { PackageCustomizer } from './PackageCustomizer';
import { Contact } from './Contact';
import { BookingForm } from '../components/BookingForm';
import { BookingForm as BookingFormType } from '../types';

import { useCMSData } from '../hooks/useCMSData';
import { CMSWidgets } from '../components/CMSWidgets';

export const DynamicPage = ({ slugOverride, username }: { slugOverride?: string; username?: string }) => {
  const { slug: routeSlug } = useParams();
  const slug = slugOverride || routeSlug;
  const { page, services, blogs, promos, bookingForms, loading } = useCMSData(slug, username);

  if (loading) return <div className="pt-40 pb-20 text-center">Loading...</div>;
  if (!page) return <div className="pt-40 pb-20 text-center">Page not found</div>;

  const renderWidget = (widget: Widget) => {
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
      // Check for legacy padding config
      if (config.paddingTop !== undefined || config.paddingBottom !== undefined) {
        return {
          className: '',
          style: {
            paddingTop: config.paddingTop !== undefined ? `${config.paddingTop}px` : '80px',
            paddingBottom: config.paddingBottom !== undefined ? `${config.paddingBottom}px` : '80px'
          }
        };
      }
      // Default auto responsive padding: 80px (py-20) for all breakpoints as requested
      return {
        className: 'py-20',
        style: {}
      };
    };

    const sectionPadding = getSectionPadding(config);

    switch (type) {
      case 'hero':
        const desktopAlignClass = config.desktopAlignment === 'center' ? 'lg:text-center lg:mx-auto lg:max-w-4xl' : 
                                 config.desktopAlignment === 'right' ? 'lg:text-right lg:ml-auto lg:max-w-2xl' : 
                                 'lg:text-left lg:max-w-2xl';
        
        const mobileAlignClass = config.mobileAlignment === 'left' ? 'text-left max-w-2xl' : 
                                config.mobileAlignment === 'right' ? 'text-right ml-auto max-w-2xl' : 
                                'text-center mx-auto max-w-4xl';

        return (
          <section 
            key={widget.id} 
            className={`relative flex items-center overflow-hidden ${config.heightType === 'pixel' ? '' : (config.height || 'min-h-[60vh]')} ${sectionPadding.className}`}
            style={sectionPadding.style}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={config.image || "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"}
                alt={config.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div 
                className={`absolute inset-0 ${config.overlayGradient || 'bg-gradient-to-r from-dark via-dark/80 to-transparent'}`} 
                style={{ backgroundColor: config.overlayColor || 'transparent', opacity: config.overlayOpacity !== undefined ? config.overlayOpacity : 1 }}
              />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`space-y-8 ${mobileAlignClass} ${desktopAlignClass}`}
              >
                <h1 
                  className={`font-bold leading-tight ${config.titleSize || 'text-6xl'}`}
                  style={{ color: config.titleColor || 'inherit' }}
                >
                  {config.title || "Dynamic Page Title"}
                </h1>
                <p 
                  className={`text-gray-300 leading-relaxed ${config.subtitleSize || 'text-xl'}`}
                  style={{ color: config.subtitleColor || 'inherit' }}
                >
                  {config.subtitle || "Experience the pinnacle of luxury event planning in Dubai."}
                </p>
                {config.ctaText && (
                  <Link
                    to={config.ctaLink || "/contact"}
                    className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all group ${config.ctaClass || 'bg-brand text-dark hover:shadow-brand/20'}`}
                    style={{ 
                      backgroundColor: config.ctaBgColor, 
                      color: config.ctaTextColor 
                    }}
                  >
                    {config.ctaText} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                )}
              </motion.div>
            </div>
          </section>
        );

      case 'text':
        return (
          <section 
            key={widget.id} 
            className={`relative overflow-hidden ${sectionPadding.className}`}
            style={{ 
              backgroundColor: config.backgroundColor || 'transparent',
              backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              ...sectionPadding.style
            }}
          >
            {config.backgroundOverlay && (
              <div 
                className="absolute inset-0 z-0" 
                style={{ backgroundColor: config.backgroundOverlay }}
              />
            )}
            <div className={`relative z-10 px-4 sm:px-6 lg:px-8 mx-auto ${config.containerWidth || 'max-w-7xl'}`}>
              <div 
                className={`markdown-body prose prose-invert prose-brand max-w-none transition-all duration-300 ${
                  config.alignment === 'center' ? 'text-center mx-auto' : 
                  config.alignment === 'right' ? 'text-right ml-auto' : 'text-left'
                } ${config.fontWeight || 'font-normal'} ${config.letterSpacing || 'tracking-normal'} ${config.lineHeight || 'leading-relaxed'} ${config.fontFamily || 'font-sans'}`}
                style={{ 
                  fontSize: config.fontSize === 'lg' ? '1.25rem' : config.fontSize === 'xl' ? '1.5rem' : config.fontSize === 'sm' ? '0.875rem' : config.fontSize === 'xs' ? '0.75rem' : '1rem',
                  color: config.textColor || 'inherit',
                  opacity: config.opacity || 1
                }}
              >
                <Markdown>{config.content || "Add your content here..."}</Markdown>
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <About />
          </section>
        );

      case 'package_builder':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <PackageCustomizer />
          </section>
        );

      case 'discounts':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <Discounts />
          </section>
        );

      case 'contact':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <Contact />
          </section>
        );

      case 'services':
        const filteredServices = config.category 
          ? services.filter(s => s.category === config.category)
          : services.slice(0, config.limit || 3);

        return (
          <section key={widget.id} className={`bg-dark/50 ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "Our Services"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <Link key={service.id} to={`/services/${service.id}`} className="glass-card rounded-[40px] overflow-hidden group">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute top-6 right-6 bg-brand text-dark px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">{service.category}</div>
                    </div>
                    <div className="p-8 space-y-4">
                      <h3 className="text-2xl font-bold">{service.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{service.shortDescription}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-brand font-bold">From AED {service.price}</span>
                        <ArrowRight className="text-brand group-hover:translate-x-2 transition-transform" size={20} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'stats':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center gap-8">
                {(config.stats || [
                  { label: "Experience", value: "10+" },
                  { label: "Events", value: "500+" },
                  { label: "Team", value: "20+" }
                ]).map((stat: any, idx: number) => (
                  <div key={idx} className="bg-brand p-8 rounded-[30px] min-w-[200px] text-center shadow-2xl">
                    <div className="text-dark">
                      <div className="text-4xl font-black mb-1">{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'testimonials':
        return (
          <section key={widget.id} className={`bg-dark/50 ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "What Our Clients Say"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(config.items || [
                  { name: "Sarah & Ahmed", text: "YA Wedding made our dream wedding a reality. Every detail was perfect.", role: "Wedding Couple" },
                  { name: "Jessica M.", text: "Professional, creative, and highly organized. Highly recommended!", role: "Corporate Event" },
                  { name: "The Al-Fayed Family", text: "The most elegant celebration we've ever hosted. Thank you!", role: "Private Party" }
                ]).map((t: any, idx: number) => (
                  <div key={idx} className="glass-card p-8 rounded-[40px] space-y-4">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(s => <CheckCircle2 key={s} size={16} className="text-brand" />)}
                    </div>
                    <p className="text-gray-300 italic">"{t.text}"</p>
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-brand uppercase tracking-widest">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'blogs':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "Latest Stories"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogs.slice(0, config.limit || 3).map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.id}`} className="glass-card rounded-[40px] overflow-hidden group">
                    <div className="aspect-video overflow-hidden relative">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="p-8 space-y-4">
                      <div className="text-brand text-xs font-bold uppercase tracking-widest">{blog.category}</div>
                      <h3 className="text-2xl font-bold">{blog.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{blog.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={widget.id} className={`bg-dark/30 ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "Our Portfolio"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(config.images || [
                  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp",
                  "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"
                ]).map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                    <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt="Gallery" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "Frequently Asked Questions"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="space-y-4">
                {(config.items || [
                  { q: "How do we start?", a: "Contact us for a free consultation." },
                  { q: "What is the budget?", a: "We cater to various luxury budgets." }
                ]).map((item: any, idx: number) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl">
                    <h4 className="font-bold mb-2">{item.q}</h4>
                    <p className="text-gray-400 text-sm">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'promos':
        return (
          <section key={widget.id} className={sectionPadding.className} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`mb-16 ${config.headerAlignment === 'left' ? 'text-left' : config.headerAlignment === 'right' ? 'text-right' : 'text-center'}`}>
                <h2 
                  className={`font-bold mb-4 ${config.titleSize || 'text-4xl'}`}
                  style={{ color: config.titleColor }}
                >
                  {config.title || "Exclusive Offers"}
                </h2>
                <p 
                  className={`text-gray-400 ${config.subtitleSize || ''}`}
                  style={{ color: config.subtitleColor }}
                >
                  {config.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {promos.slice(0, config.limit || 2).map((promo) => (
                  <div key={promo.id} className="glass-card p-8 rounded-[40px] border-brand/20 border flex flex-col justify-between">
                    <div>
                      <div className="text-brand font-bold mb-4">{promo.badge}</div>
                      <h3 className="text-3xl font-bold mb-4">{promo.title}</h3>
                      <p className="text-gray-400 mb-6">{promo.description}</p>
                    </div>
                    <Link to={promo.link} className="text-brand font-bold flex items-center gap-2 hover:gap-4 transition-all">
                      Learn More <ArrowRight size={20} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'cta':
        return (
          <section 
            key={widget.id} 
            className={sectionPadding.className}
            style={{ backgroundColor: config.backgroundColor, ...sectionPadding.style }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div 
                className={`rounded-[60px] p-16 text-center relative overflow-hidden ${config.containerClass || 'glass-card'}`}
                style={{ backgroundColor: config.cardBgColor, color: config.cardTextColor }}
              >
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{ backgroundColor: config.overlayColor || 'rgba(0, 200, 150, 0.05)' }}
                />
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                  <h2 
                    className={`font-bold ${config.titleSize || 'text-4xl'}`}
                    style={{ color: config.titleColor }}
                  >
                    {config.title || "Ready to Start Planning?"}
                  </h2>
                  <p 
                    className={`opacity-80 ${config.subtitleSize || 'text-xl'}`}
                    style={{ color: config.subtitleColor }}
                  >
                    {config.subtitle}
                  </p>
                  <Link
                    to={config.link || "/contact"}
                    className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl transition-all group ${config.buttonClass || 'bg-brand text-dark hover:shadow-brand/20'}`}
                    style={{ backgroundColor: config.buttonBgColor, color: config.buttonTextColor }}
                  >
                    {config.buttonText || "Get in Touch"} <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );

      case 'booking_form':
        const form = bookingForms.find(f => f.id === config.formId);
        if (!form) return null;

        return (
          <section key={widget.id} className={`bg-dark ${sectionPadding.className}`} style={sectionPadding.style}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">{config.title || form.name}</h2>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto">{config.subtitle || form.description}</p>
              </div>
              <BookingForm form={form} />
            </div>
          </section>
        );

      default:
        return <div key={widget.id} className="py-10 text-center text-gray-500">Widget type "{type}" not implemented yet.</div>;
    }
  };

  const renderVisualComponent = (component: VisualComponent) => {
    const { type, content, style, settings, className, animate } = component;
    
    const baseStyle = {
      fontSize: style?.font_size,
      color: style?.color,
      backgroundColor: style?.background,
      margin: style?.margin,
      padding: style?.padding,
      border: style?.border,
      boxShadow: style?.shadow,
      textAlign: style?.alignment as any,
      fontFamily: style?.font_family,
      ...style
    };

    const ComponentWrapper = animate ? motion.div : 'div';
    const componentProps = animate ? { initial: animate.initial, animate: animate.animate, transition: animate.transition } : {};

    const renderContent = () => {
      switch (type) {
        case 'heading':
          return <h2 style={baseStyle} className={className}>{content}</h2>;
        case 'text':
          return <div style={baseStyle} className={`markdown-body prose prose-invert max-w-none ${className || ''}`}><Markdown>{content}</Markdown></div>;
        case 'image':
          return <img src={content} alt="" style={baseStyle} className={`w-full h-auto ${className || ''}`} referrerPolicy="no-referrer" />;
        case 'button':
          return (
            <Link to={settings?.link || '#'} style={baseStyle} className={`inline-block px-6 py-2 rounded-full font-bold ${className || ''}`}>
              {content}
            </Link>
          );
        case 'form':
          return <div className={`p-4 bg-white/5 rounded-xl border border-white/10 ${className || ''}`}>Form Placeholder: {settings?.formId}</div>;
        case 'cta_block':
          return (
            <div style={baseStyle} className={`p-8 rounded-3xl text-center ${className || ''}`}>
              <h3 className="text-2xl font-bold mb-4">{content?.title}</h3>
              <p className="mb-6 opacity-80">{content?.subtitle}</p>
              <Link to={settings?.link || '#'} className="bg-brand text-dark px-8 py-3 rounded-full font-bold inline-block">
                {content?.buttonText}
              </Link>
            </div>
          );
        default:
          return <div className={`p-4 border border-dashed border-white/20 opacity-50 ${className || ''}`}>Component {type}</div>;
      }
    };

    return (
      <ComponentWrapper key={component.id} {...componentProps}>
        {renderContent()}
      </ComponentWrapper>
    );
  };

  const renderVisualLayout = (layout: VisualLayout) => {
    return (
      <div className="visual-layout">
        {(layout.sections || []).map((section: VisualSection) => (
          <section 
            key={section.id} 
            style={{ 
              ...section.style,
              paddingTop: section.style?.paddingTop || '80px',
              paddingBottom: section.style?.paddingBottom || '80px'
            }}
            className="relative"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap -mx-4">
                {(section.columns || []).map((column: VisualColumn) => (
                  <div 
                    key={column.id} 
                    className="px-4" 
                    style={{ 
                      width: column.width || '100%',
                      ...column.style
                    }}
                  >
                    {(column.components || []).map(renderVisualComponent)}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-dark min-h-screen">
      <div className="widgets-container">
        {page.visualLayout ? renderVisualLayout(page.visualLayout) : <CMSWidgets slug={slug} />}
      </div>
    </div>
  );
};
