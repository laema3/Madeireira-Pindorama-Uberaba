import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Ricardo Oliveira",
    role: "Construtor Civil",
    content: "Excelente qualidade nas madeiras para o telhado. Entrega rápida e material muito bem selecionado. Recomendo a Pindorama para todos os meus clientes.",
    rating: 5
  },
  {
    id: 2,
    name: "Ana Paula Souza",
    role: "Arquiteta",
    content: "As peças de acabamento são impecáveis. O atendimento técnico me ajudou a escolher a melhor madeira para o deck da piscina. Resultado maravilhoso!",
    rating: 5
  },
  {
    id: 3,
    name: "Marcos Santos",
    role: "Marceneiro",
    content: "Sou cliente há anos. A constância na qualidade das tábuas e o preço justo fazem da Pindorama minha parceira principal na marcenaria.",
    rating: 5
  },
  {
    id: 4,
    name: "Juliana Mendes",
    role: "Cliente Residencial",
    content: "Comprei as madeiras para minha reforma e fiquei impressionada com o cuidado no carregamento e a educação dos entregadores. Nota 10!",
    rating: 5
  },
  {
    id: 5,
    name: "Carlos Eduardo",
    role: "Engenheiro",
    content: "Material com certificação e procedência. Para quem busca segurança estrutural e beleza, a Madeireira Pindorama é a escolha certa.",
    rating: 5
  },
  {
    id: 6,
    name: "Fernanda Lima",
    role: "Designer de Interiores",
    content: "Encontrei opções únicas de painéis ripados. O suporte da equipe para entender as medidas foi fundamental para o sucesso do meu projeto.",
    rating: 5
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">O que dizem nossos clientes</h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="relative h-[300px] md:h-[250px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-yellow-400/20 p-3 rounded-full">
                  <Quote className="text-yellow-400" size={32} />
                </div>
              </div>
              
              <p className="text-xl md:text-2xl font-medium text-yellow-400 italic mb-8 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
              
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mb-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <h4 className="text-white font-bold text-lg">{testimonials[currentIndex].name}</h4>
                <span className="text-emerald-300 text-sm uppercase tracking-widest">{testimonials[currentIndex].role}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                currentIndex === index ? 'w-8 bg-yellow-400' : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
