import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Handshake, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  ChevronRight, 
  CheckCircle2,
  Send,
  Users,
  Briefcase,
  Lock,
  LifeBuoy
} from 'lucide-react';
import { DecoratedHeadline } from '../components/CMSWidgets';

const Partnerships = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    experience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
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

      // 1. Save to database
      const response = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      // 2. Send notification emails
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inquiryType: 'Partnership Application',
          pageLocation: window.location.href,
          geotag
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', website: '', experience: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Briefcase className="text-brand" size={24} />,
      title: "Full Resource Access",
      description: "Get access to our complete library of services, premium wedding packages, and vendor networks."
    },
    {
      icon: <TrendingUp className="text-brand" size={24} />,
      title: "Flexible Pricing",
      description: "Set your own custom prices above our base rates and keep 100% of the markup."
    },
    {
      icon: <DollarSign className="text-brand" size={24} />,
      title: "Guaranteed Commission",
      description: "Earn a 3.75% base commission on the actual service price for every verified sale."
    },
    {
      icon: <ShieldCheck className="text-brand" size={24} />,
      title: "White Label Support",
      description: "Sell under your own brand name while we handle the heavy lifting of event execution."
    }
  ];

  return (
    <div className="bg-dark min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://tsameemevents.com/wp-content/uploads/luxury-outdoor-wedding-reception-sunset-lakeview.webp" 
            className="w-full h-full object-cover"
            alt="Partnership Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/80 to-dark"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                <span className="text-brand font-bold tracking-widest uppercase text-xs">
                  Partner with Excellence
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Grow Your Business <br />
                <span className="font-script text-gradient-brand text-6xl md:text-8xl lowercase animate-float inline-block">With YA Wedding</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our exclusive partnership program and gain access to Dubai's most prestigious wedding planning resources.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Commission Structure Explanation */}
      <section className="py-20 bg-lighter-dark/30">
        <div className="container mx-auto px-4">
          <DecoratedHeadline 
            title="How You Earn" 
            subtitle="Our partnership model is designed to maximize your profitability. You earn from two distinct streams on every sale:"
            centered={false}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              
              <div className="space-y-6">
                <div className="flex gap-4 p-6 glass-card rounded-2xl border-l-4 border-brand">
                  <div className="bg-brand/10 p-3 rounded-xl h-fit">
                    <CheckCircle2 className="text-brand" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">3.75% Base Commission</h3>
                    <p className="text-gray-400">Earn 3.75% of the actual service price upon every verified sale. This is your guaranteed baseline earnings.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-6 glass-card rounded-2xl border-l-4 border-brand">
                  <div className="bg-brand/10 p-3 rounded-xl h-fit">
                    <TrendingUp className="text-brand" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">100% Markup Earnings</h3>
                    <p className="text-gray-400">Set your own custom price. Any amount you sell above our actual price is yours to keep in full.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-brand/5 rounded-3xl border border-brand/20">
                <h4 className="text-brand font-bold uppercase text-xs tracking-widest mb-4">Example Calculation</h4>
                <div className="flex justify-between items-end gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Our Service Price</p>
                    <p className="text-2xl font-bold">AED 2,000</p>
                  </div>
                  <div className="text-brand">
                    <ChevronRight size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">Your Custom Price</p>
                    <p className="text-2xl font-bold">AED 2,200</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400">Your Total Earnings:</p>
                  <p className="text-3xl font-bold text-brand mt-1">AED 275</p>
                  <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">(AED 75 Commission + AED 200 Markup)</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {benefits.map((benefit, index) => (
                <div key={index} className="glass-card p-8 rounded-3xl hover:border-brand/50 transition-all group">
                  <div className="mb-6 transform group-hover:scale-110 transition-transform">{benefit.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20" id="apply">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <DecoratedHeadline 
              title="Apply for Partnership" 
              subtitle="Fill out the form below and our partnership manager will contact you within 48 hours."
              centered={true}
            />

            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 rounded-3xl text-center border-brand/30"
              >
                <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-brand" size={40} />
                </div>
                <h3 className="text-3xl font-germania mb-4">Application Received!</h3>
                <p className="text-gray-400 mb-8">Thank you for your interest in partnering with YA Wedding. We have received your application and will review it shortly.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="bg-brand text-dark px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-brand/20 transition-all"
                >
                  Send Another Application
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 rounded-3xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                      placeholder="+971 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Company Name</label>
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                      placeholder="Your Agency"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Website / Portfolio</label>
                  <input 
                    type="url" 
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Years of Experience</label>
                  <select 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                  >
                    <option value="" className="bg-dark">Select Experience</option>
                    <option value="0-2" className="bg-dark">0-2 Years</option>
                    <option value="3-5" className="bg-dark">3-5 Years</option>
                    <option value="5-10" className="bg-dark">5-10 Years</option>
                    <option value="10+" className="bg-dark">10+ Years</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Tell us about your vision</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
                    placeholder="How do you plan to sell our services?"
                  ></textarea>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-brand text-dark py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      Submit Application <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      {/* Access Partnership Portal */}
      <section className="py-20 bg-brand/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto glass-card p-12 rounded-[3rem] border-brand/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Handshake size={120} className="text-brand" />
            </div>
            <DecoratedHeadline 
              title="Access Partnership Portal" 
              subtitle="Manage your leads, track commissions, and access marketing resources in one place."
              centered={true}
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link to="/login" className="bg-brand text-dark px-10 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all animate-border-glow animate-fast-pulse border-2 border-brand/20">
                <Lock size={20} /> Sign In
              </Link>
              <button className="border border-white/20 hover:border-brand/50 hover:bg-white/10 px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 animate-border-glow animate-fast-pulse">
                <LifeBuoy size={20} /> Support
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnerships;
