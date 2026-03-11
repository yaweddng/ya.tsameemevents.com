import React from 'react';

export const useCMSData = (slug?: string, username?: string) => {
  const [settings, setSettings] = React.useState<any>(null);
  const [page, setPage] = React.useState<any>(null);
  const [services, setServices] = React.useState<any[]>([]);
  const [blogs, setBlogs] = React.useState<any[]>([]);
  const [promos, setPromos] = React.useState<any[]>([]);
  const [bookingForms, setBookingForms] = React.useState<any[]>([]);
  const [ratings, setRatings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const isFetching = React.useRef(false);

  const fetchData = async (retries = 3) => {
    if (isFetching.current && retries > 0) return;
    isFetching.current = true;
    
    try {
      const fetchWithTimeout = async (url: string, options = {}, timeout = 15000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
          const response = await fetch(url, { ...options, signal: controller.signal });
          clearTimeout(id);
          return response;
        } catch (error: any) {
          clearTimeout(id);
          if (error.name === 'AbortError') {
            throw new Error(`Request timeout: ${url}`);
          }
          throw error;
        }
      };

      if (username) {
        // Fetch user-specific data
        const [pRes, tRes] = await Promise.all([
          fetchWithTimeout(`/api/public/user/${username}/pages`),
          fetchWithTimeout(`/api/public/user/${username}/theme`)
        ]);

        const pData = await pRes.json();
        const tData = await tRes.json();

        setSettings(tData);
        setPage(pData.find((p: any) => p.slug === slug));
        // For now, other data like services/blogs are empty for users unless implemented
        setServices([]);
        setBlogs([]);
        setPromos([]);
        setBookingForms([]);
        setRatings([]);
      } else {
        // Fetch platform-wide data
        const [sRes, pRes, svRes, bRes, prRes, bfRes, rRes] = await Promise.all([
          fetchWithTimeout('/api/settings'),
          fetchWithTimeout('/api/pages'),
          fetchWithTimeout('/api/services'),
          fetchWithTimeout('/api/blogs'),
          fetchWithTimeout('/api/promos'),
          fetchWithTimeout('/api/booking-forms'),
          fetchWithTimeout('/api/ratings')
        ]);

        const sData = await sRes.json();
        const pData = await pRes.json();
        const svData = await svRes.json();
        const bData = await bRes.json();
        const prData = await prRes.json();
        const bfData = await bfRes.json();
        const rData = await rRes.json();

        setSettings(sData);
        setServices(svData);
        setBlogs(bData);
        setPromos(prData);
        setBookingForms(bfData);
        setRatings(rData);

        if (slug) {
          setPage(pData.find((p: any) => p.slug === slug));
        }
      }
      setLoading(false);
      isFetching.current = false;
    } catch (err) {
      isFetching.current = false;
      if (retries > 0) {
        console.warn(`Fetch failed, retrying... (${retries} left)`, err);
        setTimeout(() => fetchData(retries - 1), 2000);
      } else {
        console.error('Error fetching CMS data after retries:', err);
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    setLoading(true);
    fetchData();
    const interval = setInterval(() => fetchData(0), 15000);
    return () => clearInterval(interval);
  }, [slug, username]);

  return { settings, page, services, blogs, promos, bookingForms, ratings, loading, refresh: fetchData };
};
