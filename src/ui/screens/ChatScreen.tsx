// src/ui/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { brain, i18n, TutorAnswer, Lang } from '../../api';
import { MicButton } from '../components/MicButton';
import { AnswerCard } from '../components/AnswerCard';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  answerMeta?: TutorAnswer;
}

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'tutor',
      text:
        i18n.getLang() === 'hi'
          ? 'नमस्ते! मैं आपका ऑफलाइन एआई शिक्षक हूँ। आप बोलकर या लिखकर कोई भी प्रश्न पूछ सकते हैं।'
          : i18n.getLang() === 'mr'
          ? 'नमस्कार! मी तुमचा ऑफलाइन एआय शिक्षक आहे. तुम्ही बोलून किंवा लिहून कोणताही प्रश्न विचारू शकता.'
          : 'Hello! I am your offline AI tutor. Ask me any question from your syllabus by voice or text.',
      answerMeta: {
        text: '',
        source: 'curated',
        ms: 10,
      },
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLang, setCurrentLang] = useState<Lang>(i18n.getLang());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Call brain.initBrain on open (lazy initialization)
    brain.initBrain().catch(() => {});

    const unsub = i18n.onLangChange((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSubmitting]);

  const handleSend = async (questionToSend?: string) => {
    const q = (questionToSend || inputText).trim();
    if (!q || isSubmitting) return;

    setInputText('');
    const userMsgId = `usr-${Date.now()}`;
    const tutorMsgId = `tut-${Date.now()}`;

    // Add user message
    setMessages((prev) => [...prev, { id: userMsgId, sender: 'user', text: q }]);
    setIsSubmitting(true);

    // Placeholder for streaming tutor message
    setMessages((prev) => [
      ...prev,
      {
        id: tutorMsgId,
        sender: 'tutor',
        text: 'Thinking...',
      },
    ]);

    try {
      const answer = await brain.askTutor(q, currentLang, (streamingToken) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === tutorMsgId ? { ...m, text: streamingToken } : m))
        );
      });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === tutorMsgId ? { ...m, text: answer.text, answerMeta: answer } : m
        )
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tutorMsgId
            ? {
                ...m,
                text: 'Sorry, I could not process that question offline.',
                answerMeta: { text: '', source: 'fallback', ms: 50 },
              }
            : m
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    // Populate into editable transcript input so user can inspect and edit!
    setInputText(transcript);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-lg mx-auto">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'user' ? (
              <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 max-w-[85%] text-sm font-medium shadow-xs">
                {msg.text}
              </div>
            ) : msg.answerMeta ? (
              <div className="w-full">
                <AnswerCard answer={{ ...msg.answerMeta, text: msg.text }} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-sm text-slate-700 shadow-xs animate-pulse">
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box + Voice Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          {/* Mic Button for voice */}
          <MicButton onTranscript={handleVoiceTranscript} disabled={isSubmitting} />

          {/* Editable Transcript Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={i18n.t('askPlaceholder')}
            disabled={isSubmitting}
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-3 rounded-2xl font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
