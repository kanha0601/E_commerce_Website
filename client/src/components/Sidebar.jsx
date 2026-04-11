import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

  /* ── ROOT ── */
  .sb-root {
    font-family: 'Space Grotesk', sans-serif;
    width: 240px;
    min-width: 240px;
    height: 100vh;
    background: #070b14;
    border-right: 1px solid rgba(56,139,253,.18);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    overflow: hidden;
    flex-shrink: 0;
  }

  /* scanline texture */
  .sb-root::after {
    content: '';
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(56,139,253,.012) 2px,
      rgba(56,139,253,.012) 4px
    );
    pointer-events: none; z-index: 0;
  }

  /* corner brackets */
  .sb-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 16px; height: 16px;
    border-top: 1px solid rgba(56,139,253,.5);
    border-left: 1px solid rgba(56,139,253,.5);
    z-index: 2; pointer-events: none;
  }

  /* ── HEADER ── */
  .sb-header {
    position: relative; z-index: 1;
    padding: 22px 20px 18px;
    border-bottom: 1px solid rgba(56,139,253,.12);
    flex-shrink: 0;
  }
  .sb-header-tag {
    font-family: 'Space Mono', monospace;
    font-size: .55rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(56,139,253,.5);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .sb-header-tag::before {
    content: '';
    width: 4px; height: 4px;
    background: #388bfd;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(56,139,253,.9);
    animation: sbPulse 2s ease infinite;
  }
  @keyframes sbPulse {
    0%,100% { opacity: 1; box-shadow: 0 0 6px rgba(56,139,253,.9); }
    50%      { opacity: .5; box-shadow: 0 0 2px rgba(56,139,253,.4); }
  }
  .sb-brand {
    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    font-weight: 700;
    color: #e8edf5;
    letter-spacing: .04em;
    line-height: 1.1;
  }
  .sb-brand span {
    color: #388bfd;
  }
  .sb-brand-sub {
    font-size: .58rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(232,237,245,.25);
    margin-top: 4px;
    font-family: 'Space Mono', monospace;
  }

  /* ── STATUS BAR ── */
  .sb-status {
    position: relative; z-index: 1;
    padding: 10px 20px;
    border-bottom: 1px solid rgba(56,139,253,.08);
    background: rgba(56,139,253,.04);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
  .sb-status-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #3fb950;
    box-shadow: 0 0 8px rgba(63,185,80,.8);
  }
  .sb-status-text {
    font-size: .6rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(63,185,80,.7);
    font-family: 'Space Mono', monospace;
  }

  /* ── NAV ── */
  .sb-nav {
    flex: 1;
    padding: 16px 0;
    overflow-y: auto;
    position: relative; z-index: 1;
    scrollbar-width: thin;
    scrollbar-color: rgba(56,139,253,.2) transparent;
  }
  .sb-nav::-webkit-scrollbar { width: 3px; }
  .sb-nav::-webkit-scrollbar-thumb { background: rgba(56,139,253,.2); }

  .sb-section-label {
    font-size: .52rem;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(232,237,245,.2);
    padding: 10px 20px 6px;
    font-family: 'Space Mono', monospace;
  }

  .sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    text-decoration: none;
    color: rgba(232,237,245,.45);
    font-size: .78rem;
    font-weight: 500;
    letter-spacing: .04em;
    position: relative;
    transition: color .2s, background .2s;
    border-left: 2px solid transparent;
    margin: 1px 0;
  }
  .sb-link:hover {
    color: #e8edf5;
    background: rgba(56,139,253,.07);
    border-left-color: rgba(56,139,253,.4);
  }
  .sb-link.active {
    color: #388bfd;
    background: rgba(56,139,253,.1);
    border-left-color: #388bfd;
  }
  .sb-link.active .sb-link-icon { color: #388bfd; }
  .sb-link-icon {
    color: rgba(232,237,245,.3);
    display: flex;
    flex-shrink: 0;
    transition: color .2s;
  }
  .sb-link:hover .sb-link-icon { color: rgba(56,139,253,.7); }

  /* active glow */
  .sb-link.active::after {
    content: '';
    position: absolute;
    right: 0; top: 50%;
    transform: translateY(-50%);
    width: 3px; height: 60%;
    background: #388bfd;
    border-radius: 2px 0 0 2px;
    box-shadow: -2px 0 8px rgba(56,139,253,.5);
  }

  .sb-divider {
    height: 1px;
    background: rgba(56,139,253,.08);
    margin: 10px 0;
  }

  /* back to site link */
  .sb-link.back {
    color: rgba(232,237,245,.25);
    font-size: .72rem;
  }
  .sb-link.back:hover {
    color: rgba(232,237,245,.6);
    background: rgba(255,255,255,.03);
    border-left-color: rgba(255,255,255,.15);
  }
  .sb-link.back .sb-link-icon { color: rgba(232,237,245,.2); }
  .sb-link.back:hover .sb-link-icon { color: rgba(232,237,245,.5); }

  /* ── FOOTER ── */
  .sb-footer {
    position: relative; z-index: 1;
    padding: 16px 20px;
    border-top: 1px solid rgba(56,139,253,.12);
    flex-shrink: 0;
  }
  .sb-logout-btn {
    width: 100%;
    background: rgba(255,56,56,.08);
    border: 1px solid rgba(255,56,56,.2);
    color: rgba(255,100,100,.7);
    font-family: 'Space Grotesk', sans-serif;
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 10px;
    border-radius: 2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background .25s, border-color .25s, color .25s;
  }
  .sb-logout-btn:hover {
    background: rgba(255,56,56,.15);
    border-color: rgba(255,56,56,.45);
    color: #ff6464;
  }
  .sb-footer-meta {
    margin-top: 12px;
    font-family: 'Space Mono', monospace;
    font-size: .5rem;
    letter-spacing: .12em;
    color: rgba(232,237,245,.15);
    text-align: center;
  }
`;

/* icons */
const IconGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconBox = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
);
const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconLogout = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const Iconorders = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const NAV_ITEMS = [
  { to: '/admin',         label: 'Dashboard', icon: <IconGrid  /> },
  { to: '/admin/contact', label: 'Messages',  icon: <IconMail  /> },
  { to: '/admin/product', label: 'Products',  icon: <IconBox   /> },
  { to: '/admin/users',   label: 'Users',     icon: <IconUsers /> },
  { to: '/admin/Orders',   label: 'orders',     icon: <IconBox /> },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
      <style>{css}</style>
      <div className="sb-root">

        {/* ── HEADER ── */}
        <div className="sb-header">
          <div className="sb-header-tag">Control Panel</div>
          <div className="sb-brand">NEX<span>_</span>OVA</div>
          <div className="sb-brand-sub">Admin System v1.0</div>
        </div>

        {/* ── STATUS ── */}
        <div className="sb-status">
          <div className="sb-status-dot" />
          <div className="sb-status-text">System Online</div>
        </div>

        {/* ── NAV ── */}
        <nav className="sb-nav">
          <div className="sb-section-label">// Navigation</div>

          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sb-link${location.pathname === item.to ? ' active' : ''}`}
            >
              <span className="sb-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <div className="sb-divider" />
          <div className="sb-section-label">// System</div>

          <Link to="/" className="sb-link back">
            <span className="sb-link-icon"><IconArrowLeft /></span>
            Back to Site
          </Link>
        </nav>

        {/* ── FOOTER ── */}
        <div className="sb-footer">
          <button className="sb-logout-btn" onClick={logout}>
            <IconLogout /> Logout
          </button>
          {user?.name && (
            <div className="sb-footer-meta">
              LOGGED IN AS {user.name.toUpperCase()}
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Sidebar;