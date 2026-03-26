import { useCart } from "../context/CartContext";
import { X } from "lucide-react";
import api from "../services/api";
import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── OVERLAY ── */
  .cs-overlay {
    position: fixed;
    inset: 0;
    background: rgba(8,8,16,.65);
    backdrop-filter: blur(4px);
    z-index: 200;
    animation: csOverlayIn .3s ease both;
  }
  @keyframes csOverlayIn { from{opacity:0} to{opacity:1} }

  /* ── PANEL ── */
  .cs-panel {
    position: fixed;
    top: 0; right: 0;
    height: 100%;
    width: 380px;
    max-width: 100vw;
    background: #0c0c18;
    border-left: 1px solid rgba(201,168,76,.2);
    display: flex;
    flex-direction: column;
    z-index: 201;
    animation: csPanelIn .4s cubic-bezier(.16,1,.3,1) both;
    font-family: 'DM Sans', sans-serif;
  }
  @keyframes csPanelIn {
    from { transform: translateX(100%); opacity: 0; }
    to   { transform: translateX(0);    opacity: 1; }
  }
  /* top accent */
  .cs-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }

  /* ── HEADER ── */
  .cs-header {
    padding: 22px 24px 18px;
    border-bottom: 1px solid rgba(201,168,76,.12);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }
  .cs-header-left { display: flex; flex-direction: column; gap: 2px; }
  .cs-eyebrow {
    font-size: .6rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: #c9a84c;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .cs-eyebrow-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #c9a84c;
    box-shadow: 0 0 6px rgba(201,168,76,.7);
  }
  .cs-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 900;
    color: #f0ebe0;
    line-height: 1.1;
  }
  .cs-close-btn {
    width: 34px; height: 34px;
    border: 1px solid rgba(201,168,76,.2);
    border-radius: 2px;
    background: rgba(201,168,76,.04);
    color: rgba(240,235,224,.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: border-color .2s, color .2s, background .2s;
    flex-shrink: 0;
  }
  .cs-close-btn:hover {
    border-color: rgba(201,168,76,.5);
    color: #c9a84c;
    background: rgba(201,168,76,.08);
  }

  /* ── ITEMS ── */
  .cs-items {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
    scrollbar-width: thin;
    scrollbar-color: rgba(201,168,76,.2) transparent;
  }
  .cs-items::-webkit-scrollbar { width: 4px; }
  .cs-items::-webkit-scrollbar-track { background: transparent; }
  .cs-items::-webkit-scrollbar-thumb { background: rgba(201,168,76,.2); border-radius: 2px; }

  /* item row */
  .cs-item {
    display: grid;
    grid-template-columns: 56px 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 14px 24px;
    border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .2s;
    animation: csItemIn .4s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes csItemIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
  .cs-item:hover { background: rgba(201,168,76,.03); }
  .cs-item:last-child { border-bottom: none; }

  /* image */
  .cs-img-wrap {
    width: 56px; height: 56px;
    border: 1px solid rgba(201,168,76,.15);
    border-radius: 2px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .cs-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .4s;
  }
  .cs-item:hover .cs-img { transform: scale(1.08); }

  /* info */
  .cs-item-name {
    font-family: 'Playfair Display', serif;
    font-size: .88rem;
    font-weight: 700;
    color: #f0ebe0;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cs-item-price {
    font-size: .72rem;
    font-weight: 300;
    color: rgba(240,235,224,.4);
    margin-bottom: 8px;
  }

  /* qty controls */
  .cs-qty {
    display: inline-flex;
    align-items: center;
    border: 1px solid rgba(201,168,76,.2);
    border-radius: 2px;
    overflow: hidden;
  }
  .cs-qty-btn {
    width: 24px; height: 24px;
    background: rgba(201,168,76,.06);
    border: none;
    color: #c9a84c;
    font-size: .9rem; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cs-qty-btn:hover { background: rgba(201,168,76,.15); }
  .cs-qty-btn:disabled { opacity: .3; cursor: not-allowed; }
  .cs-qty-val {
    width: 28px;
    text-align: center;
    font-size: .78rem;
    font-weight: 600;
    color: #f0ebe0;
    border-left: 1px solid rgba(201,168,76,.18);
    border-right: 1px solid rgba(201,168,76,.18);
    line-height: 24px;
    user-select: none;
  }

  /* right col */
  .cs-item-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;
  }
  .cs-item-subtotal {
    font-family: 'Playfair Display', serif;
    font-size: .95rem;
    font-weight: 700;
    color: #c9a84c;
    white-space: nowrap;
  }
  .cs-remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(240,235,224,.22);
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: .6rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    padding: 0;
    transition: color .2s;
  }
  .cs-remove-btn:hover { color: #f87171; }

  /* ── EMPTY ── */
  .cs-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 24px;
  }
  .cs-empty-sym {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    font-style: italic;
    font-weight: 900;
    color: rgba(201,168,76,.1);
    line-height: 1;
  }
  .cs-empty-text {
    font-size: .72rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(240,235,224,.22);
  }

  /* ── FOOTER ── */
  .cs-footer {
    border-top: 1px solid rgba(201,168,76,.12);
    padding: 20px 24px 24px;
    flex-shrink: 0;
    background: rgba(8,8,16,.6);
  }

  /* free shipping bar */
  .cs-ship-msg {
    font-size: .68rem;
    letter-spacing: .06em;
    color: rgba(240,235,224,.3);
    margin-bottom: 6px;
  }
  .cs-ship-msg em { color: #c9a84c; font-style: normal; font-weight: 500; }
  .cs-ship-bar-track {
    height: 2px;
    background: rgba(201,168,76,.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 18px;
  }
  .cs-ship-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #c9a84c, #e8d08a);
    border-radius: 2px;
    transition: width .6s cubic-bezier(.16,1,.3,1);
  }

  /* totals row */
  .cs-totals {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .cs-total-label {
    font-size: .68rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(240,235,224,.35);
    font-weight: 500;
  }
  .cs-total-val {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem;
    font-weight: 900;
    color: #c9a84c;
  }
  .cs-total-val em {
    font-style: normal;
    font-size: .7rem;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    color: rgba(240,235,224,.3);
    margin-right: 2px;
  }

  /* pay button */
  .cs-pay-btn {
    width: 100%;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: .75rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 14px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform .3s, box-shadow .3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .cs-pay-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .45s cubic-bezier(.16,1,.3,1);
  }
  .cs-pay-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .cs-pay-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(201,168,76,.4); }
  .cs-pay-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
  .cs-pay-btn.success { background: linear-gradient(135deg, #2d6a4f, #40916c); color: #fff; }

  /* spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .cs-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(8,8,16,.25);
    border-top-color: #080810;
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }

  /* trust row */
  .cs-trust {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 14px;
    flex-wrap: wrap;
  }
  .cs-trust-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: .6rem;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: rgba(240,235,224,.2);
  }
  .cs-trust-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: #c9a84c;
    flex-shrink: 0;
  }

  /* toast */
  .cs-toast {
    position: fixed;
    bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #c9a84c; color: #080810;
    font-size: .72rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 24px; border-radius: 2px;
    box-shadow: 0 10px 28px rgba(201,168,76,.35);
    z-index: 300;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
    white-space: nowrap;
  }
  .cs-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .cs-toast.error { background: #ef4444; color: #fff; box-shadow: 0 10px 28px rgba(239,68,68,.35); }

  @media (max-width: 420px) {
    .cs-panel { width: 100vw; }
  }
`;

const FREE_SHIP_AT = 999;

const IconTrash = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
  </svg>
);
const IconBag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CartSidebar = ({ showCart, setShowCart }) => {
  const { cart, removeFromCart, clearCart, totalPrice, incrementItem, decrementItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', error: false });

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 2800);
  };

  const total = totalPrice();
  const shipProgress = Math.min((total / FREE_SHIP_AT) * 100, 100);
  const remaining = FREE_SHIP_AT - total;

  const handlePay = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Please login to place order", true);
        return;
      }

      setLoading(true);

      await api.post(
        "/order/create",
        {
          products: cart.map(item => ({
            product: item._id,
            quantity: item.quantity || 1,
            price: item.price,
          })),
          totalAmount: total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      showToast("Order placed successfully!");
      setTimeout(() => {
        clearCart();
        setShowCart(false);
        setSuccess(false);
      }, 1600);

    } catch (error) {
      console.error(error);
      showToast("Order failed. Please try again.", true);
    } finally {
      setLoading(false);
    }
  };

  if (!showCart) return null;

  return (
    <>
      <style>{css}</style>

      {/* Overlay */}
      <div className="cs-overlay" onClick={() => setShowCart(false)} />

      {/* Panel */}
      <div className="cs-panel">

        {/* Header */}
        <div className="cs-header">
          <div className="cs-header-left">
            <div className="cs-eyebrow">
              <div className="cs-eyebrow-dot" />
              Shopping Cart
            </div>
            <div className="cs-title">
              {cart.length === 0 ? "Your Cart" : `${cart.reduce((s,i) => s + i.quantity, 0)} Items`}
            </div>
          </div>
          <button className="cs-close-btn" onClick={() => setShowCart(false)}>
            <X size={15} />
          </button>
        </div>

        {/* Empty state */}
        {cart.length === 0 ? (
          <div className="cs-empty">
            <div className="cs-empty-sym">◈</div>
            <div className="cs-empty-text">Your cart is empty</div>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="cs-items">
              {cart.map((item, idx) => (
                <div
                  key={item._id}
                  className="cs-item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="cs-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cs-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/56x56/0f0f1a/c9a84c?text=◈'; }}
                    />
                  </div>

                  {/* Info + qty */}
                  <div style={{ minWidth: 0 }}>
                    <div className="cs-item-name">{item.name}</div>
                    <div className="cs-item-price">₹{item.price?.toLocaleString()} / unit</div>
                    <div className="cs-qty">
                      <button
                        className="cs-qty-btn"
                        onClick={() => decrementItem(item._id)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <div className="cs-qty-val">{item.quantity}</div>
                      <button
                        className="cs-qty-btn"
                        onClick={() => incrementItem(item._id)}
                      >+</button>
                    </div>
                  </div>

                  {/* Subtotal + remove */}
                  <div className="cs-item-right">
                    <div className="cs-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                      className="cs-remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <IconTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cs-footer">
              {/* Free shipping progress */}
              {total >= FREE_SHIP_AT ? (
                <div className="cs-ship-msg">🎉 You've unlocked <em>free shipping!</em></div>
              ) : (
                <div className="cs-ship-msg">
                  Add <em>₹{remaining.toLocaleString()}</em> more for free shipping
                </div>
              )}
              <div className="cs-ship-bar-track">
                <div className="cs-ship-bar-fill" style={{ width: `${shipProgress}%` }} />
              </div>

              {/* Total */}
              <div className="cs-totals">
                <span className="cs-total-label">Order Total</span>
                <div className="cs-total-val">
                  <em>₹</em>{total.toLocaleString()}
                </div>
              </div>

              {/* Pay button */}
              <button
                className={`cs-pay-btn${success ? ' success' : ''}`}
                onClick={handlePay}
                disabled={loading}
              >
                {loading
                  ? <><span className="cs-spinner" /> Processing…</>
                  : success
                  ? <><IconCheck /> Order Placed!</>
                  : <><IconBag /> Place Order</>
                }
              </button>

              {/* Trust badges */}
              <div className="cs-trust">
                {['Secure', 'Easy Returns', 'Encrypted'].map(t => (
                  <div key={t} className="cs-trust-item">
                    <span className="cs-trust-dot" />{t}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      <div className={`cs-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
};

export default CartSidebar;
