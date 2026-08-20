import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, BrainCircuit, Loader2, Sparkles, Bot, User } from 'lucide-react';
import api from '../api/axios';

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm HealthAI. I've analyzed your medical vault and diagnostic history. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    api.get('/ai-engine/chat/')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const formattedMessages = res.data.map(msg => ({ role: msg.role, text: msg.text }));
          setMessages(formattedMessages);
        }
      })
      .catch(err => console.error("Error fetching chat history:", err));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai-engine/chat/', { question: userMessage.text });
      setMessages(prev => [...prev, { role: 'assistant', text: response.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to my clinical knowledge base right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-600 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all duration-300 z-50 group border border-cyan-400/30"
          >
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl animate-ping opacity-30 pointer-events-none"></div>
            <BrainCircuit className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 z-50 flex flex-col overflow-hidden h-[540px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 border-b border-slate-800 flex justify-between items-center text-white z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/30">
                  <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    Health<span className="text-cyan-400">AI</span> Clinical
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-0.5">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    Gemini 2.5 Active
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-950/80 p-4 overflow-y-auto flex flex-col gap-3.5">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-md whitespace-pre-wrap ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-br-none border border-cyan-400/20' 
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5 justify-start items-center">
                  <div className="h-7 w-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                    <span className="text-xs text-slate-400 font-medium">Analyzing diagnostic records...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about symptoms, prescriptions..."
                className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-9 w-9 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-all shadow-md shadow-cyan-500/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HealthChatbot;
