import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookingForm as BookingFormType } from '../types';
import { BookingForm } from '../components/BookingForm';
import { ArrowLeft } from 'lucide-react';

export const BookingPage = () => {
  const { id } = useParams();
  const [form, setForm] = React.useState<BookingFormType | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await fetch('/api/booking-forms');
        const forms = await res.json();
        const found = forms.find((f: BookingFormType) => f.id === id);
        setForm(found || null);
      } catch (err) {
        console.error('Error fetching booking form:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  if (loading) return <div className="pt-40 pb-20 text-center">Loading...</div>;
  if (!form) return (
    <div className="pt-40 pb-20 text-center space-y-4">
      <h2 className="text-2xl font-bold">Booking Form Not Found</h2>
      <Link to="/" className="text-brand hover:underline">Back to Home</Link>
    </div>
  );

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{form.name}</h1>
              <p className="text-gray-400 text-lg">{form.description}</p>
            </div>
            
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xl font-bold text-brand">Why Book With Us?</h3>
              <ul className="space-y-4">
                {[
                  'Bespoke luxury event planning',
                  'Access to exclusive venues in Dubai',
                  'Dedicated event coordinator',
                  'Transparent pricing & proposals'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 bg-brand/20 rounded-full flex items-center justify-center text-brand shrink-0 mt-0.5">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="glass-card p-8 md:p-12 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[100px] -z-10" />
              <BookingForm form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
