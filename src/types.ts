import { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  image: string;
  description: string;
  price: number;
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
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Settings {
  logoUrl: string;
  footerText: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
  googleTagId: string;
  facebookPixelId: string;
  address: string;
  phone: string;
  email: string;
  adminUser?: string;
  adminPassword?: string;
  heroImages?: string[];
}

export interface Work {
  id: string;
  title: string;
  description: string;
  images: string[]; // Array of image URLs (or base64)
}
