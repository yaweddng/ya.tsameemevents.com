import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Send, 
  Plus, 
  Minus, 
  X, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Sparkles,
  Users,
  Globe,
  Wallet,
  Layout,
  Music,
  Coffee,
  Palette,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  PackageType, 
  ThemeType, 
  EnvironmentType, 
  PackageBuilderState, 
  Service,
  PDFTemplate
} from '../types';
import servicesData from '../data/services.json';
import { jsPDF } from 'jspdf';

interface PackageBuilderProps {
  isFullPage?: boolean;
}

const THEME_MULTIPLIERS: Record<ThemeType, number> = {
  'Basic': 1.0,
  'Modern': 1.2,
  'Premium': 1.5,
  'Luxury': 2.0,
  'Traditional': 1.3,
  'Emarati': 1.8,
  'Elegant': 1.4,
  'Extended': 2.5,
};

const CATEGORIES = [
  'Wedding',
  'Events',
  'Invitation cards',
  'Birthday',
  'Rentals',
  'Corporate',
  'Others'
];

const ENVIRONMENTS: EnvironmentType[] = [
  'indoor', 'outdoor', 'beach', 'hall', 'ballroom', 'venue', 'hotels'
];

const BUDGET_RANGES = [
  'AED 5,000 - 10,000',
  'AED 10,000 - 25,000',
  'AED 25,000 - 50,000',
  'AED 50,000 - 100,000',
  'AED 100,000 - 250,000',
  'AED 250,000+'
];

const NATIONALITIES = [
  'Asian', 'Emarati', 'Western', 'African', 'Arabic', 'Indian', 'Keep Secret'
];

const WEDDING_CELEBRATIONS: Record<string, { id: string, name: string, price: number, description: string }[]> = {
  'Emarati': [
    { id: 'em-1', name: 'Al Khoutha (Proposal)', price: 5000, description: 'Traditional proposal arrangement' },
    { id: 'em-2', name: 'Milcha / Al Akhd', price: 10000, description: 'Marriage Contract ceremony' },
    { id: 'em-3', name: 'Dazza', price: 8000, description: 'Delivery of Bridal Gifts' },
    { id: 'em-4', name: '40-Day Preparation', price: 15000, description: 'Bridal preparation period' },
    { id: 'em-5', name: 'Laylat al Henna', price: 12000, description: 'Henna Night celebration' },
    { id: 'em-6', name: 'Mojlish / Majlis', price: 20000, description: 'Reception/Gathering' },
    { id: 'em-7', name: 'Zaffa', price: 5000, description: 'Wedding Procession' },
    { id: 'em-8', name: 'Al-Urs', price: 50000, description: 'Main Wedding Day Party' },
    { id: 'em-9', name: 'After Party', price: 15000, description: 'Modern celebration/Second entrance' },
    { id: 'em-10', name: 'Walima', price: 25000, description: 'Wedding Feast' },
    { id: 'em-11', name: 'Al-Dukhla', price: 5000, description: 'Entrance to the Groom\'s home' },
  ],
  'Asian': [
    { id: 'as-1', name: 'Engagement / Roka', price: 8000, description: 'Formal engagement ceremony' },
    { id: 'as-2', name: 'Mehndi / Henna', price: 10000, description: 'Henna application ceremony' },
    { id: 'as-3', name: 'Sangeet / Haldi', price: 15000, description: 'Pre-wedding musical/cleansing' },
    { id: 'as-4', name: 'Wedding Ceremony', price: 40000, description: 'Main traditional wedding' },
    { id: 'as-5', name: 'Reception', price: 35000, description: 'Post-wedding celebration' },
  ],
  'Indian': [
    { id: 'in-1', name: 'Engagement / Roka', price: 8000, description: 'Formal engagement ceremony' },
    { id: 'in-2', name: 'Mehndi / Henna', price: 10000, description: 'Henna application ceremony' },
    { id: 'in-3', name: 'Sangeet / Haldi', price: 15000, description: 'Pre-wedding musical/cleansing' },
    { id: 'in-4', name: 'Baraat', price: 8000, description: 'Groom\'s wedding procession' },
    { id: 'in-5', name: 'Wedding Ceremony (Phera)', price: 40000, description: 'Main traditional wedding' },
    { id: 'in-6', name: 'Reception', price: 35000, description: 'Post-wedding celebration' },
  ],
  'Western': [
    { id: 'we-1', name: 'Engagement Party', price: 10000, description: 'Celebration of engagement' },
    { id: 'we-2', name: 'Bridal Shower', price: 5000, description: 'Pre-wedding gift party' },
    { id: 'we-3', name: 'Rehearsal Dinner', price: 8000, description: 'Pre-wedding dinner' },
    { id: 'we-4', name: 'Wedding Ceremony', price: 20000, description: 'Exchange of vows' },
    { id: 'we-5', name: 'Cocktail Hour', price: 10000, description: 'Drinks and appetizers' },
    { id: 'we-6', name: 'Wedding Reception', price: 40000, description: 'Main celebration dinner & dance' },
    { id: 'we-7', name: 'After Party', price: 10000, description: 'Late night celebration' },
  ],
  'African': [
    { id: 'af-1', name: 'Introduction Ceremony', price: 10000, description: 'Families meet and agree' },
    { id: 'af-2', name: 'Traditional Wedding', price: 30000, description: 'Cultural wedding ceremony' },
    { id: 'af-3', name: 'White Wedding', price: 35000, description: 'Religious/Modern ceremony' },
    { id: 'af-4', name: 'Reception', price: 30000, description: 'Main celebration' },
  ],
  'Arabic': [
    { id: 'ar-1', name: 'Tulba (Proposal)', price: 5000, description: 'Formal asking of hand' },
    { id: 'ar-2', name: 'Katb Al-Kitab', price: 10000, description: 'Marriage Contract' },
    { id: 'ar-3', name: 'Henna Night', price: 12000, description: 'Pre-wedding celebration' },
    { id: 'ar-4', name: 'Zaffa', price: 5000, description: 'Wedding Procession' },
    { id: 'ar-5', name: 'Wedding Reception', price: 45000, description: 'Main celebration' },
  ]
};

