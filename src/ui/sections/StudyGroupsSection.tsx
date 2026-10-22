// src/ui/sections/StudyGroupsSection.tsx
import React, { useState } from 'react';
import { Users, ChevronRight, Check } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { SEED_GROUPS, StudyGroup } from '../../data/seedData';

const GroupCard: React.FC<{ group: StudyGroup; delay: number }> = ({ group, delay }) => {
  const [joined, setJoined] = useState(false);

  return (
    <article
      className={`card-lift d-${delay}`}
      style={{
        background:'var(--bg-card)', borderRadius:20,
        border:'1px solid var(--border)',
        padding:'20px 22px', boxShadow:'var(--shadow-sm)',
        display:'flex', flexDirection:'column', gap:14,
      }}
      aria-label={`${group.name} study group, ${group.memberCount} members`}
    >
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)' }}>{group.name}</h3>
            {group.isActive && (
              <span style={{
                display:'flex', alignItems:'center', gap:4,
                fontSize:10, fontWeight:700, color:'var(--accent-teal)',
                background:'var(--accent-teal-l)', padding:'2px 8px', borderRadius:99,
              }}>
                <span className="online-dot" style={{ display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--accent-teal)' }} />
                Active
              </span>
            )}
          </div>
          <p style={{ fontSize:12, color:'var(--text-muted)' }}>{group.topic}</p>
        </div>
        <div style={{
          display:'flex', alignItems:'center', gap:4,
          fontSize:12, fontWeight:600, color:'var(--text-muted)',
          background:'var(--bg-muted)', padding:'4px 10px', borderRadius:99, flexShrink:0,
        }}>
          <Users size={12} /> {group.memberCount}
        </div>
      </div>

      {/* Member avatars */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ display:'flex' }}>
          {group.members.map((m, i) => (
            <div
              key={i}
              title={m.initials}
              style={{
                width:28, height:28, borderRadius:'50%',
                background:m.color, color:'#fff',
                fontSize:10, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center',
                border:'2px solid var(--bg-card)',
                marginLeft: i === 0 ? 0 : -8,
              }}
            >
              {m.initials}
            </div>
          ))}
          {group.memberCount > group.members.length && (
            <div style={{
              width:28, height:28, borderRadius:'50%',
              background:'var(--bg-muted)', color:'var(--text-muted)',
              fontSize:10, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'2px solid var(--bg-card)', marginLeft:-8,
            }}>
              +{group.memberCount - group.members.length}
            </div>
          )}
        </div>
        <p style={{ fontSize:12, color:'var(--text-muted)', flex:1 }}>
          {group.activity}
        </p>
      </div>

      {/* Join button */}
      <button
        onClick={() => setJoined(!joined)}
        disabled={!group.joinable}
        aria-label={joined ? `Leave ${group.name}` : `Join ${group.name}`}
        style={{
          display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          padding:'10px', borderRadius:10, border:'none', cursor: group.joinable ? 'pointer' : 'not-allowed',
          fontSize:13, fontWeight:700,
          background: joined
            ? 'var(--accent-teal-l)'
            : group.joinable
            ? 'var(--accent-blue)'
            : 'var(--bg-muted)',
          color: joined
            ? 'var(--accent-teal)'
            : group.joinable
            ? '#fff'
            : 'var(--text-muted)',
          transition:'all 0.2s ease',
        }}
      >
        {joined ? <><Check size={14} /> Joined</> : group.joinable ? 'Join group' : 'Full'}
      </button>
    </article>
  );
};

export const StudyGroupsSection: React.FC = () => {
  const ref = useReveal();
  return (
    <section ref={ref} className="reveal" aria-labelledby="groups-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h2 id="groups-heading" style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>
              Study with people like you
            </h2>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>
              Join a peer group · Study together · Share knowledge
            </p>
          </div>
          <button style={{
            display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:600,
            color:'var(--accent-blue)', background:'none', border:'none', cursor:'pointer',
          }}>
            Browse all <ChevronRight size={15} />
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
          {SEED_GROUPS.map((g, i) => <GroupCard key={g.id} group={g} delay={i + 1} />)}
        </div>
      </div>
    </section>
  );
};
