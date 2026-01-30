
import React, { useState, useRef, useCallback } from 'react';
import { Message } from './types';
import { STEPS } from './constants';
import StepCard from './components/StepCard';
import { analyzeContent } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Assalomu alaykum! Men Gemini AI-man. Sizga fayllar bilan ishlash va savollaringizga javob berishda yordam beraman. Fayl yuklash uchun pastdagi qadamlarni bajaring."
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      imageUrl: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    // AI logic
    const aiResponse = await analyzeContent(userMessage.content || "Rasmni tahlil qil", userMessage.imageUrl);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponse
    }]);
    
    setIsLoading(false);
    setTimeout(scrollToBottom, 100);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Guide */}
      <aside className="w-full md:w-[400px] bg-white border-r border-slate-200 p-6 overflow-y-auto max-h-[40vh] md:max-h-screen sticky top-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Gemini Master Guide</h1>
          <p className="text-slate-500 mt-2">Fayl yuklash va tahlil qilish bo'yicha bosqichma-bosqich qo'llanma.</p>
        </div>

        <div className="space-y-4">
          {STEPS.map(step => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>

        <div className="mt-10 p-4 rounded-xl bg-blue-600 text-white">
          <h4 className="font-bold mb-2">💡 Maslahat</h4>
          <p className="text-sm opacity-90">Rasm yuklaganda, AI ga aniq vazifa bering. Masalan: "Ushbu rasmda nimalar aks etgan?" yoki "GitHub profilimni bahola".</p>
        </div>
      </aside>

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
              }`}>
                {msg.imageUrl && (
                  <img 
                    src={msg.imageUrl} 
                    alt="Yuklangan fayl" 
                    className="rounded-lg mb-3 max-w-full h-auto border border-white/20"
                  />
                )}
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                <span className="text-sm text-slate-500 ml-2">Gemini o'ylamoqda...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-200">
          {selectedImage && (
            <div className="mb-4 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-blue-500" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
              title="Fayl yuklash"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Savolingizni yozing..."
                className="w-full p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none outline-none"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || (!inputText.trim() && !selectedImage)}
                className="absolute right-2 bottom-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Gemini AI xatolar qilishi mumkin. Muhim ma'lumotlarni tekshiring.
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
