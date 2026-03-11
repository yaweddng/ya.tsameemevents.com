import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  PenTool, 
  Grid, 
  Palette, 
  Settings, 
  BarChart, 
  LogOut, 
  Globe, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  Image as ImageIcon,
  Search,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  ShieldCheck,
  User,
  Mail,
  Lock,
  CreditCard,
  FileJson,
  Share2,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Sub-components for tabs
const PagesTab = ({ user, token }: { user: any; token: string }) => {
  const [pages, setPages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/user/pages', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      });
  }, [token]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Pages</h2>
          <p className="text-gray-400 text-sm">Create and manage your website pages</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          <Plus size={20} /> Create New Page
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page: any) => (
          <div key={page.id} className="glass-card p-6 rounded-3xl border border-white/5 space-y-4 group">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <FileText size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white"><Edit2 size={16} /></button>
                <button className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">{page.title}</h3>
              <p className="text-gray-500 text-sm italic">/{page.slug}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${page.published ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                {page.published ? 'Published' : 'Draft'}
              </span>
              <button className="text-xs text-brand hover:underline flex items-center gap-1 font-bold uppercase">
                View Live <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
        {pages.length === 0 && !loading && (
          <div className="col-span-full p-20 text-center glass-card rounded-[32px] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
              <FileText size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">No pages yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">Start building your site by creating your first page.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogsTab = ({ user, token }: { user: any; token: string }) => {
  const [posts, setPosts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/user/blogs', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [token]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-gray-400 text-sm">Share your stories and updates</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          <Plus size={20} /> New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post: any) => (
          <div key={post.id} className="glass-card p-6 rounded-3xl border border-white/5 flex gap-6 items-center group">
            <div className="w-24 h-24 bg-white/5 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
              {post.image ? (
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32} /></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{post.category}</span>
                <span className="text-[10px] text-gray-500">• {post.date}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-brand transition-colors">{post.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-1">{post.excerpt}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"><Edit2 size={18} /></button>
              <button className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="p-20 text-center glass-card rounded-[32px] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
              <PenTool size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">No blog posts yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">Start writing to engage your audience.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const WidgetsTab = ({ user, token }: { user: any; token: string }) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dynamic Widgets</h2>
          <p className="text-gray-400 text-sm">Enhance your pages with interactive components</p>
        </div>
        <button className="flex items-center gap-2 bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          <Plus size={20} /> Add Widget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: '1', name: 'Service Slider', type: 'carousel', status: 'Active' },
          { id: '2', name: 'Contact Form', type: 'form', status: 'Active' },
          { id: '3', name: 'Review Grid', type: 'grid', status: 'Active' },
        ].map((widget: any) => (
          <div key={widget.id} className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6 group">
            <div className="flex justify-between items-start">
              <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <Grid size={28} />
              </div>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                <Settings size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">{widget.name}</h3>
              <p className="text-gray-500 text-xs uppercase font-bold tracking-widest">{widget.type}</p>
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-[10px] font-bold text-green-400 uppercase flex items-center gap-1">
                <CheckCircle size={10} /> {widget.status}
              </span>
              <button className="text-xs text-brand hover:underline font-bold uppercase">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ThemeTab = ({ user, token }: { user: any; token: string }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Theme Builder</h2>
        <p className="text-gray-400 text-sm">Customize your site's global appearance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <Palette size={20} /> Global Styles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Primary Color</label>
                <div className="flex gap-4 items-center">
                  <input type="color" className="w-12 h-12 bg-transparent border-none cursor-pointer" defaultValue="#00C896" />
                  <input className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" defaultValue="#00C896" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Heading Font</label>
                <select className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand appearance-none">
                  <option>Inter</option>
                  <option>Germania One</option>
                  <option>Playfair Display</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <LayoutDashboard size={20} /> Layout Sections
            </h3>
            <div className="space-y-4">
              {['Header', 'Footer'].map(section => (
                <div key={section} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                      <ImageIcon size={20} />
                    </div>
                    <span className="font-bold">{section} Template</span>
                  </div>
                  <button className="text-xs text-brand hover:underline font-bold uppercase">Edit Template</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 text-center">
            <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand">
              <Globe size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Preview</h3>
            <p className="text-gray-400 text-sm mb-6">See how your changes look in real-time on your site.</p>
            <button className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
              Open Preview <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ user, token }: { user: any; token: string }) => {
  const [site, setSite] = React.useState<any>(null);
  const [customDomain, setCustomDomain] = React.useState('');
  const [verifying, setVerifying] = React.useState(false);
  const [message, setMessage] = React.useState({ type: '', text: '' });

  React.useEffect(() => {
    fetch('/api/user/site', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSite(data);
        if (data?.customDomain) setCustomDomain(data.customDomain);
      });
  }, [token]);

  const handleVerify = async () => {
    if (!customDomain) return;
    setVerifying(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/site/verify-domain', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ domain: customDomain })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Domain verified successfully!' });
        setSite({ ...site, customDomain, dnsVerified: true });
      } else {
        setMessage({ type: 'error', text: data.error || 'Verification failed.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An error occurred during verification.' });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-gray-400 text-sm">Manage your site metadata and configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <Globe size={20} /> General Info
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Site Title</label>
                <input 
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" 
                  defaultValue={site?.title}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Subdomain</label>
                <div className="flex">
                  <input 
                    className="flex-1 bg-dark border border-white/10 rounded-l-xl px-4 py-3 outline-none focus:border-brand" 
                    defaultValue={site?.subdomain}
                  />
                  <div className="bg-white/5 border border-l-0 border-white/10 rounded-r-xl px-4 py-3 text-gray-500 text-sm flex items-center">
                    .platform.com
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <LinkIcon size={20} /> Custom Domain
            </h3>
            <div className="space-y-4">
              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <AlertCircle size={16} /> DNS Instructions
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  To connect your custom domain, add a CNAME record pointing to <strong>sites.platform.com</strong> or an A record pointing to <strong>76.76.21.21</strong>.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex gap-4">
                  <input 
                    className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" 
                    placeholder="www.yourdomain.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                  />
                  <button 
                    onClick={handleVerify}
                    disabled={verifying}
                    className="bg-brand text-dark px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {verifying ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
                {message.text && (
                  <p className={`text-xs font-bold ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                    {message.text}
                  </p>
                )}
                {site?.dnsVerified && (
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                    <CheckCircle size={14} /> Domain Connected & Verified
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <User size={20} /> Profile Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center text-brand text-2xl font-bold">
                  {user.name?.[0]}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{user.name}</h4>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <button className="text-xs text-brand hover:underline font-bold uppercase mt-1">Change Avatar</button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" defaultValue={user.email} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SEOTab = ({ user, token }: { user: any; token: string }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">SEO & Marketing</h2>
        <p className="text-gray-400 text-sm">Optimize your site for search engines and track performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <Search size={20} /> Search Engine Optimization
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Default Meta Title</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="My Awesome Site" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Default Meta Description</label>
                <textarea rows={4} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Describe your site for search engines..." />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <Share2 size={20} /> Social Metadata
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">OG Image URL</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="https://..." />
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center gap-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center text-gray-600"><ImageIcon size={24} /></div>
                <p className="text-xs text-gray-500 italic">This image will be shown when your site is shared on social media.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[32px] border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-brand flex items-center gap-2">
              <TrendingUp size={20} /> Analytics & Tracking
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Google Analytics ID</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Google Tag Manager ID</label>
                <input className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="GTM-XXXXXXX" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Custom Tracking Scripts</label>
                <textarea rows={6} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-mono text-xs" placeholder="<script>...</script>" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserDashboard = () => {
  const [user, setUser] = React.useState<any>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'pages' | 'blogs' | 'widgets' | 'theme' | 'settings' | 'seo'>('pages');
  const navigate = useNavigate();

  React.useEffect(() => {
    const storedToken = localStorage.getItem('ya-token');
    const storedUser = localStorage.getItem('ya-user');
    
    if (!storedToken || !storedUser) {
      navigate('/login');
      return;
    }

    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('ya-token');
    localStorage.removeItem('ya-user');
    navigate('/login');
  };

  if (!user || !token) return null;

  const tabs = [
    { id: 'pages', label: 'Pages', icon: FileText },
    { id: 'blogs', label: 'Blogs', icon: PenTool },
    { id: 'widgets', label: 'Widgets', icon: Grid },
    { id: 'theme', label: 'Theme Builder', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'seo', label: 'SEO & Marketing', icon: BarChart },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Partner Dashboard</h1>
              <p className="text-gray-400 text-sm">Welcome back, {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`https://${user.username}.platform.com`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-brand/10 text-brand rounded-xl font-bold hover:bg-brand/20 transition-all"
            >
              <Globe size={20} /> View Site
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative mb-12">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-2 sm:gap-4 scroll-smooth">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${
                  activeTab === t.id 
                    ? 'border-brand text-white' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {activeTab === t.id && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-brand rounded-[14px] -z-10 shadow-lg shadow-brand/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <t.icon size={18} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'pages' && <PagesTab user={user} token={token} />}
          {activeTab === 'blogs' && <BlogsTab user={user} token={token} />}
          {activeTab === 'widgets' && <WidgetsTab user={user} token={token} />}
          {activeTab === 'theme' && <ThemeTab user={user} token={token} />}
          {activeTab === 'settings' && <SettingsTab user={user} token={token} />}
          {activeTab === 'seo' && <SEOTab user={user} token={token} />}
        </motion.div>
      </div>
    </div>
  );
};
