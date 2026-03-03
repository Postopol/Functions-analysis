import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { govData } from '../data';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function ChatAssistant({ isSidebarOpen, onOpenSidebar }: { isSidebarOpen: boolean, onOpenSidebar: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Привет! Я ИИ-ассистент. Готов обсудить коллизии и структуру госорганов.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    if (!chatRef.current) {
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `Ты — ИИ-ассистент для GovTech приложения. Твоя задача — помогать анализировать дублирование функций (коллизии) в государственных органах. 
Данные о структуре и коллизиях: ${JSON.stringify(govData)}. 
Отвечай кратко, профессионально и по делу. Используй Markdown для форматирования списков и выделения важного.`,
        }
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userText });
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Произошла ошибка при обращении к ИИ.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSidebarOpen) {
    return (
      <div className="flex-1 flex flex-col items-center justify-end pb-6">
        <button 
          onClick={onOpenSidebar}
          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors shadow-sm"
          title="Открыть ИИ-ассистента"
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden border-t border-slate-200 mt-2 bg-slate-50/50">
      <div className="p-3 bg-white border-b border-slate-200 flex items-center gap-2 shrink-0 shadow-sm z-10">
        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
          <Bot className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="font-semibold text-sm text-slate-700">ИИ-Ассистент</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-white border border-slate-200 text-slate-600 shadow-sm'}`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
              {msg.role === 'user' ? (
                <span className="whitespace-pre-wrap">{msg.text}</span>
              ) : (
                <div className="markdown-body">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 flex-row">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 bg-white border border-slate-200 text-slate-600 shadow-sm">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-3 py-2 rounded-xl text-sm bg-white border border-slate-200 text-slate-800 rounded-tl-sm flex items-center gap-2 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-slate-500 font-medium">Анализирую...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <textarea 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Спросите о коллизиях..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 py-1.5 min-w-0 resize-none max-h-32 min-h-[36px]"
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:hover:bg-blue-600 shrink-0 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
