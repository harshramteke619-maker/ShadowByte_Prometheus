// src/ui/sections/QuickActions.tsx
import React from 'react';
import { Play, Users, MessageCircle, Bookmark, ArrowRight } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import type { AppTab } from '../layout/TopNav';

interface QuickActionsProps { onNav: (t: AppTab) => void; }

const ACTIONS = [
  {
    icon: <Play size={22} />,
    title: 'Continue learning',
    desc: 'Pick up where you left off in Photosynthesis',
    tab: 'lessons' as AppTab,
    accentBg: 'var(--accent-blue-l)',
    accentColor: 'var(--accent-blue)',
  },
  {
    icon: <Users size={22} />,
    title: 'Find a study group',
    desc: 'Science Squad is active right now',
    tab: 'groups' as AppTab,
    accentBg: 'var(--accent-teal-l)',
    accentColor: 'var(--accent-teal)',
  },
  {
    icon: <MessageCircle size={22} />,
    title: 'Ask a tutor',
    desc: 'Get instant answers in your language',
    tab: 'chat' as AppTab,
    accentBg: 'var(--accent-lav-l)',
    accentColor: 'var(--accent-lavender)',
  },
  {
    icon: <Bookmark size={22} />,
    title: 'Saved lessons',
    desc: '3 lessons saved for offline study',
    tab: 'lessons' as AppTab,
    accentBg: 'var(--accent-amber-l)',
    accentColor: 'var(--accent-amber)',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({ onNav }) => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" aria-labelledby="quick-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <h2 id="quick-heading" style={{
          fontSize:20, fontWeight:700, color:'var(--text-primary)',
          marginBottom:24,
        }}>
          Quick actions
        </h2>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
          gap:16,
        }}>
          {ACTIONS.map(({ icon, title, desc, tab, accentBg, accentColor }, i) => (
            <button
              key={title}
              onClick={() => onNav(tab)}
              className={`card-lift d-${i + 1}`}
              aria-label={title}
              style={{
                display:'flex', flexDirection:'column', alignItems:'flex-start',
                padding:'20px 20px 18px', borderRadius:16,
                background:'var(--bg-card)',
                border:'1px solid var(--border)',
                cursor:'pointer', textAlign:'left',
                transition:'all 0.25s ease',
                boxShadow:'var(--shadow-sm)',
              }}
            >
              <div style={{
                width:44, height:44, borderRadius:12, background:accentBg,
                color:accentColor, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:14, flexShrink:0,
              }}>
                {icon}
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>{title}</div>
              <div style={{ fontSize:12, color:'var(--text-muted)', lineHeight:1.5, marginBottom:16, flex:1 }}>{desc}</div>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, fontWeight:600, color:accentColor }}>
                Open <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
