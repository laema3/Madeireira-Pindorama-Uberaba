import React from 'react';
import { motion } from 'motion/react';
import { Target, Eye, Heart } from 'lucide-react';

export function MissionVisionValues() {
  return (
    <section className="py-16 bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-md text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-900 rounded-full mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Missão</h3>
            <p className="text-stone-600">
              Fornecer madeiras e produtos de alta qualidade, contribuindo para a realização dos sonhos de nossos clientes com sustentabilidade e excelência.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-md text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-900 rounded-full mb-6">
              <Eye size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Visão</h3>
            <p className="text-stone-600">
              Ser referência no mercado madeireiro nacional, reconhecida pela inovação, qualidade dos produtos e compromisso ambiental.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-xl shadow-md text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-900 rounded-full mb-6">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-4">Valores</h3>
            <p className="text-stone-600">
              Ética, transparência, respeito ao meio ambiente, valorização das pessoas e compromisso com a satisfação do cliente.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
