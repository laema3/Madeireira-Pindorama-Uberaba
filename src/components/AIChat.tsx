import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useData } from './DataContext';

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Olá! Sou o assistente virtual da Madeireira Pindorama. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { settings, products, categories, about } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error('Gemini API Key is missing in process.env');
        throw new Error('API Key not found');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Prepare context about the company
      const context = `
        Você é o assistente virtual da Madeireira Pindorama.
        Informações da Empresa:
        - Nome: Madeireira Pindorama
        - Endereço: ${settings.address || 'Não informado'}
        - Telefone: ${settings.phone || 'Não informado'}
        - Email: ${settings.email || 'Não informado'}
        - Sobre: ${about.description || 'Uma madeireira de tradição e qualidade.'}
        - Categorias de Produtos: ${categories.map(c => c.name).join(', ') || 'Madeiras, Ferragens, Ferramentas'}
        - Alguns Produtos: ${products.slice(0, 10).map(p => p.name).join(', ') || 'Vigamento, Tábuas, Ripas'}
        
        Instruções:
        - Seja cordial, prestativo e profissional.
        - Responda em Português do Brasil.
        - Se não souber algo específico, peça para o cliente entrar em contato via WhatsApp: ${settings.whatsappUrl}
        - Foque em tirar dúvidas sobre madeiras, projetos e produtos da loja.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
      });

      const aiResponse = response.text || 'Desculpe, tive um problema ao processar sua pergunta. Pode repetir?';
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Ops! Estou com uma instabilidade técnica no momento. Por favor, tente novamente em instantes ou nos chame no WhatsApp.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-24 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-yellow-400 text-emerald-950 p-4 rounded-full shadow-lg hover:bg-yellow-500 transition hover:scale-110 flex items-center justify-center group relative"
          title="Falar com IA"
        >
          <Bot size={28} />
          <span className="absolute -top-12 right-0 bg-emerald-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Dúvidas? Fale com nossa IA
          </span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-stone-200"
          >
            {/* Header */}
            <div className="bg-emerald-900 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-emerald-950">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Assistente Pindorama</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-[10px] opacity-80 uppercase tracking-wider">Online agora</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white text-stone-800 shadow-sm border border-stone-100 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-stone-100 flex items-center gap-2 text-stone-400 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    Pensando...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
              <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-stone-400 uppercase tracking-widest">
                <Sparkles size={10} />
                Powered by Gemini AI
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
