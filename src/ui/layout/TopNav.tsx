// src/ui/layout/TopNav.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Bell, User, Moon, Sun, Menu, X, Wifi, WifiOff,
  GraduationCap, Users, MessageCircle, BarChart2, ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePWAStatus } from '../../pwa/usePWAStatus';
import { i18n } from '../../api';

export type AppTab = 'home' | 'lessons' | 'groups' | 'chat' | 'progress' | 'share' | 'setup';

interface TopNavProps {
  current: AppTab;
  onNav: (t: AppTab) => void;
}

const NAV_LINKS: { tab: AppTab; label: string; icon: React.ReactNode }[] = [
  { tab: 'lessons',  label: 'Explore Lessons', icon: <GraduationCap className="w-4 h-4" /> },
  { tab: 'groups',   label: 'Study Groups',    icon: <Users className="w-4 h-4" /> },
  { tab: 'chat',     label: 'Tutor Chat',      icon: <MessageCircle className="w-4 h-4" /> },
  { tab: 'progress', label: 'Progress',        icon: <BarChart2 className="w-4 h-4" /> },
];

export const TopNav: React.FC<TopNavProps> = ({ current, onNav }) => {
  const { resolved, toggle } = useTheme();
  const { isOnline } = usePWAStatus();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = useCallback((tab: AppTab) => {
    onNav(tab);
    setMenuOpen(false);
    setProfileOpen(false);
  }, [onNav]);

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="anim-slide-down"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--nav-border)' : '1px solid transparent',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div className="container">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>

          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            style={{ display:'flex', alignItems:'center', gap:10, background:'none', border:'none', cursor:'pointer' }}
            aria-label="Everlearn.ai home"
          >
            <img
              src="/logo.png"
              alt="Everlearn.ai Logo"
              style={{
                height: 34,
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:17, fontWeight:800, color:'var(--text-primary)', lineHeight:1.1, letterSpacing:'-0.01em' }}>
                Everlearn<span style={{ color:'var(--accent-teal)' }}>.ai</span>
              </div>
              <div style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase', marginTop:2 }}>
                Offline · Free
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <div
            style={{ display:'flex', alignItems:'center', gap:4 }}
            className="desktop-nav"
          >
            {NAV_LINKS.map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => handleNav(tab)}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  padding:'8px 14px', borderRadius:10,
                  border:'none', cursor:'pointer', fontSize:14, fontWeight:500,
                  background: current === tab ? 'var(--accent-blue-l)' : 'transparent',
                  color: current === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  transition:'all 0.2s ease',
                }}
                onMouseEnter={e => { if (current !== tab) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-muted)'; }}
                onMouseLeave={e => { if (current !== tab) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {/* Online badge */}
            <div
              aria-live="polite"
              style={{
                display:'flex', alignItems:'center', gap:5,
                padding:'4px 10px', borderRadius:99,
                fontSize:11, fontWeight:600,
                background: isOnline ? 'var(--accent-teal-l)' : 'var(--accent-amber-l)',
                color: isOnline ? 'var(--accent-teal)' : 'var(--accent-amber)',
                border: `1px solid ${isOnline ? 'var(--accent-teal)' : 'var(--accent-amber)'}`,
                opacity:0.9,
              }}
              className="desktop-only"
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Online' : 'Offline'}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
              style={{
                width:40, height:40, borderRadius:10, border:'1px solid var(--border)',
                background:'var(--bg-card)', color:'var(--text-secondary)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', transition:'all 0.2s ease',
              }}
            >
              {resolved === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications (3 unread)"
              style={{
                width:40, height:40, borderRadius:10, border:'1px solid var(--border)',
                background:'var(--bg-card)', color:'var(--text-secondary)',
                display:'flex', alignItems:'center', justifyContent:'center',
                cursor:'pointer', position:'relative', transition:'all 0.2s ease',
              }}
              className="desktop-only"
            >
              <Bell size={17} />
              <span style={{
                position:'absolute', top:8, right:8, width:8, height:8,
                background:'var(--accent-amber)', borderRadius:'50%',
                border:'2px solid var(--bg-card)',
              }} />
            </button>

            {/* Profile menu */}
            <div style={{ position:'relative' }} className="desktop-only">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="Profile menu"
                aria-expanded={profileOpen}
                style={{
                  display:'flex', alignItems:'center', gap:7,
                  padding:'6px 10px 6px 6px', borderRadius:10,
                  border:'1px solid var(--border)', background:'var(--bg-card)',
                  cursor:'pointer', transition:'all 0.2s ease',
                }}
              >
                <div style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'var(--accent-blue)', color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, fontWeight:700,
                }}>R</div>
                <span style={{ fontSize:13, fontWeight:600, color:'var(--text-primary)' }}>Rutuja</span>
                <ChevronDown size={14} style={{ color:'var(--text-muted)', transform: profileOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
              </button>
              {profileOpen && (
                <div
                  className="anim-scale-in"
                  style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0,
                    background:'var(--bg-card)', border:'1px solid var(--border)',
                    borderRadius:12, boxShadow:'var(--shadow-lg)',
                    minWidth:180, zIndex:100, overflow:'hidden',
                  }}
                >
                  {['My Profile', 'Saved Lessons', 'Settings', 'Sign out'].map(item => (
                    <button
                      key={item}
                      style={{
                        display:'block', width:'100%', textAlign:'left',
                        padding:'10px 16px', fontSize:14, fontWeight:500,
                        color:'var(--text-secondary)', background:'none',
                        border:'none', cursor:'pointer', transition:'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-muted)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                width:40, height:40, borderRadius:10, border:'1px solid var(--border)',
                background:'var(--bg-card)', color:'var(--text-secondary)',
                display:'none', alignItems:'center', justifyContent:'center',
                cursor:'pointer',
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="anim-slide-down"
          style={{
            background:'var(--bg-card)', borderTop:'1px solid var(--border)',
            padding:'8px 16px 16px',
          }}
        >
          {NAV_LINKS.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => handleNav(tab)}
              style={{
                display:'flex', alignItems:'center', gap:10, width:'100%',
                padding:'12px 14px', borderRadius:10, border:'none',
                background: current === tab ? 'var(--accent-blue-l)' : 'transparent',
                color: current === tab ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontSize:14, fontWeight:500, cursor:'pointer',
                marginBottom:2, textAlign:'left',
              }}
            >
              {icon} {label}
            </button>
          ))}
          <div style={{ height:1, background:'var(--border)', margin:'12px 0' }} />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={toggle} style={{
              display:'flex', alignItems:'center', gap:8, padding:'10px 14px',
              borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-muted)',
              color:'var(--text-secondary)', fontSize:13, fontWeight:500, cursor:'pointer', flex:1,
            }}>
              {resolved === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              {resolved === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              padding:'10px 14px', borderRadius:10,
              background: isOnline ? 'var(--accent-teal-l)' : 'var(--accent-amber-l)',
              color: isOnline ? 'var(--accent-teal)' : 'var(--accent-amber)',
              fontSize:12, fontWeight:600,
            }}>
              {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-only { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};