const ALL_CELEBRATIONS = Object.values(WEDDING_CELEBRATIONS).flat().filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);

const PackageBuilder: React.FC<PackageBuilderProps> = ({ isFullPage = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [state, setState] = useState<PackageBuilderState>({
    guestCount: 50,
    date: '',
    packageType: 'Wedding',
    nationality: 'Emarati',
    budgetRange: BUDGET_RANGES[1],
    category: 'Wedding',
    selectedServices: [],
    selectedCelebrations: [],
    addOns: [],
    environment: 'hall',
    hospitality: {
      welcomeDrinks: false,
      catering: false,
      invitations: false,
      themeItems: false,
    },
    entertainment: [],
    theme: 'Modern',
    customMessage: '',
    leadInfo: {
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      city: '',
      date: '',
      location: '',
      geoCoords: null,
    }
  });

  const [isGeoValid, setIsGeoValid] = useState<boolean | null>(null);
  const [isGeoLoading, setIsGeoLoading] = useState(false);
  const [pdfTemplates, setPdfTemplates] = useState<PDFTemplate[]>([]);

  useEffect(() => {
    const fetchPdfTemplates = async () => {
      try {
        const res = await fetch('/api/pdf-templates');
        setPdfTemplates(await res.json());
      } catch (e) {
        console.error('Failed to fetch PDF templates:', e);
      }
    };
    fetchPdfTemplates();
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setServices(servicesData.services as Service[]);
  }, []);

  useEffect(() => {
    if (containerRef.current && currentStep > 1) {
      const yOffset = -120; // Offset for sticky header
      const element = containerRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentStep]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // Don't prevent default for textareas unless it's a specific navigation intent
      if (e.currentTarget.tagName === 'TEXTAREA' && !e.ctrlKey) return;
      
      e.preventDefault();
      const form = containerRef.current;
      if (!form) return;
      
      const focusableElements = Array.from(
        form.querySelectorAll('input, select, textarea, button:not([disabled])')
      ) as HTMLElement[];
      
      const index = focusableElements.indexOf(e.currentTarget as HTMLElement);
      if (index > -1 && index < focusableElements.length - 1) {
        // Find next non-disabled element
        let nextIndex = index + 1;
        while (nextIndex < focusableElements.length && (focusableElements[nextIndex] as any).disabled) {
          nextIndex++;
        }
        if (nextIndex < focusableElements.length) {
          focusableElements[nextIndex].focus();
          return;
        }
      }
      
      // If it's the last element or we couldn't find a next one, try to go to next step
      const nextButton = document.getElementById('next-step-btn');
      if (nextButton && !(nextButton as HTMLButtonElement).disabled) {
        nextStep();
      }
    }
  };

  const calculateActualCost = () => {
    let total = 0;
    
    // Base Services
    state.selectedServices.forEach(id => {
      const service = services.find(s => s.id === id);
      if (service) total += service.price;
    });

    // Celebrations
    state.selectedCelebrations.forEach(id => {
      const celebration = ALL_CELEBRATIONS.find(c => c.id === id);
      if (celebration) total += celebration.price;
    });

    // Add-ons
    state.addOns.forEach(id => {
      const service = services.find(s => s.id === id);
      if (service) total += service.price;
    });

    // Hospitality (Per Guest)
    if (state.hospitality.welcomeDrinks) total += state.guestCount * 30;
    if (state.hospitality.catering) total += state.guestCount * 150;
    if (state.hospitality.invitations) total += state.guestCount * 20;
    if (state.hospitality.themeItems) total += state.guestCount * 50;

    // Entertainment
    if (state.entertainment.includes('DJ')) total += 3000;
    if (state.entertainment.includes('Dance Stage')) total += 3000;
    if (state.entertainment.includes('Photo/Video')) total += 1000;
    if (state.entertainment.includes('Sound System')) total += 1500;

    // Theme Multiplier
    total = total * THEME_MULTIPLIERS[state.theme];

    return Math.round(total);
  };

  const getBudgetLimit = () => {
    if (state.budgetRange.includes('+')) return 500000;
    const parts = state.budgetRange.replace(/AED|,/g, '').split('-');
    return parseInt(parts[parts.length - 1].trim());
  };

  const actualCost = calculateActualCost();
  const budgetLimit = getBudgetLimit();
  const balance = budgetLimit - actualCost;

  const handleGeoLocation = () => {
    setIsGeoLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // UAE Approximate Bounds: Lat 22.6-26.1, Lng 51.5-56.4
          const inUAE = latitude >= 22.6 && latitude <= 26.1 && longitude >= 51.5 && longitude <= 56.4;
          
          setState(prev => ({
            ...prev,
            leadInfo: {
              ...prev.leadInfo,
              geoCoords: { lat: latitude, lng: longitude }
            }
          }));
          
          setIsGeoValid(inUAE);
          setIsGeoLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsGeoValid(false);
          setIsGeoLoading(false);
        }
      );
    } else {
      setIsGeoValid(false);
      setIsGeoLoading(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 10));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const generatePDF = () => {
    const doc = new jsPDF();
    const template = pdfTemplates[0]; // Use first template as default
    
    // Theme Colors
    const brandColor = template?.header.textColor || '#F27D26';
    const darkColor = template?.header.bgColor || '#141414';
    const pageBg = template?.pageBgColor || '#FFFFFF';
    const bodyText = template?.body.textColor || '#141414';
    
    // Page Background
    if (pageBg !== '#FFFFFF') {
      doc.setFillColor(pageBg);
      doc.rect(0, 0, 210, 297, 'F');
    }

    // Watermark
    if (template?.watermark.text) {
      doc.setTextColor(template.watermark.color);
      doc.setFontSize(80);
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: template.watermark.opacity }));
      doc.text(template.watermark.text, 30, 150, { angle: 45 });
      doc.restoreGraphicsState();
    }
    
    // --- Header ---
    doc.setFillColor(darkColor);
    doc.rect(0, 0, 210, 55, 'F');

    // Top Left: Website Name (Dual Font)
    doc.setTextColor(template?.header.websiteName.color || brandColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(template?.header.websiteName.part1 || 'YA', 20, 15);
    doc.setFontSize(22);
    doc.text(template?.header.websiteName.part2 || 'WEDDING', 20, 23);
    
    // Below Website Name: WhatsApp, Email, Website
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(template?.header.contactInfo.color || brandColor);
    doc.text(`WA: ${template?.header.contactInfo.whatsapp || '+971 50 558 8842'}`, 20, 30);
    doc.text(`EM: ${template?.header.contactInfo.email || 'info@ya.com'}`, 20, 34);
    doc.text(`WW: ${template?.header.contactInfo.website || 'www.ya.com'}`, 20, 38);

    // Center-Center: Icon with BG
    doc.setFillColor(template?.header.centerIcon.bgColor || brandColor);
    doc.roundedRect(95, 10, 20, 20, 5, 5, 'F');
    doc.setTextColor(template?.header.centerIcon.textColor || darkColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(template?.header.centerIcon.text || 'YA', 105, 23, { align: 'center' });

    // Right: Location, Call, Date
    doc.setTextColor(template?.header.rightInfo.color || brandColor);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(template?.header.rightInfo.location || 'Dubai, UAE', 190, 15, { align: 'right' });
    doc.text(template?.header.rightInfo.call || '+971 50 558 8842', 190, 19, { align: 'right' });
    doc.text(template?.header.rightInfo.date || state.date || new Date().toLocaleDateString(), 190, 23, { align: 'right' });

    // Below Center: PDF Custom Title (Dual Font)
    doc.setTextColor(template?.header.customTitle.color || brandColor);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(template?.header.customTitle.text1 || 'EVENT', 105, 45, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(template?.header.customTitle.text2 || 'PROPOSAL', 105, 51, { align: 'center' });
    
    // --- Body ---
    doc.setTextColor(bodyText);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Client: ${state.leadInfo.name}`, 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.text(`Phone: ${state.leadInfo.phone}`, 20, 77);
    doc.text(`Email: ${state.leadInfo.email}`, 20, 84);
    doc.text(`Event Date: ${state.date}`, 120, 70);
    doc.text(`Guest Count: ${state.guestCount}`, 120, 77);
    doc.text(`Theme: ${state.theme}`, 120, 84);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 90, 190, 90);
    
    // --- Plan Details ---
    let y = 100;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Plan Details:', 20, y);
    y += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Package Type: ${state.packageType}`, 25, y); y += 7;
    doc.text(`Environment: ${state.environment}`, 25, y); y += 7;
    
    if (state.category === 'Wedding' && state.selectedCelebrations.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Selected Celebrations:', 25, y); y += 7;
      doc.setFont('helvetica', 'normal');
      state.selectedCelebrations.forEach(id => {
        const c = ALL_CELEBRATIONS.find(cel => cel.id === id);
        if (c) {
          doc.text(`- ${c.name}`, 30, y);
          y += 6;
        }
      });
      y += 2;
    }

    if (state.selectedServices.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('Selected Services:', 25, y); y += 7;
      doc.setFont('helvetica', 'normal');
      state.selectedServices.forEach(id => {
        const s = services.find(srv => srv.id === id);
        if (s) {
          doc.text(`- ${s.name}`, 30, y);
          y += 6;
        }
      });
      y += 2;
    }

    y += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('Hospitality & Entertainment:', 25, y); y += 7;
    doc.setFont('helvetica', 'normal');
    if (state.hospitality.catering) { doc.text(`- Catering for ${state.guestCount} guests`, 30, y); y += 6; }
    if (state.hospitality.welcomeDrinks) { doc.text(`- Welcome Drinks for ${state.guestCount} guests`, 30, y); y += 6; }
    state.entertainment.forEach(e => {
      doc.text(`- ${e}`, 30, y);
      y += 6;
    });

    y += 10;
    doc.setDrawColor(brandColor);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Estimated Total: AED ${actualCost.toLocaleString()}`, 20, y);

    // --- Footer ---
    const pageHeight = 297;
    doc.setFillColor(template?.footer.bgColor || '#F5F5F5');
    doc.rect(0, pageHeight - 45, 210, 45, 'F');

    // Center Text
    doc.setTextColor(template?.footer.centerText.color || template?.footer.textColor || '#8E9299');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(template?.footer.centerText.text || 'Thank you for choosing YA Wedding', 105, pageHeight - 35, { align: 'center' });

    // Left: Logo, Website, Phone
    doc.setTextColor(template?.footer.leftInfo.color || template?.footer.textColor || '#8E9299');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(template?.footer.leftInfo.logoText || 'YA WEDDING DUBAI', 20, pageHeight - 20);
    doc.setFont('helvetica', 'normal');
    doc.text(template?.footer.leftInfo.website || 'www.ya.tsameemevents.com', 20, pageHeight - 16);
    doc.text(template?.footer.leftInfo.phone || '+971 50 558 8842', 20, pageHeight - 12);

    // Center-Center: Icon with BG
    doc.setFillColor(template?.footer.centerIcon.bgColor || darkColor);
    doc.roundedRect(97, pageHeight - 25, 16, 16, 4, 4, 'F');
    doc.setTextColor(template?.footer.centerIcon.textColor || brandColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(template?.footer.centerIcon.text || 'YA', 105, pageHeight - 15, { align: 'center' });

    // Right: Submission, Date, Page
    doc.setTextColor(template?.footer.rightInfo.color || template?.footer.textColor || '#8E9299');
    doc.setFontSize(7);
    doc.text(`#YA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, 190, pageHeight - 20, { align: 'right' });
    doc.text(new Date().toLocaleString(), 190, pageHeight - 16, { align: 'right' });
    doc.text('PAGE 1 / 1', 190, pageHeight - 12, { align: 'right' });

    // Below Center: Copyright
    doc.setTextColor(template?.footer.copyright.color || template?.footer.textColor || '#8E9299');
    doc.setFontSize(6);
    doc.text(template?.footer.copyright.text || '© 2026 YA Wedding. All rights reserved.', 105, pageHeight - 5, { align: 'center' });

    doc.save(`YA-Wedding-Proposal-${state.leadInfo.name.replace(/\s+/g, '-')}.pdf`);
    handleWhatsAppRedirect();
  };

  const handleWhatsAppRedirect = async () => {
    // 1. Send Email Notification
    const bookingData = {
      packageTitle: `Custom ${state.packageType} Package`,
      isCustomForm: true,
      name: state.leadInfo.name,
      email: state.leadInfo.email,
      phone: state.leadInfo.phone,
      date: state.date,
      location: state.leadInfo.location,
      guestCount: state.guestCount,
      nationality: state.nationality,
      theme: state.theme,
      environment: state.environment,
      budgetRange: state.budgetRange,
      finalPrice: actualCost,
      customMessage: state.customMessage,
      selectedCelebrations: state.selectedCelebrations.map(id => ALL_CELEBRATIONS.find(c => c.id === id)?.name).join(', '),
      selectedServices: state.selectedServices.map(id => services.find(s => s.id === id)?.name).join(', '),
      hospitality: Object.entries(state.hospitality).filter(([_, v]) => v).map(([k]) => k).join(', '),
      entertainment: state.entertainment.join(', ')
    };

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
    } catch (err) {
      console.error('Email notification failed:', err);
    }

    // 2. Prepare WhatsApp Message
    let message = `*YA Wedding - Custom Proposal*\n\n`;
    message += `*Client:* ${state.leadInfo.name}\n`;
    message += `*Phone:* ${state.leadInfo.phone}\n`;
    message += `*Event Date:* ${state.date}\n`;
    message += `*Guests:* ${state.guestCount}\n`;
    message += `*Package:* ${state.packageType}\n`;
    message += `*Theme:* ${state.theme}\n`;
    message += `*Environment:* ${state.environment}\n\n`;
    
    if (state.category === 'Wedding' && state.selectedCelebrations.length > 0) {
      message += `*Selected Celebrations:*\n`;
      state.selectedCelebrations.forEach(id => {
        const c = ALL_CELEBRATIONS.find(cel => cel.id === id);
        if (c) message += `- ${c.name}\n`;
      });
      message += `\n`;
    }

    if (state.selectedServices.length > 0) {
      message += `*Selected Services:*\n`;
      state.selectedServices.forEach(id => {
        const s = services.find(srv => srv.id === id);
        if (s) message += `- ${s.name}\n`;
      });
    }

    message += `\n*Hospitality:*\n`;
    if (state.hospitality.catering) message += `- Catering (${state.guestCount} pax)\n`;
    if (state.hospitality.welcomeDrinks) message += `- Welcome Drinks\n`;
    
    message += `\n*Entertainment:*\n`;
    state.entertainment.forEach(e => message += `- ${e}\n`);

    message += `\n*Estimated Total: AED ${actualCost.toLocaleString()}*\n`;
    message += `*Budget Range:* ${state.budgetRange}\n`;
    
    if (state.customMessage) {
      message += `\n*Custom Request:* ${state.customMessage}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/971505588842?text=${encodedMessage}`, '_blank');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Users className="w-4 h-4" /> Guest Count</label>
                <input 
                  type="number" 
                  value={state.guestCount}
                  onChange={(e) => setState({...state, guestCount: parseInt(e.target.value) || 0})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Calendar className="w-4 h-4" /> Event Date</label>
                <input 
                  type="date" 
                  value={state.date}
                  onChange={(e) => setState({...state, date: e.target.value})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Layout className="w-4 h-4" /> Package Type</label>
                <select 
                  value={state.packageType}
                  onChange={(e) => setState({...state, packageType: e.target.value as PackageType})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Events">Events</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Globe className="w-4 h-4" /> Nationality</label>
                <select 
                  value={state.nationality}
                  onChange={(e) => setState({...state, nationality: e.target.value})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                >
                  {NATIONALITIES.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Wallet className="w-4 h-4" /> Budget Range</label>
                <select 
                  value={state.budgetRange}
                  onChange={(e) => setState({...state, budgetRange: e.target.value})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                >
                  {BUDGET_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Layout className="w-4 h-4" /> Service Category</label>
                <select 
                  value={state.category}
                  onChange={(e) => setState({...state, category: e.target.value})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        );
      case 3:
        if (state.category === 'Wedding') {
          const celebrations = state.nationality === 'Keep Secret' 
            ? ALL_CELEBRATIONS 
            : (WEDDING_CELEBRATIONS[state.nationality] || ALL_CELEBRATIONS);
            
          return (
            <div className="space-y-4">
              <h3 className="text-white font-medium">Select Wedding Celebrations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {celebrations.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      const isSelected = state.selectedCelebrations.includes(c.id);
                      setState({
                        ...state,
                        selectedCelebrations: isSelected 
                          ? state.selectedCelebrations.filter(id => id !== c.id)
                          : [...state.selectedCelebrations, c.id]
                      });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      state.selectedCelebrations.includes(c.id)
                        ? 'bg-[#00C896]/10 border-[#00C896]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-white">{c.name}</h4>
                      {state.selectedCelebrations.includes(c.id) && <CheckCircle2 className="w-5 h-5 text-[#00C896]" />}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{c.description}</p>
                    <p className="text-[#00C896] font-mono text-sm mt-2">AED {c.price}</p>
                  </button>
                ))}
              </div>
            </div>
          );
        } else {
          const filteredServices = services.filter(s => s.category.toLowerCase().includes(state.category.toLowerCase()));
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    const isSelected = state.selectedServices.includes(s.id);
                    setState({
                      ...state,
                      selectedServices: isSelected 
                        ? state.selectedServices.filter(id => id !== s.id)
                        : [...state.selectedServices, s.id]
                    });
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    state.selectedServices.includes(s.id)
                      ? 'bg-[#00C896]/10 border-[#00C896]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white">{s.name}</h4>
                    {state.selectedServices.includes(s.id) && <CheckCircle2 className="w-5 h-5 text-[#00C896]" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{s.shortDescription}</p>
                  <p className="text-[#00C896] font-mono text-sm mt-2">AED {s.price}</p>
                </button>
              ))}
            </div>
          );
        }
      case 4:
        const addOns = services.filter(s => !state.selectedServices.includes(s.id)).slice(0, 6);
        return (
          <div className="space-y-4">
            <h3 className="text-white font-medium">Suggested Add-ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addOns.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    const isSelected = state.addOns.includes(s.id);
                    setState({
                      ...state,
                      addOns: isSelected 
                        ? state.addOns.filter(id => id !== s.id)
                        : [...state.addOns, s.id]
                    });
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    state.addOns.includes(s.id)
                      ? 'bg-[#00C896]/10 border-[#00C896]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-white">{s.name}</h4>
                    {state.addOns.includes(s.id) && <CheckCircle2 className="w-5 h-5 text-[#00C896]" />}
                  </div>
                  <p className="text-[#00C896] font-mono text-sm mt-1">AED {s.price}</p>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ENVIRONMENTS.map(env => (
              <button
                key={env}
                onClick={() => setState({...state, environment: env})}
                className={`p-4 rounded-xl border text-center capitalize transition-all ${
                  state.environment === env
                    ? 'bg-[#00C896]/10 border-[#00C896] text-[#00C896]'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'welcomeDrinks', label: 'Welcome Drinks', icon: Coffee },
                { key: 'catering', label: 'Catering Packages', icon: Coffee },
                { key: 'invitations', label: 'Invitation Cards', icon: Mail },
                { key: 'themeItems', label: 'Theme-based Items (Tissue, Cups, etc)', icon: Palette },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => setState({
                    ...state,
                    hospitality: { ...state.hospitality, [item.key]: !state.hospitality[item.key as keyof typeof state.hospitality] }
                  })}
                  className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                    state.hospitality[item.key as keyof typeof state.hospitality]
                      ? 'bg-[#00C896]/10 border-[#00C896]'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${state.hospitality[item.key as keyof typeof state.hospitality] ? 'text-[#00C896]' : 'text-gray-500'}`} />
                  <span className="text-white font-medium">{item.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 italic">* Hospitality costs are calculated per guest based on your guest count ({state.guestCount}).</p>
          </div>
        );
      case 7:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'DJ', icon: Music },
              { label: 'Dance Stage', icon: Layout },
              { label: 'Photo/Video', icon: Sparkles },
              { label: 'Sound System', icon: Music },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => {
                  const isSelected = state.entertainment.includes(item.label);
                  setState({
                    ...state,
                    entertainment: isSelected 
                      ? state.entertainment.filter(e => e !== item.label)
                      : [...state.entertainment, item.label]
                  });
                }}
                className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                  state.entertainment.includes(item.label)
                    ? 'bg-[#00C896]/10 border-[#00C896]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <item.icon className={`w-6 h-6 ${state.entertainment.includes(item.label) ? 'text-[#00C896]' : 'text-gray-500'}`} />
                <span className="text-white font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        );
      case 8:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(Object.keys(THEME_MULTIPLIERS) as ThemeType[]).map(t => (
                <button
                  key={t}
                  onClick={() => setState({...state, theme: t})}
                  className={`p-3 rounded-xl border text-sm transition-all ${
                    state.theme === t
                      ? 'bg-[#00C896]/10 border-[#00C896] text-[#00C896]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Selected Budget Limit</span>
                <span className="text-white font-mono">AED {budgetLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Actual Estimated Cost</span>
                <span className="text-xl font-bold text-[#00C896] font-mono">AED {actualCost.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-gray-400">{balance >= 0 ? 'Remaining Balance' : 'Additional Budget Needed'}</span>
                <span className={`font-bold font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  AED {Math.abs(balance).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Custom Request</label>
              <textarea 
                value={state.customMessage}
                onChange={(e) => setState({...state, customMessage: e.target.value})}
                onKeyDown={handleKeyDown}
                placeholder="Type any specific colors, designs, or themes you have in mind..."
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#00C896] outline-none min-h-[100px]"
              />
            </div>
          </div>
        );
      case 9:
        return (
          <div className="space-y-6">
            <div className="bg-[#00C896]/10 border border-[#00C896]/20 p-4 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#00C896] shrink-0 mt-0.5" />
              <p className="text-sm text-gray-300">
                <span className="text-[#00C896] font-bold">Special Offer:</span> Book your free consultation with our senior planner to adjust your budget, minimize costs, and make your perfect celebrations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><User className="w-4 h-4" /> Full Name</label>
                <input 
                  type="text" 
                  value={state.leadInfo.name}
                  onChange={(e) => setState({...state, leadInfo: {...state.leadInfo, name: e.target.value}})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</label>
                <input 
                  type="email" 
                  value={state.leadInfo.email}
                  onChange={(e) => setState({...state, leadInfo: {...state.leadInfo, email: e.target.value}})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
                <input 
                  type="tel" 
                  value={state.leadInfo.phone}
                  onChange={(e) => setState({...state, leadInfo: {...state.leadInfo, phone: e.target.value}})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><Phone className="w-4 h-4" /> WhatsApp</label>
                <input 
                  type="tel" 
                  value={state.leadInfo.whatsapp}
                  onChange={(e) => setState({...state, leadInfo: {...state.leadInfo, whatsapp: e.target.value}})}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-gray-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</label>
                <input 
                  type="text" 
                  value={state.leadInfo.location}
                  onChange={(e) => setState({...state, leadInfo: {...state.leadInfo, location: e.target.value}})}
                  onKeyDown={handleKeyDown}
                  placeholder="Your event location or city"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00C896] outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGeoLocation}
                disabled={isGeoLoading}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all w-full ${
                  isGeoValid === true 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : isGeoValid === false
                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {isGeoLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : isGeoValid === true ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isGeoValid === false ? (
                  <AlertCircle className="w-5 h-5" />
                ) : (
                  <Navigation className="w-5 h-5" />
                )}
                <div className="text-left">
                  <p className="font-medium">Verify Location</p>
                  <p className="text-xs opacity-70">Click to automatically verify your location in UAE</p>
                </div>
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="text-center space-y-8 py-8">
            <div className="w-20 h-20 bg-[#00C896]/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-[#00C896]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Proposal Ready!</h2>
              <p className="text-gray-400 mt-2 max-w-md mx-auto">
                Your custom {state.packageType.toLowerCase()} plan has been generated. 
                Download the PDF or finalize directly on WhatsApp.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 max-w-md mx-auto space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-gray-400">Total Estimate</span>
                <span className="text-2xl font-bold text-[#00C896] font-mono">AED {actualCost.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div>
                  <p className="text-gray-500 uppercase text-[10px] tracking-widest">Client</p>
                  <p className="text-white font-medium truncate">{state.leadInfo.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] tracking-widest">Date</p>
                  <p className="text-white font-medium">{state.date}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] tracking-widest">Guests</p>
                  <p className="text-white font-medium">{state.guestCount}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase text-[10px] tracking-widest">Theme</p>
                  <p className="text-white font-medium">{state.theme}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isGeoValid === true && (
                <button
                  onClick={generatePDF}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
              )}
              <button
                onClick={handleWhatsAppRedirect}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#00C896] text-white px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all"
              >
                <Send className="w-5 h-5" /> Finalize on WhatsApp
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const stepTitles = [
    "Basic Info",
    "Budget & Category",
    "Select Services",
    "Add-ons",
    "Environment",
    "Hospitality",
    "Entertainment",
    "Theme & Cost",
    "Lead Collection",
    "Finalize"
  ];

  return (
    <div 
      ref={containerRef}
      className={`w-full ${isFullPage ? 'max-w-4xl mx-auto py-12 px-4' : 'bg-[#121821] rounded-2xl p-6 shadow-2xl border border-white/5'}`}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-[#00C896]" />
              {stepTitles[currentStep - 1]}
            </h2>
            <p className="text-gray-400 mt-1">Step {currentStep} of 10</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-gray-500 uppercase tracking-widest">Current Estimate</p>
            <p className="text-[#00C896] font-mono font-bold text-lg">AED {actualCost.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#00C896]"
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 10) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1 
                ? 'text-gray-600 cursor-not-allowed' 
                : 'text-white hover:bg-white/5'
            }`}
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="flex items-center gap-4">
            {currentStep < 10 && (
              <button
                id="next-step-btn"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && (!state.date || !state.nationality)) ||
                  (currentStep === 9 && (!state.leadInfo.name || !state.leadInfo.phone))
                }
                className="flex items-center gap-2 bg-[#00C896] text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(0,200,150,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Next <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageBuilder;
