import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Save, 
  Image as ImageIcon,
  Briefcase,
  FileText,
  Settings,
  Sparkles,
  Package,
  Tag,
  Globe,
  Menu as MenuIcon,
  Layout,
  Search,
  ExternalLink,
  RefreshCw,
  X,
  Upload,
  File,
  Video,
  Music,
  Archive,
  Type,
  Check,
  Copy,
  Link as LinkIcon,
  Calendar,
  FileJson,
  Palette,
  LayoutTemplate,
  Handshake,
  Users,
  Shield,
  MapPin,
  Terminal,
  Mail,
  Star,
  CheckCircle,
  Eye,
  EyeOff,
  MousePointer2,
  Database
} from 'lucide-react';
import { Service, Blog, PackageStep, Promo, SiteSettings, MediaItem, BookingForm, BookingFormStep, BookingFormField, PDFConfig, Rating } from '../types';

import { ContainerWidgetTab } from './admin/container-widget/ContainerWidgetTab';
import { ThemeBuilderTab } from './admin/theme-builder/ThemeBuilderTab';
import { CustomPostTypesTab } from './admin/CustomPostTypesTab';
import { RedirectionsTab } from './admin/RedirectionsTab';
import { EmailTemplatesTab } from './admin/EmailTemplatesTab';
import { VisualEditor } from '../components/VisualEditor';

