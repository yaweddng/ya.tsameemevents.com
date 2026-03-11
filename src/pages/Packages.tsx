import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MapPin, Calendar, User, Phone, Mail, Tag, MessageCircle, Info, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { Package } from '../types';

// --- Data ---
const PROMOS = [
  { id: 1, title: "Summer Wedding Special", discount: "20% OFF", minSpend: "AED 20,000", maxDiscount: "AED 5,000", code: "SUMMER20" },
  { id: 2, title: "Corporate Event Bonus", discount: "15% OFF", minSpend: "AED 15,000", maxDiscount: "AED 3,000", code: "CORP15" },
  { id: 3, title: "Early Bird Booking", discount: "10% OFF", minSpend: "AED 10,000", maxDiscount: "AED 2,000", code: "EARLY10" },
];

type Tier = 'traditional' | 'premium' | 'luxury';

export const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [activeTiers, setActiveTiers] = useState<Record<string, Tier>>({});
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [verifyLocation, setVerifyLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch('/api/packages');
        const data = await res.json();
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);
  
  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    location: '',
    coupon: ''
  });
  const [requireAddons, setRequireAddons] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [locationError, setLocationError] = useState('');

  // Auto-scrolling carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const getTier = (pkgId: string): Tier => activeTiers[pkgId] || 'traditional';
  const setTier = (pkgId: string, tier: Tier) => setActiveTiers(prev => ({ ...prev, [pkgId]: tier }));

  const openBookingModal = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedPackage(null);
      setFormData({ name: '', phone: '', email: '', date: '', location: '', coupon: '' });
      setRequireAddons(false);
      setDiscount(0);
      setBookingStep(1);
      setVerifyLocation(false);
    }, 300);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateCoupon = () => {
    const promo = PROMOS.find(p => p.code === formData.coupon.toUpperCase());
    if (promo && selectedPackage) {
      const tier = getTier(selectedPackage.id);
      const price = selectedPackage.tiers[tier].price;
      const minSpend = parseInt(promo.minSpend.replace(/[^0-9]/g, ''));
      if (price >= minSpend) {
        const discountPercent = parseInt(promo.discount.replace(/[^0-9]/g, ''));
        const maxDiscount = parseInt(promo.maxDiscount.replace(/[^0-9]/g, ''));
        let calculatedDiscount = (price * discountPercent) / 100;
        if (calculatedDiscount > maxDiscount) calculatedDiscount = maxDiscount;
        setDiscount(calculatedDiscount);
        alert(`Coupon applied! You saved AED ${calculatedDiscount}`);
      } else {
        alert(`Minimum spend of ${promo.minSpend} required for this coupon.`);
        setDiscount(0);
      }
    } else {
      alert('Invalid coupon code.');
      setDiscount(0);
    }
  };

  const handleVerifyLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setVerifyLocation(checked);
    if (checked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            // We collect it to qualify lead, but we don't show it in the input field
            console.log("Location verified:", position.coords.latitude, position.coords.longitude);
            setLocationError('');
          },
          (error) => {
            setLocationError('Unable to verify location automatically.');
            setVerifyLocation(false);
          }
        );
      } else {
        setLocationError('Geolocation is not supported by your browser.');
        setVerifyLocation(false);
      }
    }
  };

  const nextStep = () => {
    if (bookingStep === 1) {
      if (!formData.name || !formData.phone || !formData.email) {
        alert("Please fill in all personal details.");
        return;
      }
      setBookingStep(2);
    } else if (bookingStep === 2) {
      if (!formData.date || !formData.location) {
        alert("Please fill in event date and location.");
        return;
      }
      setBookingStep(3);
    }
  };

  const prevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const generatePDF = (finalPrice: number) => {
    const doc = new jsPDF();
    const tier = getTier(selectedPackage.id);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Watermark ---
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(80);
    doc.setFont("helvetica", "bold");
    doc.text("YA WEDDING", pageWidth / 2, pageHeight / 2, { angle: 45, align: "center" });

    // --- Header ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    doc.text("YA Wedding", 20, 20);
    doc.text("www.ya.tsameemevents.com", 20, 26);
    doc.text("+971 50 558 8842 | ya@tsameemevents.com", 20, 32);

    doc.setTextColor(0, 200, 150);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("YA", pageWidth - 30, 28);

    // --- Line Separator ---
    doc.setDrawColor(0, 200, 150);
    doc.setLineWidth(0.5);
    doc.line(20, 40, pageWidth - 20, 40);

    // --- Content ---
    doc.setTextColor(20, 20, 20);
    doc.setFontSize(18);
    doc.text('Booking Confirmation', 20, 55);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    let yPos = 70;
    const addRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, yPos);
      yPos += 10;
    };

    addRow("Package", selectedPackage.title);
    addRow("Tier", `${selectedPackage.tiers[tier].name} (${tier.toUpperCase()})`);
    addRow("Guests", `Up to ${selectedPackage.tiers[tier].guests}`);
    addRow("Name", formData.name);
    addRow("Phone", formData.phone);
    addRow("Email", formData.email);
    addRow("Date", formData.date);
    addRow("Location", formData.location);
    addRow("Add-ons", requireAddons ? 'Yes' : 'No');
    
    yPos += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 15;

    addRow("Original Price", `AED ${selectedPackage.tiers[tier].price.toLocaleString()}`);
    if (discount > 0) {
      doc.setTextColor(0, 150, 0);
      addRow("Discount", `- AED ${discount.toLocaleString()}`);
      doc.setTextColor(20, 20, 20);
    }
    
    yPos += 5;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Final Price:", 20, yPos);
    doc.setTextColor(0, 200, 150);
    doc.text(`AED ${finalPrice.toLocaleString()}`, 60, yPos);

    // --- Footer ---
    const footerY = pageHeight - 30;
    doc.setDrawColor(0, 200, 150);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text("YA Wedding", 20, footerY + 5);
    doc.text("www.ya.tsameemevents.com", 20, footerY + 10);
    doc.text("+971 50 558 8842", 20, footerY + 15);

    doc.setTextColor(0, 200, 150);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("YA", pageWidth / 2, footerY + 10, { align: "center" });

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Luxury Wedding Planner", pageWidth - 20, footerY + 5, { align: "right" });
    doc.text("Abu Hail Center, Deira Dubai, UAE", pageWidth - 20, footerY + 10, { align: "right" });

    doc.save(`YA_Wedding_Booking_${formData.name.replace(/\s+/g, '_')}.pdf`);
  };

  const confirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

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

    const tier = getTier(selectedPackage.id);
    const currentTierData = selectedPackage.tiers[tier];
    const finalPrice = currentTierData.price - discount;
    
    // Generate PDF
    generatePDF(finalPrice);

    // Call API for email notifications
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          packageTitle: selectedPackage.title,
          tierName: currentTierData.name,
          finalPrice,
          requireAddons,
          pageLocation: window.location.href,
          geotag
        })
      });
    } catch (err) {
      console.error("Failed to send booking to API:", err);
    }

    // Redirect to WhatsApp
    const message = `Hello YA Wedding! I would like to book a package:
*Package:* ${selectedPackage.title}
*Tier:* ${currentTierData.name}
*Guests:* Up to ${currentTierData.guests}
*Name:* ${formData.name}
*Phone:* ${formData.phone}
*Email:* ${formData.email}
*Date:* ${formData.date}
*Location:* ${formData.location}
*Add-ons Required:* ${requireAddons ? 'Yes' : 'No'}
*Final Price:* AED ${finalPrice}

Please confirm my booking.`;

    const whatsappUrl = `https://wa.me/971505588842?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    closeBookingModal();
  };

  return (
    <div className="min-h-screen bg-dark pt-24 pb-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Explore Our <span className="text-brand">Packages</span></h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Discover tailored packages for every occasion. From intimate gatherings to grand luxury weddings, we have the perfect plan for you.
        </p>
      </div>

      {/* Promo Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div ref={carouselRef} className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
          {PROMOS.map((promo) => (
            <div key={promo.id} className="min-w-[260px] md:min-w-[320px] bg-white/5 border border-brand/30 rounded-xl p-5 snap-center flex-shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-brand text-dark text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                PROMO
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{promo.title}</h3>
              <div className="text-2xl font-bold text-brand mb-1">{promo.discount}</div>
              <p className="text-xs text-gray-400 mb-4">
                Min spend: {promo.minSpend} | Max: {promo.maxDiscount}
              </p>
              <div className="bg-dark/50 border border-white/10 rounded-lg p-2 flex justify-between items-center">
                <span className="font-mono text-sm text-white tracking-widest">{promo.code}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(promo.code)}
                  className="text-[10px] px-2 py-1 bg-brand/10 rounded text-brand hover:bg-brand hover:text-dark transition-colors font-bold"
                >
                  COPY
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const currentTierLevel = getTier(pkg.id);
              const currentTier = pkg.tiers[currentTierLevel];
              return (
                <motion.div 
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`bg-white/5 border rounded-3xl p-8 relative overflow-hidden transition-all duration-300 flex flex-col ${
                    currentTierLevel === 'luxury' ? 'border-brand shadow-[0_0_30px_rgba(0,200,150,0.15)]' : 'border-white/10 hover:border-brand/50'
                  }`}
                >
                  {currentTierLevel === 'luxury' && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand to-transparent" />
                  )}
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 h-10">{pkg.description}</p>
                  
                  {/* Per-Package Tier Toggle */}
                  <div className="bg-dark/50 p-1 rounded-full flex relative mb-6">
                    <div 
                      className="absolute top-1 bottom-1 w-1/3 bg-brand rounded-full transition-transform duration-300 ease-in-out"
                      style={{ 
                        transform: `translateX(${currentTierLevel === 'traditional' ? '0%' : currentTierLevel === 'premium' ? '100%' : '200%'})` 
                      }}
                    />
                    {(['traditional', 'premium', 'luxury'] as Tier[]).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setTier(pkg.id, tier)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider relative z-10 transition-colors ${
                          currentTierLevel === tier ? 'text-dark' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>

                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white">AED {currentTier.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-2">/ event</span>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    {pkg.features.map((feature, idx) => {
                      const isIncluded = currentTier.includes[idx];
                      const displayFeature = feature === 'Guests' ? `Guests (Up to ${currentTier.guests})` : feature;
                      return (
                        <div key={idx} className={`flex items-center gap-3 ${isIncluded ? 'text-gray-300' : 'text-gray-600'}`}>
                          {isIncluded ? <Check size={18} className="text-brand flex-shrink-0" /> : <X size={18} className="flex-shrink-0" />}
                          <span className="text-sm">{displayFeature}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => openBookingModal(pkg)}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 mt-auto ${
                      currentTierLevel === 'luxury' 
                        ? 'bg-brand text-dark hover:bg-white hover:shadow-[0_0_20px_rgba(0,200,150,0.4)]' 
                        : 'bg-white/10 text-white hover:bg-brand hover:text-dark'
                    }`}
                  >
                    Book {currentTier.name}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Terms & Conditions Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
            <Info className="text-brand" size={32} />
            <h2 className="text-2xl font-bold text-white">Universal Terms & Agreements</h2>
          </div>
          
          <div className="space-y-8 text-gray-400 text-sm leading-relaxed">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">1. Payment Milestones</h3>
              <p>A 50% non-refundable deposit is required to secure your booking and date. The remaining 50% balance must be paid in full at least 14 days prior to the event date. For bookings made within 14 days of the event, full payment is required immediately.</p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-2">2. Refund & Cancellation Policy</h3>
              <p>Cancellations made 60 days or more before the event will receive a full refund minus the 50% non-refundable deposit. Cancellations within 30-59 days will be charged 75% of the total package price. Cancellations within 29 days of the event are non-refundable.</p>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-2">3. Package Modifications</h3>
              <p>You may upgrade your package tier at any time up to 14 days before the event, subject to availability. Downgrading packages is not permitted once the deposit has been paid. Additional services can be added a la carte.</p>
            </div>

            <div>
              <h3 className="text-white font-bold text-lg mb-2">4. Liability & Damages</h3>
              <p>The client is responsible for any damage to rental equipment, decor, or venue property caused by guests. A security deposit may be required for certain luxury rentals, which will be refunded within 7 days post-event pending inspection.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPackage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={closeBookingModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark border border-white/10 rounded-3xl w-full max-w-md relative z-10 overflow-hidden flex flex-col max-h-[85vh] shadow-2xl"
            >
              {/* Header - Sticky */}
              <div className="p-4 md:p-5 border-b border-white/10 flex justify-between items-center bg-white/5 sticky top-0 z-20 backdrop-blur-md">
                <div>
                  <h2 className="text-base md:text-lg font-bold text-white leading-tight">{selectedPackage.title}</h2>
                  <p className="text-brand font-bold text-[10px] md:text-xs">{selectedPackage.tiers[getTier(selectedPackage.id)].name} Tier - AED {selectedPackage.tiers[getTier(selectedPackage.id)].price.toLocaleString()}</p>
                </div>
                <button onClick={closeBookingModal} className="text-gray-400 hover:text-white p-1.5 bg-white/10 rounded-full transition-colors">
                  <X size={16} />
                </button>
              </div>
              
              {/* Body - Scrollable */}
              <div className="p-4 md:p-5 overflow-y-auto custom-scrollbar">
                <form id="booking-form" onSubmit={confirmBooking} className="space-y-5">
                  {/* Progress Bar - More Compact */}
                  <div className="flex items-center justify-between mb-6 relative px-1">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 rounded-full -z-10"></div>
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand rounded-full -z-10 transition-all duration-500 ease-out"
                      style={{ width: `${((bookingStep - 1) / 2) * 100}%` }}
                    ></div>
                    
                    {[1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs transition-all duration-300 ${
                          bookingStep >= step 
                            ? 'bg-brand text-dark shadow-[0_0_10px_rgba(0,200,150,0.5)]' 
                            : 'bg-dark border border-white/20 text-gray-500'
                        }`}
                      >
                        {step}
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {bookingStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }} 
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <User size={14} className="text-brand" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Personal Details</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Full Name</label>
                            <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs" placeholder="John Doe" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Phone Number</label>
                            <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs" placeholder="+971 50 000 0000" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Email Address</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs" placeholder="john@example.com" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {bookingStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }} 
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar size={14} className="text-brand" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Event Details</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Event Date</label>
                            <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs" />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Event Location</label>
                            <input required type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs mb-2" placeholder="Write your event location" />
                            
                            <div className="flex items-start gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                              <input 
                                type="checkbox" 
                                id="verifyLocation" 
                                checked={verifyLocation} 
                                onChange={handleVerifyLocationChange}
                                className="w-3.5 h-3.5 mt-0.5 accent-brand bg-white/10 border-white/20 rounded cursor-pointer"
                              />
                              <label htmlFor="verifyLocation" className="text-[10px] text-gray-400 cursor-pointer select-none leading-snug">
                                Verify your location (Helps us qualify your request)
                              </label>
                            </div>
                            {locationError && <p className="text-red-500 text-[9px] mt-1 ml-1">{locationError}</p>}
                          </div>

                          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/10">
                            <input 
                              type="checkbox" 
                              id="addons" 
                              checked={requireAddons} 
                              onChange={(e) => setRequireAddons(e.target.checked)}
                              className="w-3.5 h-3.5 accent-brand bg-white/10 border-white/20 rounded cursor-pointer"
                            />
                            <label htmlFor="addons" className="text-[10px] text-white font-medium cursor-pointer select-none">
                              I require add-ons (I need more services)
                            </label>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {bookingStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, x: 10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -10 }} 
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Tag size={14} className="text-brand" />
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Summary & Payment</h3>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-widest">Discount Coupon</label>
                            <div className="flex gap-2">
                              <input type="text" name="coupon" value={formData.coupon} onChange={handleInputChange} className="flex-grow bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all text-xs uppercase" placeholder="ENTER CODE" />
                              <button type="button" onClick={validateCoupon} className="bg-white/10 hover:bg-white text-white hover:text-dark px-3 font-bold rounded-lg transition-colors text-[10px] uppercase tracking-wider">
                                Apply
                              </button>
                            </div>
                          </div>

                          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                            <div className="flex justify-between text-gray-400 text-[10px] uppercase tracking-wider">
                              <span>Subtotal</span>
                              <span className="text-white font-mono">AED {selectedPackage.tiers[getTier(selectedPackage.id)].price.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                              <div className="flex justify-between text-brand text-[10px] uppercase tracking-wider">
                                <span>Discount</span>
                                <span className="font-mono">- AED {discount.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10 mt-1">
                              <span className="uppercase tracking-tight">Total</span>
                              <span className="text-brand font-mono">AED {(selectedPackage.tiers[getTier(selectedPackage.id)].price - discount).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-brand/5 border border-brand/20 rounded-lg flex items-start gap-2">
                            <Info size={14} className="text-brand flex-shrink-0 mt-0.5" />
                            <p className="text-[9px] text-gray-400 leading-relaxed">
                              By clicking "Confirm Booking", you agree to our terms. A PDF invoice will be generated and you will be redirected to WhatsApp.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Footer - Sticky */}
              <div className="p-4 md:p-5 border-t border-white/10 bg-white/5 sticky bottom-0 z-20 flex gap-2 md:gap-3">
                {bookingStep > 1 && (
                  <button 
                    type="button" 
                    onClick={prevStep}
                    className="w-1/4 bg-white/5 text-white hover:bg-white/10 border border-white/10 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center text-[10px] md:text-xs"
                  >
                    Back
                  </button>
                )}
                {bookingStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={nextStep}
                    className="flex-grow bg-brand text-dark hover:bg-white py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(0,200,150,0.2)] text-[10px] md:text-xs"
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    form="booking-form"
                    type="submit"
                    className="flex-grow bg-brand text-dark hover:bg-white py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center shadow-[0_0_15px_rgba(0,200,150,0.3)] text-[10px] md:text-xs"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
