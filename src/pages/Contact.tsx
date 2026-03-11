import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

import { useCMSData } from '../hooks/useCMSData';
import { CMSWidgets } from '../components/CMSWidgets';

export const Contact = () => {
  const [submitted, setSubmitted] = React.useState(false);
  const { settings } = useCMSData('contact');

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Wedding Planning',
    message: ''
  });

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

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          inquiryType: 'Contact Form',
          pageLocation: window.location.href,
          geotag
        })
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-40 pb-24 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md px-4"
        >
          <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto text-brand">
            <CheckCircle size={40} />
          </div>
          <h1 className="text-4xl font-bold">Thank You!</h1>
          <p className="text-gray-400">
            Your message has been received. Our luxury event specialists will contact you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-brand font-bold border-b border-brand pb-1"
          >
            Send another message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold mb-6">Get in <span className="font-script text-gradient-brand text-6xl lowercase animate-float inline-block">Touch</span></h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Ready to plan your next masterpiece? Contact us for a personalized consultation and quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl space-y-8 h-full">
              <div className="flex items-start gap-6">
                <div className="bg-brand/10 p-4 rounded-2xl text-brand">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Call / WhatsApp</h4>
                  <p className="text-gray-400">{settings?.contactPhone || '+971 50 558 8842'}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-brand/10 p-4 rounded-2xl text-brand">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email Us</h4>
                  <p className="text-gray-400">{settings?.contactEmail || 'ya@tsameemevents.com'}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-brand/10 p-4 rounded-2xl text-brand">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Our Location</h4>
                  <p className="text-gray-400 whitespace-pre-line">
                    {settings?.address || 'Abu Hail Center, 2nd Floor\nHor Al Anz - Deira\nDubai - UAE'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-brand/10 p-4 rounded-2xl text-brand">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Working Hours</h4>
                  <p className="text-gray-400">Sat - Fri: 07:00 AM - 11:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map Placeholder */}
          <div className="h-64 lg:h-full min-h-[400px] rounded-3xl overflow-hidden glass-card">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.234321!2d55.33!3d25.27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDE2JzEyLjAiTiA1NcKwMTknNDguMCJF!5e0!3m2!1sen!2sae!4v1620000000000!5m2!1sen!2sae"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="glass-card p-10 rounded-[40px] space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <input
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
                  placeholder="+971 50 000 0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Event Type</label>
                <select 
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all appearance-none"
                >
                  <option>Wedding Planning</option>
                  <option>Corporate Event</option>
                  <option>Birthday / Anniversary</option>
                  <option>Rentals Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-dark border border-white/10 rounded-2xl px-6 py-4 focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all resize-none"
                placeholder="Tell us about your dream event..."
              ></textarea>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="relative group overflow-hidden w-full bg-brand text-dark py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_40px_rgba(0,200,150,0.4)] transition-all animate-fast-pulse disabled:opacity-50"
            >
              <div className="absolute inset-0 shimmer-effect opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-3">
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={20} />
              </span>
            </button>
          </form>
        </div>
      </div>
      <CMSWidgets slug="contact" excludeTypes={['contact']} />
    </div>
  );
};
