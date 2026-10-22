// src/ui/screens/ChatScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Info } from 'lucide-react';
import { brain, voice, i18n, TutorAnswer, Lang } from '../../api';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  answerMeta?: TutorAnswer;
  streaming?: boolean;
}

const SOURCE_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  curated:  { bg: 'var(--accent-teal-l)',   color: 'var(--accent-teal)',     label: '📚 Syllabus' },
  slm:      { bg: 'var(--accent-lav-l)',    color: 'var(--accent-lavender)', label: '⚡ On-device AI' },
  fallback: { bg: 'var(--bg-muted)',         color: 'var(--text-muted)',     label: '💡 General' },
};

const LANG_LABELS: Record<Lang, string> = { en: 'EN', hi: 'हिंदी', mr: 'मराठी' };

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>(i18n.getLang());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    brain.initBrain().catch(() => {});
    const unsub = i18n.onLangChange((l) => setLang(l));

    // Initial greeting
    setMessages([{
      id: 'init',
      sender: 'tutor',
      text: lang === 'hi'
        ? 'नमस्ते! मैं आपका AI शिक्षक हूँ। कोई भी प्रश्न पूछें।'
        : lang === 'mr'
        ? 'नमस्कार! मी तुमचा AI शिक्षक आहे. कोणताही प्रश्न विचारा.'
        : 'Hello! I\'m your offline AI tutor. Ask me anything from your syllabus.',
      answerMeta: { text: '', source: 'curated', ms: 0 },
    }]);

    return () => unsub();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (question: string) => {
    const q = question.trim();
    if (!q || isSending) return;
    setInput('');
    setIsSending(true);

    const userId = `u-${Date.now()}`;
    const tutorId = `t-${Date.now()}`;

    setMessages(prev => [
      ...prev,
      { id: userId, sender: 'user', text: q },
      { id: tutorId, sender: 'tutor', text: '', streaming: true },
    ]);

    try {
      const answer = await brain.askTutor(q, lang, (token) => {
        setMessages(prev => prev.map(m => m.id === tutorId ? { ...m, text: token } : m));
      });
      setMessages(prev => prev.map(m =>
        m.id === tutorId
          ? { ...m, text: answer.text, answerMeta: answer, streaming: false }
          : m
      ));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === tutorId
          ? { ...m, text: 'Could not get an answer right now.', answerMeta: { text: '', source: 'fallback', ms: 0 }, streaming: false }
          : m
      ));
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleVoice = async () => {
    if (isListening) { voice.stopListening(); setIsListening(false); return; }
    setIsListening(true);
    try {
      const text = await voice.listen(lang);
      setIsListening(false);
      if (text.trim()) setInput(text.trim());
    } catch {
      setIsListening(false);
    }
  };

  const handleSpeak = (msg: Message) => {
    if (speakingId === msg.id) { voice.stopSpeaking(); setSpeakingId(null); return; }
    voice.speak(msg.text, lang);
    setSpeakingId(msg.id);
    const ms = Math.max(2000, (msg.text.length / 10) * 1000);
    setTimeout(() => setSpeakingId(null), ms);
  };

  const cycleLang = () => {
    const langs: Lang[] = ['en', 'hi', 'mr'];
    i18n.setLang(langs[(langs.indexOf(lang) + 1) % langs.length]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)', minHeight: 500 }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg-card)', borderRadius: '16px 16px 0 0',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-muted)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 4, flexShrink: 0,
          }}>
            <img src="/logo.png" alt="Everlearn.ai" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Everlearn.ai Tutor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--accent-teal)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-teal)', display: 'inline-block' }} />
              {lang === 'hi' ? 'तैयार है' : lang === 'mr' ? 'तयार आहे' : 'Ready · Fully offline'}
            </div>
          </div>
        </div>
        <button
          onClick={cycleLang}
          style={{
            padding: '5px 12px', borderRadius: 99, border: '1px solid var(--border)',
            background: 'var(--bg-muted)', color: 'var(--text-secondary)',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}
          aria-label={`Current language ${lang}. Click to switch.`}
        >
          {LANG_LABELS[lang]}
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '16px 20px',
        display: 'flex', flexDirection: 'column', gap: 12,
        background: 'var(--bg-base)',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="anim-msg"
            style={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}
          >
            {msg.sender === 'tutor' ? (
              <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Source badge */}
                {msg.answerMeta && msg.answerMeta.source && !msg.streaming && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                      background: SOURCE_STYLES[msg.answerMeta.source]?.bg,
                      color: SOURCE_STYLES[msg.answerMeta.source]?.color,
                    }}>
                      {SOURCE_STYLES[msg.answerMeta.source]?.label}
                    </span>
                    {msg.answerMeta.ms > 0 && (
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{msg.answerMeta.ms}ms</span>
                    )}
                  </div>
                )}
                <div style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: '14px 14px 14px 4px',
                  padding: '12px 14px', fontSize: 13.5, lineHeight: 1.65,
                  color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)',
                  minHeight: msg.streaming && !msg.text ? 36 : undefined,
                }}>
                  {msg.streaming && !msg.text ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--text-muted)',
                          animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  ) : msg.text}
                </div>
                {/* Speak button */}
                {!msg.streaming && msg.text && (
                  <button
                    onClick={() => handleSpeak(msg)}
                    style={{
                      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 99, border: '1px solid var(--border)',
                      background: speakingId === msg.id ? 'var(--accent-blue-l)' : 'transparent',
                      color: speakingId === msg.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                      fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    aria-label={speakingId === msg.id ? 'Stop audio' : 'Listen'}
                  >
                    {speakingId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                    {speakingId === msg.id
                      ? (lang === 'hi' ? 'रोकें' : lang === 'mr' ? 'थांबा' : 'Stop')
                      : (lang === 'hi' ? 'सुनें' : lang === 'mr' ? 'ऐका' : 'Listen')}
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                maxWidth: '78%', background: 'var(--accent-blue)', color: '#fff',
                borderRadius: '14px 14px 4px 14px',
                padding: '11px 14px', fontSize: 13.5, lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(15,76,129,0.25)',
              }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-card)', borderRadius: '0 0 16px 16px',
        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        {/* Mic */}
        <button
          onClick={handleVoice}
          disabled={isSending}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: isListening ? 'var(--accent-blue)' : 'var(--bg-muted)',
            color: isListening ? '#fff' : 'var(--text-muted)',
            border: `1px solid ${isListening ? 'var(--accent-blue)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: isListening ? '0 0 0 3px rgba(15,76,129,0.2)' : 'none',
          }}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
          placeholder={
            isListening
              ? (lang === 'hi' ? 'सुन रहे हैं...' : lang === 'mr' ? 'ऐकत आहे...' : 'Listening...')
              : (lang === 'hi' ? 'अपना प्रश्न पूछें...' : lang === 'mr' ? 'प्रश्न विचारा...' : 'Ask anything from your syllabus...')
          }
          disabled={isSending || isListening}
          aria-label="Type your question"
          style={{
            flex: 1, height: 44, borderRadius: 12, padding: '0 14px',
            border: '1px solid var(--border)', background: 'var(--bg-muted)',
            color: 'var(--text-primary)', fontSize: 13.5, outline: 'none',
            transition: 'border-color 0.2s',
            fontFamily: 'inherit',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        />

        {/* Send */}
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isSending}
          aria-label="Send message"
          style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: input.trim() && !isSending ? 'var(--accent-blue)' : 'var(--bg-muted)',
            color: input.trim() && !isSending ? '#fff' : 'var(--text-muted)',
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() && !isSending ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {isSending ? <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={17} />}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
