import { useEffect, useState } from "react";
import api from "../../services/api";
import { X, Package, Hash, IndianRupee, ShoppingBag } from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .om-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,.75);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: omFadeIn .2s ease both;
  }
  @keyframes omFadeIn { from{opacity:0} to{opacity:1} }

  .om-modal {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    border: 1px solid rgba(56,139,253,.2);
    width: 100%; max-width: 680px;
    max-height: 88vh;
    display: flex; flex-direction: column;
    position: relative;
    animation: omSlideUp .3s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes omSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

  .om-modal::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, rgba(56,139,253,.3), transparent);
  }

  /* header */
  .om-head {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(56,139,253,.1);
    flex-shrink: 0;
  }
  .om-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .om-eyebrow-line { height: 1px; width: 20px; background: linear-gradient(90deg,#388bfd,transparent); }
  .om-eyebrow-text { font-size: .52rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.55); }
  .om-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem; font-weight: 800; letter-spacing: -.02em;
    color: #e8f4ff; line-height: 1;
  }
  .om-title span { color: rgba(56,139,253,.7); }
  .om-subtitle { font-size: .6rem; color: rgba(168,196,224,.3); letter-spacing: .1em; margin-top: 5px; }

  .om-close {
    background: rgba(56,139,253,.06); border: 1px solid rgba(56,139,253,.18);
    color: rgba(168,196,224,.45); cursor: pointer; padding: 7px;
    display: flex; align-items: center; justify-content: center;
    transition: all .2s; flex-shrink: 0;
  }
  .om-close:hover { background: rgba(239,68,68,.1); border-color: rgba(239,68,68,.35); color: #f87171; }

  /* stats strip */
  .om-stats {
    display: flex; gap: 1px;
    background: rgba(56,139,253,.06);
    border-bottom: 1px solid rgba(56,139,253,.08);
    flex-shrink: 0;
  }
  .om-stat {
    flex: 1; padding: 12px 18px;
    background: #03060f;
    display: flex; flex-direction: column; gap: 3px;
  }
  .om-stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem; font-weight: 800; color: #e8f4ff; line-height: 1;
  }
  .om-stat-lbl { font-size: .5rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.22); }

  /* body */
  .om-body { overflow-y: auto; padding: 20px 24px; flex: 1; }
  .om-body::-webkit-scrollbar { width: 4px; }
  .om-body::-webkit-scrollbar-track { background: transparent; }
  .om-body::-webkit-scrollbar-thumb { background: rgba(56,139,253,.2); }

  /* order card */
  .om-order {
    border: 1px solid rgba(56,139,253,.1);
    background: rgba(56,139,253,.02);
    margin-bottom: 12px;
    animation: omSlideUp .35s cubic-bezier(.16,1,.3,1) both;
    transition: border-color .2s;
  }
  .om-order:hover { border-color: rgba(56,139,253,.22); }
  .om-order:last-child { margin-bottom: 0; }

  .om-order-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 16px; gap: 12px; flex-wrap: wrap;
    border-bottom: 1px solid rgba(56,139,253,.07);
  }
  .om-order-id {
    display: flex; align-items: center; gap: 7px;
    font-size: .62rem; color: rgba(168,196,224,.35); letter-spacing: .08em;
  }
  .om-order-id strong { color: rgba(56,139,253,.65); font-weight: 500; }

  .om-order-meta { display: flex; align-items: center; gap: 10px; }
  .om-amount {
    display: flex; align-items: center; gap: 4px;
    font-family: 'Syne', sans-serif;
    font-size: .95rem; font-weight: 800; color: #e8f4ff;
  }
  .om-amount svg { color: rgba(56,139,253,.6); }

  /* status badge */
  .om-status {
    font-size: .52rem; letter-spacing: .18em; text-transform: uppercase; font-weight: 700;
    padding: 4px 10px; border: 1px solid;
  }
  .om-status.pending   { background: rgba(251,191,36,.07);  border-color: rgba(251,191,36,.3);  color: #fbbf24; }
  .om-status.delivered { background: rgba(0,212,180,.07);   border-color: rgba(0,212,180,.3);   color: #00d4b4; }
  .om-status.cancelled { background: rgba(239,68,68,.07);   border-color: rgba(239,68,68,.3);   color: #f87171; }
  .om-status.shipped   { background: rgba(56,139,253,.07);  border-color: rgba(56,139,253,.3);  color: #79b8ff; }
  .om-status.processing{ background: rgba(168,85,247,.07);  border-color: rgba(168,85,247,.3);  color: #c084fc; }

  /* products list */
  .om-products { padding: 10px 16px; }
  .om-product {
    display: flex; align-items: center; justify-content: space-between;
    padding: 7px 0;
    border-bottom: 1px solid rgba(56,139,253,.05);
    font-size: .68rem;
  }
  .om-product:last-child { border-bottom: none; }
  .om-product-name {
    display: flex; align-items: center; gap: 8px;
    color: rgba(168,196,224,.6);
  }
  .om-product-name svg { color: rgba(56,139,253,.35); flex-shrink: 0; }
  .om-qty {
    font-size: .55rem; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(56,139,253,.5);
    background: rgba(56,139,253,.07); border: 1px solid rgba(56,139,253,.15);
    padding: 2px 8px;
  }

  /* empty */
  .om-empty {
    text-align: center; padding: 60px 24px;
  }
  .om-empty-sym {
    font-family: 'Syne', sans-serif;
    font-size: 3rem; font-weight: 800;
    color: rgba(56,139,253,.07); line-height: 1; margin-bottom: 12px;
  }
  .om-empty p { font-size: .58rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.2); }

  /* skeleton */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg, rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 800px 100%; animation: skel 1.4s infinite linear;
  }
`;

const statusClass = (s) => {
  const map = { pending:'pending', delivered:'delivered', cancelled:'cancelled', shipped:'shipped', processing:'processing' };
  return map[s?.toLowerCase()] || 'pending';
};

const UserOrdersModal = ({ user, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`/admin/users/${user._id}/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const total = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const initials = (name) => name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';

  return (
    <>
      <style>{css}</style>
      <div className="om-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="om-modal">

          {/* HEADER */}
          <div className="om-head">
            <div>
              <div className="om-eyebrow">
                <div className="om-eyebrow-line" />
                <span className="om-eyebrow-text">Admin / Orders</span>
              </div>
              <div className="om-title">
                <span>{initials(user.name)}</span> {user.name}
              </div>
              <div className="om-subtitle">{user.email}</div>
            </div>
            <button className="om-close" onClick={onClose}>
              <X size={15} />
            </button>
          </div>

          {/* STATS STRIP */}
          {!loading && (
            <div className="om-stats">
              <div className="om-stat">
                <div className="om-stat-val">{orders.length}</div>
                <div className="om-stat-lbl">Total Orders</div>
              </div>
              <div className="om-stat">
                <div className="om-stat-val">₹{total.toLocaleString('en-IN')}</div>
                <div className="om-stat-lbl">Total Spent</div>
              </div>
              <div className="om-stat">
                <div className="om-stat-val">
                  {orders.filter(o => o.status?.toLowerCase() === 'delivered').length}
                </div>
                <div className="om-stat-lbl">Delivered</div>
              </div>
            </div>
          )}

          {/* BODY */}
          <div className="om-body">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="om-order" style={{ marginBottom: 12 }}>
                  <div className="om-order-head">
                    <div className="skel" style={{ height: 10, width: 180, borderRadius: 1 }} />
                    <div style={{ display:'flex', gap: 8 }}>
                      <div className="skel" style={{ height: 22, width: 60, borderRadius: 1 }} />
                      <div className="skel" style={{ height: 22, width: 70, borderRadius: 1 }} />
                    </div>
                  </div>
                  <div className="om-products">
                    {[1,2].map(j => (
                      <div key={j} className="om-product">
                        <div className="skel" style={{ height: 10, width: 140, borderRadius: 1 }} />
                        <div className="skel" style={{ height: 18, width: 40, borderRadius: 1 }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="om-empty">
                <div className="om-empty-sym">[ ]</div>
                <p>No orders found</p>
              </div>
            ) : (
              orders.map((order, idx) => (
                <div
                  key={order._id}
                  className="om-order"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="om-order-head">
                    <div className="om-order-id">
                      <Hash size={10} />
                      <strong>{order._id.slice(-10).toUpperCase()}</strong>
                    </div>
                    <div className="om-order-meta">
                      <div className="om-amount">
                        <IndianRupee size={13} />
                        {order.totalAmount?.toLocaleString('en-IN')}
                      </div>
                      <span className={`om-status ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="om-products">
                    {order.products.map((p, i) => (
                      <div key={i} className="om-product">
                        <div className="om-product-name">
                          <Package size={11} />
                          {p.product?.name || 'Unknown Product'}
                        </div>
                        <span className="om-qty">× {p.quantity}</span>
                      </div>
                    ))}
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

export default UserOrdersModal;