import { ImageUpload } from '../components/ImageUpload';
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem('ya-token');
    const user = JSON.parse(localStorage.getItem('ya-user') || '{}');
    if (token === 'ya-admin-secret' && user.role === 'admin') {
      setIsLoggedIn(true);
    } else if (token) {
      navigate('/dashboard');
    } else {
      // Fetch the secure slug and redirect there
      fetch('/api/admin/security/config')
        .then(res => res.json())
        .then(data => {
          navigate(data.slug || '/admin-portal-access');
        })
        .catch(() => {
          navigate('/login');
        });
    }
  }, [navigate]);

  const [tab, setTab] = React.useState<'services' | 'blogs' | 'settings' | 'package' | 'promos' | 'pages' | 'general' | 'media' | 'booking' | 'partnerships' | 'development' | 'reviews' | 'container-widget' | 'theme-builder' | 'custom-post-types' | 'redirections' | 'user-manager' | 'security-settings' | 'email-templates'>('services');
  const [services, setServices] = React.useState<Service[]>([]);
  const [blogs, setBlogs] = React.useState<Blog[]>([]);
  const [packageSteps, setPackageSteps] = React.useState<PackageStep[]>([]);
  const [promos, setPromos] = React.useState<Promo[]>([]);
  const [pages, setPages] = React.useState<any[]>([]);
  const [ratings, setRatings] = React.useState<Rating[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [securityConfig, setSecurityConfig] = React.useState<any>(null);
  const [saveStatus, setSaveStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [settings, setSettings] = React.useState<any>(null);
  const [devSettings, setDevSettings] = React.useState<any>(null);
  const [media, setMedia] = React.useState<MediaItem[]>([]);
  const [bookingForms, setBookingForms] = React.useState<BookingForm[]>([]);
  const [partnerships, setPartnerships] = React.useState<any[]>([]);
  const [editingItem, setEditingItem] = React.useState<any>(null);
  const [editingStep, setEditingStep] = React.useState<any>(null);
  const [editingPromo, setEditingPromo] = React.useState<any>(null);
  const [editingBlog, setEditingBlog] = React.useState<any>(null);
  const [editingPage, setEditingPage] = React.useState<any>(null);
  const [editingMedia, setEditingMedia] = React.useState<MediaItem | null>(null);
  const [editingBookingForm, setEditingBookingForm] = React.useState<BookingForm | null>(null);
  const [editingRating, setEditingRating] = React.useState<Rating | null>(null);
  const [reviewFilter, setReviewFilter] = React.useState<'all' | 'pending'>('all');
  const [isUploading, setIsUploading] = React.useState(false);
  const [isVisualEditing, setIsVisualEditing] = React.useState(false);
  const [visualEditingItem, setVisualEditingItem] = React.useState<{ id: string, type: 'page' | 'blog' } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('ya-token');
    localStorage.removeItem('ya-user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const fetchData = async () => {
    const sRes = await fetch('/api/services');
    const sData = await sRes.json();
    setServices(sData);

    const bRes = await fetch('/api/blogs');
    const bData = await bRes.json();
    setBlogs(bData);

    const setRes = await fetch('/api/settings');
    const setData = await setRes.json();
    setSettings(setData);

    const pRes = await fetch('/api/package-steps');
    const pData = await pRes.json();
    setPackageSteps(pData);

    const prRes = await fetch('/api/promos');
    const prData = await prRes.json();
    setPromos(prData);

    const pgRes = await fetch('/api/pages');
    const pgData = await pgRes.json();
    setPages(pgData);

    const devRes = await fetch('/api/development', {
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    const devData = await devRes.json();
    setDevSettings(devData);

    const mRes = await fetch('/api/media');
    const mData = await mRes.json();
    setMedia(mData);

    const bfRes = await fetch('/api/booking-forms');
    const bfData = await bfRes.json();
    setBookingForms(bfData);

    const rRes = await fetch('/api/ratings', {
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    const rData = await rRes.json();
    setRatings(rData);

    const partRes = await fetch('/api/partnerships', {
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    const partData = await partRes.json();
    setPartnerships(partData);

    const usersRes = await fetch('/api/admin/users', {
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    const usersData = await usersRes.json();
    setUsers(usersData);

    const secRes = await fetch('/api/admin/security/full-config', {
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    const secData = await secRes.json();
    setSecurityConfig(secData);
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    const res = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ userId, updates })
    });
    if (res.ok) {
      setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch('/api/admin/users/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPassword = prompt('Please enter your current admin password to confirm changes:');
    if (!currentPassword) return;

    const res = await fetch('/api/admin/security/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ currentPassword, newConfig: securityConfig })
    });

    if (res.ok) {
      alert('Security settings updated successfully!');
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to update security settings.');
    }
  };

  const handleSaveMedia = async (updatedMedia: MediaItem[]) => {
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify(updatedMedia)
    });
    if (res.ok) {
      setMedia(updatedMedia);
      setEditingMedia(null);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify(settings)
    });
    if (res.ok) alert('Settings saved!');
  };

  const handleSaveDevSettings = async () => {
    const res = await fetch('/api/development', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify(devSettings)
    });
    if (res.ok) {
      alert('Development settings saved successfully!');
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newService: Service = {
      id: editingItem?.id || (formData.get('name') as string).toLowerCase().replace(/\s+/g, '-'),
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      oldPrice: formData.get('oldPrice') ? Number(formData.get('oldPrice')) : undefined,
      discount: formData.get('discount') as string || undefined,
      currency: 'AED',
      category: formData.get('category') as string,
      badge: formData.get('badge') as any || undefined,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
      shortDescription: formData.get('shortDescription') as string,
      seoDescription: formData.get('seoDescription') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      serviceAreas: (formData.get('serviceAreas') as string).split(',').map(a => a.trim()),
      features: (formData.get('features') as string).split(',').map(f => f.trim()),
      rating: formData.get('rating') ? Number(formData.get('rating')) : undefined,
      reviewCount: formData.get('reviewCount') ? Number(formData.get('reviewCount')) : undefined,
    };

    let updatedServices;
    if (editingItem) {
      updatedServices = services.map(s => s.id === editingItem.id ? newService : s);
    } else {
      updatedServices = [...services, newService];
    }

    const res = await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ services: updatedServices })
    });

    if (res.ok) {
      setServices(updatedServices);
      setEditingItem(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedServices = services.filter(s => s.id !== id);
    await fetch('/api/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ services: updatedServices })
    });
    setServices(updatedServices);
  };

  const handleDeletePartnership = async (id: string) => {
    if (!confirm('Are you sure you want to delete this partnership application?')) return;
    const res = await fetch(`/api/partnerships/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ya-admin-secret' }
    });
    if (res.ok) {
      setPartnerships(partnerships.filter(p => p.id !== id));
    }
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newBlog: Blog = {
      id: editingBlog?.id || (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
      title: formData.get('title') as string,
      image: formData.get('image') as string,
      date: formData.get('date') as string || new Date().toISOString().split('T')[0],
      author: formData.get('author') as string,
      category: formData.get('category') as string,
      excerpt: formData.get('excerpt') as string,
      content: formData.get('content') as string,
      tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean),
    };

    let updatedBlogs;
    if (editingBlog?.id) {
      updatedBlogs = blogs.map(b => b.id === editingBlog.id ? newBlog : b);
    } else {
      updatedBlogs = [...blogs, newBlog];
    }

    const res = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ blogs: updatedBlogs })
    });

    if (res.ok) {
      setBlogs(updatedBlogs);
      setEditingBlog(null);
    }
  };

  const handleSaveBookingForm = async (form: BookingForm) => {
    const now = new Date().toISOString();
    const formWithTime = { ...form, updatedAt: now };
    const updatedForms = bookingForms.find(f => f.id === form.id)
      ? bookingForms.map(f => f.id === form.id ? formWithTime : f)
      : [...bookingForms, { ...formWithTime, createdAt: now }];

    const res = await fetch('/api/booking-forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ forms: updatedForms })
    });

    if (res.ok) {
      setBookingForms(updatedForms);
      setEditingBookingForm(null);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedBlogs = blogs.filter(b => b.id !== id);
    await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ blogs: updatedBlogs })
    });
    setBlogs(updatedBlogs);
  };

  const handleSaveRating = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newRating: Rating = {
      id: editingRating?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      slug: formData.get('slug') as string || undefined,
      profileImage: formData.get('profileImage') as string || undefined,
      showProfileImage: formData.get('showProfileImage') === 'on',
      reviewImage: formData.get('reviewImage') as string || undefined,
      showReviewImage: formData.get('showReviewImage') === 'on',
      stars: Number(formData.get('stars')),
      content: formData.get('content') as string,
      services: (formData.get('services') as string).split(',').map(s => s.trim()).filter(Boolean),
      budgetRange: formData.get('budgetRange') as string,
      isVerified: formData.get('isVerified') === 'on',
      badge: formData.get('badge') as string,
      customBadgeText: formData.get('customBadgeText') as string || undefined,
      status: (formData.get('status') as any) || 'approved',
      createdAt: editingRating?.createdAt || new Date().toISOString(),
    };

    const updatedRatings = editingRating?.id 
      ? ratings.map(r => r.id === editingRating.id ? newRating : r)
      : [...ratings, newRating];

    const res = await fetch('/api/admin/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ ratings: updatedRatings })
    });

    if (res.ok) {
      setRatings(updatedRatings);
      setEditingRating(null);
    }
  };

  const handleDeleteRating = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const updatedRatings = ratings.filter(r => r.id !== id);
    await fetch('/api/admin/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ya-admin-secret'
      },
      body: JSON.stringify({ ratings: updatedRatings })
    });
    setRatings(updatedRatings);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark">
      {isVisualEditing && visualEditingItem && (
        <VisualEditor 
          pageId={visualEditingItem.id} 
          type={visualEditingItem.type}
          onClose={() => {
            setIsVisualEditing(false);
            setVisualEditingItem(null);
            fetchData(); // Refresh data
          }} 
        />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm">Manage your luxury event platform</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all w-full sm:w-auto"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        <div className="relative mb-12">
          <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-2 sm:gap-4 scroll-smooth">
            {[
              { id: 'services', label: 'Services', icon: Briefcase },
              { id: 'blogs', label: 'Blogs', icon: FileText },
              { id: 'media', label: 'Media Manager', icon: ImageIcon },
              { id: 'general', label: 'General Settings', icon: Globe },
              { id: 'settings', label: 'SEO & APIs', icon: Settings },
              { id: 'package', label: 'Package Builder', icon: Package },
              { id: 'promos', label: 'Promos', icon: Tag },
              { id: 'booking', label: 'Booking', icon: Calendar },
              { id: 'pages', label: 'Pages', icon: LayoutDashboard },
              { id: 'partnerships', label: 'Partnerships', icon: Handshake },
              { id: 'reviews', label: 'Reviews', icon: Star },
              { id: 'container-widget', label: 'Container & Widget', icon: LayoutTemplate },
              { id: 'theme-builder', label: 'Theme Builder', icon: Palette },
              { id: 'custom-post-types', label: 'Custom Post Types', icon: Database },
              { id: 'redirections', label: 'Redirections', icon: RefreshCw },
              { id: 'user-manager', label: 'User Manager', icon: Users },
              { id: 'email-templates', label: 'Email Templates', icon: Mail },
              { id: 'security-settings', label: 'Security Settings', icon: Shield },
              { id: 'development', label: 'Development', icon: Terminal },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border-2 ${
                  tab === t.id 
                    ? 'border-brand text-white' 
                    : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                }`}
              >
                {tab === t.id && (
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
          {/* Subtle fade effect for scroll indicators */}
          <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-dark to-transparent pointer-events-none sm:hidden" />
        </div>

        {tab === 'general' && settings && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">General Platform Settings</h2>
              <button 
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save All Changes
              </button>
            </div>

            {/* Platform Branding */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <Globe size={20} /> Platform Branding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Platform Name</label>
                  <input
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Platform Title</label>
                  <input
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-400 uppercase">Logo Configuration</label>
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setSettings({...settings, logoType: 'image'})}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${settings.logoType === 'image' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
                  >
                    Image Logo
                  </button>
                  <button
                    onClick={() => setSettings({...settings, logoType: 'text'})}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${settings.logoType === 'text' ? 'bg-brand text-dark' : 'bg-white/5 text-gray-400'}`}
                  >
                    Text Logo
                  </button>
                </div>

                {settings.logoType === 'image' ? (
                  <div className="space-y-2">
                    <ImageUpload
                      label="Logo URL"
                      value={settings.siteLogo}
                      onChange={(url) => setSettings({...settings, siteLogo: url})}
                    />
                  </div>
                ) : (
                  <div className="space-y-8 p-6 bg-white/5 rounded-2xl border border-white/5">
                    {/* Header Logo */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-brand uppercase tracking-wider">Header Logo (Text)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Desktop - Part 1 (Germania One)</label>
                          <input
                            value={settings.logoSettings?.header?.desktop?.part1 || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              logoSettings: {
                                ...settings.logoSettings,
                                header: {
                                  ...settings.logoSettings?.header,
                                  desktop: { ...settings.logoSettings?.header?.desktop, part1: e.target.value }
                                }
                              }
                            })}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-script"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Desktop - Part 2 (Inter Bold)</label>
                          <input
                            value={settings.logoSettings?.header?.desktop?.part2 || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              logoSettings: {
                                ...settings.logoSettings,
                                header: {
                                  ...settings.logoSettings?.header,
                                  desktop: { ...settings.logoSettings?.header?.desktop, part2: e.target.value }
                                }
                              }
                            })}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-bold"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Mobile Logo (Max 3 chars - Germania One)</label>
                        <input
                          maxLength={3}
                          value={settings.logoSettings?.header?.mobile || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            logoSettings: {
                              ...settings.logoSettings,
                              header: {
                                ...settings.logoSettings?.header,
                                mobile: e.target.value
                              }
                            }
                          })}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-script"
                        />
                      </div>
                    </div>

                    {/* Footer Logo */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-brand uppercase tracking-wider">Footer Logo (Text)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Part 1 (Germania One)</label>
                          <input
                            value={settings.logoSettings?.footer?.part1 || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              logoSettings: {
                                ...settings.logoSettings,
                                footer: {
                                  ...settings.logoSettings?.footer,
                                  part1: e.target.value
                                }
                              }
                            })}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-script"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Part 2 (Inter Bold)</label>
                          <input
                            value={settings.logoSettings?.footer?.part2 || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              logoSettings: {
                                ...settings.logoSettings,
                                footer: {
                                  ...settings.logoSettings?.footer,
                                  part2: e.target.value
                                }
                              }
                            })}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <ImageUpload
                  label="Favicon URL"
                  value={settings.siteFavicon || ''}
                  onChange={(url) => setSettings({...settings, siteFavicon: url})}
                />
              </div>
            </div>

            {/* SEO Schema */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <Layout size={20} /> SEO Schema.org Profile
              </h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Primary SEO Schema (JSON-LD)</label>
                <textarea
                  value={settings.seoSchema}
                  onChange={(e) => setSettings({...settings, seoSchema: e.target.value})}
                  rows={8}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-mono text-sm"
                  placeholder='{ "@context": "https://schema.org", ... }'
                />
                <p className="text-xs text-gray-500 italic">This will be injected into the head of your platform.</p>
              </div>
            </div>

            {/* Header Editor */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <MenuIcon size={20} /> Header Menu Editor
              </h3>
              
              <div className="space-y-4">
                {settings.header?.menu?.map((item: any, idx: number) => (
                  <div key={item.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                            <input
                              value={item.label}
                              onChange={(e) => {
                                const newMenu = [...settings.header.menu];
                                newMenu[idx].label = e.target.value;
                                setSettings({...settings, header: {...settings.header, menu: newMenu}});
                              }}
                              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">URL / Slug</label>
                            <input
                              value={item.url}
                              onChange={(e) => {
                                const newMenu = [...settings.header.menu];
                                newMenu[idx].url = e.target.value;
                                setSettings({...settings, header: {...settings.header, menu: newMenu}});
                              }}
                              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Name (Lucide)</label>
                          <input
                            value={item.icon || ''}
                            onChange={(e) => {
                              const newMenu = [...settings.header.menu];
                              newMenu[idx].icon = e.target.value;
                              setSettings({...settings, header: {...settings.header, menu: newMenu}});
                            }}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newMenu = settings.header.menu.filter((_: any, i: number) => i !== idx);
                          setSettings({...settings, header: {...settings.header, menu: newMenu}});
                        }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Sub-menu items */}
                    <div className="pl-4 sm:pl-8 space-y-3 border-l-2 border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sub-menu Items</span>
                        <button 
                          onClick={() => {
                            const newMenu = [...settings.header.menu];
                            if (!newMenu[idx].subItems) newMenu[idx].subItems = [];
                            newMenu[idx].subItems.push({ label: '', url: '', icon: '' });
                            setSettings({...settings, header: {...settings.header, menu: newMenu}});
                          }}
                          className="text-[10px] text-brand hover:underline flex items-center gap-1 font-bold uppercase"
                        >
                          <Plus size={10} /> Add Sub-item
                        </button>
                      </div>
                      <div className="space-y-2">
                        {item.subItems?.map((sub: any, sIdx: number) => (
                          <div key={sIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-white/5 rounded-xl relative group/sub">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-500 uppercase">Label</label>
                              <input
                                value={sub.label}
                                onChange={(e) => {
                                  const newMenu = [...settings.header.menu];
                                  newMenu[idx].subItems[sIdx].label = e.target.value;
                                  setSettings({...settings, header: {...settings.header, menu: newMenu}});
                                }}
                                placeholder="e.g. Services"
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-500 uppercase">URL / Slug</label>
                              <div className="flex gap-2">
                                <input
                                  value={sub.url}
                                  onChange={(e) => {
                                    const newMenu = [...settings.header.menu];
                                    newMenu[idx].subItems[sIdx].url = e.target.value;
                                    setSettings({...settings, header: {...settings.header, menu: newMenu}});
                                  }}
                                  placeholder="/services"
                                  className="flex-1 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                                />
                                <button 
                                  onClick={() => {
                                    const newMenu = [...settings.header.menu];
                                    newMenu[idx].subItems = newMenu[idx].subItems.filter((_: any, i: number) => i !== sIdx);
                                    setSettings({...settings, header: {...settings.header, menu: newMenu}});
                                  }}
                                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg self-end"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newMenu = [...(settings.header?.menu || []), { id: Math.random().toString(), label: '', url: '', icon: '' }];
                    setSettings({...settings, header: {...settings.header, menu: newMenu}});
                  }}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 hover:border-brand hover:text-brand transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Add Main Menu Item
                </button>
              </div>

              {/* Header CTAs */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase">Header Call-to-Actions (CTAs)</h4>
                <div className="space-y-4">
                  {settings.header?.ctas?.map((cta: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-xl">
                      <input
                        value={cta.label}
                        onChange={(e) => {
                          const newCtas = [...settings.header.ctas];
                          newCtas[idx].label = e.target.value;
                          setSettings({...settings, header: {...settings.header, ctas: newCtas}});
                        }}
                        placeholder="CTA Label"
                        className="bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                      />
                      <input
                        value={cta.url}
                        onChange={(e) => {
                          const newCtas = [...settings.header.ctas];
                          newCtas[idx].url = e.target.value;
                          setSettings({...settings, header: {...settings.header, ctas: newCtas}});
                        }}
                        placeholder="CTA URL"
                        className="bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                      />
                      <div className="flex gap-2">
                        <select
                          value={cta.variant}
                          onChange={(e) => {
                            const newCtas = [...settings.header.ctas];
                            newCtas[idx].variant = e.target.value;
                            setSettings({...settings, header: {...settings.header, ctas: newCtas}});
                          }}
                          className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                        >
                          <option value="primary">Primary (Brand)</option>
                          <option value="secondary">Secondary (Outline)</option>
                        </select>
                        <button 
                          onClick={() => {
                            const newCtas = settings.header.ctas.filter((_: any, i: number) => i !== idx);
                            setSettings({...settings, header: {...settings.header, ctas: newCtas}});
                          }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newCtas = [...(settings.header?.ctas || []), { label: '', url: '', variant: 'primary' }];
                      setSettings({...settings, header: {...settings.header, ctas: newCtas}});
                    }}
                    className="text-sm text-brand hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Another CTA
                  </button>
                </div>
              </div>

              {/* Mobile Menu Settings */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase">Mobile Hamburger Menu</h4>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500">CTA Icon (Lucide)</label>
                  <input
                    value={settings.header?.mobileMenu?.ctaIcon || ''}
                    onChange={(e) => setSettings({...settings, header: {...settings.header, mobileMenu: {...settings.header.mobileMenu, ctaIcon: e.target.value}}})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Footer Editor */}
            <div className="glass-card p-8 rounded-3xl space-y-8">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <Layout size={20} /> Footer Editor
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">Footer Branding</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Logo Type</label>
                        <select
                          value={settings.footer?.logoType || 'image'}
                          onChange={(e) => setSettings({...settings, footer: {...settings.footer, logoType: e.target.value as any}})}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        >
                          <option value="image">Image Logo</option>
                          <option value="text">Text Logo</option>
                        </select>
                      </div>
                      {settings.footer?.logoType === 'text' ? (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500">Logo Text</label>
                          <input
                            value={settings.footer?.logoText || ''}
                            onChange={(e) => setSettings({...settings, footer: {...settings.footer, logoText: e.target.value}})}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                            placeholder="e.g. YA Wedding"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500">Logo URL</label>
                          <div className="flex gap-2">
                            <input
                              value={settings.footer?.logo || ''}
                              onChange={(e) => setSettings({...settings, footer: {...settings.footer, logo: e.target.value}})}
                              className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                            />
                            <button className="px-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                              <Upload size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">Visibility Toggles</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <input
                          type="checkbox"
                          id="show-footer-cta"
                          checked={settings.footer?.showCTA ?? true}
                          onChange={(e) => setSettings({...settings, footer: {...settings.footer, showCTA: e.target.checked}})}
                          className="w-5 h-5 rounded border-white/10 bg-dark text-brand focus:ring-brand"
                        />
                        <label htmlFor="show-footer-cta" className="text-sm font-medium">Show CTA Button</label>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <input
                          type="checkbox"
                          id="show-footer-hours"
                          checked={settings.footer?.showHours ?? true}
                          onChange={(e) => setSettings({...settings, footer: {...settings.footer, showHours: e.target.checked}})}
                          className="w-5 h-5 rounded border-white/10 bg-dark text-brand focus:ring-brand"
                        />
                        <label htmlFor="show-footer-hours" className="text-sm font-medium">Show Hours</label>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <input
                          type="checkbox"
                          id="show-footer-contact"
                          checked={settings.footer?.showContact ?? true}
                          onChange={(e) => setSettings({...settings, footer: {...settings.footer, showContact: e.target.checked}})}
                          className="w-5 h-5 rounded border-white/10 bg-dark text-brand focus:ring-brand"
                        />
                        <label htmlFor="show-footer-contact" className="text-sm font-medium">Show Contact</label>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <input
                          type="checkbox"
                          id="show-footer-seo"
                          checked={settings.footer?.showSEOTags ?? true}
                          onChange={(e) => setSettings({...settings, footer: {...settings.footer, showSEOTags: e.target.checked}})}
                          className="w-5 h-5 rounded border-white/10 bg-dark text-brand focus:ring-brand"
                        />
                        <label htmlFor="show-footer-seo" className="text-sm font-medium">Show SEO Tags</label>
                      </div>
                    </div>
                  </div>

                  {settings.footer?.showCTA && (
                    <div className="space-y-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-gray-400 uppercase">Footer CTA Buttons</h4>
                        <button 
                          onClick={() => {
                            const newCtas = [...(settings.footer?.ctas || []), { label: '', url: '', icon: '', show: true }];
                            setSettings({...settings, footer: {...settings.footer, ctas: newCtas}});
                          }}
                          className="text-xs text-brand hover:underline flex items-center gap-1"
                        >
                          <Plus size={14} /> Add CTA
                        </button>
                      </div>
                      <div className="space-y-3">
                        {settings.footer?.ctas?.map((cta: any, idx: number) => (
                          <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    const newCtas = [...settings.footer.ctas];
                                    newCtas[idx].show = !newCtas[idx].show;
                                    setSettings({...settings, footer: {...settings.footer, ctas: newCtas}});
                                  }}
                                  className={`p-1.5 rounded-lg transition-colors ${cta.show ? 'text-brand bg-brand/10' : 'text-gray-500 bg-white/5'}`}
                                >
                                  {cta.show ? <Eye size={16} /> : <EyeOff size={16} />}
                                </button>
                                <span className="text-xs font-bold text-gray-400">CTA #{idx + 1}</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const newCtas = settings.footer.ctas.filter((_: any, i: number) => i !== idx);
                                  setSettings({...settings, footer: {...settings.footer, ctas: newCtas}});
                                }}
                                className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                                <input
                                  value={cta.label}
                                  onChange={(e) => {
                                    const newCtas = [...settings.footer.ctas];
                                    newCtas[idx].label = e.target.value;
                                    setSettings({...settings, footer: {...settings.footer, ctas: newCtas}});
                                  }}
                                  className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase">URL / Slug</label>
                                <input
                                  value={cta.url}
                                  onChange={(e) => {
                                    const newCtas = [...settings.footer.ctas];
                                    newCtas[idx].url = e.target.value;
                                    setSettings({...settings, footer: {...settings.footer, ctas: newCtas}});
                                  }}
                                  className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-xs font-bold text-gray-400 uppercase">Short Description</label>
                    <textarea
                      value={settings.footer?.description || ''}
                      onChange={(e) => setSettings({...settings, footer: {...settings.footer, description: e.target.value}})}
                      rows={3}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Social Media Links</label>
                  <div className="space-y-3">
                    {settings.footer?.socialLinks?.map((social: any, idx: number) => (
                      <div key={idx} className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <input
                          value={social.platform}
                          onChange={(e) => {
                            const newSocial = [...settings.footer.socialLinks];
                            newSocial[idx].platform = e.target.value;
                            setSettings({...settings, footer: {...settings.footer, socialLinks: newSocial}});
                          }}
                          placeholder="Platform"
                          className="w-1/4 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                        />
                        <input
                          value={social.url}
                          onChange={(e) => {
                            const newSocial = [...settings.footer.socialLinks];
                            newSocial[idx].url = e.target.value;
                            setSettings({...settings, footer: {...settings.footer, socialLinks: newSocial}});
                          }}
                          placeholder="URL"
                          className="flex-1 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                        />
                        <input
                          value={social.icon}
                          onChange={(e) => {
                            const newSocial = [...settings.footer.socialLinks];
                            newSocial[idx].icon = e.target.value;
                            setSettings({...settings, footer: {...settings.footer, socialLinks: newSocial}});
                          }}
                          placeholder="Icon"
                          className="w-1/4 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                        />
                        <button 
                          onClick={() => {
                            const newSocial = settings.footer.socialLinks.filter((_: any, i: number) => i !== idx);
                            setSettings({...settings, footer: {...settings.footer, socialLinks: newSocial}});
                          }}
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const newSocial = [...(settings.footer?.socialLinks || []), { platform: '', url: '', icon: '' }];
                        setSettings({...settings, footer: {...settings.footer, socialLinks: newSocial}});
                      }}
                      className="text-xs text-brand hover:underline flex items-center gap-1"
                    >
                      <Plus size={12} /> Add Social Icon
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Navigation Sections */}
              <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-400 uppercase">Footer Navigation Sections</h4>
                  <button 
                    onClick={() => {
                      const newNav = [...(settings.footer?.navigation || []), { title: '', items: [] }];
                      setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                    }}
                    className="text-xs text-brand hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add New Section
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.footer?.navigation?.map((section: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                      <div className="flex justify-between items-center">
                        <input
                          value={section.title}
                          onChange={(e) => {
                            const newNav = [...settings.footer.navigation];
                            newNav[idx].title = e.target.value;
                            setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                          }}
                          placeholder="Section Title"
                          className="bg-dark border border-white/10 rounded-xl px-4 py-2 font-bold outline-none focus:border-brand"
                        />
                        <button 
                          onClick={() => {
                            const newNav = settings.footer.navigation.filter((_: any, i: number) => i !== idx);
                            setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                          }}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {section.items.map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex gap-2 items-start p-3 bg-dark/50 rounded-xl border border-white/5">
                            <div className="flex-1 space-y-2">
                              <input
                                value={item.label}
                                onChange={(e) => {
                                  const newNav = [...settings.footer.navigation];
                                  newNav[idx].items[iIdx].label = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                                }}
                                placeholder="Item Label"
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                              <input
                                value={item.url}
                                onChange={(e) => {
                                  const newNav = [...settings.footer.navigation];
                                  newNav[idx].items[iIdx].url = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                                }}
                                placeholder="URL / Slug"
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const newNav = [...settings.footer.navigation];
                                newNav[idx].items = newNav[idx].items.filter((_: any, i: number) => i !== iIdx);
                                setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => {
                            const newNav = [...settings.footer.navigation];
                            newNav[idx].items.push({ label: '', url: '' });
                            setSettings({...settings, footer: {...settings.footer, navigation: newNav}});
                          }}
                          className="text-xs text-brand hover:underline flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact & More Info */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">Contact Details</h4>
                    <button 
                      onClick={() => {
                        const newItems = [...(settings.footer?.contactInfo?.items || []), { icon: 'Mail', value: '', label: '' }];
                        setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, items: newItems}}});
                      }}
                      className="text-xs text-brand hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Section Title</label>
                    <input
                      value={settings.footer?.contactInfo?.title || ''}
                      onChange={(e) => setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, title: e.target.value}}})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-3">
                    {settings.footer?.contactInfo?.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <input
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...settings.footer.contactInfo.items];
                                  newItems[idx].icon = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, items: newItems}}});
                                }}
                                placeholder="Icon (e.g. Mail)"
                                className="w-1/3 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                              />
                              <input
                                value={item.label}
                                onChange={(e) => {
                                  const newItems = [...settings.footer.contactInfo.items];
                                  newItems[idx].label = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, items: newItems}}});
                                }}
                                placeholder="Label (e.g. Email)"
                                className="flex-1 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                              />
                            </div>
                            <input
                              value={item.value}
                              onChange={(e) => {
                                const newItems = [...settings.footer.contactInfo.items];
                                newItems[idx].value = e.target.value;
                                setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, items: newItems}}});
                              }}
                              placeholder="Value"
                              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = settings.footer.contactInfo.items.filter((_: any, i: number) => i !== idx);
                              setSettings({...settings, footer: {...settings.footer, contactInfo: {...settings.footer.contactInfo, items: newItems}}});
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg self-start"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">More info</h4>
                    <button 
                      onClick={() => {
                        const newItems = [...(settings.footer?.moreInfo?.items || []), { icon: 'Clock', value: '', label: '' }];
                        setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, items: newItems}}});
                      }}
                      className="text-xs text-brand hover:underline flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Section Title</label>
                    <input
                      value={settings.footer?.moreInfo?.title || ''}
                      onChange={(e) => setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, title: e.target.value}}})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-3">
                    {settings.footer?.moreInfo?.items?.map((item: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <div className="flex gap-2">
                              <input
                                value={item.icon}
                                onChange={(e) => {
                                  const newItems = [...settings.footer.moreInfo.items];
                                  newItems[idx].icon = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, items: newItems}}});
                                }}
                                placeholder="Icon (e.g. Clock)"
                                className="w-1/3 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                              />
                              <input
                                value={item.label}
                                onChange={(e) => {
                                  const newItems = [...settings.footer.moreInfo.items];
                                  newItems[idx].label = e.target.value;
                                  setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, items: newItems}}});
                                }}
                                placeholder="Label (e.g. Sat - Fri)"
                                className="flex-1 bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-brand"
                              />
                            </div>
                            <input
                              value={item.value}
                              onChange={(e) => {
                                const newItems = [...settings.footer.moreInfo.items];
                                newItems[idx].value = e.target.value;
                                setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, items: newItems}}});
                              }}
                              placeholder="Value (e.g. 09:00 - 18:00)"
                              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                            />
                          </div>
                          <button 
                            onClick={() => {
                              const newItems = settings.footer.moreInfo.items.filter((_: any, i: number) => i !== idx);
                              setSettings({...settings, footer: {...settings.footer, moreInfo: {...settings.footer.moreInfo, items: newItems}}});
                            }}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg self-start"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Tags & Copyright */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">SEO Tags (Comma separated)</label>
                  <input
                    value={settings.footer?.seoTags?.join(', ') || ''}
                    onChange={(e) => setSettings({...settings, footer: {...settings.footer, seoTags: e.target.value.split(',').map(s => s.trim())}})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Copyright Text</label>
                  <input
                    value={settings.footer?.copyrightText || ''}
                    onChange={(e) => setSettings({...settings, footer: {...settings.footer, copyrightText: e.target.value}})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>
            </div>

            {/* Floating Items Settings */}
            <div className="glass-card p-8 rounded-3xl space-y-8">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <MousePointer2 size={20} /> Floating Items
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Floating Tabs (Help) */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">Floating Tabs (Help)</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Show</span>
                      <button 
                        onClick={() => setSettings({
                          ...settings, 
                          floatingItems: {
                            ...settings.floatingItems,
                            helpTabs: { ...settings.floatingItems.helpTabs, show: !settings.floatingItems.helpTabs.show }
                          }
                        })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${settings.floatingItems?.helpTabs?.show ? 'bg-brand' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.floatingItems?.helpTabs?.show ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-xs font-bold text-gray-500 uppercase">View UI Style</span>
                      <div className="flex bg-dark rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => setSettings({
                            ...settings, 
                            floatingItems: {
                              ...settings.floatingItems,
                              helpTabs: { ...settings.floatingItems.helpTabs, viewType: 'button' }
                            }
                          })}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${settings.floatingItems?.helpTabs?.viewType === 'button' ? 'bg-brand text-dark' : 'text-gray-400'}`}
                        >
                          Button
                        </button>
                        <button 
                          onClick={() => setSettings({
                            ...settings, 
                            floatingItems: {
                              ...settings.floatingItems,
                              helpTabs: { ...settings.floatingItems.helpTabs, viewType: 'nav' }
                            }
                          })}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${settings.floatingItems?.helpTabs?.viewType === 'nav' ? 'bg-brand text-dark' : 'text-gray-400'}`}
                        >
                          Nav
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {settings.floatingItems?.helpTabs?.items?.map((tab: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500">Tab #{idx + 1}</span>
                            <button 
                              onClick={() => {
                                const newItems = settings.floatingItems.helpTabs.items.filter((_: any, i: number) => i !== idx);
                                setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                              <input
                                value={tab.label}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.helpTabs.items];
                                  newItems[idx].label = e.target.value;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Icon</label>
                              <input
                                value={tab.icon}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.helpTabs.items];
                                  newItems[idx].icon = e.target.value;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">URL / Slug</label>
                              <input
                                value={tab.url}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.helpTabs.items];
                                  newItems[idx].url = e.target.value;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Position</label>
                              <select
                                value={tab.position}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.helpTabs.items];
                                  newItems[idx].position = e.target.value as any;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              >
                                <option value="left">Left</option>
                                <option value="right">Right</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newItems = [...(settings.floatingItems?.helpTabs?.items || []), { label: '', icon: 'HelpCircle', url: '', position: 'right' }];
                          setSettings({...settings, floatingItems: {...settings.floatingItems, helpTabs: {...settings.floatingItems.helpTabs, items: newItems}}});
                        }}
                        className="text-xs text-brand hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Tab
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-400 uppercase">Floating Action Buttons</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Show</span>
                      <button 
                        onClick={() => setSettings({
                          ...settings, 
                          floatingItems: {
                            ...settings.floatingItems,
                            actionButtons: { ...settings.floatingItems.actionButtons, show: !settings.floatingItems.actionButtons.show }
                          }
                        })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${settings.floatingItems?.actionButtons?.show ? 'bg-brand' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings.floatingItems?.actionButtons?.show ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <span className="text-xs font-bold text-gray-500 uppercase">Position Bottom</span>
                      <div className="flex bg-dark rounded-lg p-1 border border-white/10">
                        <button 
                          onClick={() => setSettings({
                            ...settings, 
                            floatingItems: {
                              ...settings.floatingItems,
                              actionButtons: { ...settings.floatingItems.actionButtons, position: 'left' }
                            }
                          })}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${settings.floatingItems?.actionButtons?.position === 'left' ? 'bg-brand text-dark' : 'text-gray-400'}`}
                        >
                          Left
                        </button>
                        <button 
                          onClick={() => setSettings({
                            ...settings, 
                            floatingItems: {
                              ...settings.floatingItems,
                              actionButtons: { ...settings.floatingItems.actionButtons, position: 'right' }
                            }
                          })}
                          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${settings.floatingItems?.actionButtons?.position === 'right' ? 'bg-brand text-dark' : 'text-gray-400'}`}
                        >
                          Right
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {settings.floatingItems?.actionButtons?.items?.map((btn: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  const newItems = [...settings.floatingItems.actionButtons.items];
                                  newItems[idx].show = !newItems[idx].show;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                                }}
                                className={`p-1.5 rounded-lg transition-colors ${btn.show ? 'text-brand bg-brand/10' : 'text-gray-500 bg-white/5'}`}
                              >
                                {btn.show ? <Eye size={14} /> : <EyeOff size={14} />}
                              </button>
                              <span className="text-xs font-bold text-gray-500">Button #{idx + 1}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const newItems = settings.floatingItems.actionButtons.items.filter((_: any, i: number) => i !== idx);
                                setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                              }}
                              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Icon</label>
                              <input
                                value={btn.icon}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.actionButtons.items];
                                  newItems[idx].icon = e.target.value;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Label (Optional)</label>
                              <input
                                value={btn.label || ''}
                                onChange={(e) => {
                                  const newItems = [...settings.floatingItems.actionButtons.items];
                                  newItems[idx].label = e.target.value;
                                  setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">URL / Slug</label>
                            <input
                              value={btn.url}
                              onChange={(e) => {
                                const newItems = [...settings.floatingItems.actionButtons.items];
                                newItems[idx].url = e.target.value;
                                setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                              }}
                              className="w-full bg-dark border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-brand"
                            />
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => {
                          const newItems = [...(settings.floatingItems?.actionButtons?.items || []), { icon: 'Phone', url: '', label: '', show: true }];
                          setSettings({...settings, floatingItems: {...settings.floatingItems, actionButtons: {...settings.floatingItems.actionButtons, items: newItems}}});
                        }}
                        className="text-xs text-brand hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Button
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                  <Sparkles size={20} /> Automated Schema.org Builder
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Enable Auto-Schema</span>
                  <button 
                    onClick={() => setSettings({...settings, autoSchema: {...(settings.autoSchema || { enabled: false, type: 'WebSite', data: { name: '', url: '', logo: '', description: '' } }), enabled: !settings.autoSchema?.enabled}})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.autoSchema?.enabled ? 'bg-brand' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.autoSchema?.enabled ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>

              {settings.autoSchema?.enabled && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Schema Type</label>
                        <select
                          value={settings.autoSchema.type}
                          onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, type: e.target.value as any}})}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        >
                          <option value="WebSite">WebSite</option>
                          <option value="Organization">Organization</option>
                          <option value="LocalBusiness">LocalBusiness</option>
                          <option value="Service">Service</option>
                          <option value="Product">Product</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Entity Name</label>
                        <input
                          value={settings.autoSchema.data.name}
                          onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, name: e.target.value}}})}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                          placeholder="e.g. YA Wedding Events"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">URL</label>
                        <input
                          value={settings.autoSchema.data.url}
                          onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, url: e.target.value}}})}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Logo URL</label>
                        <input
                          value={settings.autoSchema.data.logo}
                          onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, logo: e.target.value}}})}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                        <textarea
                          value={settings.autoSchema.data.description}
                          onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, description: e.target.value}}})}
                          rows={4}
                          className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                      {(settings.autoSchema.type === 'LocalBusiness' || settings.autoSchema.type === 'Organization') && (
                        <>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Address</label>
                            <input
                              value={settings.autoSchema.data.address || ''}
                              onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, address: e.target.value}}})}
                              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Telephone</label>
                            <input
                              value={settings.autoSchema.data.telephone || ''}
                              onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, telephone: e.target.value}}})}
                              className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                            />
                          </div>
                        </>
                      )}
                      {(settings.autoSchema.type === 'Service' || settings.autoSchema.type === 'Product') && (
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Price Range</label>
                          <input
                            value={settings.autoSchema.data.priceRange || ''}
                            onChange={(e) => setSettings({...settings, autoSchema: {...settings.autoSchema!, data: {...settings.autoSchema!.data, priceRange: e.target.value}}})}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-brand/5 border border-brand/20 rounded-2xl">
                    <h4 className="text-sm font-bold text-brand mb-4 uppercase tracking-widest">Generated Schema Preview</h4>
                    <pre className="text-[10px] text-gray-400 overflow-x-auto p-4 bg-dark rounded-xl border border-white/5">
                      {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": settings.autoSchema.type,
                        "name": settings.autoSchema.data.name,
                        "url": settings.autoSchema.data.url,
                        "logo": settings.autoSchema.data.logo,
                        "description": settings.autoSchema.data.description,
                        ...(settings.autoSchema.data.address && { "address": settings.autoSchema.data.address }),
                        ...(settings.autoSchema.data.telephone && { "telephone": settings.autoSchema.data.telephone }),
                        ...(settings.autoSchema.data.priceRange && { "priceRange": settings.autoSchema.data.priceRange })
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Google Integrations */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                <Search size={20} /> Google Search Console & Adsense
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Search Console Auth Key</label>
                  <div className="flex gap-2">
                    <input
                      value={settings.googleSearchConsoleKey || ''}
                      onChange={(e) => setSettings({...settings, googleSearchConsoleKey: e.target.value})}
                      className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                      placeholder="Enter verification key"
                    />
                    <button 
                      onClick={() => alert('Site resubmitted for indexing!')}
                      className="bg-white/5 hover:bg-white/10 text-brand px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border border-brand/20"
                    >
                      <RefreshCw size={16} /> Index Now
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Google Adsense Key</label>
                  <input
                    value={settings.googleAdsenseKey || ''}
                    onChange={(e) => setSettings({...settings, googleAdsenseKey: e.target.value})}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'media' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Media Manager</h2>
                <p className="text-gray-400 text-sm">Manage images, videos, and other assets</p>
              </div>
              <button 
                onClick={() => setEditingMedia({
                  id: Math.random().toString(36).substr(2, 9),
                  url: '',
                  name: '',
                  type: 'image',
                  size: 0,
                  createdAt: new Date().toISOString()
                })}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Plus size={20} /> Add New Media
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {media.map((item) => (
                <div key={item.id} className="glass-card rounded-3xl overflow-hidden group border border-white/5 hover:border-brand/30 transition-all">
                  <div className="aspect-video bg-white/5 relative overflow-hidden">
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        {item.type === 'video' ? <Video size={48} /> : 
                         item.type === 'pdf' ? <File size={48} /> : 
                         item.type === 'audio' ? <Music size={48} /> : 
                         <Archive size={48} />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setEditingMedia(item)}
                        className="p-3 bg-white/10 hover:bg-brand hover:text-dark rounded-full transition-all"
                        title="Edit SEO & Details"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete this media?')) {
                            handleSaveMedia(media.filter(m => m.id !== item.id));
                          }
                        }}
                        className="p-3 bg-white/10 hover:bg-red-500 rounded-full transition-all"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                          alert('URL copied to clipboard!');
                        }}
                        className="p-3 bg-white/10 hover:bg-blue-500 rounded-full transition-all"
                        title="Copy URL"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <h4 className="font-bold truncate text-sm">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.type} • {(item.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ))}
            </div>

            {editingMedia && (
              <div className="fixed inset-0 bg-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-dark border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold">Edit Media Details</h3>
                    <button onClick={() => setEditingMedia(null)} className="text-gray-400 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">File Name</label>
                        <input
                          value={editingMedia.name}
                          onChange={(e) => setEditingMedia({...editingMedia, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">File Type</label>
                        <select
                          value={editingMedia.type}
                          onChange={(e) => setEditingMedia({...editingMedia, type: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                          <option value="pdf">PDF</option>
                          <option value="svg">SVG</option>
                          <option value="font">Font</option>
                          <option value="icon">Icon</option>
                          <option value="audio">Audio</option>
                          <option value="zip">Zip Archive</option>
                        </select>
                      </div>
                    </div>

                    <ImageUpload
                      label="File URL"
                      value={editingMedia.url}
                      onChange={(url) => setEditingMedia({...editingMedia, url: url})}
                    />

                    <div className="space-y-4 border-t border-white/5 pt-6">
                      <h4 className="text-sm font-bold text-brand uppercase tracking-widest">SEO & Metadata</h4>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Alt Text (Images)</label>
                        <input
                          value={editingMedia.alt || ''}
                          onChange={(e) => setEditingMedia({...editingMedia, alt: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Keywords (Comma separated)</label>
                        <input
                          value={editingMedia.keywords?.join(', ') || ''}
                          onChange={(e) => setEditingMedia({...editingMedia, keywords: e.target.value.split(',').map(k => k.trim())})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                        <textarea
                          value={editingMedia.description || ''}
                          onChange={(e) => setEditingMedia({...editingMedia, description: e.target.value})}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 flex justify-end gap-4">
                    <button onClick={() => setEditingMedia(null)} className="px-6 py-2 rounded-xl font-bold text-gray-400 hover:text-white">Cancel</button>
                    <button 
                      onClick={() => {
                        const exists = media.find(m => m.id === editingMedia.id);
                        let updated;
                        if (exists) {
                          updated = media.map(m => m.id === editingMedia.id ? editingMedia : m);
                        } else {
                          updated = [...media, editingMedia];
                        }
                        handleSaveMedia(updated);
                      }}
                      className="bg-brand text-dark px-8 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      Save Media
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'booking' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Booking Management</h2>
                <p className="text-gray-400 text-sm">Build and manage your booking flows and PDF proposals</p>
              </div>
              <button 
                onClick={() => setEditingBookingForm({
                  id: `form-${Date.now()}`,
                  name: 'New Booking Form',
                  description: '',
                  steps: [],
                  pdfConfig: {
                    logo: '',
                    primaryColor: '#00C896',
                    secondaryColor: '#141414',
                    fontFamily: 'Inter',
                    headerText: 'Proposal',
                    footerText: '',
                    showPricing: true,
                    showTerms: true,
                    termsContent: '',
                    brandingDesign: { accentStyle: 'elegant' }
                  },
                  successMessage: 'Thank you for your booking!',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Plus size={20} /> Create New Form
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {bookingForms.map((form) => (
                <div key={form.id} className="glass-card p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-white/5 hover:border-brand/30 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{form.name}</h3>
                      <p className="text-gray-400 text-sm">{form.steps.length} Steps • {form.description || 'No description'}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-400 font-mono">ID: {form.id}</span>
                        <button 
                          onClick={() => {
                            const url = `${window.location.origin}/booking/${form.id}`;
                            navigator.clipboard.writeText(url);
                            alert('Booking link copied!');
                          }}
                          className="text-[10px] text-brand hover:underline flex items-center gap-1 font-bold uppercase"
                        >
                          <LinkIcon size={10} /> Copy Public Link
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => setEditingBookingForm(form)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-brand hover:text-dark rounded-xl font-bold transition-all"
                    >
                      <Edit2 size={18} /> Edit Form
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Delete this booking form?')) {
                          const updated = bookingForms.filter(f => f.id !== form.id);
                          const res = await fetch('/api/booking-forms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                            body: JSON.stringify({ forms: updated })
                          });
                          if (res.ok) setBookingForms(updated);
                        }
                      }}
                      className="p-3 bg-white/5 hover:bg-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {editingBookingForm && (
              <div className="fixed inset-0 bg-dark/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-dark border border-white/10 w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl my-8">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                      <h3 className="text-2xl font-bold">Edit Booking Flow</h3>
                      <p className="text-gray-400 text-sm">Configure steps, fields, and PDF branding</p>
                    </div>
                    <button onClick={() => setEditingBookingForm(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="p-8 space-y-12 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Form Name</label>
                        <input
                          value={editingBookingForm.name}
                          onChange={(e) => setEditingBookingForm({...editingBookingForm, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand text-lg font-bold"
                          placeholder="e.g. Wedding Booking"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                        <input
                          value={editingBookingForm.description}
                          onChange={(e) => setEditingBookingForm({...editingBookingForm, description: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand"
                          placeholder="Short description for internal use"
                        />
                      </div>
                    </div>

                    {/* Steps Builder */}
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-lg font-bold text-brand flex items-center gap-2">
                          <LayoutTemplate size={20} /> Booking Steps
                        </h4>
                        <button 
                          onClick={() => {
                            const newStep: BookingFormStep = {
                              id: `step-${Date.now()}`,
                              title: 'New Step',
                              fields: []
                            };
                            setEditingBookingForm({...editingBookingForm, steps: [...editingBookingForm.steps, newStep]});
                          }}
                          className="px-4 py-2 bg-brand/10 text-brand rounded-xl text-sm font-bold hover:bg-brand/20 transition-all flex items-center gap-2"
                        >
                          <Plus size={16} /> Add Step
                        </button>
                      </div>

                      <div className="space-y-4">
                        {editingBookingForm.steps.map((step, sIdx) => (
                          <div key={step.id} className="p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-8 relative group">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Step Title</label>
                                  <input
                                    value={step.title}
                                    onChange={(e) => {
                                      const newSteps = [...editingBookingForm.steps];
                                      newSteps[sIdx].title = e.target.value;
                                      setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand font-bold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase">Step Description</label>
                                  <input
                                    value={step.description || ''}
                                    onChange={(e) => {
                                      const newSteps = [...editingBookingForm.steps];
                                      newSteps[sIdx].description = e.target.value;
                                      setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-2 outline-none focus:border-brand"
                                  />
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  const newSteps = editingBookingForm.steps.filter((_, i) => i !== sIdx);
                                  setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                }}
                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl ml-4"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>

                            {/* Fields Builder */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fields in this step</span>
                                <button 
                                  onClick={() => {
                                    const newField: BookingFormField = {
                                      id: `field-${Date.now()}`,
                                      label: 'New Field',
                                      type: 'text',
                                      required: false,
                                      width: 'full'
                                    };
                                    const newSteps = [...editingBookingForm.steps];
                                    newSteps[sIdx].fields.push(newField);
                                    setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                  }}
                                  className="text-[10px] text-brand hover:underline flex items-center gap-1 font-bold uppercase"
                                >
                                  <Plus size={12} /> Add Field
                                </button>
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                {step.fields.map((field, fIdx) => (
                                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4 bg-dark/50 rounded-2xl border border-white/5">
                                    <div className="lg:col-span-2">
                                      <input
                                        value={field.label}
                                        onChange={(e) => {
                                          const newSteps = [...editingBookingForm.steps];
                                          newSteps[sIdx].fields[fIdx].label = e.target.value;
                                          setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                        }}
                                        placeholder="Label"
                                        className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                                      />
                                    </div>
                                    <div>
                                      <select
                                        value={field.type}
                                        onChange={(e) => {
                                          const newSteps = [...editingBookingForm.steps];
                                          newSteps[sIdx].fields[fIdx].type = e.target.value as any;
                                          setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                        }}
                                        className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                                      >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="tel">Phone</option>
                                        <option value="date">Date</option>
                                        <option value="select">Dropdown</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="checkbox">Checkbox</option>
                                      </select>
                                    </div>
                                    <div>
                                      <select
                                        value={field.width}
                                        onChange={(e) => {
                                          const newSteps = [...editingBookingForm.steps];
                                          newSteps[sIdx].fields[fIdx].width = e.target.value as any;
                                          setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                        }}
                                        className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                                      >
                                        <option value="full">Full Width</option>
                                        <option value="half">Half Width</option>
                                      </select>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                      <input
                                        type="checkbox"
                                        checked={field.required}
                                        onChange={(e) => {
                                          const newSteps = [...editingBookingForm.steps];
                                          newSteps[sIdx].fields[fIdx].required = e.target.checked;
                                          setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                        }}
                                        id={`req-${field.id}`}
                                        className="w-4 h-4 accent-brand"
                                      />
                                      <label htmlFor={`req-${field.id}`} className="text-xs text-gray-500">Required</label>
                                    </div>
                                    <div className="flex justify-end">
                                      <button 
                                        onClick={() => {
                                          const newSteps = [...editingBookingForm.steps];
                                          newSteps[sIdx].fields = newSteps[sIdx].fields.filter((_, i) => i !== fIdx);
                                          setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                        }}
                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                    {field.type === 'select' && (
                                      <div className="col-span-full mt-2">
                                        <input
                                          value={field.options?.join(', ') || ''}
                                          onChange={(e) => {
                                            const newSteps = [...editingBookingForm.steps];
                                            newSteps[sIdx].fields[fIdx].options = e.target.value.split(',').map(o => o.trim()).filter(Boolean);
                                            setEditingBookingForm({...editingBookingForm, steps: newSteps});
                                          }}
                                          placeholder="Options (comma separated)"
                                          className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                                        />
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF Branding Editor */}
                    <div className="space-y-8 pt-12 border-t border-white/10">
                      <h4 className="text-xl font-bold text-brand flex items-center gap-2">
                        <Palette size={24} /> PDF Proposal Branding
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Proposal Logo URL</label>
                              <input
                                value={editingBookingForm.pdfConfig.logo}
                                onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, logo: e.target.value}})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-brand"
                                placeholder="https://..."
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Brand Color</label>
                              <div className="flex gap-3">
                                <input
                                  type="color"
                                  value={editingBookingForm.pdfConfig.primaryColor}
                                  onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, primaryColor: e.target.value}})}
                                  className="w-12 h-12 bg-transparent border-none cursor-pointer"
                                />
                                <input
                                  value={editingBookingForm.pdfConfig.primaryColor}
                                  onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, primaryColor: e.target.value}})}
                                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-brand font-mono"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Header Title</label>
                              <input
                                value={editingBookingForm.pdfConfig.headerText}
                                onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, headerText: e.target.value}})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-brand"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Accent Style</label>
                              <select
                                value={editingBookingForm.pdfConfig.brandingDesign.accentStyle}
                                onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, brandingDesign: {...editingBookingForm.pdfConfig.brandingDesign, accentStyle: e.target.value as any}}})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-brand"
                              >
                                <option value="minimal">Minimalist</option>
                                <option value="bold">Bold & Modern</option>
                                <option value="elegant">Elegant Serif</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Terms & Conditions</label>
                            <textarea
                              value={editingBookingForm.pdfConfig.termsContent}
                              onChange={(e) => setEditingBookingForm({...editingBookingForm, pdfConfig: {...editingBookingForm.pdfConfig, termsContent: e.target.value}})}
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-brand"
                              placeholder="Standard terms and conditions for the proposal..."
                            />
                          </div>
                        </div>

                        {/* PDF Preview Mockup */}
                        <div className="bg-white rounded-xl shadow-2xl p-8 text-gray-900 space-y-8 min-h-[500px] flex flex-col">
                          <div className="flex justify-between items-start border-b pb-6" style={{ borderBottomColor: editingBookingForm.pdfConfig.primaryColor }}>
                            <div>
                              {editingBookingForm.pdfConfig.logo ? (
                                <img src={editingBookingForm.pdfConfig.logo} alt="Logo" className="h-12 object-contain mb-4" />
                              ) : (
                                <div className="h-12 w-32 bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400 uppercase mb-4">Logo Placeholder</div>
                              )}
                              <h5 className="text-2xl font-bold uppercase tracking-tighter" style={{ color: editingBookingForm.pdfConfig.primaryColor }}>{editingBookingForm.pdfConfig.headerText}</h5>
                            </div>
                            <div className="text-right text-xs text-gray-400">
                              <p>Proposal #: PR-2024-001</p>
                              <p>Date: {new Date().toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                              <div className="h-4 w-1/3 bg-gray-100 rounded"></div>
                              <div className="h-4 w-1/2 bg-gray-50 rounded"></div>
                            </div>
                            <div className="space-y-4">
                              <div className="h-32 bg-gray-50 rounded-lg border-l-4" style={{ borderLeftColor: editingBookingForm.pdfConfig.primaryColor }}></div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-4 w-full bg-gray-100 rounded"></div>
                              <div className="h-4 w-full bg-gray-100 rounded"></div>
                              <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
                            </div>
                          </div>

                          <div className="pt-6 border-t text-[10px] text-gray-400 flex justify-between">
                            <p>{editingBookingForm.pdfConfig.footerText || '© 2024 Tsameem Events'}</p>
                            <p>Page 1 of 1</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end gap-4">
                    <button onClick={() => setEditingBookingForm(null)} className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-white transition-all">Cancel</button>
                    <button 
                      onClick={() => handleSaveBookingForm(editingBookingForm)}
                      className="bg-brand text-dark px-12 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center gap-2"
                    >
                      <Save size={20} /> Save Booking Form
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {editingRating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-lighter border border-white/10 rounded-[2.5rem] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingRating.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                <button onClick={() => setEditingRating(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveRating} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                    <input
                      name="name"
                      defaultValue={editingRating.name}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                    <input
                      name="location"
                      defaultValue={editingRating.location}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">URL / Slug (Optional)</label>
                    <input
                      name="slug"
                      defaultValue={editingRating.slug}
                      placeholder="e.g. sarah-ahmed-wedding"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Star Rating (1-5)</label>
                    <select
                      name="stars"
                      defaultValue={editingRating.stars}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    >
                      {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Stars</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Testimonial Content</label>
                  <textarea
                    name="content"
                    defaultValue={editingRating.content}
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Services (comma separated)</label>
                    <input
                      name="services"
                      defaultValue={editingRating.services.join(', ')}
                      placeholder="e.g. Wedding Planning, Decor"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Budget Range</label>
                    <input
                      name="budgetRange"
                      defaultValue={editingRating.budgetRange}
                      placeholder="e.g. AED 50,000 - 100,000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Badge Selection</label>
                    <select
                      name="badge"
                      defaultValue={editingRating.badge}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    >
                      {['Elite', 'Traditional', 'Premium', 'Luxury', 'Emarati', 'Indian', 'Asian', 'Western', 'African', 'Custom Writing'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Review Status</label>
                    <select
                      name="status"
                      defaultValue={editingRating.status}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Custom Badge Text (if selected)</label>
                    <input
                      name="customBadgeText"
                      defaultValue={editingRating.customBadgeText}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageUpload
                      label="Profile Image"
                      value={editingRating.profileImage}
                      onChange={(url) => setEditingRating({...editingRating, profileImage: url})}
                    />
                    <ImageUpload
                      label="Review Image"
                      value={editingRating.reviewImage || ''}
                      onChange={(url) => setEditingRating({...editingRating, reviewImage: url})}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isVerified"
                        defaultChecked={editingRating.isVerified}
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-white/10 rounded-full transition-colors group-hover:bg-white/20"></div>
                      <div className="dot absolute left-1 top-1 bg-gray-400 w-3 h-3 rounded-full transition-all"></div>
                    </div>
                    <span className="text-sm text-gray-400">Verified Badge</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="showProfileImage"
                        defaultChecked={editingRating.showProfileImage}
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-white/10 rounded-full transition-colors group-hover:bg-white/20"></div>
                      <div className="dot absolute left-1 top-1 bg-gray-400 w-3 h-3 rounded-full transition-all"></div>
                    </div>
                    <span className="text-sm text-gray-400">Show Profile Image</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="showReviewImage"
                        defaultChecked={editingRating.showReviewImage}
                        className="sr-only"
                      />
                      <div className="w-10 h-5 bg-white/10 rounded-full transition-colors group-hover:bg-white/20"></div>
                      <div className="dot absolute left-1 top-1 bg-gray-400 w-3 h-3 rounded-full transition-all"></div>
                    </div>
                    <span className="text-sm text-gray-400">Show Review Image</span>
                  </label>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditingRating(null)}
                    className="px-6 py-3 rounded-xl font-bold hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brand text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-brand/20 transition-all"
                  >
                    Save Testimonial
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {tab === 'settings' && settings && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">SEO & API Configuration</h2>
              <button 
                onClick={handleSaveSettings}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save All Changes
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="space-y-8">
              {/* SEO & General */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand">General & SEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Site Name</label>
                    <input
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Google Tag Manager ID</label>
                    <input
                      value={settings.googleTagManagerId}
                      onChange={(e) => setSettings({...settings, googleTagManagerId: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Site Description (SEO)</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    rows={3}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>

              {/* Hero Section Settings */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand">Hero Section Settings</h3>
                <ImageUpload
                  label="Background Image URL"
                  value={settings.heroBackgroundImage}
                  onChange={(url) => setSettings({...settings, heroBackgroundImage: url})}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Desktop Height (e.g. 50vh)</label>
                    <input
                      value={settings.heroHeightDesktop}
                      onChange={(e) => setSettings({...settings, heroHeightDesktop: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Tablet Height (e.g. 60vh)</label>
                    <input
                      value={settings.heroHeightTablet}
                      onChange={(e) => setSettings({...settings, heroHeightTablet: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Mobile Height (e.g. 75vh)</label>
                    <input
                      value={settings.heroHeightMobile}
                      onChange={(e) => setSettings({...settings, heroHeightMobile: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Help Tab Settings */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand">Help Tab Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Tab Label</label>
                    <input
                      value={settings.helpTabName}
                      onChange={(e) => setSettings({...settings, helpTabName: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Tab Size</label>
                    <select
                      value={settings.helpTabSize}
                      onChange={(e) => setSettings({...settings, helpTabSize: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    >
                      <option value="small">Small (Discreet)</option>
                      <option value="large">Large (Prominent)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* About Page Settings */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand">About Page Settings</h3>
                <ImageUpload
                  label="Main Image URL"
                  value={settings.aboutImage}
                  onChange={(url) => setSettings({...settings, aboutImage: url})}
                />
                <div className="space-y-4">
                  <label className="text-xs font-bold text-gray-400 uppercase block">Centered Stats</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {settings.aboutStats?.map((stat: any, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...settings.aboutStats];
                            newStats[idx].value = e.target.value;
                            setSettings({...settings, aboutStats: newStats});
                          }}
                          placeholder="Value (e.g. 10+)"
                          className="w-1/3 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                        <input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...settings.aboutStats];
                            newStats[idx].label = e.target.value;
                            setSettings({...settings, aboutStats: newStats});
                          }}
                          placeholder="Label"
                          className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Contact Phone</label>
                    <input
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Contact Email</label>
                    <input
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Address (Use \n for new lines)</label>
                  <textarea
                    value={settings.address}
                    onChange={(e) => setSettings({...settings, address: e.target.value})}
                    rows={3}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-brand text-dark py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all">
                Save All Settings
              </button>
            </form>
          </div>
        )}

        {tab === 'package' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Package Builder Steps</h2>
              <button
                onClick={() => setEditingStep({})}
                className="bg-brand text-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Add Step
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {packageSteps.map((step, idx) => (
                <div key={step.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-brand/20 rounded-full flex items-center justify-center text-brand font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{step.title}</h3>
                      <p className="text-sm text-gray-400">{step.type} • {step.required ? 'Required' : 'Optional'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingStep(step)} className="p-2 hover:text-brand transition-colors"><Edit2 size={18} /></button>
                    <button onClick={async () => {
                      if (!confirm('Are you sure?')) return;
                      const updated = packageSteps.filter(s => s.id !== step.id);
                      await fetch('/api/package-steps', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                        body: JSON.stringify(updated)
                      });
                      setPackageSteps(updated);
                    }} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal for Package Step */}
        {editingStep && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-8">{editingStep.id ? 'Edit Step' : 'Add New Step'}</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newStep: PackageStep = {
                  id: editingStep.id || `step-${Date.now()}`,
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  type: formData.get('type') as any,
                  required: formData.get('required') === 'on',
                  serviceIds: (formData.get('serviceIds') as string)?.split(',').map(s => s.trim()).filter(Boolean)
                };
                
                let updated;
                if (editingStep.id) {
                  updated = packageSteps.map(s => s.id === editingStep.id ? newStep : s);
                } else {
                  updated = [...packageSteps, newStep];
                }

                const res = await fetch('/api/package-steps', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                  body: JSON.stringify(updated)
                });

                if (res.ok) {
                  setPackageSteps(updated);
                  setEditingStep(null);
                }
              }} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Step Title</label>
                  <input name="title" defaultValue={editingStep.title} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                  <textarea name="description" defaultValue={editingStep.description} required rows={2} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                    <select name="type" defaultValue={editingStep.type} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand">
                      <option value="services">Services Selection</option>
                      <option value="custom">Custom Text Input</option>
                      <option value="lead">Lead Information Form</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-8">
                    <input type="checkbox" name="required" defaultChecked={editingStep.required} id="required" className="w-4 h-4 accent-brand" />
                    <label htmlFor="required" className="text-sm text-gray-400">Required Step</label>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Service IDs (comma separated, only for 'services' type)</label>
                  <input name="serviceIds" defaultValue={editingStep.serviceIds?.join(', ')} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="full-wedding-planning, photography-videography, ..." />
                  <p className="text-[10px] text-gray-500">Available IDs: {services.map(s => s.id).join(', ')}</p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={20} /> Save Step
                  </button>
                  <button type="button" onClick={() => setEditingStep(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {tab === 'services' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Services</h2>
              <button
                onClick={() => setEditingItem({})}
                className="bg-brand text-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {services.map(service => (
                <div key={service.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <img src={service.image} className="w-16 h-16 rounded-lg object-cover" alt={service.name} />
                    <div>
                      <h3 className="font-bold">{service.name}</h3>
                      <p className="text-sm text-gray-400">AED {service.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(service)} className="p-2 hover:text-brand transition-colors"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteService(service.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'blogs' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Blogs</h2>
              <button
                onClick={() => setEditingBlog({})}
                className="bg-brand text-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Add Blog Post
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {blogs.map(blog => (
                <div key={blog.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <img src={blog.image} className="w-16 h-16 rounded-lg object-cover" alt={blog.title} />
                    <div>
                      <h3 className="font-bold">{blog.title}</h3>
                      <p className="text-sm text-gray-400">{blog.date} • {blog.author}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingBlog(blog)} className="p-2 hover:text-brand transition-colors"><Edit2 size={18} /></button>
                    <button 
                      onClick={() => {
                        setVisualEditingItem({ id: blog.id, type: 'blog' });
                        setIsVisualEditing(true);
                      }} 
                      className="p-2 hover:text-brand transition-colors"
                      title="Visual Editor"
                    >
                      <MousePointer2 size={18} />
                    </button>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pages' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Dynamic Pages</h2>
              <button
                onClick={() => setEditingPage({ title: '', slug: '', widgets: [], published: false })}
                className="bg-brand text-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Add Page
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {pages.map(page => (
                <div key={page.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                      <LayoutDashboard size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">{page.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">/{page.slug} • {(page.widgets || []).length} Widgets</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${page.published ? 'bg-brand/20 text-brand' : 'bg-yellow-500/20 text-yellow-500'}`}>
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!page.published && (
                      <button 
                        onClick={async () => {
                          const updated = pages.map(p => p.id === page.id ? { ...p, published: true } : p);
                          await fetch('/api/pages', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                            body: JSON.stringify({ pages: updated })
                          });
                          setPages(updated);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-brand text-dark rounded-lg text-xs font-bold hover:shadow-lg transition-all"
                      >
                        <Globe size={14} /> Publish
                      </button>
                    )}
                    <button onClick={() => setEditingPage(page)} className="p-2 hover:text-brand transition-colors"><Edit2 size={18} /></button>
                    <button 
                      onClick={() => {
                        setVisualEditingItem({ id: page.id, type: 'page' });
                        setIsVisualEditing(true);
                      }} 
                      className="p-2 hover:text-brand transition-colors"
                      title="Visual Editor"
                    >
                      <MousePointer2 size={18} />
                    </button>
                    <a 
                      href={page.slug === 'home' ? '/' : (['about', 'services', 'gallery', 'blog', 'contact', 'faq', 'discounts', 'package-builder', 'packages', 'help-center', 'trust-safety', 'terms-of-service', 'privacy-policy', 'partnerships', 'return-refund'].includes(page.slug) ? `/${page.slug}` : `/p/${page.slug}`)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2 hover:text-brand transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button onClick={async () => {
                      if (!confirm('Are you sure?')) return;
                      const updated = pages.filter(p => p.id !== page.id);
                      await fetch('/api/pages', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                        body: JSON.stringify({ pages: updated })
                      });
                      setPages(updated);
                    }} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'promos' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Manage Promos & Discounts</h2>
              <button
                onClick={() => setEditingPromo({})}
                className="bg-brand text-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2"
              >
                <Plus size={18} /> Add Promo
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {promos.map(promo => (
                <div key={promo.id} className="glass-card p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="font-bold">{promo.title}</h3>
                      <p className="text-sm text-gray-400">{promo.badge || 'No Badge'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingPromo(promo)} className="p-2 hover:text-brand transition-colors"><Edit2 size={18} /></button>
                    <button onClick={async () => {
                      if (!confirm('Are you sure?')) return;
                      const updated = promos.filter(p => p.id !== promo.id);
                      await fetch('/api/promos', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                        body: JSON.stringify({ promos: updated })
                      });
                      setPromos(updated);
                    }} className="p-2 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'partnerships' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Partnership Applications</h2>
                <p className="text-gray-400 text-sm">Manage and review partnership requests from the platform</p>
              </div>
              <div className="bg-brand/10 px-4 py-2 rounded-xl border border-brand/20">
                <span className="text-brand font-bold">{partnerships.length}</span>
                <span className="text-gray-400 text-xs ml-2 uppercase tracking-wider">Total Applications</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {partnerships.length === 0 ? (
                <div className="glass-card p-20 rounded-[2rem] text-center border-dashed border-2 border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                    <Handshake size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400">No applications yet</h3>
                  <p className="text-gray-500 mt-2">New partnership requests will appear here once submitted.</p>
                </div>
              ) : (
                partnerships.map((app) => (
                  <div key={app.id} className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-brand/30 transition-all">
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-start gap-6">
                          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center text-brand shrink-0">
                            <Users size={32} />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-2xl font-bold">{app.name}</h3>
                              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest rounded-full border border-yellow-500/20">
                                {app.status}
                              </span>
                            </div>
                            <p className="text-brand font-medium">{app.company || 'Independent Partner'}</p>
                            <p className="text-gray-500 text-xs mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Contact Details</span>
                            <p className="text-sm">{app.email}</p>
                            <p className="text-sm text-gray-400">{app.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Experience & Web</span>
                            <p className="text-sm">{app.experience} Years</p>
                            {app.website && (
                              <a href={app.website} target="_blank" rel="noopener noreferrer" className="text-sm text-brand hover:underline flex items-center gap-1">
                                <ExternalLink size={12} /> Visit Website
                              </a>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Vision & Message</span>
                          <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl italic">
                            "{app.message}"
                          </p>
                        </div>
                      </div>

                      <div className="lg:w-64 flex flex-col gap-3">
                        <button 
                          onClick={() => alert('Approval logic would go here. In this demo, we just keep the record.')}
                          className="w-full py-4 bg-brand text-dark rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all"
                        >
                          <Check size={20} /> Approve Partner
                        </button>
                        <button 
                          onClick={() => handleDeletePartnership(app.id)}
                          className="w-full py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-transparent hover:border-red-500/20"
                        >
                          <Trash2 size={20} /> Reject & Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Manage Testimonials</h2>
                <p className="text-gray-400 text-sm">Add, edit, and manage client reviews for the platform</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  <button 
                    onClick={() => setReviewFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reviewFilter === 'all' ? 'bg-brand text-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setReviewFilter('pending')}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reviewFilter === 'pending' ? 'bg-yellow-500 text-dark' : 'text-gray-400 hover:text-white'}`}
                  >
                    Pending ({ratings.filter(r => r.status === 'pending').length})
                  </button>
                </div>
                <button
                  onClick={() => setEditingRating({
                    id: '',
                    name: '',
                    location: '',
                    showProfileImage: false,
                    showReviewImage: false,
                    stars: 5,
                    content: '',
                    services: [],
                    budgetRange: '',
                    isVerified: true,
                    badge: 'Elite',
                    status: 'approved',
                    createdAt: new Date().toISOString()
                  })}
                  className="bg-brand text-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all"
                >
                  <Plus size={20} /> Add Testimonial
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {ratings.filter(r => reviewFilter === 'all' ? true : r.status === reviewFilter).length === 0 ? (
                <div className="glass-card p-20 rounded-[2rem] text-center border-dashed border-2 border-white/5">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                    <Star size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400">No {reviewFilter === 'pending' ? 'pending' : ''} testimonials yet</h3>
                  <p className="text-gray-500 mt-2">New reviews will appear here once submitted by customers.</p>
                </div>
              ) : (
                ratings
                  .filter(r => reviewFilter === 'all' ? true : r.status === reviewFilter)
                  .map((rating) => (
                  <div key={rating.id} className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-brand/30 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold overflow-hidden">
                          {rating.profileImage ? (
                            <img src={rating.profileImage} alt={rating.name} className="w-full h-full object-cover" />
                          ) : (
                            rating.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {rating.name}
                            {rating.isVerified && <CheckCircle size={16} className="text-brand" />}
                          </h3>
                          <p className="text-sm text-gray-400">{rating.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingRating(rating)} className="p-2 hover:text-brand transition-colors bg-white/5 rounded-lg"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteRating(rating.id)} className="p-2 hover:text-red-500 transition-colors bg-white/5 rounded-lg"><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex text-brand mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < rating.stars ? "currentColor" : "none"} />
                        ))}
                        <span className="ml-2 px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold uppercase rounded-md border border-brand/20">
                          {rating.badge === 'Custom Writing' ? rating.customBadgeText : rating.badge}
                        </span>
                      </div>
                      <p className="text-gray-300 italic line-clamp-3 mb-4">"{rating.content}"</p>
                      <div className="flex flex-wrap gap-2">
                        {rating.services.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-white/5 text-gray-400 text-[10px] font-medium rounded-md border border-white/10">
                            {s}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Budget: {rating.budgetRange}</span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                          rating.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                          rating.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {rating.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'container-widget' && (
          <ContainerWidgetTab />
        )}

        {tab === 'theme-builder' && (
          <ThemeBuilderTab />
        )}

        {tab === 'custom-post-types' && (
          <CustomPostTypesTab />
        )}

        {tab === 'redirections' && (
          <RedirectionsTab />
        )}

        {tab === 'development' && devSettings && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Development & SMTP Settings</h2>
                <p className="text-gray-400 text-sm">Configure your email server and administrative notifications</p>
              </div>
              <button 
                onClick={handleSaveDevSettings}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save Development Settings
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* SMTP Configuration */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                  <Mail size={20} /> SMTP Configuration
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">SMTP Host</label>
                    <input
                      value={devSettings.smtpHost}
                      onChange={(e) => setDevSettings({...devSettings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">SMTP Port</label>
                    <input
                      value={devSettings.smtpPort}
                      onChange={(e) => setDevSettings({...devSettings, smtpPort: e.target.value})}
                      placeholder="587"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">SMTP User</label>
                    <input
                      value={devSettings.smtpUser}
                      onChange={(e) => setDevSettings({...devSettings, smtpUser: e.target.value})}
                      placeholder="your-email@gmail.com"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">SMTP Password</label>
                    <input
                      type="password"
                      value={devSettings.smtpPass}
                      onChange={(e) => setDevSettings({...devSettings, smtpPass: e.target.value})}
                      placeholder="••••••••••••"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                  <Users size={20} /> Notification Settings
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Admin Email (Receiver)</label>
                    <input
                      value={devSettings.adminEmail}
                      onChange={(e) => setDevSettings({...devSettings, adminEmail: e.target.value})}
                      placeholder="admin@ya-wedding.com"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                    <p className="text-[10px] text-gray-500 italic">This email will receive all new bookings and inquiries.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">From Email (Sender)</label>
                    <input
                      value={devSettings.fromEmail}
                      onChange={(e) => setDevSettings({...devSettings, fromEmail: e.target.value})}
                      placeholder="noreply@ya-wedding.com"
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                    <p className="text-[10px] text-gray-500 italic">This address will appear as the sender for all automated emails.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'user-manager' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">User Management</h2>
                <p className="text-gray-400 text-sm">Manage platform users, roles, and access</p>
              </div>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">User</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Role</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500">Joined</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center text-brand font-bold">
                            {user.name[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white">{user.name}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={user.role}
                          onChange={(e) => handleUpdateUser(user.id, { role: e.target.value })}
                          className="bg-dark border border-white/10 rounded-lg px-2 py-1 text-xs text-gray-300 outline-none focus:border-brand"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="partner">Partner</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          user.subscriptionStatus === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {user.subscriptionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              const newEmail = prompt('Enter new email:', user.email);
                              if (newEmail) handleUpdateUser(user.id, { email: newEmail });
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                            title="Edit Email"
                          >
                            <Mail size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'security-settings' && securityConfig && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Admin Security Protocol</h2>
                <p className="text-gray-400 text-sm">Configure advanced security checks and access controls</p>
              </div>
              <button 
                onClick={handleUpdateSecurity}
                className="flex items-center gap-2 bg-brand text-dark px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Save size={20} /> Save Security Protocol
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                  <Shield size={20} /> Access Configuration
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Admin Portal Slug</label>
                    <input
                      value={securityConfig.slug}
                      onChange={(e) => setSecurityConfig({...securityConfig, slug: e.target.value})}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                      placeholder="/admin-portal-access"
                    />
                    <p className="text-[10px] text-gray-500 italic">Changing this will change the URL required to access the admin login.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Admin Username</label>
                    <input
                      value={securityConfig.adminCredentials.username}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig, 
                        adminCredentials: { ...securityConfig.adminCredentials, username: e.target.value }
                      })}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Admin Password</label>
                    <input
                      type="password"
                      value={securityConfig.adminCredentials.password}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig, 
                        adminCredentials: { ...securityConfig.adminCredentials, password: e.target.value }
                      })}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl space-y-6">
                <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                  <MapPin size={20} /> Geo-Location Restrictions
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Allowed Locations (Comma separated)</label>
                    <textarea
                      rows={3}
                      value={securityConfig.allowedGeos.join(', ')}
                      onChange={(e) => setSecurityConfig({
                        ...securityConfig, 
                        allowedGeos: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                      className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand"
                      placeholder="Sylhet, Bangladesh, Dubai, UAE"
                    />
                  </div>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl space-y-6 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-brand flex items-center gap-2">
                    <CheckCircle size={20} /> Security Questions
                  </h3>
                  <button 
                    onClick={() => setSecurityConfig({
                      ...securityConfig,
                      securityQuestions: [...securityConfig.securityQuestions, { q: '', a: '' }]
                    })}
                    className="text-xs font-bold text-brand hover:underline"
                  >
                    + Add Question
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {securityConfig.securityQuestions.map((qa: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4 relative group">
                      <button 
                        onClick={() => {
                          const newQA = [...securityConfig.securityQuestions];
                          newQA.splice(idx, 1);
                          setSecurityConfig({ ...securityConfig, securityQuestions: newQA });
                        }}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Question {idx + 1}</label>
                        <input
                          value={qa.q}
                          onChange={(e) => {
                            const newQA = [...securityConfig.securityQuestions];
                            newQA[idx].q = e.target.value;
                            setSecurityConfig({ ...securityConfig, securityQuestions: newQA });
                          }}
                          className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Answer</label>
                        <input
                          value={qa.a}
                          onChange={(e) => {
                            const newQA = [...securityConfig.securityQuestions];
                            newQA[idx].a = e.target.value;
                            setSecurityConfig({ ...securityConfig, securityQuestions: newQA });
                          }}
                          className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-brand"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'email-templates' && (
          <EmailTemplatesTab />
        )}

        {/* Modal for Dynamic Page Builder */}
        {editingPage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingPage.id ? 'Edit Page' : 'Create New Page'}</h2>
                <button onClick={() => { setEditingPage(null); setSaveStatus('idle'); }} className="text-gray-400 hover:text-white">Close</button>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setSaveStatus('saving');
                try {
                  const formData = new FormData(e.target as HTMLFormElement);
                  const newPage = {
                    ...editingPage,
                    id: editingPage.id || `page-${Date.now()}`,
                    title: formData.get('title') as string,
                    slug: formData.get('slug') as string,
                    description: formData.get('description') as string,
                    schema: formData.get('schema') as string,
                  };
                  
                  let updated;
                  if (editingPage.id) {
                    updated = pages.map(p => p.id === editingPage.id ? newPage : p);
                  } else {
                    updated = [...pages, newPage];
                  }

                  const res = await fetch('/api/pages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                    body: JSON.stringify({ pages: updated })
                  });

                  if (res.ok) {
                    setPages(updated);
                    setSaveStatus('saved');
                    setTimeout(() => {
                      setEditingPage(null);
                      setSaveStatus('idle');
                    }, 1500);
                  } else {
                    setSaveStatus('error');
                  }
                } catch (err) {
                  setSaveStatus('error');
                }
              }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Page Title</label>
                    <input name="title" defaultValue={editingPage.title} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Slug (URL path)</label>
                    <input name="slug" defaultValue={editingPage.slug} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. custom-landing" />
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm">Publish Status</h4>
                    <p className="text-xs text-gray-400">Make this page visible to the public</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, published: !editingPage.published })}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${editingPage.published ? 'bg-brand' : 'bg-gray-600'}`}
                  >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${editingPage.published ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">SEO Description</label>
                  <textarea name="description" defaultValue={editingPage.description} rows={2} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Schema Markup (JSON-LD)</label>
                  <textarea name="schema" defaultValue={editingPage.schema} rows={4} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand font-mono text-xs" placeholder='{ "@context": "https://schema.org", ... }' />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-brand">Page Widgets</h3>
                    <button
                      type="button"
                      onClick={() => {
                        const widgetTypes: Record<string, any> = {
                          hero: { title: 'New Hero', subtitle: 'Subtitle here', image: '', ctaText: 'Contact Us', ctaLink: '/contact' },
                          services: { title: 'Our Services', subtitle: 'Luxury solutions', category: '', limit: 3 },
                          blogs: { title: 'Latest Stories', subtitle: 'From our blog', limit: 3 },
                          text: { content: '## New Section\nAdd your content here...' },
                          stats: { stats: [{ label: 'Experience', value: '10+' }, { label: 'Events', value: '500+' }] },
                          gallery: { title: 'Gallery', images: [] },
                          faq: { title: 'FAQs', items: [{ q: 'Question?', a: 'Answer.' }] },
                          cta: { title: 'Ready?', subtitle: 'Let\'s talk', buttonText: 'Get Started', link: '/contact' },
                          promos: { title: 'Special Offers', limit: 2 }
                        };
                        const newWidget = { 
                          id: `w-${Date.now()}`, 
                          type: 'text', 
                          config: widgetTypes.text, 
                          weight: (editingPage.widgets || []).length 
                        };
                        setEditingPage({ ...editingPage, widgets: [...(editingPage.widgets || []), newWidget] });
                      }}
                      className="text-sm bg-brand/10 text-brand px-3 py-1 rounded-lg font-bold"
                    >
                      + Add Widget
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(editingPage.widgets || []).sort((a: any, b: any) => a.weight - b.weight).map((widget: any, idx: number) => (
                      <div key={widget.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-gray-500 font-mono">#{idx + 1}</span>
                            <select
                              value={widget.type}
                              onChange={(e) => {
                                const newType = e.target.value;
                                const widgetTypes: Record<string, any> = {
                                  hero: { 
                                    title: 'New Hero', 
                                    subtitle: 'Subtitle here', 
                                    image: '', 
                                    ctaText: 'Contact Us', 
                                    ctaLink: '/contact',
                                    heightType: 'auto',
                                    customHeight: 100,
                                    desktopAlignment: 'left',
                                    mobileAlignment: 'center',
                                    titleSize: 'text-6xl',
                                    subtitleSize: 'text-xl',
                                    overlayColor: '',
                                    overlayOpacity: 1,
                                    overlayGradient: 'bg-gradient-to-r from-dark via-dark/80 to-transparent'
                                  },
                                  services: { 
                                    title: 'Our Services', 
                                    subtitle: 'Luxury solutions', 
                                    category: '', 
                                    limit: 3,
                                    headerAlignment: 'center',
                                    titleSize: 'text-4xl',
                                    subtitleSize: '',
                                    titleColor: '',
                                    subtitleColor: ''
                                  },
                                  blogs: { 
                                    title: 'Latest Stories', 
                                    subtitle: 'From our blog', 
                                    limit: 3,
                                    headerAlignment: 'center',
                                    titleSize: 'text-4xl',
                                    subtitleSize: '',
                                    titleColor: '',
                                    subtitleColor: ''
                                  },
                                  text: { 
                                    content: '## New Section\nAdd your content here...', 
                                    alignment: 'left', 
                                    fontSize: 'base', 
                                    fontWeight: 'font-normal',
                                    letterSpacing: 'tracking-normal',
                                    lineHeight: 'leading-relaxed',
                                    fontFamily: 'font-sans',
                                    containerWidth: 'max-w-7xl',
                                    textColor: '', 
                                    backgroundColor: '', 
                                    backgroundImage: '',
                                    backgroundOverlay: '',
                                    paddingTop: 80, 
                                    paddingBottom: 80,
                                    opacity: 1
                                  },
                                  stats: { stats: [{ label: 'Experience', value: '10+' }, { label: 'Events', value: '500+' }] },
                                  gallery: { 
                                    title: 'Gallery', 
                                    images: [],
                                    headerAlignment: 'center',
                                    titleSize: 'text-4xl',
                                    subtitleSize: '',
                                    titleColor: '',
                                    subtitleColor: ''
                                  },
                                  faq: { 
                                    title: 'FAQs', 
                                    items: [{ q: 'Question?', a: 'Answer.' }],
                                    headerAlignment: 'center',
                                    titleSize: 'text-4xl',
                                    subtitleSize: '',
                                    titleColor: '',
                                    subtitleColor: ''
                                  },
                                  cta: { 
                                    title: 'Ready to start?', 
                                    subtitle: 'Let\'s talk about your event', 
                                    buttonText: 'Get Started', 
                                    link: '/contact',
                                    titleSize: 'text-4xl',
                                    subtitleSize: 'text-xl',
                                    backgroundColor: '',
                                    cardBgColor: '',
                                    cardTextColor: '',
                                    buttonBgColor: '',
                                    buttonTextColor: ''
                                  },
                                  promos: { 
                                    title: 'Special Offers', 
                                    limit: 2,
                                    headerAlignment: 'center',
                                    titleSize: 'text-4xl',
                                    subtitleSize: '',
                                    titleColor: '',
                                    subtitleColor: ''
                                  },
                                  about: { title: 'About Us', content: 'Our story...', image: '' },
                                  package_builder: { title: 'Build Your Package' },
                                  discounts: { title: 'Exclusive Discounts' },
                                  contact: { title: 'Contact Us', subtitle: 'Get in touch' },
                                  booking_form: { formId: 'default-booking', title: 'Book Now', subtitle: 'Fill the form to get started' },
                                  features: { 
                                    title: 'Our Features', 
                                    subtitle: 'Why choose us', 
                                    centered: true,
                                    items: [
                                      { icon: 'Star', title: 'Feature 1', description: 'Description here' },
                                      { icon: 'Shield', title: 'Feature 2', description: 'Description here' },
                                      { icon: 'Heart', title: 'Feature 3', description: 'Description here' }
                                    ]
                                  }
                                };
                                const newWidgets = [...(editingPage.widgets || [])];
                                newWidgets[idx].type = newType;
                                newWidgets[idx].config = widgetTypes[newType] || {};
                                setEditingPage({ ...editingPage, widgets: newWidgets });
                              }}
                              className="bg-dark border border-white/10 rounded-lg px-3 py-1 text-sm outline-none focus:border-brand"
                            >
                              <option value="hero">Hero Section</option>
                              <option value="services">Services Grid</option>
                              <option value="blogs">Latest Blogs</option>
                              <option value="text">Rich Text Content</option>
                              <option value="stats">Stats Counter</option>
                              <option value="gallery">Image Gallery</option>
                              <option value="faq">FAQ Section</option>
                              <option value="cta">Call to Action</option>
                              <option value="promos">Promos Section</option>
                              <option value="about">About Section</option>
                              <option value="package_builder">Package Builder</option>
                              <option value="discounts">Discounts Page</option>
                              <option value="contact">Contact Section</option>
                              <option value="booking_form">Booking Form</option>
                              <option value="features">Features Section</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === 0) return;
                                const newWidgets = [...(editingPage.widgets || [])];
                                const temp = newWidgets[idx].weight;
                                newWidgets[idx].weight = newWidgets[idx-1].weight;
                                newWidgets[idx-1].weight = temp;
                                setEditingPage({ ...editingPage, widgets: newWidgets });
                              }}
                              className="p-1 hover:text-brand"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (idx === (editingPage.widgets || []).length - 1) return;
                                const newWidgets = [...(editingPage.widgets || [])];
                                const temp = newWidgets[idx].weight;
                                newWidgets[idx].weight = newWidgets[idx+1].weight;
                                newWidgets[idx+1].weight = temp;
                                setEditingPage({ ...editingPage, widgets: newWidgets });
                              }}
                              className="p-1 hover:text-brand"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newWidgets = (editingPage.widgets || []).filter((w: any) => w.id !== widget.id);
                                setEditingPage({ ...editingPage, widgets: newWidgets });
                              }}
                              className="p-1 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Widget Configuration (JSON)</label>
                          
                          {/* Common Section Spacing Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded-xl border border-white/10 mb-4">
                            <div className="md:col-span-2">
                              <h4 className="text-[10px] font-bold text-brand uppercase mb-2">Section Spacing & Height</h4>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-gray-400 uppercase">Height/Padding Type</label>
                              <select
                                value={widget.config.heightType || 'auto'}
                                onChange={(e) => {
                                  const newWidgets = [...(editingPage.widgets || [])];
                                  newWidgets[idx].config.heightType = e.target.value;
                                  setEditingPage({ ...editingPage, widgets: newWidgets });
                                }}
                                className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                              >
                                <option value="auto">Auto (Responsive Padding)</option>
                                <option value="pixel">Custom Pixel Padding</option>
                              </select>
                            </div>
                            
                            {widget.config.heightType === 'pixel' && (
                              <>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Desktop Padding (px)</label>
                                  <input
                                    type="number"
                                    value={widget.config.desktopCustomHeight || widget.config.customHeight || 80}
                                    onChange={(e) => {
                                      const newWidgets = [...editingPage.widgets];
                                      newWidgets[idx].config.desktopCustomHeight = Number(e.target.value);
                                      setEditingPage({ ...editingPage, widgets: newWidgets });
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile/Tablet Padding (px)</label>
                                  <input
                                    type="number"
                                    value={widget.config.mobileCustomHeight || widget.config.customHeight || 80}
                                    onChange={(e) => {
                                      const newWidgets = [...editingPage.widgets];
                                      newWidgets[idx].config.mobileCustomHeight = Number(e.target.value);
                                      setEditingPage({ ...editingPage, widgets: newWidgets });
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                                  />
                                </div>
                              </>
                            )}

                            {widget.type === 'hero' && (
                              <>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Desktop Alignment</label>
                                  <select
                                    value={widget.config.desktopAlignment || 'left'}
                                    onChange={(e) => {
                                      const newWidgets = [...editingPage.widgets];
                                      newWidgets[idx].config.desktopAlignment = e.target.value;
                                      setEditingPage({ ...editingPage, widgets: newWidgets });
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Mobile/Tablet Alignment</label>
                                  <select
                                    value={widget.config.mobileAlignment || 'center'}
                                    onChange={(e) => {
                                      const newWidgets = [...editingPage.widgets];
                                      newWidgets[idx].config.mobileAlignment = e.target.value;
                                      setEditingPage({ ...editingPage, widgets: newWidgets });
                                    }}
                                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-xs outline-none focus:border-brand"
                                  >
                                    <option value="left">Left</option>
                                    <option value="center">Center</option>
                                    <option value="right">Right</option>
                                  </select>
                                </div>
                              </>
                            )}
                          </div>

                          <textarea
                            key={`${widget.id}-${widget.type}`}
                            defaultValue={JSON.stringify(widget.config, null, 2)}
                            onBlur={(e) => {
                              try {
                                const val = e.target.value.trim();
                                if (!val) return;
                                const newConfig = JSON.parse(val);
                                const newWidgets = [...editingPage.widgets];
                                newWidgets[idx].config = newConfig;
                                setEditingPage({ ...editingPage, widgets: newWidgets });
                              } catch (err) {
                                console.error("Invalid JSON in widget config", err);
                                alert("Invalid JSON format. Please check your syntax.");
                              }
                            }}
                            rows={6}
                            className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 font-mono text-xs outline-none focus:border-brand"
                            placeholder='{ "title": "Hello World" }'
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={saveStatus === 'saving'}
                    className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      saveStatus === 'saved' ? 'bg-green-500 text-white' : 
                      saveStatus === 'error' ? 'bg-red-500 text-white' : 
                      'bg-brand text-dark'
                    }`}
                  >
                    {saveStatus === 'saving' ? <div className="w-5 h-5 border-2 border-dark/30 border-t-dark animate-spin rounded-full" /> : <Save size={20} />}
                    {saveStatus === 'idle' && 'Save Page'}
                    {saveStatus === 'saving' && 'Saving...'}
                    {saveStatus === 'saved' && 'Saved Successfully!'}
                    {saveStatus === 'error' && 'Error Saving!'}
                  </button>
                  <button type="button" onClick={() => { setEditingPage(null); setSaveStatus('idle'); }} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal for Promo */}
        {editingPromo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-8">{editingPromo.id ? 'Edit Promo' : 'Add New Promo'}</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const newPromo: Promo = {
                  id: editingPromo.id || (formData.get('title') as string).toLowerCase().replace(/\s+/g, '-'),
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  icon: formData.get('icon') as string,
                  terms: (formData.get('terms') as string).split('\n').map(t => t.trim()).filter(Boolean),
                  badge: formData.get('badge') as string || undefined,
                  link: formData.get('link') as string,
                  fullDetails: formData.get('fullDetails') as string,
                };
                
                let updated;
                if (editingPromo.id) {
                  updated = promos.map(p => p.id === editingPromo.id ? newPromo : p);
                } else {
                  updated = [...promos, newPromo];
                }

                const res = await fetch('/api/promos', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ya-admin-secret' },
                  body: JSON.stringify({ promos: updated })
                });

                if (res.ok) {
                  setPromos(updated);
                  setEditingPromo(null);
                }
              }} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Promo Title</label>
                    <input name="title" defaultValue={editingPromo.title} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Badge (Optional)</label>
                    <input name="badge" defaultValue={editingPromo.badge} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. Most Popular" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Icon Name</label>
                    <select name="icon" defaultValue={editingPromo.icon || 'Tag'} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand">
                      <option value="Tag">Tag</option>
                      <option value="Gift">Gift</option>
                      <option value="CreditCard">CreditCard</option>
                      <option value="Calendar">Calendar</option>
                      <option value="Star">Star</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Link / Redirect URL</label>
                    <input name="link" defaultValue={editingPromo.link || '/contact'} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Short Description</label>
                  <textarea name="description" defaultValue={editingPromo.description} required rows={2} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Quick Terms (One per line)</label>
                  <textarea name="terms" defaultValue={editingPromo.terms?.join('\n')} required rows={3} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Term 1&#10;Term 2" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Full Details & Agreements</label>
                  <textarea name="fullDetails" defaultValue={editingPromo.fullDetails} required rows={5} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={20} /> Save Promo
                  </button>
                  <button type="button" onClick={() => setEditingPromo(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal for Blog Add/Edit */}
        {editingBlog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-8">{editingBlog.id ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
              <form onSubmit={handleSaveBlog} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Blog Title</label>
                    <input name="title" defaultValue={editingBlog.title} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <input name="category" defaultValue={editingBlog.category} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. Planning, Tips" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Author</label>
                    <input name="author" defaultValue={editingBlog.author} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                    <input name="date" type="date" defaultValue={editingBlog.date} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                </div>
                <ImageUpload
                  label="Image URL"
                  name="image"
                  value={editingBlog.image}
                  onChange={(url) => setEditingBlog({...editingBlog, image: url})}
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Excerpt (Short Summary)</label>
                  <textarea name="excerpt" defaultValue={editingBlog.excerpt} required rows={2} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Content (Markdown supported)</label>
                  <textarea name="content" defaultValue={editingBlog.content} required rows={8} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Tags (comma separated)</label>
                  <input name="tags" defaultValue={editingBlog.tags?.join(', ')} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Wedding, Dubai, Luxury, ..." />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={20} /> Save Blog Post
                  </button>
                  <button type="button" onClick={() => setEditingBlog(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-8">{editingItem.id ? 'Edit Service' : 'Add New Service'}</h2>
              <form onSubmit={handleSaveService} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Service Name</label>
                    <input name="name" defaultValue={editingItem.name} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <input name="category" defaultValue={editingItem.category} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. Planning, Media" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Current Price (AED)</label>
                    <input name="price" type="number" defaultValue={editingItem.price} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Old Price (Optional)</label>
                    <input name="oldPrice" type="number" defaultValue={editingItem.oldPrice} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Discount (e.g. 15%)</label>
                    <input name="discount" defaultValue={editingItem.discount} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Badge</label>
                    <select name="badge" defaultValue={editingItem.badge} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand">
                      <option value="">None</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Trending">Trending</option>
                      <option value="Price Drop">Price Drop</option>
                      <option value="New">New</option>
                    </select>
                  </div>
                </div>
                <ImageUpload
                  label="Image URL"
                  name="image"
                  value={editingItem.image}
                  onChange={(url) => setEditingItem({...editingItem, image: url})}
                />
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Short Description</label>
                  <input name="shortDescription" defaultValue={editingItem.shortDescription} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">SEO Description</label>
                  <textarea name="seoDescription" defaultValue={editingItem.seoDescription} required rows={2} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                  <textarea name="description" defaultValue={editingItem.description} required rows={3} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Tags (comma separated)</label>
                    <input name="tags" defaultValue={editingItem.tags?.join(', ')} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Luxury, Planning, ..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Service Areas (comma separated)</label>
                    <input name="serviceAreas" defaultValue={editingItem.serviceAreas?.join(', ')} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Dubai, Sharjah, All UAE, ..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Custom Rating (1-5)</label>
                    <input name="rating" type="number" step="0.1" min="1" max="5" defaultValue={editingItem.rating} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. 4.8" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Review Count</label>
                    <input name="reviewCount" type="number" defaultValue={editingItem.reviewCount} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="e.g. 124" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Features (comma separated)</label>
                  <input name="features" defaultValue={editingItem.features?.join(', ')} required className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand" placeholder="Feature 1, Feature 2, ..." />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Save size={20} /> Save Changes
                  </button>
                  <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-white/5 py-4 rounded-xl font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
