import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from './DataContext';
import { 
  Package, 
  TreePine, 
  Home, 
  Wrench, 
  Boxes, 
  Paintbrush, 
  Layers, 
  Hammer, 
  Grid,
  Truck,
  HardHat,
  Ruler,
  Map,
  Construction,
  Shovel,
  Warehouse,
  Fence,
  Lamp,
  Bed,
  Bath,
  Utensils,
  Armchair,
  DoorOpen,
  Thermometer,
  Car,
  Cctv,
  ShieldCheck,
  Leaf,
  Sun,
  Wind,
  Droplets,
  Flame,
  Plug,
  Mountain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ProductDescription = ({ text }: { text: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;

  if (!text || text.length <= maxLength) {
    return <p className="text-stone-600 mb-6">{text}</p>;
  }

  return (
    <div className="mb-6">
      <p className={`text-stone-600 transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
        {text}
      </p>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-emerald-700 font-bold text-xs mt-1 hover:text-emerald-800 transition-colors uppercase tracking-wider"
      >
        {isExpanded ? 'Ver menos' : 'Continuar Lendo...'}
      </button>
    </div>
  );
};

const ProductImages = ({ mainImage, additionalImages, name }: { mainImage: string, additionalImages?: string[], name: string }) => {
  const allImages = [mainImage, ...(additionalImages || [])].filter(img => img && img.trim() !== '');
  const [currentIndex, setCurrentIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-stone-400">
        Sem imagem
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/gallery">
      <img
        src={allImages[currentIndex]}
        alt={`${name} - Imagem ${currentIndex + 1}`}
        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/600x400?text=Erro+Imagem';
          e.currentTarget.onerror = null;
        }}
      />
      
      {allImages.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-1 rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i === currentIndex ? 'bg-emerald-600' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export function Products() {
  const { products, categories, settings } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const productsGridRef = useRef<HTMLDivElement>(null);

  // Reset page and scroll when category changes
  useEffect(() => {
    setCurrentPage(1);
    
    // Only scroll on mobile/tablet (less than lg breakpoint)
    if (window.innerWidth < 1024 && productsGridRef.current) {
      // Small delay to ensure any layout shifts are stable
      setTimeout(() => {
        productsGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedCategory]);

  const getCategoryIcon = (iconName?: string, name?: string) => {
    // If we have an explicit icon name from the database, use it
    if (iconName) {
      switch (iconName) {
        case 'TreePine': return <TreePine size={24} />;
        case 'Home': return <Home size={24} />;
        case 'Hammer': return <Hammer size={24} />;
        case 'Paintbrush': return <Paintbrush size={24} />;
        case 'Grid': return <Grid size={24} />;
        case 'Layers': return <Layers size={24} />;
        case 'Boxes': return <Boxes size={24} />;
        case 'Truck': return <Truck size={24} />;
        case 'HardHat': return <HardHat size={24} />;
        case 'Ruler': return <Ruler size={24} />;
        case 'Map': return <Map size={24} />;
        case 'Construction': return <Construction size={24} />;
        case 'Shovel': return <Shovel size={24} />;
        case 'Warehouse': return <Warehouse size={24} />;
        case 'Fence': return <Fence size={24} />;
        case 'Lamp': return <Lamp size={24} />;
        case 'Bed': return <Bed size={24} />;
        case 'Bath': return <Bath size={24} />;
        case 'Utensils': return <Utensils size={24} />;
        case 'Armchair': return <Armchair size={24} />;
        case 'DoorOpen': return <DoorOpen size={24} />;
        case 'Thermometer': return <Thermometer size={24} />;
        case 'Car': return <Car size={24} />;
        case 'Cctv': return <Cctv size={24} />;
        case 'ShieldCheck': return <ShieldCheck size={24} />;
        case 'Leaf': return <Leaf size={24} />;
        case 'Sun': return <Sun size={24} />;
        case 'Wind': return <Wind size={24} />;
        case 'Droplets': return <Droplets size={24} />;
        case 'Flame': return <Flame size={24} />;
        case 'Plug': return <Plug size={24} />;
        case 'Mountain': return <Mountain size={24} />;
        case 'Package': return <Package size={24} />;
      }
    }

    // Fallback based on name (backward compatibility or if no icon selected)
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('madeira')) return <TreePine size={24} />;
      if (lowerName.includes('telha') || lowerName.includes('cobertura')) return <Home size={24} />;
      if (lowerName.includes('ferramenta') || lowerName.includes('ferragem')) return <Hammer size={24} />;
      if (lowerName.includes('acabamento') || lowerName.includes('pintura')) return <Paintbrush size={24} />;
      if (lowerName.includes('piso') || lowerName.includes('revestimento')) return <Grid size={24} />;
      if (lowerName.includes('estrutura') || lowerName.includes('viga')) return <Layers size={24} />;
    }

    return <Package size={24} />;
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="produtos" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-emerald-900 mb-4">Nossos Produtos</h2>
          <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto">
            Trabalhamos com uma ampla variedade de madeiras e derivados para atender todas as etapas da sua obra.
          </p>
        </div>

        {/* Category Navigation Cards */}
        <div className="mb-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border-2 ${
              selectedCategory === 'all'
                ? 'bg-emerald-50 border-emerald-600 text-yellow-500 shadow-md transform scale-105'
                : 'bg-white border-stone-100 text-stone-600 hover:border-emerald-200 hover:bg-emerald-50/30'
            }`}
          >
            <div className={`p-3 rounded-full ${selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
              <Package size={24} />
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">Todos</span>
          </button>
          
          {categories && categories.length > 0 && categories.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`p-6 rounded-xl flex flex-col items-center justify-center gap-3 transition-all border-2 ${
                selectedCategory === cat.name
                  ? 'bg-emerald-50 border-emerald-600 text-yellow-500 shadow-md transform scale-105'
                  : 'bg-white border-stone-100 text-stone-600 hover:border-emerald-200 hover:bg-emerald-50/30'
              }`}
            >
              <div className={`p-3 rounded-full ${selectedCategory === cat.name ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
                {getCategoryIcon(cat.icon, cat.name)}
              </div>
              <span className="font-bold text-sm uppercase tracking-wider text-center">{cat.name || 'S/ NOME'}</span>
            </button>
          ))}
        </div>

        <div ref={productsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-stone-50 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  <ProductImages 
                    mainImage={product.image} 
                    additionalImages={product.images} 
                    name={product.name} 
                  />
                  <div className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide pointer-events-none">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-emerald-900">{product.name}</h3>
                    {product.price !== undefined && product.price !== null && product.price > 0 && (
                      <span className="text-emerald-700 font-bold">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mb-2 uppercase tracking-wider">{product.brand} - {product.subcategory}</p>
                  <ProductDescription text={product.description} />
                  
                  <a 
                    href={`${settings.whatsappUrl}&text=${encodeURIComponent(`Olá! Gostaria de um orçamento para o produto: ${product.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    SOLICITAR ORÇAMENTO
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border-2 transition-colors ${
                currentPage === 1
                  ? 'border-stone-100 text-stone-300 cursor-not-allowed'
                  : 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-stone-600 hover:bg-emerald-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border-2 transition-colors ${
                currentPage === totalPages
                  ? 'border-stone-100 text-stone-300 cursor-not-allowed'
                  : 'border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Package className="mx-auto text-stone-300 mb-4" size={48} />
            <p className="text-stone-500">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
