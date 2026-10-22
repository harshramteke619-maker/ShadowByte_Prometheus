// src/ui/sections/HeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Users, BookOpen, Star } from 'lucide-react';
import type { AppTab } from '../layout/TopNav';

interface HeroProps {
  onNav: (t: AppTab) => void;
}

export const HeroSection: React.FC<HeroProps> = ({ onNav }) => {
  const [loaded, setLoaded] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Subtle parallax
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const onScroll = () => {
      if (!parallaxRef.current) return;
      const y = window.scrollY;
      parallaxRef.current.style.transform = `translateY(${y * 0.22}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      aria-label="Hero: Learn together, go further"
      style={{
        position:'relative', overflow:'hidden',
        minHeight:'min(88vh, 680px)',
        display:'flex', alignItems:'center',
      }}
    >
      {/* Background image with parallax */}
      <div
        ref={parallaxRef}
        style={{
          position:'absolute', inset:'-10% 0', zIndex:0,
          backgroundImage:'url(/images/hero.jpg)',
          backgroundSize:'cover', backgroundPosition:'center 30%',
          transition:'opacity 0.6s ease',
          opacity: loaded ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Fallback while image loads */}
      <div style={{
        position:'absolute', inset:0, zIndex:0,
        background:'linear-gradient(135deg, #0a1428 0%, #0d2040 60%, #0a1a30 100%)',
      }} />

      {/* Hidden img to detect load */}
      <img
        src="/images/hero.jpg"
        alt=""
        style={{ display:'none' }}
        onLoad={() => setLoaded(true)}
      />

      {/* Dark overlay for text readability */}
      <div style={{
        position:'absolute', inset:0, zIndex:1,
        background:'var(--hero-overlay)',
      }} aria-hidden="true" />

      {/* Content */}
      <div className="container" style={{ position:'relative', zIndex:2, paddingBlock:'80px 60px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:40, alignItems:'center' }}
          className="hero-grid">

          {/* Left: text */}
          <div style={{ maxWidth:620 }}>
            <div
              className="anim-slide-down"
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                background:'rgba(255,255,255,0.10)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(255,255,255,0.15)',
                borderRadius:99, padding:'6px 14px',
                marginBottom:24,
              }}
            >
              <Star size={13} fill="var(--accent-amber)" color="var(--accent-amber)" />
              <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.90)' }}>
                100% free · Works without internet
              </span>
            </div>

            <h1
              className="anim-slide-up"
              style={{
                fontSize:'clamp(2rem, 5vw, 3.5rem)', fontWeight:800,
                color:'#ffffff', lineHeight:1.1, letterSpacing:'-0.02em',
                marginBottom:20,
              }}
            >
              Learn together.
              <br />
              <span style={{ color:'var(--accent-amber)', fontStyle:'italic', fontWeight:300 }}>
                Go further.
              </span>
            </h1>

            <p
              className="anim-slide-up d-2"
              style={{
                fontSize:'clamp(1rem, 2vw, 1.125rem)',
                color:'rgba(255,255,255,0.75)', lineHeight:1.7,
                maxWidth:480, marginBottom:36,
              }}
            >
              A calm, offline-first space for students to discover lessons, join study groups,
              get instant AI tutoring — all in their own language.
            </p>

            <div className="anim-slide-up d-3" style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <button
                onClick={() => onNav('lessons')}
                className="btn-press"
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'var(--accent-blue)', color:'#fff',
                  border:'none', borderRadius:12, padding:'14px 24px',
                  fontSize:15, fontWeight:700, cursor:'pointer',
                  boxShadow:'0 4px 20px rgba(15,76,129,0.5)',
                }}
              >
                Explore lessons <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNav('groups')}
                className="btn-press"
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'rgba(255,255,255,0.12)', color:'#fff',
                  border:'1px solid rgba(255,255,255,0.25)',
                  backdropFilter:'blur(8px)',
                  borderRadius:12, padding:'14px 24px',
                  fontSize:15, fontWeight:600, cursor:'pointer',
                }}
              >
                <Users size={16} /> Join a study group
              </button>
            </div>
          </div>

          {/* Right: floating stat card */}
          <div className="anim-fade-in d-4 hero-stat-card" style={{ display:'flex', justifyContent:'flex-end' }}>
            <div
              className="anim-float-y glass"
              style={{
                borderRadius:20, border:'1px solid rgba(255,255,255,0.15)',
                padding:'20px 24px', minWidth:220,
              }}
            >
              <div style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.60)', marginBottom:16, textTransform:'uppercase', letterSpacing:'0.08em' }}>
                Your Progress
              </div>

              {[
                { label:'Lessons done', value:'4', color:'var(--accent-teal)' },
                { label:'Study streak', value:'3 days 🔥', color:'var(--accent-amber)' },
                { label:'XP earned', value:'210', color:'var(--accent-lavender)' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.70)' }}>{label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color }}>{value}</span>
                </div>
              ))}

              <div style={{ height:1, background:'rgba(255,255,255,0.12)', margin:'12px 0' }} />
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{
                  width:8, height:8, borderRadius:'50%',
                  background:'var(--accent-teal)',
                }} className="online-dot" />
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.65)' }}>Offline ready · No internet needed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 767px) {
          .hero-stat-card { display: none !important; }
        }
      `}</style>
    </section>
  );
};
