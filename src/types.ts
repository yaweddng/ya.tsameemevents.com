export interface BookingOption {
  label: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[];
  required?: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  currency: string;
  image: string;
  description: string;
  shortDescription: string;
  tags: string[];
  serviceAreas: string[];
  category: string;
  badge?: 'Best Seller' | 'Trending' | 'Price Drop' | 'New';
  features: string[];
  seoDescription?: string;
  bookingOptions?: BookingOption[];
  rating?: number;
  reviewCount?: number;
  faqs?: { question: string; answer: string }[];
}

export interface Rating {
  id: string;
  name: string;
  location: string;
  slug?: string;
  profileImage?: string;
  showProfileImage: boolean;
  reviewImage?: string;
  showReviewImage: boolean;
  stars: number;
  content: string;
  services: string[];
  budgetRange: string;
  isVerified: boolean;
  badge: string;
  customBadgeText?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  image: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  icon: string;
  terms: string[];
  badge?: string;
  link: string;
  fullDetails: string;
}

export interface AdvancedStyling {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  height?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
}

export interface Widget {
  id: string;
  type: 'hero' | 'services' | 'blogs' | 'text' | 'stats' | 'contact' | 'gallery' | 'promos' | 'faq' | 'cta' | 'about' | 'package_builder' | 'discounts' | 'booking_form' | 'testimonials' | 'pro' | 'standard' | 'pwa_install' | 'features';
  config: any;
  weight: number;
}

export interface ContainerSlot {
  id: string;
  name: string;
  width: string; // e.g. "50%", "100%", "33.33%"
  widgets: Widget[];
}

export interface Container {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  layout: 'flex' | 'grid' | 'split-50-50' | 'split-30-70' | 'split-70-30' | 'custom';
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignment: 'start' | 'center' | 'end' | 'between' | 'around';
  slots: ContainerSlot[];
  widgets: Widget[]; // Keep for compatibility
  weight: number;
}

export type WidgetItemProType = 
  | 'badge_title' 
  | 'advanced_title' 
  | 'subheading' 
  | 'cta_button' 
  | 'carousel' 
  | 'form' 
  | 'icon_list'
  | 'custom_code'
  | 'map'
  | 'image'
  | 'card'
  | 'faq'
  | 'tabs'
  | 'toggle';

export interface WidgetItemPro {
  id: string;
  name: string;
  slug?: string;
  type: WidgetItemProType;
  config: any;
  advancedStyling?: AdvancedStyling;
  customCss?: string;
  status: 'Active' | 'Draft' | 'Archived';
  category: string; // general, forms, email, etc.
  createdAt: string;
  updatedAt: string;
}

export interface StandardWidget {
  id: string;
  name: string;
  slug: string;
  description?: string;
  items: { 
    itemId: string; // Reference to WidgetItemPro
    weight: number;
    configOverride?: any;
  }[];
  status: 'Active' | 'Draft';
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  slug: string;
  header: {
    bgColor: string;
    textColor: string;
    centerIcon: { text: string; bgColor: string; textColor: string; show: boolean };
    contactInfo: {
      whatsapp: string;
      email: string;
      website: string;
      show: boolean;
      color: string;
    };
  };
  body: {
    bgColor: string;
    textColor: string;
    title: {
      part1: string;
      part2: string;
      color: string;
    };
    subheading: { text: string; color: string };
    content: string;
    overlayIcon: { icon: string; opacity: number; color: string; show: boolean };
  };
  cta: {
    buttons: { text: string; url: string; show: boolean; bgColor: string; textColor: string }[];
  };
  footer: {
    bgColor: string;
    textColor: string;
    links: { label: string; url: string; show: boolean; color: string }[];
    platformName: { text: string; color: string };
    shortDescription: { text: string; color: string };
    copyright: { text: string; color: string };
  };
  advanced: {
    customCode?: string;
    responsive: boolean;
  };
}

