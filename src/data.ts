import { Product, Partner, Professional } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Vigas de Peroba',
    category: 'Estrutural',
    subcategory: 'Vigas',
    brand: 'Nacional',
    image: 'https://picsum.photos/seed/wood1/600/400',
    description: 'Vigas de alta resistência para telhados e estruturas.',
    price: 0
  },
  {
    id: '2',
    name: 'Tábuas de Pinus',
    category: 'Construção',
    subcategory: 'Tábuas',
    brand: 'Nacional',
    image: 'https://picsum.photos/seed/wood2/600/400',
    description: 'Madeira versátil para caixarias e construção civil.',
    price: 0
  },
  {
    id: '3',
    name: 'Deck de Cumaru',
    category: 'Acabamento',
    subcategory: 'Decks',
    brand: 'Premium',
    image: 'https://picsum.photos/seed/wood3/600/400',
    description: 'Durabilidade e beleza para áreas externas.',
    price: 0
  },
  {
    id: '4',
    name: 'Forro de Cedrinho',
    category: 'Acabamento',
    subcategory: 'Forros',
    brand: 'Premium',
    image: 'https://picsum.photos/seed/wood4/600/400',
    description: 'Acabamento nobre e aconchegante para interiores.',
    price: 0
  },
  {
    id: '5',
    name: 'Compensado Naval',
    category: 'Chapas',
    subcategory: 'Compensados',
    brand: 'Nacional',
    image: 'https://picsum.photos/seed/wood5/600/400',
    description: 'Resistente à umidade, ideal para móveis e barcos.',
    price: 0
  },
  {
    id: '6',
    name: 'MDF Branco',
    category: 'Chapas',
    subcategory: 'MDF',
    brand: 'Duratex',
    image: 'https://picsum.photos/seed/wood6/600/400',
    description: 'Chapas de MDF para marcenaria em geral.',
    price: 0
  }
];

export const PARTNERS: Partner[] = [
  { id: '1', name: 'Bosch', logo: 'https://picsum.photos/seed/bosch/200/100' },
  { id: '2', name: 'Makita', logo: 'https://picsum.photos/seed/makita/200/100' },
  { id: '3', name: 'Duratex', logo: 'https://picsum.photos/seed/duratex/200/100' },
  { id: '4', name: 'Eucatex', logo: 'https://picsum.photos/seed/eucatex/200/100' }
];

export const PROFESSIONALS: Professional[] = [
  {
    id: '1',
    name: 'João Silva',
    specialty: 'Carpinteiro',
    contact: '(11) 99999-9999',
    image: 'https://picsum.photos/seed/worker1/300/300'
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    specialty: 'Marceneira',
    contact: '(11) 98888-8888',
    image: 'https://picsum.photos/seed/worker2/300/300'
  },
  {
    id: '3',
    name: 'Carlos Souza',
    specialty: 'Telhadista',
    contact: '(11) 97777-7777',
    image: 'https://picsum.photos/seed/worker3/300/300'
  }
];
