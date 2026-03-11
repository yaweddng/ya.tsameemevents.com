import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingForm as BookingFormType, BookingFormStep, BookingFormField } from '../types';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, Loader2 } from 'lucide-react';

interface BookingFormProps {
  form: BookingFormType;
  onSuccess?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ form, onSuccess }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const steps = form.steps;
  const activeStep = steps[currentStep];

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
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

      // Find name and email in formData for the confirmation email
      const nameField = Object.entries(formData).find(([k, v]) => k.toLowerCase().includes('name'))?.[1] || 'Valued Client';
      const emailField = Object.entries(formData).find(([k, v]) => k.toLowerCase().includes('email'))?.[1];

      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: nameField,
          email: emailField,
          packageTitle: form.name,
          isCustomForm: true,
          pageLocation: window.location.href,
          geotag
        })
      });
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Booking submission failed:", err);
      alert("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20 space-y-6"
      >
        <div className="w-20 h-20 bg-brand/20 rounded-full flex items-center justify-center mx-auto text-brand">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold">{form.successMessage || 'Booking Successful!'}</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We have received your request and our team will get back to you shortly with a personalized proposal.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-brand text-dark px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Back to Home
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-4">
          {steps.map((step, idx) => (
            <div 
              key={step.id}
              className={`flex flex-col items-center gap-2 ${idx <= currentStep ? 'text-brand' : 'text-gray-600'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                idx < currentStep ? 'bg-brand border-brand text-dark' : 
                idx === currentStep ? 'border-brand text-brand' : 'border-gray-600 text-gray-600'
              }`}>
                {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-brand"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">{activeStep.title}</h2>
            {activeStep.description && <p className="text-gray-400">{activeStep.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeStep.fields.map((field) => (
              <div key={field.id} className={`${field.width === 'full' ? 'md:col-span-2' : ''} space-y-2`}>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {field.label} {field.required && <span className="text-brand">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                  />
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all appearance-none"
                  >
                    <option value="" className="bg-dark">Select an option</option>
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="bg-dark">{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <input
                      type="checkbox"
                      checked={formData[field.id] || false}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                      className="w-5 h-5 accent-brand"
                      id={field.id}
                    />
                    <label htmlFor={field.id} className="text-sm text-gray-300 cursor-pointer">I agree to the terms</label>
                  </div>
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    required={field.required}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-brand transition-all"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4 pt-8">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 bg-brand text-dark py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Processing...
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  <Send size={20} /> Submit Booking
                </>
              ) : (
                <>
                  Next Step <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