export interface PDFTemplate {
  id: string;
  name: string;
  slug: string;
  pageBgColor: string;
  header: {
    bgColor: string;
    textColor: string;
    websiteName: { part1: string; part2: string; color: string };
    contactInfo: {
      whatsapp: string;
      email: string;
      website: string;
      color: string;
    };
    centerIcon: { text: string; bgColor: string; textColor: string };
    rightInfo: {
      location: string;
      call: string;
      date: string;
      color: string;
    };
    customTitle: { text1: string; text2: string; color: string };
  };
  footer: {
    bgColor: string;
    textColor: string;
    centerText: { text: string; color: string };
    leftInfo: {
      logoText: string;
      website: string;
      phone: string;
      color: string;
    };
    centerIcon: { text: string; bgColor: string; textColor: string };
    rightInfo: {
      showSubmissionId: boolean;
      showSubmissionDate: boolean;
      showPageCount: boolean;
      color: string;
    };
    copyright: { text: string; color: string };
  };
  body: {
    textColor: string;
    content: string;
  };
  watermark: {
    text: string;
    color: string;
    opacity: number;
  };
}

export interface VisualComponent {
  id: string;
  type: 'heading' | 'text' | 'image' | 'button' | 'form' | 'slider' | 'gallery' | 'card' | 'video' | 'map' | 'review_widget' | 'cta_block';
  content: any;
  style: any;
  settings: any;
  className?: string;
  animate?: any;
}

export interface VisualColumn {
  id: string;
  components: VisualComponent[];
  width?: string; // e.g. "50%", "100%"
  style?: any;
}

export interface VisualSection {
  id: string;
  columns: VisualColumn[];
  style?: any;
  settings?: any;
}

export interface VisualLayout {
  sections: VisualSection[];
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  widgets?: (Widget | { containerId: string })[];
  containers?: Container[];
  visualLayout?: VisualLayout; // New visual editor layout
  isSystem?: boolean;
  schema?: string;
  published?: boolean;
}

export interface HeaderMenuItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  hideOnMobile?: boolean;
  subItems?: { label: string; url: string; icon?: string }[];
}

export interface HeaderCTA {
  label: string;
  url: string;
  variant: 'primary' | 'secondary';
  icon?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterNavSection {
  title: string;
  items: { label: string; url: string }[];
}

export interface OperatingHour {
  day: string;
  hours: string;
  icon?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string; // 'image' | 'video' | 'pdf' | 'svg' | 'font' | 'icon' | 'audio' | 'zip'
  size: number;
  alt?: string;
  keywords?: string[];
  description?: string;
  createdAt: string;
}

export interface SchemaConfig {
  enabled: boolean;
  type: 'WebSite' | 'Organization' | 'LocalBusiness' | 'Service' | 'Product';
  data: {
    name: string;
    url: string;
    logo: string;
    description: string;
    address?: string;
    telephone?: string;
    priceRange?: string;
    image?: string;
    services?: string[];
  };
}

export interface SiteSettings {
  siteName: string;
  siteTitle: string;
  logoType: 'text' | 'image';
  siteLogo: string;
  siteLogoText?: string;
  siteFavicon?: string;
  siteDescription: string;
  seoSchema: string; // Manual JSON string for Schema.org
  autoSchema?: SchemaConfig;
  googleTagManagerId: string;
  googleAnalyticsId: string;
  googleSearchConsoleKey: string;
  googleAdsenseKey: string;
  
  header: {
    menu: HeaderMenuItem[];
    ctas: HeaderCTA[];
    mobileMenu: {
      ctaIcon: string;
      items: HeaderMenuItem[];
    };
  };
  
  footer: {
    logoType?: 'text' | 'image';
    logoText?: string;
    logo: string;
    title: string;
    description: string;
    socialLinks: SocialLink[];
    navigation: FooterNavSection[];
    contactInfo: {
      title: string;
      items: { icon: string; value: string; label?: string }[];
    };
    moreInfo: {
      title: string;
      items: { icon: string; value: string; label?: string }[];
    };
    seoTags: string[];
    showSEOTags?: boolean;
    copyrightText: string;
    ctas?: { label: string; url: string; icon?: string; show: boolean }[];
    showCTA?: boolean;
    showHours?: boolean;
    showContact?: boolean;
  };

