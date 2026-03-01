import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useLoader } from './LoaderContext';
import { useData } from './DataContext';

export function ContactForm() {
  const { simulateLoading } = useLoader();
  const { addClient } = useData();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    simulateLoading(() => {
      // Add to clients list
      addClient({
        id: Date.now().toString(),
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        address: 'Contato via Site',
        notes: formState.message
      });

      setIsSubmitted(true);
      setFormState({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contato-form" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Entre em Contato</h2>
          <p className="text-stone-600">
            Tem alguma dúvida ou precisa de um orçamento? Preencha o formulário abaixo e entraremos em contato.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle size={48} className="text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-900 mb-2">Mensagem Enviada!</h3>
            <p className="text-emerald-800">
              Obrigado pelo contato. Nossa equipe retornará em breve.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-stone-50 p-8 rounded-2xl shadow-sm border border-stone-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-1">Telefone / WhatsApp</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Mensagem</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formState.message}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Como podemos ajudar?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Send size={20} />
              Enviar Mensagem
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
