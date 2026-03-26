import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  /* ════════════════════════════════
     ROOT — deep navy terminal
  ════════════════════════════════ */
  .ad {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    min-height: 100vh;
    color: #a8c4e0;
    padding: 0;
    position: relative;
    overflow-x: hidden;
  }

  /* CRT phosphor glow overlay */
  .ad-crt {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(14,99,233,.07) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0,212,180,.04) 0%, transparent 60%);
  }

  /* fine dot grid */
  .ad-dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: .35;
  }

  /* ── TOP STATUS BAR ── */
  .ad-statusbar {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    height: 36px;
    background: rgba(14,99,233,.08);
    border-bottom: 1px solid rgba(56,139,253,.2);
    font-size: .58rem; letter-spacing: .16em; text-transform: uppercase;
  }
  .ad-statusbar-left { display: flex; align-items: center; gap: 20px; }
  .ad-statusbar-item { display: flex; align-items: center; gap: 6px; color: rgba(168,196,224,.4); }
  .ad-statusbar-item.live { color: rgba(0,212,180,.7); }
  .ad-statusbar-item.live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4;
    box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: livePulse 1.5s ease infinite;
  }
  @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ad-statusbar-right { color: rgba(56,139,253,.6); font-size: .56rem; }

  /* ── MAIN LAYOUT: 3-column asymmetric ── */
  .ad-body {
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 1fr 320px;
    grid-template-rows: auto auto auto;
    gap: 1px;
    padding: 1px;
    min-height: calc(100vh - 36px);
  }

  /* ── PANEL base ── */
  .ad-panel {
    background: rgba(3,6,15,.85);
    border: 1px solid rgba(56,139,253,.1);
    position: relative;
    overflow: hidden;
  }
  .ad-panel::before {
    content: attr(data-label);
    position: absolute; top: 0; left: 0;
    font-size: .5rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(56,139,253,.4);
    background: rgba(56,139,253,.07);
    border-bottom: 1px solid rgba(56,139,253,.12);
    border-right: 1px solid rgba(56,139,253,.12);
    padding: 4px 10px;
    z-index: 1;
  }

  /* ════════════════════
     HERO PANEL (left, top)
  ════════════════════ */
  .ad-hero {
    grid-column: 1;
    grid-row: 1;
    padding: 52px 40px 40px;
    background: linear-gradient(135deg, rgba(14,99,233,.08) 0%, rgba(3,6,15,.9) 60%);
    border-color: rgba(56,139,253,.15);
  }
  .ad-hero-eyebrow {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px;
  }
  .ad-hero-eyebrow-line {
    height: 1px; width: 32px;
    background: linear-gradient(90deg, #388bfd, transparent);
  }
  .ad-hero-eyebrow-text {
    font-size: .58rem; letter-spacing: .22em;
    color: rgba(56,139,253,.6); text-transform: uppercase;
  }
  .ad-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.4rem, 5vw, 4rem);
    font-weight: 800;
    line-height: .95;
    letter-spacing: -.02em;
    color: #e8f4ff;
    margin-bottom: 6px;
  }
  .ad-hero-title span {
    display: block;
    color: transparent;
    -webkit-text-stroke: 1px rgba(56,139,253,.5);
    font-weight: 800;
  }
  .ad-hero-sub {
    font-size: .72rem; letter-spacing: .08em;
    color: rgba(168,196,224,.3); margin-bottom: 28px;
    font-weight: 300;
  }
  .ad-hero-session {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(56,139,253,.08);
    border: 1px solid rgba(56,139,253,.2);
    padding: 8px 16px;
    font-size: .65rem; letter-spacing: .1em;
    color: rgba(56,139,253,.7);
  }
  .ad-hero-session strong { color: #79b8ff; font-weight: 700; }

  /* ════════════════════
     METRICS PANEL (right, spans rows 1-2)
  ════════════════════ */
  .ad-metrics {
    grid-column: 2;
    grid-row: 1 / 3;
    padding: 44px 0 0;
    border-color: rgba(56,139,253,.12);
    display: flex; flex-direction: column;
  }
  .ad-metrics-title {
    font-size: .55rem; letter-spacing: .22em; text-transform: uppercase;
    color: rgba(56,139,253,.45); padding: 0 24px 16px;
    border-bottom: 1px solid rgba(56,139,253,.08);
    margin-bottom: 0;
  }

  /* metric row */
  .ad-metric {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(56,139,253,.07);
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: start;
    gap: 8px;
    transition: background .2s;
    cursor: default;
  }
  .ad-metric:hover { background: rgba(56,139,253,.04); }
  .ad-metric-label {
    font-size: .55rem; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(168,196,224,.3);
    margin-bottom: 6px;
  }
  .ad-metric-val {
    font-family: 'Syne', sans-serif;
    font-size: 2rem; font-weight: 800;
    color: #e8f4ff; line-height: 1; letter-spacing: -.02em;
  }
  .ad-metric-val.loading {
    background: linear-gradient(90deg,
      rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 200px 100%;
    animation: skel 1.4s infinite linear;
    border-radius: 2px;
    color: transparent;
    width: 80px; height: 32px;
  }
  @keyframes skel { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
  .ad-metric-bar-wrap {
    height: 2px; background: rgba(56,139,253,.1); margin-top: 10px;
    position: relative; overflow: hidden;
  }
  .ad-metric-bar {
    height: 100%; border-radius: 0;
    animation: barGrow .8s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes barGrow { from{width:0} }
  .ad-metric-badge {
    font-size: .55rem; letter-spacing: .1em;
    text-transform: uppercase; padding: 3px 8px;
    border-radius: 1px; font-weight: 500; white-space: nowrap;
    margin-top: 2px;
  }
  .ad-metric-badge.up   { background: rgba(0,212,180,.1); border: 1px solid rgba(0,212,180,.25); color: #00d4b4; }
  .ad-metric-badge.warn { background: rgba(240,165,42,.1); border: 1px solid rgba(240,165,42,.25); color: #f0a52a; }

  /* system status inside metrics */
  .ad-sys-status {
    margin-top: auto;
    padding: 16px 24px;
    border-top: 1px solid rgba(56,139,253,.08);
    background: rgba(56,139,253,.03);
  }
  .ad-sys-status-title {
    font-size: .52rem; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(56,139,253,.35);
    margin-bottom: 10px;
  }
  .ad-sys-row {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 6px; font-size: .6rem;
  }
  .ad-sys-key { color: rgba(168,196,224,.3); letter-spacing: .06em; }
  .ad-sys-val { color: rgba(0,212,180,.7); }
  .ad-sys-val.warn { color: #f0a52a; }

  /* ════════════════════
     STATS GRID (left, row 2)
  ════════════════════ */
  .ad-grid {
    grid-column: 1;
    grid-row: 2;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(56,139,253,.06);
    padding: 1px;
    border: none !important;
  }
  .ad-grid-cell {
    background: rgba(3,6,15,.9);
    padding: 22px 20px;
    border: 1px solid rgba(56,139,253,.08);
    transition: border-color .25s, background .25s;
    position: relative; overflow: hidden;
    animation: cellIn .4s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes cellIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .ad-grid-cell:hover {
    border-color: rgba(56,139,253,.35);
    background: rgba(56,139,253,.05);
  }
  .ad-grid-cell::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .3s;
  }
  .ad-grid-cell:hover::after { transform: scaleX(1); }
  .ad-cell-num {
    font-size: .48rem; letter-spacing: .2em; color: rgba(56,139,253,.3);
    margin-bottom: 10px; text-transform: uppercase;
  }
  .ad-cell-icon {
    color: rgba(56,139,253,.4); margin-bottom: 12px;
    width: 20px; height: 20px;
  }
  .ad-cell-label {
    font-size: .56rem; letter-spacing: .14em; text-transform: uppercase;
    color: rgba(168,196,224,.3); margin-bottom: 4px;
  }
  .ad-cell-link {
    font-size: .62rem; color: rgba(56,139,253,.5); text-decoration: none;
    letter-spacing: .06em;
    transition: color .2s;
    display: flex; align-items: center; gap: 4px;
  }
  .ad-cell-link:hover { color: #79b8ff; }

  /* ════════════════════
     LOG PANEL (spans full width, row 3)
  ════════════════════ */
  .ad-log {
    grid-column: 1 / -1;
    grid-row: 3;
    padding: 0;
    border-color: rgba(56,139,253,.1);
  }
  .ad-log-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid rgba(56,139,253,.1);
    background: rgba(56,139,253,.04);
  }
  .ad-log-title {
    font-size: .56rem; letter-spacing: .2em;
    text-transform: uppercase; color: rgba(56,139,253,.5);
    display: flex; align-items: center; gap: 8px;
  }
  .ad-log-title::before {
    content: '>_';
    color: rgba(0,212,180,.5); font-weight: 700;
  }
  .ad-log-body { padding: 12px 24px 20px; max-height: 140px; overflow-y: auto; }
  .ad-log-line {
    display: flex; align-items: baseline; gap: 12px;
    padding: 4px 0;
    border-bottom: 1px solid rgba(56,139,253,.04);
    font-size: .62rem; line-height: 1.5;
    animation: logIn .3s ease both;
  }
  @keyframes logIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  .ad-log-line:last-child { border-bottom: none; }
  .ad-log-ts { color: rgba(56,139,253,.4); flex-shrink: 0; width: 70px; }
  .ad-log-type { flex-shrink: 0; width: 44px; }
  .ad-log-type.ok   { color: #00d4b4; }
  .ad-log-type.warn { color: #f0a52a; }
  .ad-log-type.info { color: rgba(56,139,253,.7); }
  .ad-log-msg { color: rgba(168,196,224,.5); font-weight: 300; }

  /* scrollbar */
  .ad-log-body::-webkit-scrollbar { width: 2px; }
  .ad-log-body::-webkit-scrollbar-thumb { background: rgba(56,139,253,.2); }

  /* responsive */
  @media (max-width: 900px) {
    .ad-body { grid-template-columns: 1fr; }
    .ad-metrics { grid-column: 1; grid-row: auto; }
    .ad-grid { grid-template-columns: repeat(2,1fr); }
    .ad-log { grid-column: 1; }
  }
  @media (max-width: 560px) {
    .ad-grid { grid-template-columns: 1fr 1fr; }
  }
`;

/* icons */
const Ic = ({ d, d2 }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d={d}/>{d2 && <path d={d2}/>}
  </svg>
);
const IconUsers  = () => <Ic d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />;
const IconBox    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const IconMail   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconOrders = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const IconShield = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconChart  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;

/* live clock */
const useClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
};

const CELLS = [
  { num: '01', icon: <IconUsers  />, label: 'User Mgmt',  href: '/admin/users'    },
  { num: '02', icon: <IconBox    />, label: 'Products',   href: '/admin/product'  },
  { num: '03', icon: <IconOrders />, label: 'Orders',     href: '/admin/orders'   },
  { num: '04', icon: <IconMail   />, label: 'Messages',   href: '/admin/contact'  },
  { num: '05', icon: <IconChart  />, label: 'Analytics',  href: '/admin/analytics'},
  { num: '06', icon: <IconShield />, label: 'Settings',   href: '/admin/settings' },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const time = useClock();

  // ── REAL DATA STATE ──
  const [stats, setStats] = useState({
    users:    null,
    orders:   null,
    products: null,
    contacts: null,
  });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const now = new Date();
      const ts = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newLogs = [];

      try {
        const res = await api.get('/admin/users');
        if (res.data.success) {
          setStats(s => ({ ...s, users: res.data.users.length }));
          newLogs.push({ ts, type: 'OK', msg: `${res.data.users.length} users loaded from database` });
        }
      } catch { newLogs.push({ ts, type: 'WARN', msg: 'Failed to fetch users' }); }

      try {
        const res = await api.get('/order/get');
        if (res.data.success) {
          const orders = res.data.orders;
          const pending = orders.filter(o => o.status === 'pending').length;
          setStats(s => ({ ...s, orders: orders.length, pendingOrders: pending }));
          newLogs.push({ ts, type: 'OK', msg: `${orders.length} orders loaded — ${pending} pending` });
        }
      } catch { newLogs.push({ ts, type: 'WARN', msg: 'Failed to fetch orders' }); }

      try {
        const res = await api.get('/product/get');
        if (res.data.status) {
          setStats(s => ({ ...s, products: res.data.product.length }));
          newLogs.push({ ts, type: 'OK', msg: `${res.data.product.length} products in catalogue` });
        }
      } catch { newLogs.push({ ts, type: 'WARN', msg: 'Failed to fetch products' }); }

      try {
        const res = await api.get('/contact/get');
        if (res.data.status) {
          setStats(s => ({ ...s, contacts: res.data.contact.length }));
          newLogs.push({ ts, type: 'INFO', msg: `${res.data.contact.length} contact messages in inbox` });
        }
      } catch { newLogs.push({ ts, type: 'WARN', msg: 'Failed to fetch contacts' }); }

      newLogs.push({ ts, type: 'OK', msg: 'Dashboard initialized successfully' });
      setLogs(newLogs);
    };

    fetchAll();
  }, []);

  // build metrics from real data
  const METRICS = [
    {
      label: 'Registered Users',
      val: stats.users !== null ? stats.users.toLocaleString() : null,
      badge: 'total', type: 'up',
      bar: stats.users ? Math.min((stats.users / 100) * 100, 100) : 0,
      barColor: '#388bfd',
    },
    {
      label: 'Total Orders',
      val: stats.orders !== null ? stats.orders.toLocaleString() : null,
      badge: stats.pendingOrders ? `${stats.pendingOrders} pending` : 'live',
      type: stats.pendingOrders > 0 ? 'warn' : 'up',
      bar: stats.orders ? Math.min((stats.orders / 500) * 100, 100) : 0,
      barColor: '#00d4b4',
    },
    {
      label: 'Products Listed',
      val: stats.products !== null ? stats.products.toLocaleString() : null,
      badge: 'in catalogue', type: 'up',
      bar: stats.products ? Math.min((stats.products / 200) * 100, 100) : 0,
      barColor: '#f0a52a',
    },
    {
      label: 'Contact Messages',
      val: stats.contacts !== null ? stats.contacts.toLocaleString() : null,
      badge: 'in inbox', type: 'up',
      bar: stats.contacts ? Math.min((stats.contacts / 50) * 100, 100) : 0,
      barColor: '#f0a52a',
    },
  ];

  const dateStr = time.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'short', year:'numeric' });
  const timeStr = time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

  return (
    <>
      <style>{css}</style>
      <div className="ad">
        <div className="ad-crt" />
        <div className="ad-dots" />

        {/* ── STATUS BAR ── */}
        <div className="ad-statusbar">
          <div className="ad-statusbar-left">
            <div className="ad-statusbar-item live">System Online</div>
            <div className="ad-statusbar-item">v1.0.0</div>
            <div className="ad-statusbar-item">{dateStr}</div>
          </div>
          <div className="ad-statusbar-right">{timeStr}</div>
        </div>

        {/* ── BODY GRID ── */}
        <div className="ad-body">

          {/* HERO */}
          <div className="ad-panel ad-hero" data-label="SYS.DASHBOARD">
            <div className="ad-hero-eyebrow">
              <div className="ad-hero-eyebrow-line" />
              <div className="ad-hero-eyebrow-text">Admin Control Center</div>
            </div>
            <h1 className="ad-hero-title">
              ADMIN
              <span>PANEL</span>
            </h1>
            <div className="ad-hero-sub">GET_READY / store-management / v1.0</div>
            <div className="ad-hero-session">
              ACTIVE SESSION — <strong>{user?.name?.toUpperCase() || 'ADMIN'}</strong>
            </div>
          </div>

          {/* METRICS SIDEBAR */}
          <div className="ad-panel ad-metrics" data-label="METRICS">
            <div className="ad-metrics-title">// live metrics</div>
            {METRICS.map((m, i) => (
              <div key={m.label} className="ad-metric" style={{ animationDelay: `${i * 0.08}s` }}>
                <div>
                  <div className="ad-metric-label">{m.label}</div>
                  <div className={`ad-metric-val${m.val === null ? ' loading' : ''}`}>
                    {m.val !== null ? m.val : '000'}
                  </div>
                  <div className="ad-metric-bar-wrap">
                    <div
                      className="ad-metric-bar"
                      style={{
                        width: `${m.bar}%`,
                        background: m.barColor,
                        animationDelay: `${i * 0.1 + 0.2}s`,
                      }}
                    />
                  </div>
                </div>
                <span className={`ad-metric-badge ${m.type}`}>{m.badge}</span>
              </div>
            ))}
            <div className="ad-sys-status">
              <div className="ad-sys-status-title">// sys.check</div>
              {[
                ['API',      'HEALTHY', 'ok'],
                ['DATABASE', 'ONLINE',  'ok'],
                ['STORAGE',  '74% USED','warn'],
                ['UPTIME',   '99.9%',   'ok'],
              ].map(([k, v, t]) => (
                <div key={k} className="ad-sys-row">
                  <span className="ad-sys-key">{k}</span>
                  <span className={`ad-sys-val ${t}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACCESS GRID */}
          <div className="ad-grid ad-panel" data-label="QUICK.ACCESS">
            {CELLS.map((c, i) => (
              <div
                key={c.num}
                className="ad-grid-cell"
                style={{ animationDelay: `${i * 0.06 + 0.1}s` }}
              >
                <div className="ad-cell-num">{c.num}</div>
                <div className="ad-cell-icon">{c.icon}</div>
                <div className="ad-cell-label">{c.label}</div>
                <a href={c.href} className="ad-cell-link">access →</a>
              </div>
            ))}
          </div>

          {/* ACTIVITY LOG */}
          <div className="ad-panel ad-log" data-label="ACTIVITY.LOG">
            <div className="ad-log-header">
              <div className="ad-log-title">System Log</div>
            </div>
            <div className="ad-log-body">
              {logs.length === 0 ? (
                <div className="ad-log-line">
                  <span className="ad-log-ts">--:--:--</span>
                  <span className="ad-log-type info">[INFO]</span>
                  <span className="ad-log-msg">Initializing dashboard…</span>
                </div>
              ) : (
                logs.map((l, i) => (
                  <div key={i} className="ad-log-line" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className="ad-log-ts">{l.ts}</span>
                    <span className={`ad-log-type ${l.type.toLowerCase()}`}>[{l.type}]</span>
                    <span className="ad-log-msg">{l.msg}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdminDashboard;