// src/ui/layout/BottomNav.tsx
import React from 'react';
import { Home, GraduationCap, Users, MessageCircle, BarChart2 } from 'lucide-react';
import type { AppTab } from './TopNav';

interface BottomNavProps {
  current: AppTab;
  onNav: (t: AppTab) => void;
}

const TABS: { tab: AppTab; icon: React.ReactNode; label: string }[] = [
  { tab: 'home',     icon: <Home size={20} />,          label: 'Home' },
  { tab: 'lessons',  icon: <GraduationCap size={20} />, label: 'Lessons' },
  { tab: 'groups',   icon: <Users size={20} />,         label: 'Groups' },
  { tab: 'chat',     icon: <MessageCircle size={20} />, label: 'Chat' },
  { tab: 'progress', icon: <BarChart2 size={20} />,     label: 'Progress' },
];

export const BottomNav: React.FC<BottomNavProps> = ({ current, onNav }) => (
  <nav
    role="navigation"
    aria-label="Mobile navigation"
    style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:50,
      background:'var(--bg-card)',
      borderTop:'1px solid var(--border)',
      display:'flex', justifyContent:'space-around', alignItems:'center',
      paddingBottom:'max(8px, env(safe-area-inset-bottom))',
    }}
    className="mobile-bottom-nav"
  >
    {TABS.map(({ tab, icon, label }) => {
      const active = current === tab;
      return (
        <button
          key={tab}
          onClick={() => onNav(tab)}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
          style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            gap:3, padding:'10px 0 6px', border:'none', background:'none',
            color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
            cursor:'pointer', transition:'color 0.2s ease', minHeight:56,
          }}
        >
          <span style={{ transform: active ? 'scale(1.1)' : 'scale(1)', transition:'transform 0.2s ease' }}>
            {icon}
          </span>
          <span style={{ fontSize:10, fontWeight: active ? 700 : 500, letterSpacing:'0.02em' }}>{label}</span>
          {active && (
            <span style={{
              width:20, height:2.5, background:'var(--accent-blue)',
              borderRadius:99, position:'absolute', bottom:0, left:'50%',
              transform:'translateX(-50%)',
            }} />
          )}
        </button>
      );
    })}
    <style>{`
      @media (min-width: 768px) { .mobile-bottom-nav { display: none !important; } }
    `}</style>
  </nav>
);
