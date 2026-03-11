import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Header, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { Services, ServiceDetail } from './pages/Services';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { Gallery } from './pages/Gallery';
import { Blog, BlogDetail } from './pages/Blog';
import { Search } from './pages/Search';
import { About } from './pages/About';
import { FAQ } from './pages/FAQ';
import { PackageCustomizer } from './pages/PackageCustomizer';
import { Discounts } from './pages/Discounts';
import Partnerships from './pages/Partnerships';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { MobileApp } from './pages/MobileApp';
import { AdminSecurityCheck } from './pages/AdminSecurityCheck';
import ScrollToTop from './components/ScrollToTop';
import { HelpTab } from './components/HelpTab';
import { PWAInstallPopup } from './components/PWAInstallPopup';

import { Packages } from './pages/Packages';
import { DynamicPage } from './pages/DynamicPage';
import { BookingPage } from './pages/BookingPage';
import { SiteSettings } from './types';

import { useCMSData } from './hooks/useCMSData';

const SEO = ({ title, description, schema, image }: { title: string; description: string; schema?: any; image?: string }) => {
  const location = useLocation();
  const { settings } = useCMSData('layout');
  const currentUrl = `https://ya.tssmeemevents.com${location.pathname}${location.search}`;
  
  const siteName = settings?.siteName || "YA Wedding";
  const siteTitle = settings?.siteTitle || "Dubai's Premier Luxury Wedding Planner";
  let globalSchema = null;
  
  try {
    if (settings?.autoSchema?.enabled && settings.autoSchema.data) {
      globalSchema = {
        "@context": "https://schema.org",
        "@type": settings.autoSchema.type,
        "name": settings.autoSchema.data.name,
        "url": settings.autoSchema.data.url,
        "logo": settings.autoSchema.data.logo,
        "description": settings.autoSchema.data.description,
        ...(settings.autoSchema.data.address && { "address": settings.autoSchema.data.address }),
        ...(settings.autoSchema.data.telephone && { "telephone": settings.autoSchema.data.telephone }),
        ...(settings.autoSchema.data.priceRange && { "priceRange": settings.autoSchema.data.priceRange })
      };
    } else if (settings?.seoSchema) {
      globalSchema = JSON.parse(settings.seoSchema);
    }
  } catch (e) {
    console.error("Failed to parse global SEO schema", e);
  }

  return (
    <Helmet>
      <title>{title} | {siteName} {siteTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"} />
      <link rel="canonical" href={currentUrl} />
      {settings?.siteFavicon && <link rel="icon" type="image/png" href={settings.siteFavicon} />}
      {globalSchema && <script type="application/ld+json">{JSON.stringify(globalSchema)}</script>}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
      {settings?.googleSearchConsoleKey && <meta name="google-site-verification" content={settings.googleSearchConsoleKey} />}
      {settings?.googleAdsenseKey && (
        <script 
          async 
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.googleAdsenseKey}`} 
          crossOrigin="anonymous"
        />
      )}
    </Helmet>
  );
};

export default function App() {
  const [adminSlug, setAdminSlug] = React.useState('/admin-portal-access');
  const [siteInfo, setSiteInfo] = React.useState<{ username: string; siteId: string } | null>(null);
  const [siteLoading, setSiteLoading] = React.useState(true);

  React.useEffect(() => {
    // Admin slug fetch
    fetch('/api/admin/security/config')
      .then(res => res.json())
      .then(data => {
        if (data.slug) setAdminSlug(data.slug);
      })
      .catch(() => {});

    // Site detection
    const host = window.location.hostname;
    const platformDomain = "platform.com";
    
    if (host !== "localhost" && !host.includes(".run.app")) {
      fetch(`/api/site-lookup?host=${host}`)
        .then(res => res.json())
        .then(data => {
          if (data.username) {
            setSiteInfo({ username: data.username, siteId: data.siteId });
          }
          setSiteLoading(false);
        })
        .catch(() => setSiteLoading(false));
    } else {
      setSiteLoading(false);
    }
  }, []);

  if (siteLoading) return <div className="min-h-screen bg-dark flex items-center justify-center text-brand font-bold">Initializing Platform...</div>;

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* If we detected a site from the hostname, the root route should show that site */}
              {siteInfo ? (
                <>
                  <Route path="/" element={<DynamicPageWrapper username={siteInfo.username} slugOverride="home" isUserSite />} />
                  <Route path="/:slug" element={<DynamicPageWrapper username={siteInfo.username} isUserSite />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<DynamicPageWrapper slugOverride="home" />} />
                  <Route path="/services" element={<DynamicPageWrapper slugOverride="services" />} />
                  <Route path="/services/:id" element={<ServiceDetailWrapper />} />
                  <Route path="/gallery" element={<DynamicPageWrapper slugOverride="gallery" />} />
                  <Route path="/blog" element={<DynamicPageWrapper slugOverride="blog" />} />
                  <Route path="/blog/:id" element={<BlogDetailWrapper />} />
                  <Route path="/contact" element={<DynamicPageWrapper slugOverride="contact" />} />
                  <Route path="/search" element={
                    <>
                      <SEO title="Search Results" description="Search for luxury wedding services and blog posts in Dubai." />
                      <Search />
                    </>
                  } />
                  <Route path="/about" element={<DynamicPageWrapper slugOverride="about" />} />
                  <Route path="/faq" element={<DynamicPageWrapper slugOverride="faq" />} />
                  <Route path="/discounts" element={<DynamicPageWrapper slugOverride="discounts" />} />
                  <Route path="/package-builder" element={<DynamicPageWrapper slugOverride="package-builder" />} />
                  <Route path="/packages" element={<DynamicPageWrapper slugOverride="packages" />} />
                  <Route path="/help-center" element={<DynamicPageWrapper slugOverride="help-center" />} />
                  <Route path="/trust-safety" element={<DynamicPageWrapper slugOverride="trust-safety" />} />
                  <Route path="/terms-of-service" element={<DynamicPageWrapper slugOverride="terms-of-service" />} />
                  <Route path="/privacy-policy" element={<DynamicPageWrapper slugOverride="privacy-policy" />} />
                  <Route path="/partnerships" element={<DynamicPageWrapper slugOverride="partnerships" />} />
                  <Route path="/return-refund" element={<DynamicPageWrapper slugOverride="return-refund" />} />
                  <Route path="/booking/:id" element={<BookingPageWrapper />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path={adminSlug} element={<AdminSecurityCheck />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/mobile-app" element={<MobileApp />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/u/:username" element={<DynamicPageWrapper isUserSite />} />
                  <Route path="/u/:username/:slug" element={<DynamicPageWrapper isUserSite />} />
                  <Route path="/p/:slug" element={<DynamicPageWrapper />} />
                  <Route path="/:slug" element={<DynamicPageWrapper />} />
                  <Route path="*" element={<DynamicPageWrapper slugOverride="home" />} />
                </>
              )}
            </Routes>
          </main>
          <Footer />
          <HelpTab />
          <PWAInstallPopup />
        </div>
      </Router>
    </HelmetProvider>
  );
}

const ServiceDetailWrapper = () => {
  const { id } = useParams();
  const [service, setService] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setService(data.find((s: any) => s.id === id)));
  }, [id]);

  if (!service) return <ServiceDetail />;

  return (
    <>
      <SEO
        title={service.name}
        description={service.seoDescription || service.description}
        image={service.image}
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": service.name,
            "image": service.image,
            "description": service.description,
            "sku": service.id,
            "brand": {
              "@type": "Brand",
              "name": "YA Wedding"
            },
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "AED",
              "price": service.price,
              "availability": "https://schema.org/InStock"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": service.category || "Wedding Service",
            "name": service.name,
            "image": service.image,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "YA Wedding",
              "image": "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp",
              "telephone": "+971505588842",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Abu Hail Center, 2nd Floor - Hor Al Anz - Deira",
                "addressLocality": "Dubai",
                "addressCountry": "UAE"
              }
            },
            "areaServed": {
              "@type": "City",
              "name": "Dubai"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "AED",
              "price": service.price,
              "url": window.location.href
            }
          }
        ]}
      />
      <ServiceDetail />
    </>
  );
};

const BlogDetailWrapper = () => {
  const { id } = useParams();
  const [blog, setBlog] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => setBlog(data.find((b: any) => b.id === id)));
  }, [id]);

  if (!blog) return <BlogDetail />;

  return (
    <>
      <SEO
        title={blog.title}
        description={blog.excerpt}
        image={blog.image}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": blog.title,
          "image": blog.image,
          "author": {
            "@type": "Person",
            "name": blog.author
          },
          "publisher": {
            "@type": "Organization",
            "name": "YA Wedding",
            "logo": {
              "@type": "ImageObject",
              "url": "https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp"
            }
          },
          "datePublished": blog.date,
          "description": blog.excerpt
        }}
      />
      <BlogDetail />
    </>
  );
};

const BookingPageWrapper = () => {
  const { id } = useParams();
  const [form, setForm] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/booking-forms')
      .then(res => res.json())
      .then(data => setForm(data.find((f: any) => f.id === id)));
  }, [id]);

  if (!form) return <BookingPage />;

  return (
    <>
      <SEO
        title={form.name}
        description={form.description || `Book your event with ${form.name}`}
      />
      <BookingPage />
    </>
  );
};

const DynamicPageWrapper = ({ slugOverride, isUserSite, username: propUsername }: { slugOverride?: string; isUserSite?: boolean; username?: string }) => {
  const { slug: routeSlug, username: routeUsername } = useParams();
  const username = propUsername || routeUsername;
  const slug = slugOverride || routeSlug || 'home';
  const [page, setPage] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPage = () => {
      const endpoint = isUserSite 
        ? `/api/public/user/${username}/pages` 
        : '/api/pages';

      fetch(endpoint)
        .then(res => res.json())
        .then(data => {
          const found = data.find((p: any) => p.slug === slug);
          setPage(found || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchPage();
    const interval = setInterval(fetchPage, 10000);
    return () => clearInterval(interval);
  }, [slug, isUserSite, username]);

  if (loading) return <div className="pt-40 pb-20 text-center">Loading...</div>;

  // If it's a user site, we render it differently
  if (isUserSite) {
    if (!page) return <div className="pt-40 pb-20 text-center">Page not found on this partner site</div>;
    return (
      <>
        <SEO title={page.title} description={page.description} />
        <DynamicPage slugOverride={slug} username={username} />
      </>
    );
  }

  // Priority 1: Core pages hardcoded components
  if (slug === 'home') return <><SEO title="Home" description="Luxury Wedding Planner Dubai" /><Home /></>;
  if (slug === 'about') return <><SEO title="About Us" description="Learn more about YA Wedding" /><About /></>;
  if (slug === 'contact') return <><SEO title="Contact Us" description="Get in touch" /><Contact /></>;
  if (slug === 'faq') return <><SEO title="FAQ" description="Frequently asked questions" /><FAQ /></>;
  if (slug === 'packages') return <><SEO title="Packages" description="Event packages" /><Packages /></>;
  if (slug === 'gallery') return <><SEO title="Gallery" description="Our portfolio" /><Gallery /></>;
  if (slug === 'blog') return <><SEO title="Blog" description="Wedding insights" /><Blog /></>;
  if (slug === 'discounts') return <><SEO title="Discounts" description="Exclusive offers" /><Discounts /></>;
  if (slug === 'package-builder') return <><SEO title="Package Builder" description="Build your package" /><PackageCustomizer /></>;
  if (slug === 'services') return <><SEO title="Services" description="Our services" /><Services /></>;
  if (slug === 'partnerships') return <><SEO title="Partnerships" description="Partner with YA Wedding" /><Partnerships /></>;

  // Priority 2: If page exists in CMS and has widgets, use DynamicPage (Real-time CMS)
  if (page && page.published && page.widgets && page.widgets.length > 0) {
    return <DynamicPage slugOverride={slug} />;
  }

  // If page exists in CMS but is not published, hide it
  if (page && !page.published) {
    return <div className="pt-40 pb-20 text-center">Page not found</div>;
  }

  // If it's a CMS page but not a core page, use DynamicPage
  if (page) {
    let pageSchema = null;
    try {
      if (page.schema) {
        pageSchema = JSON.parse(page.schema);
      }
    } catch (e) {
      console.error("Failed to parse page schema", e);
    }

    return (
      <>
        <SEO
          title={page.title}
          description={page.description || `Explore ${page.title} at YA Wedding Dubai.`}
          schema={pageSchema}
        />
        <DynamicPage slugOverride={slug} />
      </>
    );
  }

  // Fallback for unknown slugs
  return <DynamicPage slugOverride={slug} />;
};
