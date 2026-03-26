import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pf-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    color: #f0ebe0;
    padding: 72px 20px 100px;
  }

  .pf-inner {
    max-width: 860px;
    margin: 0 auto;
  }

  /* ── HEADER ── */
  .pf-header {
    text-align: center;
    margin-bottom: 44px;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .pf-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(201,168,76,.4);
    padding: 5px 16px;
    border-radius: 2px;
    margin-bottom: 16px;
  }
  .pf-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #c9a84c;
    box-shadow: 0 0 8px rgba(201,168,76,.7);
  }
  .pf-eyebrow span {
    font-size: .66rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #c9a84c;
    font-weight: 500;
  }
  .pf-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900;
    background: linear-gradient(90deg, #c9a84c, #e8d08a, #fff8df, #c9a84c);
    background-size: 300%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shimmer 6s ease infinite;
    line-height: 1.1;
  }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }

  /* ── PROFILE CARD ── */
  .pf-profile-card {
    border: 1px solid rgba(201,168,76,.2);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
    padding: 32px 28px;
    margin-bottom: 2px;
    position: relative;
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .1s both;
  }
  .pf-profile-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }

  .pf-profile-top {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  .pf-avatar {
    width: 68px; height: 68px;
    border-radius: 2px;
    border: 1px solid rgba(201,168,76,.35);
    background: linear-gradient(135deg, rgba(201,168,76,.15), rgba(201,168,76,.05));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem;
    font-weight: 900;
    color: #c9a84c;
    flex-shrink: 0;
  }

  .pf-profile-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: #f0ebe0;
    margin-bottom: 4px;
  }
  .pf-profile-email {
    font-size: .8rem;
    color: rgba(240,235,224,.4);
    font-weight: 300;
    margin-bottom: 10px;
  }
  .pf-role-badge {
    display: inline-block;
    font-size: .6rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 2px;
  }
  .pf-role-badge.admin {
    background: rgba(200,60,60,.12);
    border: 1px solid rgba(200,60,60,.3);
    color: #e07070;
  }
  .pf-role-badge.user {
    background: rgba(64,145,108,.12);
    border: 1px solid rgba(64,145,108,.3);
    color: #6fcba0;
  }

  /* stats strip */
  .pf-stats-strip {
    display: flex;
    gap: 2px;
    padding-top: 20px;
    border-top: 1px solid rgba(201,168,76,.1);
  }
  .pf-stat {
    flex: 1;
    padding: 14px 10px;
    background: rgba(255,255,255,.02);
    border: 1px solid rgba(201,168,76,.08);
    text-align: center;
  }
  .pf-stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 900;
    color: #c9a84c;
    line-height: 1;
    margin-bottom: 5px;
  }
  .pf-stat-label {
    font-size: .6rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(240,235,224,.3);
  }

  /* ── ORDERS SECTION ── */
  .pf-orders-section {
    animation: fadeUp .6s cubic-bezier(.16,1,.3,1) .18s both;
  }

  .pf-orders-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0 16px;
    border-bottom: 1px solid rgba(201,168,76,.12);
    margin-bottom: 2px;
  }
  .pf-orders-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: #f0ebe0;
  }
  .pf-orders-count {
    font-size: .66rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(240,235,224,.3);
  }

  /* ── ORDER CARD ── */
  .pf-order {
    border: 1px solid rgba(201,168,76,.12);
    background: linear-gradient(140deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
    margin-bottom: 2px;
    overflow: hidden;
    transition: border-color .3s;
  }
  .pf-order:hover { border-color: rgba(201,168,76,.28); }

  /* head row */
  .pf-order-head {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
    border-bottom: 1px solid rgba(201,168,76,.07);
  }
  .pf-order-id {
    font-family: 'Playfair Display', serif;
    font-size: .92rem;
    font-weight: 700;
    color: #f0ebe0;
  }
  .pf-order-id em {
    font-style: normal;
    font-family: 'DM Sans', sans-serif;
    font-size: .62rem;
    letter-spacing: .1em;
    color: rgba(240,235,224,.3);
    font-weight: 400;
    text-transform: uppercase;
    margin-right: 5px;
  }
  .pf-order-date {
    font-size: .7rem;
    color: rgba(240,235,224,.3);
    margin-top: 3px;
  }
  .pf-status {
    font-size: .58rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 4px 11px;
    border-radius: 2px;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .pf-status.pending   { background: rgba(234,179,8,.1);  border: 1px solid rgba(234,179,8,.3);  color: #fbbf24; }
  .pf-status.paid      { background: rgba(59,130,246,.1); border: 1px solid rgba(59,130,246,.3); color: #60a5fa; }
  .pf-status.shipped   { background: rgba(139,92,246,.1); border: 1px solid rgba(139,92,246,.3); color: #a78bfa; }
  .pf-status.delivered { background: rgba(34,197,94,.1);  border: 1px solid rgba(34,197,94,.3);  color: #4ade80; }
  .pf-status.cancelled { background: rgba(239,68,68,.1);  border: 1px solid rgba(239,68,68,.3);  color: #f87171; }

  /* tracker */
  .pf-tracker {
    padding: 14px 20px 10px;
    border-bottom: 1px solid rgba(201,168,76,.06);
  }
  .pf-tracker-rail {
    display: flex;
    align-items: flex-start;
  }
  .pf-tracker-step {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  .pf-tracker-step:last-child { flex: none; }
  .pf-tracker-dot-row {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .pf-tracker-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .pf-tracker-line {
    flex: 1;
    height: 1px;
  }
  .pf-tracker-lbl {
    font-size: .52rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    margin-top: 5px;
    text-align: center;
  }

  /* products */
  .pf-order-body { padding: 14px 20px 16px; }
  .pf-product-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,.03);
  }
  .pf-product-row:last-child { border-bottom: none; }
  .pf-product-name {
    font-size: .82rem;
    font-weight: 300;
    color: rgba(240,235,224,.58);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .pf-product-bullet {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(201,168,76,.4);
    flex-shrink: 0;
  }
  .pf-product-qty {
    font-size: .7rem;
    color: rgba(240,235,224,.28);
  }
  .pf-order-total-row {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding-top: 10px;
    border-top: 1px solid rgba(201,168,76,.08);
    margin-top: 8px;
  }
  .pf-total-label {
    font-size: .68rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(240,235,224,.3);
  }
  .pf-total-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #c9a84c;
  }
  .pf-total-val em {
    font-style: normal;
    font-family: 'DM Sans', sans-serif;
    font-size: .68rem;
    font-weight: 400;
    color: rgba(240,235,224,.3);
    margin-right: 1px;
  }

  /* empty */
  .pf-empty {
    text-align: center;
    padding: 56px 24px;
    border: 1px solid rgba(201,168,76,.08);
    background: rgba(255,255,255,.01);
  }
  .pf-empty-sym {
    font-family: 'Playfair Display', serif;
    font-size: 3.5rem;
    font-style: italic;
    font-weight: 900;
    color: rgba(201,168,76,.1);
    margin-bottom: 12px;
    line-height: 1;
  }
  .pf-empty p {
    font-size: .75rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(240,235,224,.22);
  }

  /* skeleton */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg,
      rgba(255,255,255,.03) 25%,
      rgba(255,255,255,.07) 50%,
      rgba(255,255,255,.03) 75%);
    background-size: 800px 100%;
    animation: skel 1.4s infinite linear;
    border-radius: 2px;
  }
`;

const STEPS = ['pending', 'paid', 'shipped', 'delivered'];

const StatusTracker = ({ status }) => {
  if (status === 'cancelled') return null;
  const cur = STEPS.indexOf(status);
  return (
    <div className="pf-tracker">
      <div className="pf-tracker-rail">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className="pf-tracker-step"
            style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}
          >
            <div className="pf-tracker-dot-row">
              <div
                className="pf-tracker-dot"
                style={{
                  background: i <= cur ? '#c9a84c' : 'rgba(201,168,76,.15)',
                  border: `2px solid ${i <= cur ? '#c9a84c' : 'rgba(201,168,76,.2)'}`,
                  boxShadow: i === cur ? '0 0 8px rgba(201,168,76,.7)' : 'none',
                }}
              />
              {i < STEPS.length - 1 && (
                <div
                  className="pf-tracker-line"
                  style={{
                    background: i < cur ? '#c9a84c' : 'rgba(201,168,76,.1)',
                  }}
                />
              )}
            </div>
            <div
              className="pf-tracker-lbl"
              style={{ color: i <= cur ? 'rgba(201,168,76,.75)' : 'rgba(240,235,224,.2)' }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/order/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const totalSpent = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const delivered  = orders.filter(o => o.status === 'delivered').length;
  const initials   = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <>
      <style>{css}</style>
      <div className="pf-wrap">
        <div className="pf-inner">

          {/* HEADER */}
          <div className="pf-header">
            <div className="pf-eyebrow">
              <div className="pf-eyebrow-dot" />
              <span>Account</span>
            </div>
            <h1 className="pf-title">My Profile</h1>
          </div>

          {/* PROFILE CARD */}
          <div className="pf-profile-card">
            <div className="pf-profile-top">
              <div className="pf-avatar">{initials}</div>
              <div>
                <div className="pf-profile-name">{user?.name || '—'}</div>
                <div className="pf-profile-email">{user?.email || '—'}</div>
                <span className={`pf-role-badge ${user?.role === 'admin' ? 'admin' : 'user'}`}>
                  {user?.role || 'user'}
                </span>
              </div>
            </div>

            <div className="pf-stats-strip">
              <div className="pf-stat">
                <div className="pf-stat-val">{orders.length}</div>
                <div className="pf-stat-label">Orders</div>
              </div>
              <div className="pf-stat">
                <div className="pf-stat-val">{delivered}</div>
                <div className="pf-stat-label">Delivered</div>
              </div>
              <div className="pf-stat">
                <div className="pf-stat-val">₹{totalSpent.toLocaleString()}</div>
                <div className="pf-stat-label">Total Spent</div>
              </div>
            </div>
          </div>

          {/* ORDERS */}
          <div className="pf-orders-section">
            <div className="pf-orders-header">
              <div className="pf-orders-title">Order History</div>
              {!loading && (
                <div className="pf-orders-count">
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="pf-order" style={{ padding: 20, marginBottom: 2 }}>
                  <div className="skel" style={{ height: 13, width: '35%', marginBottom: 10 }} />
                  <div className="skel" style={{ height: 10, width: '55%', marginBottom: 8 }} />
                  <div className="skel" style={{ height: 10, width: '25%' }} />
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="pf-empty">
                <div className="pf-empty-sym">◈</div>
                <p>No orders placed yet</p>
              </div>
            ) : (
              orders.map((order, idx) => (
                <div
                  key={order._id}
                  className="pf-order"
                  style={{ animation: `fadeUp .5s cubic-bezier(.16,1,.3,1) ${idx * 0.07 + 0.1}s both` }}
                >
                  {/* Head */}
                  <div className="pf-order-head">
                    <div>
                      <div className="pf-order-id">
                        <em>Order</em>#{order._id.slice(-6).toUpperCase()}
                      </div>
                      <div className="pf-order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <span className={`pf-status ${order.status}`}>{order.status}</span>
                  </div>

                  {/* Tracker */}
                  <StatusTracker status={order.status} />

                  {/* Products + Total */}
                  <div className="pf-order-body">
                    {order.products.map(item => (
                      <div key={item._id} className="pf-product-row">
                        <div className="pf-product-name">
                          <div className="pf-product-bullet" />
                          {item.product?.name || 'Product'}
                        </div>
                        <div className="pf-product-qty">× {item.quantity}</div>
                      </div>
                    ))}
                    <div className="pf-order-total-row">
                      <span className="pf-total-label">Order Total</span>
                      <div className="pf-total-val">
                        <em>₹</em>{order.totalAmount?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
