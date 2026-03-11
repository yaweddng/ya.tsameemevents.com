import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, ArrowRight, Filter, Tag, MapPin, CheckCircle } from 'lucide-react';
import { Service, Blog, Package } from '../types';

export const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [services, setServices] = React.useState<Service[]>([]);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filter, setFilter] = React.useState<'all' | 'services' | 'blogs' | 'packages'>('all');

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [sRes, bRes, pRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/blogs'),
        fetch('/api/packages')
      ]);
      const sData = await sRes.json();
      const bData = await bRes.json();
      const pData = await pRes.json();

      const filteredServices = sData.filter((s: Service) => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.tags?.some(t => t.toLowerCase().includes(query.toLowerCase()))
      );

      const filteredBlogs = bData.filter((b: Blog) => 
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        b.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        b.category.toLowerCase().includes(query.toLowerCase())
      );

      const filteredPackages = pData.filter((p: Package) => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase()) ||
        p.features.some(f => f.toLowerCase().includes(query.toLowerCase()))
      );

      setServices(filteredServices);
      setBlogs(filteredBlogs);
      setPackages(filteredPackages);
      setLoading(false);
    };

    fetchData();
  }, [query]);

  const totalResults = services.length + blogs.length + packages.length;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Search Results for <span className="text-brand">"{query}"</span>
          </h1>
          <p className="text-gray-400">
            Found {totalResults} results across services and blogs.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'all' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
          >
            All Results ({totalResults})
          </button>
          <button
            onClick={() => setFilter('services')}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'services' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setFilter('blogs')}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'blogs' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
          >
            Blog Posts ({blogs.length})
          </button>
          <button
            onClick={() => setFilter('packages')}
            className={`px-6 py-2 rounded-full font-bold whitespace-nowrap transition-all ${filter === 'packages' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
          >
            Packages ({packages.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Services Results */}
            {(filter === 'all' || filter === 'services') && services.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Filter className="text-brand" size={24} /> Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-3xl overflow-hidden group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.name} />
                        <div className="absolute top-4 right-4 bg-brand text-dark px-3 py-1 rounded-full text-xs font-bold">
                          {service.category}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.shortDescription}</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {service.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-md flex items-center gap-1">
                              <Tag size={10} /> {tag}
                            </span>
                          ))}
                        </div>
                        <Link to={`/services/${service.id}`} className="text-brand font-bold text-sm flex items-center gap-2">
                          View Details <ArrowRight size={16} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Blogs Results */}
            {(filter === 'all' || filter === 'blogs') && blogs.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <SearchIcon className="text-brand" size={24} /> Blog Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {blogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-3xl overflow-hidden flex flex-col md:flex-row group"
                    >
                      <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">
                        <img src={blog.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={blog.title} />
                      </div>
                      <div className="p-6 flex-1">
                        <span className="text-brand text-xs font-bold uppercase tracking-widest mb-2 block">{blog.category}</span>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-brand transition-colors">{blog.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">{blog.excerpt}</p>
                        <Link to={`/blog/${blog.id}`} className="text-white font-bold text-sm border-b border-brand pb-1">
                          Read More
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Packages Results */}
            {(filter === 'all' || filter === 'packages') && packages.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <Tag className="text-brand" size={24} /> Event Packages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-3xl p-8 border border-white/5 hover:border-brand/30 transition-all group"
                    >
                      <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-2">{pkg.description}</p>
                      <div className="space-y-3 mb-8">
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                            <CheckCircle size={14} className="text-brand" /> {feature}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-brand font-bold">From AED {pkg.tiers.traditional.price.toLocaleString()}</span>
                        <Link to="/packages" className="p-2 bg-white/5 rounded-full hover:bg-brand hover:text-dark transition-all">
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div className="text-center py-20 glass-card rounded-3xl">
                <SearchIcon size={64} className="mx-auto text-gray-600 mb-6" />
                <h3 className="text-2xl font-bold mb-2">No results found</h3>
                <p className="text-gray-400">Try searching for something else like "wedding", "planning", or "dubai".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
