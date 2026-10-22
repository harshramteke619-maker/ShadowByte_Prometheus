// src/ui/sections/PeerActivity.tsx
import React from 'react';
import { useReveal } from '../../hooks/useReveal';
import { PEER_ACTIVITY } from '../../data/seedData';

export const PeerActivity: React.FC = () => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" aria-labelledby="peers-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <h2 id="peers-heading" style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', marginBottom:8 }}>
          What others are doing
        </h2>
        <p style={{ fontSize:13, color:'var(--text-muted)', marginBottom:24 }}>
          Stay motivated with real peer activity
        </p>
        <div style={{
          background:'var(--bg-card)', borderRadius:20,
          border:'1px solid var(--border)', boxShadow:'var(--shadow-sm)',
          overflow:'hidden',
        }}>
          {PEER_ACTIVITY.map(({ name, action, initials, color, time }, i) => (
            <div
              key={i}
              className={`d-${i + 1}`}
              style={{
                display:'flex', alignItems:'center', gap:14, padding:'14px 20px',
                borderBottom: i < PEER_ACTIVITY.length - 1 ? '1px solid var(--border)' : 'none',
                transition:'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-muted)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width:36, height:36, borderRadius:'50%', flexShrink:0,
                background:color, color:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:700,
              }}>{initials}</div>
              <div style={{ flex:1 }}>
                <span style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{name}</span>
                {' '}
                <span style={{ fontSize:13, color:'var(--text-muted)' }}>{action}</span>
              </div>
              <span style={{ fontSize:11, color:'var(--text-muted)', flexShrink:0 }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
