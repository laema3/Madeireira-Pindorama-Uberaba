import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from './DataContext';
import { Package } from 'lucide-react';

export function Products() {
  const { products, categories, settings } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-emerald-700 text-white shadow-md scale-105'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-emerald-700 text-white shadow-md scale-105'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
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
                  {product.image && product.image.trim() !== '' ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400?text=Sem+Imagem';
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      Sem imagem
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-emerald-900">{product.name}</h3>
                    <span className="text-emerald-700 font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2 uppercase tracking-wider">{product.brand} - {product.subcategory}</p>
                  <p className="text-stone-600 mb-6 line-clamp-2">{product.description}</p>
                  
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
