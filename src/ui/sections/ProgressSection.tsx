// src/ui/sections/ProgressSection.tsx
import React from 'react';
import { useReveal } from '../../hooks/useReveal';

const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R;

const RingProgress: React.FC<{ value: number; label: string; color: string; size?: number }> = ({
  value, label, color, size = 110,
}) => {
  const offset = RING_C * (1 - value);
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
      <div style={{ position:'relative', width:size, height:size }}>
        <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${label}: ${Math.round(value * 100)}%`}>
          <circle className="ring-track" cx="50" cy="50" r={RING_R} />
          <circle
            className="ring-fill anim-ring"
            cx="50" cy="50" r={RING_R}
            stroke={color}
            strokeDasharray={RING_C}
            strokeDashoffset={offset}
            style={{ '--circ': RING_C } as React.CSSProperties}
          />
        </svg>
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        }}>
          <span style={{ fontSize:18, fontWeight:800, color:'var(--text-primary)' }}>
            {Math.round(value * 100)}%
          </span>
        </div>
      </div>
      <span style={{ fontSize:12, fontWeight:600, color:'var(--text-muted)', textAlign:'center' }}>{label}</span>
    </div>
  );
};

const BAR_DAYS = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 0.5 },
  { day: 'Thu', hours: 1.8 },
  { day: 'Fri', hours: 2.5 },
  { day: 'Sat', hours: 1.2 },
  { day: 'Sun', hours: 0, isToday: true },
];
const MAX_H = Math.max(...BAR_DAYS.map(d => d.hours), 1);

export const ProgressSection: React.FC = () => {
  const ref = useReveal();
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;

  return (
    <section ref={ref} className="reveal" aria-labelledby="progress-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <h2 id="progress-heading" style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', marginBottom:28 }}>
          Your progress this week
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:20 }} className="progress-grid">
          {/* Stat tiles */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:14 }}>
            {[
              { label:'Hours studied', value:'9.5h', bg:'var(--accent-blue-l)', color:'var(--accent-blue)' },
              { label:'Lessons done', value:'4',    bg:'var(--accent-teal-l)', color:'var(--accent-teal)' },
              { label:'Day streak',   value:'🔥 3', bg:'var(--accent-amber-l)', color:'var(--accent-amber)' },
              { label:'XP earned',    value:'210',  bg:'var(--accent-lav-l)', color:'var(--accent-lavender)' },
            ].map(({ label, value, bg, color }, i) => (
              <div key={label} className={`d-${i + 1}`} style={{
                background:'var(--bg-card)', borderRadius:16, border:'1px solid var(--border)',
                padding:'16px 18px', boxShadow:'var(--shadow-sm)',
              }}>
                <div style={{ fontSize:22, fontWeight:800, color, marginBottom:4 }}>{value}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</div>
                <div style={{ height:3, borderRadius:99, background:bg, marginTop:10 }} />
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div style={{
            background:'var(--bg-card)', borderRadius:20,
            border:'1px solid var(--border)', padding:'20px 22px',
            boxShadow:'var(--shadow-sm)',
          }}>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text-muted)', marginBottom:18 }}>Daily study hours</div>
            <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:100 }}>
              {BAR_DAYS.map(({ day, hours }, i) => {
                const pct = (hours / MAX_H) * 100;
                const isToday = i === todayIdx;
                return (
                  <div key={day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%' }}>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end' }}>
                      <div
                        className="anim-progress"
                        title={`${day}: ${hours}h`}
                        style={{
                          width:'100%',
                          height:`${Math.max(pct, hours > 0 ? 5 : 2)}%`,
                          borderRadius:'6px 6px 0 0',
                          background: isToday
                            ? 'var(--accent-blue)'
                            : hours === 0
                            ? 'var(--border)'
                            : 'var(--accent-blue-l)',
                          animationDelay:`${i * 80}ms`,
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize:10, fontWeight: isToday ? 700 : 500,
                      color: isToday ? 'var(--accent-blue)' : 'var(--text-muted)',
                    }}>{day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress rings */}
          <div style={{
            background:'var(--bg-card)', borderRadius:20,
            border:'1px solid var(--border)', padding:'20px 22px',
            boxShadow:'var(--shadow-sm)',
            display:'flex', alignItems:'center', justifyContent:'space-around',
            flexWrap:'wrap', gap:20,
          }}>
            <RingProgress value={0.65} label="Science mastery"    color="var(--accent-teal)" />
            <RingProgress value={0.40} label="Math mastery"       color="var(--accent-blue)" />
            <RingProgress value={0.80} label="Reading mastery"    color="var(--accent-lavender)" />
            <RingProgress value={0.72} label="Weekly goal"        color="var(--accent-amber)" />
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .progress-grid { grid-template-columns: 1fr 1fr !important; grid-template-rows: auto auto; }
          .progress-grid > *:first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </section>
  );
};