  floatingItems?: {
    helpTabs: {
      show: boolean;
      viewType: 'button' | 'nav';
      items: { label: string; icon: string; url: string; position: 'left' | 'right' }[];
    };
    actionButtons: {
      show: boolean;
      position: 'left' | 'right';
      items: { icon: string; url: string; label?: string; show: boolean }[];
    };
  };
  
  // Existing fields for compatibility
  googleMapsApiKey?: string;
  heroBackgroundImage?: string;
  heroHeightDesktop?: string;
  heroHeightTablet?: string;
  heroHeightMobile?: string;
  helpTabName?: string;
  helpTabSize?: string;
  aboutImage?: string;
  aboutStats?: { label: string; value: string }[];
  logoSettings?: {
    header: {
      desktop: {
        part1: string;
        part2: string;
      };
      mobile: string;
    };
    footer: {
      part1: string;
      part2: string;
    };
  };
}

export interface PackageStep {
  id: string;
  title: string;
  description: string;
  type: 'services' | 'custom' | 'lead';
  serviceIds?: string[]; // If type is 'services'
  required?: boolean;
}

export interface PackageSelection {
  stepId: string;
  selectedIds: string[];
  customValue?: string;
}

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  date: string;
  location?: string;
  geoCoords?: { lat: number; lng: number } | null;
}

export interface BookingFormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'email' | 'tel' | 'textarea' | 'checkbox';
  options?: string[];
  required?: boolean;
  placeholder?: string;
  width?: 'full' | 'half';
}

export interface BookingFormStep {
  id: string;
  title: string;
  description?: string;
  fields: BookingFormField[];
}

export interface PDFConfig {
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headerText: string;
  footerText: string;
  showPricing: boolean;
  showTerms: boolean;
  termsContent: string;
  brandingDesign: {
    backgroundPattern?: string;
    accentStyle: 'minimal' | 'bold' | 'elegant';
    watermark?: string;
  };
}

export interface BookingForm {
  id: string;
  name: string;
  description: string;
  steps: BookingFormStep[];
  pdfConfig: PDFConfig;
  successMessage: string;
  redirectUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  features: string[];
  tiers: {
    [key: string]: {
      price: number;
      name: string;
      guests: number;
      includes: boolean[];
    };
  };
}

export type PackageType = 'Wedding' | 'Events' | 'Others';
export type ThemeType = 'Basic' | 'Modern' | 'Premium' | 'Luxury' | 'Traditional' | 'Emarati' | 'Elegant' | 'Extended';
export type EnvironmentType = 'indoor' | 'outdoor' | 'beach' | 'hall' | 'ballroom' | 'venue' | 'hotels';

export interface ThemeTemplate {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'styles' | 'single' | 'archive' | 'product' | 'category' | 'tag' | 'search' | '404' | 'card' | 'cpt' | 'widget';
  config: any;
  conditions?: string[];
  status: 'Active' | 'Draft' | 'Archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomPostField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'gallery' | 'select' | 'rating' | 'price' | 'boolean';
  required: boolean;
  options?: string[]; // For select type
}

export interface CustomPostType {
  id: string;
  name: string; // e.g. "Service"
  slug: string; // e.g. "service"
  icon: string;
  description: string;
  fields: CustomPostField[];
  hasArchive: boolean;
  menuPosition: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  password?: string;
  role: 'admin' | 'user' | 'editor' | 'manager' | 'viewer';
  name: string;
  profileImage?: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  createdAt: string;
}

export interface UserSite {
  id: string;
  userId: string;
  title: string;
  domain?: string;
  subdomain: string;
  logo?: string;
  favicon?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsoleKey?: string;
  customScripts?: string;
  status: 'published' | 'draft';
  themeConfig: any;
  createdAt: string;
  updatedAt: string;
}

export interface PackageBuilderState {
  guestCount: number;
  date: string;
  packageType: PackageType;
  nationality: string;
  budgetRange: string;
  category: string;
  selectedServices: string[];
  selectedCelebrations: string[];
  addOns: string[];
  environment: EnvironmentType;
  hospitality: {
    welcomeDrinks: boolean;
    catering: boolean;
    invitations: boolean;
    themeItems: boolean;
  };
  entertainment: string[];
  theme: ThemeType;
  customMessage: string;
  leadInfo: LeadInfo;
}
