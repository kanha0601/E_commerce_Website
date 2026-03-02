import React, { useEffect, useState } from "react";
import api from "../../services/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .ao-wrap {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    min-height: 100vh;
    color: #a8c4e0;
    position: relative;
    overflow-x: hidden;
  }

  /* dot grid */
  .ao-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px; opacity: .3;
  }
  /* glow */
  .ao-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14,99,233,.07) 0%, transparent 70%);
  }

  /* ── STATUS BAR ── */
  .ao-statusbar {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 34px;
    background: rgba(14,99,233,.08);
    border-bottom: 1px solid rgba(56,139,253,.2);
    font-size: .56rem; letter-spacing: .16em; text-transform: uppercase;
  }
  .ao-status-left { display: flex; align-items: center; gap: 16px; color: rgba(168,196,224,.35); }
  .ao-status-live { display: flex; align-items: center; gap: 6px; color: rgba(0,212,180,.7); }
  .ao-status-live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4; box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: aoPulse 1.5s ease infinite;
  }
  @keyframes aoPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ao-status-right { color: rgba(56,139,253,.5); font-size: .54rem; }

  .ao-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 40px 28px 100px;
  }

  /* ── HEADER ── */
  .ao-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid rgba(56,139,253,.12);
    animation: aoUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes aoUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .ao-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .ao-eyebrow-line { height: 1px; width: 24px; background: linear-gradient(90deg,#388bfd,transparent); }
  .ao-eyebrow-text { font-size: .56rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.6); }
  .ao-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    font-weight: 800; letter-spacing: -.02em;
    color: #e8f4ff; line-height: 1;
  }
  .ao-title span { color: transparent; -webkit-text-stroke: 1px rgba(56,139,253,.45); }
  .ao-count { font-size: .56rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(168,196,224,.3); margin-top: 6px; }

  .ao-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(56,139,253,.08); border: 1px solid rgba(56,139,253,.25);
    color: rgba(56,139,253,.7);
    font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; font-weight: 600;
    padding: 6px 14px; align-self: flex-start; margin-top: 4px;
  }
  .ao-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #388bfd; box-shadow: 0 0 6px rgba(56,139,253,.8);
    animation: aoPulse 2s ease infinite;
  }

  /* ── TOOLBAR ── */
  .ao-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; flex-wrap: wrap;
    animation: aoUp .6s cubic-bezier(.16,1,.3,1) .06s both;
  }
  .ao-search-wrap { position: relative; flex:1; min-width:200px; max-width:340px; }
  .ao-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%); color: rgba(56,139,253,.4); pointer-events: none; display: flex;
  }
  .ao-search {
    width: 100%; box-sizing: border-box;
    background: rgba(56,139,253,.05); border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0; font-family: 'JetBrains Mono', monospace;
    font-size: .72rem; font-weight: 300; padding: 9px 12px 9px 32px; outline: none;
    transition: border-color .25s, box-shadow .25s;
  }
  .ao-search::placeholder { color: rgba(168,196,224,.2); }
  .ao-search:focus { border-color: rgba(56,139,253,.5); box-shadow: 0 0 0 3px rgba(56,139,253,.07); }
  .ao-result-count {
    font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(168,196,224,.25); margin-left: auto;
  }

  /* ── TABLE ── */
  .ao-table-wrap {
    border: 1px solid rgba(56,139,253,.12);
    background: rgba(3,6,15,.85);
    overflow-x: auto; position: relative;
    animation: aoUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .ao-table-wrap::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, rgba(56,139,253,.3), transparent);
  }

  .ao-table { width: 100%; border-collapse: collapse; min-width: 800px; }
  .ao-table thead tr { border-bottom: 1px solid rgba(56,139,253,.12); }
  .ao-table thead th {
    padding: 13px 18px; text-align: left;
    font-size: .56rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(56,139,253,.55); font-weight: 500;
    background: rgba(56,139,253,.04); white-space: nowrap;
  }
  .ao-table thead th:last-child { text-align: center; }
  .ao-table tbody tr {
    border-bottom: 1px solid rgba(56,139,253,.06);
    transition: background .2s;
    animation: aoUp .4s cubic-bezier(.16,1,.3,1) both;
  }
  .ao-table tbody tr:last-child { border-bottom: none; }
  .ao-table tbody tr:hover { background: rgba(56,139,253,.04); }
  .ao-table td { padding: 15px 18px; vertical-align: top; }

  /* cells */
  .ao-cell-idx { font-size: .52rem; letter-spacing: .14em; color: rgba(56,139,253,.3); }
  .ao-cell-name {
    font-family: 'Syne', sans-serif;
    font-size: .88rem; font-weight: 700;
    color: #e8f4ff; letter-spacing: -.01em;
  }
  .ao-cell-email { font-size: .68rem; font-weight: 300; color: rgba(168,196,224,.35); margin-top: 2px; }
  .ao-cell-amount { font-size: .8rem; font-weight: 700; color: #388bfd; letter-spacing: .04em; }
  .ao-cell-amount em { font-style: normal; font-weight: 400; color: rgba(56,139,253,.5); font-size: .65rem; margin-right: 1px; }
  .ao-cell-date { font-size: .68rem; font-weight: 300; color: rgba(168,196,224,.35); white-space: nowrap; }

  /* products list */
  .ao-products { display: flex; flex-direction: column; gap: 4px; }
  .ao-product-item {
    font-size: .65rem; font-weight: 300;
    color: rgba(168,196,224,.45); line-height: 1.5;
  }
  .ao-product-item span { color: rgba(56,139,253,.5); margin-left: 4px; }

  /* ── STATUS BADGE ── */
  .ao-status {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: .55rem; letter-spacing: .12em; text-transform: uppercase;
    font-weight: 600; padding: 4px 10px; white-space: nowrap;
  }
  .ao-status::before {
    content: ''; width: 4px; height: 4px; border-radius: 50%; flex-shrink: 0;
  }
  .ao-status.pending   { background: rgba(240,165,42,.1);  border: 1px solid rgba(240,165,42,.3);  color: #f0a52a; }
  .ao-status.pending::before   { background: #f0a52a; box-shadow: 0 0 4px rgba(240,165,42,.8); }
  .ao-status.paid      { background: rgba(56,139,253,.1);  border: 1px solid rgba(56,139,253,.3);  color: #79b8ff; }
  .ao-status.paid::before      { background: #79b8ff; box-shadow: 0 0 4px rgba(56,139,253,.8); }
  .ao-status.shipped   { background: rgba(168,100,255,.1); border: 1px solid rgba(168,100,255,.3); color: #c084fc; }
  .ao-status.shipped::before   { background: #c084fc; box-shadow: 0 0 4px rgba(168,100,255,.8); }
  .ao-status.delivered { background: rgba(0,212,180,.1);   border: 1px solid rgba(0,212,180,.3);   color: #00d4b4; }
  .ao-status.delivered::before { background: #00d4b4; box-shadow: 0 0 4px rgba(0,212,180,.8); }
  .ao-status.cancelled { background: rgba(239,68,68,.1);   border: 1px solid rgba(239,68,68,.3);   color: #f87171; }
  .ao-status.cancelled::before { background: #f87171; box-shadow: 0 0 4px rgba(239,68,68,.8); }

  /* ── STATUS SELECT ── */
  .ao-select {
    background: rgba(56,139,253,.06);
    border: 1px solid rgba(56,139,253,.2);
    color: #a8c4e0;
    font-family: 'JetBrains Mono', monospace;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    padding: 6px 10px; outline: none; cursor: pointer;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
    -webkit-appearance: none;
    min-width: 110px;
  }
  .ao-select:focus { border-color: rgba(56,139,253,.5); box-shadow: 0 0 0 3px rgba(56,139,253,.07); }
  .ao-select option { background: #070b14; color: #a8c4e0; }

  /* ── EMPTY ── */
  .ao-empty {
    text-align: center; padding: 72px 24px;
    border: 1px solid rgba(56,139,253,.07);
    background: rgba(56,139,253,.02);
    animation: aoUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .ao-empty-sym {
    font-family: 'Syne', sans-serif;
    font-size: 3.5rem; font-weight: 800;
    color: rgba(56,139,253,.07); line-height: 1; margin-bottom: 12px;
  }
  .ao-empty p { font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.2); }

  /* ── SKELETON ── */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg,
      rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 800px 100%; animation: skel 1.4s infinite linear; border-radius: 1px;
  }

  /* ── TOAST ── */
  .ao-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #00d4b4; color: #03060f;
    font-family: 'JetBrains Mono', monospace;
    font-size: .65rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 24px; box-shadow: 0 0 24px rgba(0,212,180,.35);
    z-index: 300;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
  }
  .ao-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ao-toast.error { background: #ef4444; color: #fff; box-shadow: 0 0 24px rgba(239,68,68,.35); }
`;

const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const useClock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const STATUS_OPTIONS = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [toast,   setToast]   = useState({ show: false, msg: '', error: false });
  const time = useClock();

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 2800);
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/order/get');
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
      showToast('Failed to load orders', true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/order/status/${orderId}`, { status: newStatus });
      if (res.data.success) {
        setOrders(prev =>
          prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
        );
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (err) {
      console.log(err);
      showToast('Failed to update status', true);
    }
  };

  const filtered = orders.filter(o =>
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
    o.status?.toLowerCase().includes(search.toLowerCase()) ||
    o._id?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <>
      <style>{css}</style>
      <div className="ao-wrap">

        {/* STATUS BAR */}
        <div className="ao-statusbar">
          <div className="ao-status-left">
            <div className="ao-status-live">System Online</div>
            <span>Orders.Module</span>
            <span>{orders.length} records loaded</span>
          </div>
          <div className="ao-status-right">{time}</div>
        </div>

        <div className="ao-inner">

          {/* HEADER */}
          <div className="ao-header">
            <div>
              <div className="ao-eyebrow">
                <div className="ao-eyebrow-line" />
                <span className="ao-eyebrow-text">Admin / Orders</span>
              </div>
              <h1 className="ao-title">CUSTOMER <span>ORDERS</span></h1>
              {!loading && <div className="ao-count">{orders.length} order{orders.length !== 1 ? 's' : ''} in database</div>}
            </div>
            {!loading && (
              <div className="ao-badge">
                <div className="ao-badge-dot" />
                {orders.length} record{orders.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* TOOLBAR */}
          {!loading && orders.length > 0 && (
            <div className="ao-toolbar">
              <div className="ao-search-wrap">
                <span className="ao-search-icon"><IconSearch /></span>
                <input
                  className="ao-search"
                  placeholder="Search name, email, status, order ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {search && (
                <div className="ao-result-count">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="ao-table-wrap">
              <table className="ao-table">
                <thead>
                  <tr>{['#','Customer','Products','Amount','Date','Status','Update'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[1,2,3,4].map(i => (
                    <tr key={i}>
                      {[20,120,180,70,80,80,100].map((w,j) => (
                        <td key={j} style={{ padding:'16px 18px' }}>
                          <div className="skel" style={{ height:11, width:w }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : orders.length === 0 ? (
            <div className="ao-empty">
              <div className="ao-empty-sym">[ ]</div>
              <p>No orders yet</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ao-empty">
              <div className="ao-empty-sym">[ ]</div>
              <p>No results for "{search}"</p>
            </div>
          ) : (
            <div className="ao-table-wrap">
              <table className="ao-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th style={{ textAlign:'center' }}>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <tr key={order._id} style={{ animationDelay: `${idx * 0.04}s` }}>

                      {/* index */}
                      <td><div className="ao-cell-idx">{String(idx+1).padStart(2,'0')}</div></td>

                      {/* customer */}
                      <td>
                        <div className="ao-cell-name">{order.user?.name || '—'}</div>
                        <div className="ao-cell-email">{order.user?.email || '—'}</div>
                      </td>

                      {/* products */}
                      <td>
                        <div className="ao-products">
                          {order.products?.map((p, i) => (
                            <div key={i} className="ao-product-item">
                              {p.product?.name || 'Product'}
                              <span>×{p.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* amount */}
                      <td>
                        <div className="ao-cell-amount">
                          <em>₹</em>{order.totalAmount?.toLocaleString()}
                        </div>
                      </td>

                      {/* date */}
                      <td>
                        <div className="ao-cell-date">{formatDate(order.createdAt)}</div>
                      </td>

                      {/* status badge */}
                      <td>
                        <span className={`ao-status ${order.status}`}>
                          {order.status}
                        </span>
                      </td>

                      {/* status update */}
                      <td style={{ textAlign:'center' }}>
                        <select
                          className="ao-select"
                          value={order.status}
                          onChange={e => handleStatusChange(order._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* TOAST */}
      <div className={`ao-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
}

export default AdminOrders;