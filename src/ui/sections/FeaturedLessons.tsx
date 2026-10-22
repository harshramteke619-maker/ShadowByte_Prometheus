// src/ui/sections/FeaturedLessons.tsx
import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, ChevronRight, Play } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { SEED_LESSONS, Lesson } from '../../data/seedData';

const SUBJECT_COLORS: Record<string, string> = {
  Science:     '#0d9488',
  Mathematics: '#0f4c81',
  Geography:   '#7c3aed',
  Coding:      '#d97706',
};

const DIFF_COLORS: Record<string, string> = {
  Beginner:     '#0d9488',
  Intermediate: '#d97706',
  Advanced:     '#dc2626',
};

const LessonCard: React.FC<{ lesson: Lesson; onSave: (id: string) => void; delay: number }> = ({ lesson, onSave, delay }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`card-lift d-${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'var(--bg-card)', borderRadius:20,
        border:'1px solid var(--border)',
        overflow:'hidden', boxShadow:'var(--shadow-sm)',
        display:'flex', flexDirection:'column',
      }}
      aria-label={`${lesson.title}, ${lesson.subject}, ${lesson.difficulty}, ${lesson.duration}`}
    >
      {/* Subject header bar */}
      <div style={{
        height:5,
        background: SUBJECT_COLORS[lesson.subject] || 'var(--accent-blue)',
      }} />

      <div style={{ padding:'18px 20px 20px', flex:1, display:'flex', flexDirection:'column' }}>
        {/* Meta row */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
          <span style={{
            fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:99,
            background: `${SUBJECT_COLORS[lesson.subject]}18`,
            color: SUBJECT_COLORS[lesson.subject] || 'var(--accent-blue)',
          }}>
            {lesson.subject}
          </span>
          <span style={{
            fontSize:11, fontWeight:600, padding:'3px 8px', borderRadius:99,
            background:'var(--bg-muted)', color: DIFF_COLORS[lesson.difficulty],
          }}>
            {lesson.difficulty}
          </span>
          <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text-muted)', marginLeft:'auto' }}>
            <Clock size={11} /> {lesson.duration}
          </span>
        </div>

        <h3 style={{ fontSize:15, fontWeight:700, color:'var(--text-primary)', marginBottom:8, lineHeight:1.35 }}>
          {lesson.title}
        </h3>
        <p style={{ fontSize:12.5, color:'var(--text-muted)', lineHeight:1.6, marginBottom:16, flex:1 }}>
          {lesson.description}
        </p>

        {/* Progress bar */}
        {lesson.progress > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:600, color:'var(--text-muted)', marginBottom:5 }}>
              <span>Progress</span>
              <span style={{ color:'var(--accent-blue)' }}>{Math.round(lesson.progress * 100)}%</span>
            </div>
            <div style={{ height:5, borderRadius:99, background:'var(--bg-muted)', overflow:'hidden' }}>
              <div
                className="anim-progress"
                style={{
                  height:'100%', borderRadius:99,
                  background:'var(--accent-blue)',
                  width:`${lesson.progress * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Author + Actions */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{
              width:28, height:28, borderRadius:'50%', flexShrink:0,
              background:lesson.author.color, color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:11, fontWeight:700,
            }}>
              {lesson.author.initials}
            </div>
            <span style={{ fontSize:12, color:'var(--text-secondary)', fontWeight:500 }}>{lesson.author.name}</span>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button
              onClick={() => onSave(lesson.id)}
              aria-label={lesson.saved ? 'Unsave lesson' : 'Save lesson'}
              style={{
                width:34, height:34, borderRadius:8, border:'1px solid var(--border)',
                background:lesson.saved ? 'var(--accent-blue-l)' : 'var(--bg-muted)',
                color:lesson.saved ? 'var(--accent-blue)' : 'var(--text-muted)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', transition:'all 0.2s',
              }}
            >
              {lesson.saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
            <button
              aria-label={`Start ${lesson.title}`}
              style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'6px 12px', borderRadius:8,
                background: hovered ? 'var(--accent-blue)' : 'var(--bg-muted)',
                color: hovered ? '#fff' : 'var(--text-secondary)',
                border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
                transition:'all 0.2s',
              }}
            >
              <Play size={13} />
              {lesson.progress > 0 ? 'Continue' : 'Start'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export const FeaturedLessons: React.FC = () => {
  const [lessons, setLessons] = useState(SEED_LESSONS);
  const ref = useReveal();

  const handleSave = (id: string) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, saved: !l.saved } : l));
  };

  return (
    <section ref={ref} className="reveal" aria-labelledby="lessons-heading"
      style={{ padding:'56px 0 0' }}>
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <div>
            <h2 id="lessons-heading" style={{ fontSize:22, fontWeight:700, color:'var(--text-primary)', marginBottom:4 }}>
              Featured lessons
            </h2>
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>
              Curated from the NCERT syllabus · Works offline
            </p>
          </div>
          <button style={{
            display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:600,
            color:'var(--accent-blue)', background:'none', border:'none', cursor:'pointer',
          }}>
            View all <ChevronRight size={15} />
          </button>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill, minmax(270px, 1fr))',
          gap:20,
        }}>
          {lessons.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} onSave={handleSave} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};
