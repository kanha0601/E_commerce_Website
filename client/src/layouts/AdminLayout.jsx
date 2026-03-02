import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';




const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  :root {
    --admin-bg:     #03060f;
    --admin-border: rgba(56,139,253,.12);
    --admin-blue:   #388bfd;
    --admin-text:   #a8c4e0;
    --admin-bright: #e8f4ff;
  }

  .adl-root {
    font-family: 'JetBrains Mono', monospace;
    background: var(--admin-bg);
    min-height: 100vh;
    display: flex;
    color: var(--admin-text);
    position: relative;
    overflow: hidden;
  }

  /* dot grid background */
  .adl-root::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: .25;
  }

  /* top glow */
  .adl-root::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(14,99,233,.08) 0%, transparent 70%);
  }

  /* ── SIDEBAR SLOT ── */
  .adl-sidebar {
    position: relative; z-index: 10;
    flex-shrink: 0;
    border-right: 1px solid var(--admin-border);
    background: rgba(3,6,15,.9);
  }

  /* ── MAIN AREA ── */
  .adl-main {
    position: relative; z-index: 1;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow-x: hidden;
  }

  /* ── TOP BAR ── */
  .adl-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 38px;
    background: rgba(14,99,233,.06);
    border-bottom: 1px solid var(--admin-border);
    font-size: .55rem; letter-spacing: .18em; text-transform: uppercase;
    flex-shrink: 0;
    position: relative; z-index: 5;
  }
  .adl-topbar-left {
    display: flex; align-items: center; gap: 14px;
    color: rgba(168,196,224,.3);
  }
  .adl-topbar-live {
    display: flex; align-items: center; gap: 6px;
    color: rgba(0,212,180,.7);
  }
  .adl-topbar-live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4;
    box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: adlPulse 1.5s ease infinite;
  }
  @keyframes adlPulse { 0%,100%{opacity:1} 50%{opacity:.3} }

  .adl-topbar-right {
    color: rgba(56,139,253,.45);
    font-size: .53rem;
  }

  /* ── CONTENT ── */
  .adl-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    /* custom scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(56,139,253,.2) transparent;
  }
  .adl-content::-webkit-scrollbar { width: 4px; }
  .adl-content::-webkit-scrollbar-track { background: transparent; }
  .adl-content::-webkit-scrollbar-thumb {
    background: rgba(56,139,253,.2);
    border-radius: 2px;
  }
  .adl-content::-webkit-scrollbar-thumb:hover {
    background: rgba(56,139,253,.4);
  }

  /* ── LOADING SCREEN ── */
  .adl-loading {
    position: fixed; inset: 0; z-index: 999;
    background: #03060f;
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 20px;
  }
  .adl-loading-bars {
    display: flex; align-items: flex-end; gap: 4px; height: 32px;
  }
  .adl-loading-bar {
    width: 3px;
    background: var(--admin-blue);
    border-radius: 1px;
    animation: adlBar 1s ease infinite;
    box-shadow: 0 0 6px rgba(56,139,253,.5);
  }
  .adl-loading-bar:nth-child(1) { animation-delay: 0s;    height: 16px; }
  .adl-loading-bar:nth-child(2) { animation-delay: .15s;  height: 24px; }
  .adl-loading-bar:nth-child(3) { animation-delay: .3s;   height: 32px; }
  .adl-loading-bar:nth-child(4) { animation-delay: .45s;  height: 24px; }
  .adl-loading-bar:nth-child(5) { animation-delay: .6s;   height: 16px; }
  @keyframes adlBar {
    0%,100% { opacity: .3; transform: scaleY(.6); }
    50%      { opacity: 1;  transform: scaleY(1);  }
  }
  .adl-loading-text {
    font-size: .58rem; letter-spacing: .28em; text-transform: uppercase;
    color: rgba(56,139,253,.5);
  }
`;

const AdminClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="adl-loading">
          <div className="adl-loading-bars">
            {[1,2,3,4,5].map(i => <div key={i} className="adl-loading-bar" />)}
          </div>
          <div className="adl-loading-text">Initializing Admin</div>
        </div>
      </>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <style>{css}</style>
      <div className="adl-root">

        {/* SIDEBAR */}
        <div className="adl-sidebar">
          <Sidebar />
        </div>

        {/* MAIN */}
        <div className="adl-main">

          {/* TOP BAR */}
          <div className="adl-topbar">
            <div className="adl-topbar-left">
              <div className="adl-topbar-live">System Online</div>
              <span>Admin.Panel</span>
              <span>{user?.name || user?.email || 'Administrator'}</span>
            </div>
            <div className="adl-topbar-right">
              <AdminClock />
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="adl-content">
            <Outlet />
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminLayout;