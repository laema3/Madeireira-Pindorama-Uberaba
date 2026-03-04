import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from './DataContext';

const SYSTEM_INSTRUCTION = `
Você é o assistente virtual "Pindô", da Madeireira Pindorama.
Seu objetivo é ser o primeiro contato do cliente, respondendo dúvidas frequentes e direcionando para o atendimento humano quando necessário.

Diretrizes de Resposta:
1. Identidade: Madeireira Pindorama (mais de 20 anos de tradição).
2. Horário: Segunda a Sexta (08:00-18:00) e Sábado (08:00-12:00). Domingo fechado.
3. Localização: Av. das Araucárias, 1234 (Bairro Industrial).
4. Contato: Telefone (11) 3333-4444 ou WhatsApp (link disponível no site).
5. Produtos: Madeiras brutas e aparelhadas (vigas, tábuas, caibros), decks de cumaru/ipê, forros (pinus/cedrinho), compensados, MDF, ferramentas e ferragens.
6. Serviços: Cortes sob medida e entrega rápida na região.
7. Tom de Voz: Profissional, acolhedor e direto ao ponto. Use emojis de madeira 🪵 ou árvores 🌲 ocasionalmente.

Fluxo de Atendimento:
- Se o cliente perguntar sobre preços específicos, explique que os valores variam conforme a bitola e tipo de madeira, e sugira enviar uma lista para orçamento via WhatsApp.
- Se o cliente quiser algo muito técnico ou complexo, direcione-o educadamente para um vendedor humano.
- Responda sempre em Português do Brasil.
`;

const QUICK_QUESTIONS = [
  { label: '🕒 Horários', value: 'Qual o horário de funcionamento?' },
  { label: '📦 Produtos', value: 'Quais produtos vocês vendem?' },
  { label: '📍 Localização', value: 'Onde vocês estão localizados?' },
  { label: '💰 Orçamento', value: 'Como faço para pedir um orçamento?' },
];

interface Message {
  role: 'user' | 'model';
  text: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Olá! Sou o Pindô, seu assistente na Madeireira Pindorama. 🌲 Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const { settings } = useData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isLoading]);

  const initChat = (force = false) => {
    if (chatRef.current && !force) return;

    try {
      const apiKey = (process.env as any).GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        chatRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });
        setHasApiError(false);
      } else {
        setHasApiError(true);
      }
    } catch (err) {
      console.error('Failed to init chat:', err);
      setHasApiError(true);
    }
  };

  useEffect(() => {
    initChat();
  }, []);

  const handleSend = async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim() || isLoading) return;

    const apiKey = (process.env as any).GEMINI_API_KEY;
    if (!apiKey) {
      setMessages(prev => [...prev, 
        { role: 'user', text: messageText },
        { role: 'model', text: '⚠️ A chave API do Gemini não foi encontrada nas configurações do sistema. Por favor, configure a GEMINI_API_KEY para ativar o assistente.' }
      ]);
      return;
    }

    if (!textOverride) setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageText }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) {
        initChat();
      }

      if (!chatRef.current) {
        throw new Error('Chat not initialized');
      }

      // Add a timeout to prevent infinite loading
      const responsePromise = chatRef.current.sendMessage({ message: messageText });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 30000)
      );

      const result = await Promise.race([responsePromise, timeoutPromise]) as any;
      
      if (result && result.text) {
        setMessages(prev => [...prev, { role: 'model', text: result.text }]);
      } else {
        throw new Error('Empty response');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'Ops! Tive um pequeno problema técnico aqui. 😅 Por favor, tente novamente.';
      
      if (error.message === 'Timeout') {
        errorMessage = 'O assistente está demorando um pouco mais que o normal. 🐢 Por favor, tente enviar sua mensagem novamente.';
      } else if (error.status === 409 || error.message?.includes('409')) {
        // Handle conflict by resetting session
        chatRef.current = null;
        initChat(true);
        errorMessage = 'Houve um pequeno conflito na conversa. Já estou reiniciando para você! Por favor, tente enviar novamente.';
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
      
      // If it's a fatal-looking error, clear the chat ref to force re-init next time
      if (!error.message?.includes('Timeout')) {
        chatRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-stone-200 flex flex-col max-h-[500px]"
          >
            <div className="bg-emerald-900 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold">Assistente Virtual</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-emerald-950 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 h-80">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-emerald-700 text-white rounded-tr-none'
                        : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {messages.length === 1 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSend(q.value)}
                      className="text-xs bg-white border border-emerald-200 text-emerald-800 p-2 rounded-lg hover:bg-emerald-50 transition text-left"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="animate-spin text-emerald-700" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-stone-200">
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Digite sua dúvida..."
                    className="flex-1 border border-stone-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="bg-emerald-700 text-white p-2 rounded-full hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <Send size={20} />
                  </button>
                </div>
                <a 
                  href={settings.whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-center text-stone-400 hover:text-emerald-600 transition underline"
                >
                  Prefere falar com um humano? Clique aqui.
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-emerald-700 text-white p-4 rounded-full shadow-lg hover:bg-emerald-800 transition z-50 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </>
  );
}
