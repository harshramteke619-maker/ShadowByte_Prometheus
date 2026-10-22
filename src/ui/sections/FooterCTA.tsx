// src/ui/sections/FooterCTA.tsx
import React from 'react';
import { ArrowRight, Wifi, WifiOff } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { usePWAStatus } from '../../pwa/usePWAStatus';
import type { AppTab } from '../layout/TopNav';

interface Props { onNav: (t: AppTab) => void; }

export const FooterCTA: React.FC<Props> = ({ onNav }) => {
  const ref = useReveal();
  const { isOnline } = usePWAStatus();
  const year = new Date().getFullYear();

  return (
    <>
      {/* CTA Banner */}
      <section ref={ref} className="reveal" style={{ padding:'56px 0 0' }}>
        <div className="container">
          <div style={{
            background:'linear-gradient(135deg, var(--accent-blue) 0%, #0d2a5c 100%)',
            borderRadius:24, padding:'clamp(32px, 6vw, 56px)',
            textAlign:'center', position:'relative', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', top:-40, right:-40, width:180, height:180,
              borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none',
            }} />
            <div style={{
              position:'absolute', bottom:-30, left:-30, width:130, height:130,
              borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none',
            }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <h2 style={{
                fontSize:'clamp(1.5rem, 4vw, 2.25rem)', fontWeight:800,
                color:'#fff', lineHeight:1.2, marginBottom:14,
              }}>
                Ready to start learning?
              </h2>
              <p style={{ fontSize:15, color:'rgba(255,255,255,0.75)', marginBottom:28, maxWidth:420, margin:'0 auto 28px' }}>
                Explore lessons, join study groups, and get tutor help — all from your phone, with no internet required.
              </p>
              <button
                onClick={() => onNav('lessons')}
                className="btn-press"
                style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'#fff', color:'var(--accent-blue)',
                  border:'none', borderRadius:12, padding:'14px 28px',
                  fontSize:15, fontWeight:700, cursor:'pointer',
                  boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
                }}
              >
                Explore lessons <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer role="contentinfo" style={{ padding:'48px 0 80px', marginTop:48 }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:32, marginBottom:40 }}
            className="footer-grid">
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'var(--text-primary)', marginBottom:8 }}>StudySpace</div>
              <p style={{ fontSize:12.5, color:'var(--text-muted)', lineHeight:1.7, maxWidth:200 }}>
                Free offline learning for every student, in their own language.
              </p>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:6,
                marginTop:14, padding:'5px 10px', borderRadius:99,
                background: isOnline ? 'var(--accent-teal-l)' : 'var(--accent-amber-l)',
                color: isOnline ? 'var(--accent-teal)' : 'var(--accent-amber)',
                fontSize:11, fontWeight:600,
              }}>
                {isOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
                {isOnline ? 'Online' : 'Offline — cached and ready'}
              </div>
            </div>

            {[
              { heading:'Learn', links:['Explore Lessons', 'Study Groups', 'Tutor Chat', 'Progress'] },
              { heading:'App',   links:['Offline Setup', 'Share Lessons', 'Language Settings', 'About'] },
              { heading:'Help',  links:['How it works', 'Accessibility', 'Privacy', 'Contact'] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <div style={{ fontSize:11, fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>
                  {heading}
                </div>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                  {links.map(l => (
                    <li key={l}>
                      <a href="#" style={{ fontSize:13, color:'var(--text-muted)', textDecoration:'none', transition:'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-blue)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            height:1, background:'var(--border)', marginBottom:20,
          }} />
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <p style={{ fontSize:12, color:'var(--text-muted)' }}>
              © {year} StudySpace · Offline-first · No tracking · Built for students
            </p>
            <p style={{ fontSize:12, color:'var(--text-muted)' }}>
              PWA v1.0 · NCERT-aligned content
            </p>
          </div>
        </div>

        <style>{`
          @media (max-width: 767px) {
            .footer-grid { grid-template-columns: 1fr 1fr !important; }
          }
        `}</style>
      </footer>
    </>
  );
};
