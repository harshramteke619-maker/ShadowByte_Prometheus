// src/ui/sections/TutorChatPreview.tsx
import React from 'react';
import { MessageCircle, ArrowRight, Mic } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { SEED_MESSAGES, SUGGESTED_QUESTIONS } from '../../data/seedData';
import type { AppTab } from '../layout/TopNav';

interface Props { onNav: (t: AppTab) => void; }

export const TutorChatPreview: React.FC<Props> = ({ onNav }) => {
  const ref = useReveal();

  return (
    <section ref={ref} className="reveal" aria-labelledby="chat-preview-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <div style={{
          display:'grid', gridTemplateColumns:'1fr',
          gap:32, alignItems:'center',
        }} className="chat-preview-grid">

          {/* Left: info */}
          <div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              background:'var(--accent-lav-l)', color:'var(--accent-lavender)',
              borderRadius:99, padding:'5px 12px',
              fontSize:11, fontWeight:700, letterSpacing:'0.06em',
              textTransform:'uppercase', marginBottom:16,
            }}>
              <MessageCircle size={12} /> AI Tutor
            </div>
            <h2 id="chat-preview-heading" style={{
              fontSize:22, fontWeight:700, color:'var(--text-primary)',
              marginBottom:12, lineHeight:1.3,
            }}>
              Your personal tutor,<br />always available
            </h2>
            <p style={{ fontSize:14, color:'var(--text-muted)', lineHeight:1.7, marginBottom:24 }}>
              Ask questions in Hindi, Marathi, or English. Get syllabus-grounded answers
              instantly — even without internet.
            </p>

            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                Try asking:
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {SUGGESTED_QUESTIONS.map(q => (
                  <button key={q} style={{
                    padding:'7px 12px', borderRadius:99,
                    border:'1px solid var(--border)',
                    background:'var(--bg-muted)',
                    fontSize:12, color:'var(--text-secondary)',
                    cursor:'pointer', transition:'all 0.2s',
                    fontWeight:500,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-blue-l)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-blue)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-blue)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-muted)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNav('chat')}
              className="btn-press"
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'var(--accent-blue)', color:'#fff',
                border:'none', borderRadius:12, padding:'13px 22px',
                fontSize:14, fontWeight:700, cursor:'pointer',
                boxShadow:'0 4px 16px rgba(15,76,129,0.3)',
              }}
            >
              Open Tutor Chat <ArrowRight size={15} />
            </button>
          </div>

          {/* Right: chat preview */}
          <div style={{
            background:'var(--bg-card)',
            border:'1px solid var(--border)',
            borderRadius:20, overflow:'hidden',
            boxShadow:'var(--shadow-md)',
          }}>
            {/* Chat header */}
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              padding:'14px 18px',
              borderBottom:'1px solid var(--border)',
              background:'var(--bg-muted)',
            }}>
              <div style={{
                width:38, height:38, borderRadius:10,
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0, padding:4,
              }}>
                <img src="/logo.png" alt="Everlearn.ai" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Everlearn.ai Tutor</div>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'var(--accent-teal)' }}>
                  <span className="online-dot" style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--accent-teal)' }} />
                  Online · Answers in your language
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:10, minHeight:220 }}>
              {SEED_MESSAGES.map((msg, i) => (
                <div
                  key={msg.id}
                  className={`anim-msg d-${i + 1}`}
                  style={{
                    display:'flex',
                    justifyContent: msg.sender === 'student' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div style={{
                    maxWidth:'82%', padding:'10px 13px', borderRadius:14,
                    borderBottomLeftRadius: msg.sender === 'tutor' ? 4 : 14,
                    borderBottomRightRadius: msg.sender === 'student' ? 4 : 14,
                    fontSize:13, lineHeight:1.55, fontWeight:400,
                    background: msg.sender === 'student'
                      ? 'var(--accent-blue)'
                      : 'var(--bg-muted)',
                    color: msg.sender === 'student'
                      ? '#fff'
                      : 'var(--text-primary)',
                  }}>
                    {msg.text}
                    <div style={{
                      fontSize:10, marginTop:4, textAlign:'right',
                      opacity:0.6,
                      color: msg.sender === 'student' ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)',
                    }}>{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Fake input */}
            <div style={{
              padding:'10px 14px',
              borderTop:'1px solid var(--border)',
              display:'flex', gap:8, alignItems:'center',
            }}>
              <div style={{
                flex:1, height:38, borderRadius:20,
                background:'var(--bg-muted)',
                border:'1px solid var(--border)',
                display:'flex', alignItems:'center', padding:'0 14px',
                fontSize:12, color:'var(--text-muted)',
              }}>
                Ask anything from your syllabus…
              </div>
              <button aria-label="Voice input" style={{
                width:38, height:38, borderRadius:'50%',
                background:'var(--accent-blue)', color:'#fff', border:'none',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}>
                <Mic size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .chat-preview-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
};
