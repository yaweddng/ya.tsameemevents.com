import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  Instagram, 
  Facebook, 
  MapPin, 
  Clock, 
  Mail, 
  Search, 
  ChevronDown, 
  Home, 
  Sparkles, 
  Package, 
  Calendar, 
  Tag, 
  Info, 
  HelpCircle, 
  BookOpen, 
  Smartphone,
  Apple,
  Image as ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteSettings } from '../types';

import { useCMSData } from '../hooks/useCMSData';

const IconRenderer = ({ name, size = 18, className = "" }: { name: string, size?: number, className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};

export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { settings } = useCMSData('layout');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  if (!settings) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-bottom border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="text-2xl font-bold text-brand font-script">YA Wedding</Link>
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-lg border-bottom border-white/5">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            {settings.logoType === 'image' ? (
              <img src={settings.siteLogo} alt={settings.siteName} className="h-10 w-auto object-contain" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex items-center">
                {/* Desktop Logo */}
                <div className="hidden md:flex items-center">
                  <span className="text-2xl font-bold tracking-tighter text-brand font-script">
                    {settings.logoSettings?.header?.desktop?.part1 || 'YA'}
                  </span>
                  <span className="text-2xl font-bold tracking-tighter text-white ml-1">
                    {settings.logoSettings?.header?.desktop?.part2 || 'Wedding'}
                  </span>
                </div>
                {/* Mobile Logo */}
                <div className="md:hidden">
                  <span className="text-2xl font-bold tracking-tighter text-brand font-script">
                    {settings.logoSettings?.header?.mobile || 'YA'}
                  </span>
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {settings.header.menu.map((link) => (
              <div 
                key={link.id}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.url}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-brand py-8 ${
                    location.pathname === link.url || (link.subItems?.some(sub => location.pathname === sub.url))
                      ? 'text-brand' 
                      : 'text-gray-400'
                  }`}
                >
                  {link.icon && <IconRenderer name={link.icon} />}
                  <span>{link.label}</span>
                  {link.subItems && link.subItems.length > 0 && (
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                    />
                  )}
                </Link>

                {link.subItems && link.subItems.length > 0 && (
                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-48 bg-dark-lighter border border-white/5 rounded-xl shadow-2xl py-2 overflow-hidden"
                      >
                        {link.subItems.map((sub) => (
                          <Link
                            key={sub.url}
                            to={sub.url}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-brand ${
                              location.pathname === sub.url ? 'text-brand bg-white/5' : 'text-gray-400'
                            }`}
                          >
                            {sub.icon && <IconRenderer name={sub.icon} size={16} className="text-brand/70" />}
                            {sub.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Link 
                to="/inbox"
                className="text-gray-400 hover:text-brand transition-colors relative"
              >
                <MessageSquare size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-pulse" />
              </Link>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <Search size={20} />
              </button>
              {settings.header.ctas.map((cta, idx) => (
                <Link
                  key={idx}
                  to={cta.url}
                  className={`relative group overflow-hidden px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    cta.variant === 'primary' 
                      ? 'bg-brand text-dark hover:shadow-[0_0_20px_rgba(0,200,150,0.4)] animate-fast-pulse' 
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {cta.variant === 'primary' && <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />}
                  <span className="relative z-10">{cta.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-400 hover:text-brand transition-colors"
            >
              <Search size={20} />
            </button>
            <Link 
              to="/inbox"
              className="text-gray-400 hover:text-brand transition-colors relative"
            >
              <MessageSquare size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-pulse" />
            </Link>
            <button className="text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-dark-lighter border-t border-white/5 p-4 shadow-2xl"
          >
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative">
              <input
                autoFocus
                type="text"
                placeholder="Search services, blogs, ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark border border-white/10 rounded-xl px-6 py-4 pr-12 text-white outline-none focus:border-brand transition-all"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-brand">
                <Search size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-lighter border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {settings.header.menu.filter(link => !link.hideOnMobile).map((link) => (
                <div key={link.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      to={link.url}
                      onClick={() => !(link.subItems && link.subItems.length > 0) && setIsOpen(false)}
                      className={`flex items-center gap-3 py-3 text-lg font-medium transition-colors ${
                        location.pathname === link.url ? 'text-brand' : 'text-gray-300'
                      }`}
                    >
                      {link.icon && <IconRenderer name={link.icon} className="text-brand/70" />}
                      {link.label}
                    </Link>
                    {link.subItems && link.subItems.length > 0 && (
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                        className="p-2 text-gray-400"
                      >
                        <ChevronDown 
                          size={20} 
                          className={`transition-transform duration-200 ${activeDropdown === link.label ? 'rotate-180' : ''}`} 
                        />
                      </button>
                    )}
                  </div>
                  
                  {link.subItems && link.subItems.length > 0 && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-10 space-y-1 border-l border-white/5 ml-4"
                        >
                          {link.subItems.map((sub) => (
                            <Link
                              key={sub.url}
                              to={sub.url}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 py-3 text-base transition-colors ${
                                location.pathname === sub.url ? 'text-brand' : 'text-gray-400'
                              }`}
                            >
                              {sub.icon && <IconRenderer name={sub.icon} size={18} className="text-brand/50" />}
                              {sub.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
              <div className="pt-4 space-y-3">
                {settings.header.ctas.map((cta, idx) => (
                  <Link
                    key={idx}
                    to={cta.url}
                    onClick={() => setIsOpen(false)}
                    className={`block text-center py-4 rounded-xl font-bold transition-all ${
                      cta.variant === 'primary'
                        ? 'bg-brand text-dark shadow-lg shadow-brand/20'
                        : 'border border-white/10 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {settings.header.mobileMenu.ctaIcon && idx === 0 && <IconRenderer name={settings.header.mobileMenu.ctaIcon} size={20} />}
                      {cta.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export const Footer = () => {
  const { settings } = useCMSData('layout');

  if (!settings) {
    return (
      <footer className="bg-dark-lighter pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} YA Wedding. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-dark-lighter pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12">
        <div className="space-y-6 lg:col-span-2">
          <Link to="/" className="flex items-center gap-3">
            {settings.footer.logoType === 'image' ? (
              <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={settings.footer.logo || settings.siteLogo} 
                  alt={settings.siteName} 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-3xl font-bold font-script text-brand">
                  {settings.logoSettings?.footer?.part1 || 'YA'}
                </span>
                <span className="text-3xl font-bold text-white ml-1">
                  {settings.logoSettings?.footer?.part2 || 'Wedding'}
                </span>
              </div>
            )}
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            {settings.footer.description}
          </p>
          <div className="flex space-x-4">
            {settings.footer.socialLinks.map((social, idx) => (
              <a 
                key={idx} 
                href={social.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-gray-400 hover:text-brand transition-colors"
              >
                <IconRenderer name={social.icon} size={20} />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-8">
            <Link to="/mobile-app" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all group border border-white/5 max-w-[200px]">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Smartphone className="text-brand" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Android App</span>
                <span className="text-sm font-bold text-white">Google Play</span>
              </div>
            </Link>
            <Link to="/mobile-app" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-xl transition-all group border border-white/5 max-w-[200px]">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                <Apple className="text-brand" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">iPhone App</span>
                <span className="text-sm font-bold text-white">App Store</span>
              </div>
            </Link>
          </div>
        </div>

        {settings.footer.navigation.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-white font-bold mb-6">{section.title}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {section.items.map((item, iIdx) => (
                <li key={iIdx}>
                  <Link to={item.url} className="hover:text-brand transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {settings.footer.showContact !== false && (
          <div>
            <h4 className="text-white font-bold mb-6">{settings.footer.contactInfo.title}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {settings.footer.contactInfo.items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <IconRenderer name={item.icon} size={18} className="text-brand shrink-0" />
                  <div className="flex flex-col">
                    {item.label && <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{item.label}</span>}
                    <span>{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {settings.footer.showHours !== false && (
          <div>
            <h4 className="text-white font-bold mb-6">{settings.footer.moreInfo.title}</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              {settings.footer.moreInfo.items.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <IconRenderer name={item.icon} size={18} className="text-brand shrink-0" />
                  <div className="flex flex-col">
                    {item.label && <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{item.label}</span>}
                    <span>{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-500 text-xs">
          {settings.footer.copyrightText}
        </p>
        {settings.footer.showSEOTags !== false && (
          <div className="flex flex-wrap justify-center gap-4">
            {settings.footer.seoTags.map((tag, idx) => (
              <span key={idx} className="text-[10px] text-gray-600 uppercase tracking-widest">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {settings.footer.showCTA !== false && settings.footer.ctas?.filter((cta: any) => cta.show).map((cta: any, idx: number) => (
            <Link 
              key={idx}
              to={cta.url} 
              className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2"
            >
              {cta.icon && <IconRenderer name={cta.icon} size={14} />}
              {cta.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      {settings.floatingItems?.actionButtons?.show && (
        <div className={`fixed bottom-8 ${settings.floatingItems.actionButtons.position === 'left' ? 'left-8' : 'right-8'} flex flex-col space-y-4 z-40`}>
          {settings.floatingItems.actionButtons.items.filter((btn: any) => btn.show).map((btn: any, idx: number) => (
            <a
              key={idx}
              href={btn.url}
              target="_blank"
              rel="noreferrer"
              className={`${btn.icon === 'MessageSquare' ? 'bg-[#25D366]' : 'bg-brand'} text-white p-4 lg:px-6 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3`}
            >
              <IconRenderer name={btn.icon} size={24} className={btn.icon === 'MessageSquare' ? 'text-white' : 'text-dark'} />
              <span className="hidden lg:inline text-sm font-bold whitespace-nowrap">
                {btn.icon === 'MessageSquare' ? 'WhatsApp' : 'Call Now'}
              </span>
            </a>
          ))}
        </div>
      )}
    </footer>
  );
};
