import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  images?: string[];
  description: string;
  price?: number;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  contact: string;
  image: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface AboutData {
  title: string;
  description: string;
  image: string;
  videoUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface HeroSlide {
  url: string;
  title: string;
  description?: string;
  subtitle?: string;
}

export interface Settings {
  companyName?: string;
  logoUrl: string;
  footerLogoUrl?: string;
  footerText: string;
  footerDescription?: string;
  openingHours?: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  googleTagId: string;
  facebookPixelId?: string;
  address: string;
  phone: string;
  email: string;
  adminUser?: string;
  adminPassword?: string;
  heroImages?: string[]; // Legacy
  heroSlides?: HeroSlide[];
  heroBgUrl?: string;
  pageBannerImageUrl? : string;
  maintenanceMode?: boolean;
}

export interface Work {
  id: string;
  title: string;
  description: string;
  images: string[]; // Array of image URLs (or base64)
}

export interface ServiceArea {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Post {
  id: string;
  title: string;
  image: string;
  content: string;
  createdAt?: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'editor' | 'viewer';
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface QuoteItem {
  id: string;
  quantity: number;
  unit?: string; // 'un', 'm', 'm²', 'm³', 'kg', 'pç'
  description: string;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  number?: string;
  companyName?: string;
  companyLogo?: string;
  clientName: string;
  address: string;
  phone: string;
  whatsapp: string;
  items: QuoteItem[];
  discount: number;
  discountType: 'fixed' | 'percent';
  discountStatus?: 'pendente' | 'aprovado' | 'rejeitado';
  discountApprovedBy?: string;
  discountApprovedAt?: string;
  finalTotal: number;
  status: 'pendente' | 'aprovado' | 'fechado' | 'nao_fechado';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}
