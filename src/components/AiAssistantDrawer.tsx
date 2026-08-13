import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Bot, User, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { SystemBrandingConfig } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  branding?: SystemBrandingConfig;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose, branding }) => {
  const aiTitle = branding?.aiTitle || 'Trợ lý AI Điều phối DVC';
  const aiGreeting =
    branding?.aiGreeting ||
    'Xin chào! Tôi là Trợ lý AI Điều phối DVC Siêu tốc. Tôi có thể hỗ trợ bạn hướng dẫn quy trình làm thủ tục, kiểm tra tính hợp lệ của giấy tờ hoặc giải đáp thắc mắc về thời gian xử lý.';
  const defaultSuggestions = branding?.aiSuggestedQuestions || [
    'Làm trích lục khai sinh cần giấy tờ gì?',
    'Thời gian xử lý cấp phép xây dựng?',
    'Lệ phí làm trợ cấp thất nghiệp?'
  ];

  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; suggestions?: string[] }>>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize messages on load or when branding changes
  useEffect(() => {
    setMessages([
      {
        sender: 'ai',
        text: aiGreeting,
        suggestions: defaultSuggestions
      }
    ]);
  }, [aiGreeting, JSON.stringify(defaultSuggestions)]);

  if (!isOpen) return null;

  const handleSend = async (questionText?: string) => {
    const q = questionText || inputQuestion;
    if (!q.trim()) return;

    const userMsg = { sender: 'user' as const, text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-analyze-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureTitle: 'Giải đáp thắc mắc thủ tục hành chính',
          userQuestion: q
        })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: data.aiFeedback || 'Hệ thống đã nhận được câu hỏi. Đảm bảo chuẩn bị đầy đủ Căn cước công dân và bản scan chính xác.',
          suggestions: data.suggestions || ['Kiểm tra lại thời hạn hiệu lực tài liệu', 'Nộp hồ sơ trực tuyến qua VNeID']
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Thủ tục hành chính công được thực hiện 100% trực tuyến. Bạn có thể chọn danh mục trên trang chủ để bắt đầu nộp hồ sơ.',
          suggestions: ['Nộp trích lục hộ tịch', 'Nộp hồ sơ trợ cấp thất nghiệp']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-slideLeft">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-amber-300" />
          <h3 className="font-bold text-sm">{aiTitle}</h3>
        </div>
        <button onClick={onClose} className="text-white hover:opacity-80">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shrink-0 mt-1">
                AI
              </div>
            )}
            <div className={`p-3 rounded-2xl max-w-[85%] ${
              m.sender === 'user'
                ? 'bg-red-600 text-white rounded-br-none font-semibold'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
            }`}>
              <p className="leading-relaxed">{m.text}</p>

              {m.suggestions && m.suggestions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-purple-200 dark:border-purple-900/50 space-y-1">
                  <p className="text-[10px] font-bold text-purple-700 dark:text-purple-300">Gợi ý câu hỏi:</p>
                  {m.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sug)}
                      className="block w-full text-left p-1.5 bg-white dark:bg-slate-900 rounded border border-purple-200 dark:border-purple-800 text-[10px] text-purple-900 dark:text-purple-200 font-semibold hover:bg-purple-50"
                    >
                      • {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-purple-600 font-bold text-xs p-2">
            <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
            <span>AI đang phân tích quy trình...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <input
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Nhập câu hỏi về thủ tục..."
          className="flex-1 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none font-medium"
        />
        <button
          onClick={() => handleSend()}
          className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
