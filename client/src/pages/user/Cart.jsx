import React, { useState, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cart-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    color: #f0ebe0;
    padding: 80px 24px 120px;
    position: relative;
    overflow-x: hidden;
  }

  /* bg */
  .cart-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .cart-glow-a {
    position: fixed; top: -20%; right: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.11) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .cart-glow-b {
    position: fixed; bottom: -20%; left: -10%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(80,60,200,.09) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* ── header ── */
  .cart-header {
    position: relative; z-index: 1;
    text-align: center; margin-bottom: 56px;
  }
  .cart-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 18px;
    border: 1px solid rgba(201,168,76,.4);
    padding: 6px 18px; border-radius: 2px;
  }
  .cart-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c9a84c; box-shadow: 0 0 8px rgba(201,168,76,.7);
  }
  .cart-eyebrow span {
    font-size: .68rem; letter-spacing: .2em;
    text-transform: uppercase; color: #c9a84c; font-weight: 500;
  }
  .cart-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 6vw, 3.8rem);
    font-weight: 900; line-height: 1.05;
    background: linear-gradient(90deg,#c9a84c,#e8d08a,#fff8df,#c9a84c);
    background-size: 300%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 6s ease infinite;
    margin-bottom: 10px;
  }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .cart-count-badge {
    display: inline-block;
    background: rgba(201,168,76,.15);
    border: 1px solid rgba(201,168,76,.3);
    color: #c9a84c; font-size: .72rem;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 14px; border-radius: 2px;
    font-weight: 500;
  }

  /* ── layout ── */
  .cart-layout {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .cart-layout { grid-template-columns: 1fr; }
  }

  /* ── items list ── */
  .cart-items { display: flex; flex-direction: column; gap: 2px; }

  /* ── cart item card ── */
  .cart-item {
    display: grid;
    grid-template-columns: 100px 1fr auto;
    gap: 20px;
    align-items: center;
    padding: 22px 24px;
    border: 1px solid rgba(201,168,76,.12);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    transition: border-color .3s, transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s;
    animation: itemIn .5s cubic-bezier(.16,1,.3,1) both;
    position: relative;
  }
  @keyframes itemIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  .cart-item:hover {
    border-color: rgba(201,168,76,.35);
    box-shadow: 0 8px 32px rgba(201,168,76,.08);
  }
  @media (max-width: 560px) {
    .cart-item { grid-template-columns: 80px 1fr; }
    .cart-item-right { grid-column: 1 / -1; }
  }

  /* image */
  .cart-img-wrap {
    width: 100px; height: 100px;
    overflow: hidden; border-radius: 2px;
    border: 1px solid rgba(201,168,76,.12);
    flex-shrink: 0;
  }
  .cart-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .cart-item:hover .cart-img { transform: scale(1.06); }

  /* info */
  .cart-item-info { flex: 1; min-width: 0; }
  .cart-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.05rem; font-weight: 700;
    color: #f0ebe0; margin-bottom: 6px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .cart-item-unit {
    font-size: .75rem; color: rgba(240,235,224,.35);
    letter-spacing: .06em; margin-bottom: 14px;
  }

  /* qty controls */
  .cart-qty {
    display: inline-flex; align-items: center; gap: 0;
    border: 1px solid rgba(201,168,76,.25); border-radius: 2px;
    overflow: hidden;
  }
  .cart-qty-btn {
    width: 32px; height: 32px;
    background: rgba(201,168,76,.06);
    border: none; color: #c9a84c;
    font-size: 1rem; font-weight: 600;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: background .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .cart-qty-btn:hover { background: rgba(201,168,76,.15); }
  .cart-qty-btn:disabled { opacity: .35; cursor: not-allowed; }
  .cart-qty-val {
    width: 36px; text-align: center;
    font-size: .88rem; font-weight: 600; color: #f0ebe0;
    border-left: 1px solid rgba(201,168,76,.2);
    border-right: 1px solid rgba(201,168,76,.2);
    line-height: 32px;
  }

  /* right col */
  .cart-item-right {
    display: flex; flex-direction: column;
    align-items: flex-end; gap: 12px;
  }
  .cart-item-subtotal {
    font-family: 'Playfair Display', serif;
    font-size: 1.2rem; font-weight: 700; color: #c9a84c;
    white-space: nowrap;
  }
  .cart-item-subtotal span {
    font-size: .72rem; font-family: 'DM Sans', sans-serif;
    font-weight: 400; color: rgba(240,235,224,.3); margin-right: 2px;
  }
  .cart-remove-btn {
    background: none; border: none; cursor: pointer;
    color: rgba(240,235,224,.25);
    display: flex; align-items: center; gap: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: .68rem; letter-spacing: .1em;
    text-transform: uppercase; font-weight: 500;
    transition: color .2s;
    padding: 0;
  }
  .cart-remove-btn:hover { color: #e05c5c; }

  /* ── empty state ── */
  .cart-empty {
    position: relative; z-index: 1;
    text-align: center; padding: 120px 24px;
    grid-column: 1 / -1;
  }
  .cart-empty-icon {
    font-family: 'Playfair Display', serif;
    font-size: 5rem; font-style: italic; font-weight: 900;
    color: rgba(201,168,76,.08); margin-bottom: 20px; line-height: 1;
  }
  .cart-empty-text {
    font-size: .9rem; color: rgba(240,235,224,.3);
    letter-spacing: .1em; text-transform: uppercase;
    margin-bottom: 28px;
  }
  .cart-empty-btn {
    display: inline-block; text-decoration: none;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: .75rem;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 13px 36px; border-radius: 2px; border: none;
    cursor: pointer;
    transition: transform .3s, box-shadow .3s;
  }
  .cart-empty-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(201,168,76,.4); }

  /* ── summary panel ── */
  .cart-summary {
    border: 1px solid rgba(201,168,76,.18);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    padding: 36px 32px;
    position: relative;
  }
  .cart-summary::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }
  .cart-summary-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700;
    margin-bottom: 28px; color: #f0ebe0;
  }
  .cart-summary-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px;
    font-size: .82rem; color: rgba(240,235,224,.45); font-weight: 300;
  }
  .cart-summary-row.total {
    margin-top: 20px; padding-top: 20px;
    border-top: 1px solid rgba(201,168,76,.15);
    font-size: 1rem; color: #f0ebe0; font-weight: 600;
  }
  .cart-summary-row.total .val {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900; color: #c9a84c;
  }
  .cart-summary-row .val { color: #f0ebe0; }

  /* free shipping bar */
  .cart-shipping-bar-wrap { margin: 20px 0; }
  .cart-shipping-msg {
    font-size: .72rem; letter-spacing: .06em;
    color: rgba(240,235,224,.35); margin-bottom: 8px;
  }
  .cart-shipping-msg em { color: #c9a84c; font-style: normal; font-weight: 500; }
  .cart-bar-track {
    height: 3px; background: rgba(201,168,76,.12); border-radius: 2px; overflow: hidden;
  }
  .cart-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #c9a84c, #e8d08a);
    border-radius: 2px;
    transition: width .6s cubic-bezier(.16,1,.3,1);
  }

  /* order btn */
  .cart-order-btn {
    width: 100%; margin-top: 24px;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: .78rem;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 15px; border: none; border-radius: 2px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .cart-order-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .cart-order-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .cart-order-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,.4); }

  /* trust row */
  .cart-trust {
    display: flex; flex-direction: column; gap: 10px;
    margin-top: 24px; padding-top: 24px;
    border-top: 1px solid rgba(240,235,224,.07);
  }
  .cart-trust-item {
    display: flex; align-items: center; gap: 8px;
    font-size: .68rem; letter-spacing: .1em;
    text-transform: uppercase; color: rgba(240,235,224,.22);
  }
  .cart-trust-dot {
    width: 3px; height: 3px; border-radius: 50%;
    background: #c9a84c; flex-shrink: 0;
  }

  /* remove animation */
  .cart-item.removing {
    animation: itemOut .35s cubic-bezier(.16,1,.3,1) forwards;
  }
  @keyframes itemOut { to { opacity:0; transform:translateX(30px); max-height:0; padding:0; margin:0; border:none; } }
