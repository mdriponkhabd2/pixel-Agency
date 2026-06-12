export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  icon: string;
  bannerUrl: string;
  description: string;
  shortDescription: string;
}

export interface ServicePackage {
  id: string;
  serviceId: string;
  name: 'Basic' | 'Standard' | 'Premium' | string;
  price: number;
  description: string;
  features: string[];
  enabled: boolean;
  customOrderUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  serviceName: string;
  packageId: string;
  packageName: string;
  price: number;
  projectDetails: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}

export interface PortfolioItem {
  id: string;
  title: string;
  serviceId: string;
  imageUrl: string;
  projectUrl?: string;
  description: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  serviceId?: string; // 'general' or specific serviceId
}

export interface CustomMenuItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
  order: number;
}

export interface WebsiteSettings {
  address: string;
  whatsapp: string;
  liveChatEnabled: boolean;
  seoTitle: string;
  seoKeywords: string;
  seoDescription: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  logoImageUrl?: string;
  aboutTitle?: string;
  aboutContent?: string;
  aboutImageUrl?: string;
  domainRegistrationUrl?: string;
  bdixHostingUrl?: string;
  usaHostingUrl?: string;
  singaporeHostingUrl?: string;
  germanyHostingUrl?: string;
  bdixResellerUrl?: string;
  usaResellerUrl?: string;
  singaporeResellerUrl?: string;
  germanyResellerUrl?: string;
  domainPricingUrl?: string;
  domainTransferUrl?: string;
  domainDnsCheckerUrl?: string;
  customMenuItems?: CustomMenuItem[];
  sqlDialect?: 'postgres' | 'mysql';
  sqlConnectionUri?: string;
  sqlEnabled?: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalServices: number;
  revenueOverall: number;
  recentOrders: Order[];
  recentContacts: ContactMessage[];
}