`;

const IconTrash = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IconBag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconShield = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const FREE_SHIPPING_AT = 999;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) setCart(savedCart);
  }, []);

  const save = (updated) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increase = (id) => save(cart.map(item =>
    item._id === id ? { ...item, quantity: item.quantity + 1 } : item
  ));

  const decrease = (id) => save(cart.map(item =>
    item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
  ));

  const removeItem = (id) => {
    setRemoving(id);
    setTimeout(() => {
      const updated = cart.filter(item => item._id !== id);
      save(updated);
      setRemoving(null);
    }, 350);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingProgress = Math.min((total / FREE_SHIPPING_AT) * 100, 100);
  const remaining = FREE_SHIPPING_AT - total;

  return (
    <>
      <style>{css}</style>
      <div className="cart-wrap">
        <div className="cart-grid-bg" />
        <div className="cart-glow-a" />
        <div className="cart-glow-b" />

        {/* ── Header ── */}
        <div className="cart-header">
          <div className="cart-eyebrow">
            <div className="cart-eyebrow-dot" />
            <span>Shopping</span>
          </div>
          <h1 className="cart-title">My Cart</h1>
          {cart.length > 0 && (
            <div className="cart-count-badge">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
          )}
        </div>

        {/* ── Layout ── */}
        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">◈</div>
            <p className="cart-empty-text">Your cart is empty</p>
            <button className="cart-empty-btn" onClick={() => window.history.back()}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">

            {/* Items */}
            <div className="cart-items">
              {cart.map((item, idx) => (
                <div
                  key={item._id}
                  className={`cart-item${removing === item._id ? ' removing' : ''}`}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  {/* Image */}
                  <div className="cart-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/100x100/0f0f1a/c9a84c?text=◈'; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-unit">₹{item.price?.toLocaleString()} per unit</div>
                    <div className="cart-qty">
                      <button className="cart-qty-btn" onClick={() => decrease(item._id)} disabled={item.quantity <= 1}>−</button>
                      <div className="cart-qty-val">{item.quantity}</div>
                      <button className="cart-qty-btn" onClick={() => increase(item._id)}>+</button>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="cart-item-right">
                    <div className="cart-item-subtotal">
                      <span>₹</span>{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button className="cart-remove-btn" onClick={() => removeItem(item._id)}>
                      <IconTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-title">Order Summary</div>

              <div className="cart-summary-row">
                <span>Subtotal ({itemCount} items)</span>
                <span className="val">₹{total.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="val" style={{ color: total >= FREE_SHIPPING_AT ? '#40916c' : undefined }}>
                  {total >= FREE_SHIPPING_AT ? 'Free' : `₹${(FREE_SHIPPING_AT - total).toLocaleString()} away`}
                </span>
              </div>

              {/* Free shipping progress */}
              <div className="cart-shipping-bar-wrap">
                {total >= FREE_SHIPPING_AT ? (
                  <div className="cart-shipping-msg">🎉 You've unlocked <em>free shipping!</em></div>
                ) : (
                  <div className="cart-shipping-msg">Add <em>₹{remaining.toLocaleString()}</em> more for free shipping</div>
                )}
                <div className="cart-bar-track">
                  <div className="cart-bar-fill" style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              <div className="cart-summary-row total">
                <span>Total</span>
                <span className="val">₹{total.toLocaleString()}</span>
              </div>

              <button className="cart-order-btn">
                <IconBag /> Place Order <IconArrow />
              </button>

              <div className="cart-trust">
                {['Secure Checkout', 'Easy Returns', 'Encrypted Payment'].map(t => (
                  <div key={t} className="cart-trust-item">
                    <span className="cart-trust-dot" /> {t}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default Cart;