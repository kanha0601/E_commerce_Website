import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .co-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    color: #f0ebe0;
    padding: 80px 24px 120px;
    position: relative;
    overflow-x: hidden;
  }

  .co-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .co-glow-a {
    position: fixed; top: -20%; right: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.11) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .co-glow-b {
    position: fixed; bottom: -20%; left: -10%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(80,60,200,.09) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .co-header {
    position: relative; z-index: 1;
    text-align: center; margin-bottom: 56px;
  }
  .co-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 18px;
    border: 1px solid rgba(201,168,76,.4);
    padding: 6px 18px; border-radius: 2px;
  }
  .co-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #c9a84c; box-shadow: 0 0 8px rgba(201,168,76,.7);
  }
  .co-eyebrow span {
    font-size: .68rem; letter-spacing: .2em;
    text-transform: uppercase; color: #c9a84c; font-weight: 500;
  }
  .co-title {
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

  .co-layout {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .co-layout { grid-template-columns: 1fr; }
  }

  .co-card {
    border: 1px solid rgba(201,168,76,.12);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    padding: 36px 32px;
    margin-bottom: 2px;
    position: relative;
    animation: fadeUp .5s cubic-bezier(.16,1,.3,1) both;
  }
  .co-card:nth-child(2) { animation-delay: .08s; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .co-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.15rem; font-weight: 700;
    color: #f0ebe0; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .co-card-title-num {
    width: 26px; height: 26px; border-radius: 50%;
    background: rgba(201,168,76,.12);
    border: 1px solid rgba(201,168,76,.3);
    color: #c9a84c; font-size: .68rem;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    flex-shrink: 0;
  }

  .co-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .co-form-grid .full { grid-column: 1 / -1; }
  @media (max-width: 560px) {
    .co-form-grid { grid-template-columns: 1fr; }
    .co-form-grid .full { grid-column: 1; }
  }

  .co-field { display: flex; flex-direction: column; gap: 6px; }
  .co-label {
    font-size: .65rem; letter-spacing: .15em;
    text-transform: uppercase; color: rgba(240,235,224,.35);
    font-weight: 500;
  }
  .co-input {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(201,168,76,.18);
    border-radius: 2px;
    color: #f0ebe0;
    font-family: 'DM Sans', sans-serif;
    font-size: .88rem;
    padding: 12px 16px;
    outline: none;
    transition: border-color .25s, box-shadow .25s;
    width: 100%; box-sizing: border-box;
  }
  .co-input::placeholder { color: rgba(240,235,224,.18); }
  .co-input:focus {
    border-color: rgba(201,168,76,.5);
    box-shadow: 0 0 0 3px rgba(201,168,76,.06);
  }
  .co-input.error { border-color: rgba(224,92,92,.5); }

  .co-pay-options { display: flex; flex-direction: column; gap: 10px; }
  .co-pay-option {
    display: flex; align-items: center; gap: 14px;
    padding: 14px 18px;
    border: 1px solid rgba(201,168,76,.15);
    border-radius: 2px;
    cursor: pointer;
    transition: border-color .25s, background .25s;
    background: rgba(255,255,255,.02);
  }
  .co-pay-option.active {
    border-color: rgba(201,168,76,.45);
    background: rgba(201,168,76,.06);
  }
  .co-pay-option:hover { border-color: rgba(201,168,76,.3); }
  .co-pay-radio {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(201,168,76,.4);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: border-color .2s;
  }
  .co-pay-option.active .co-pay-radio { border-color: #c9a84c; }
  .co-pay-radio-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #c9a84c;
    transform: scale(0); transition: transform .2s;
  }
  .co-pay-option.active .co-pay-radio-dot { transform: scale(1); }
  .co-pay-label { flex: 1; }
  .co-pay-label strong {
    display: block; font-size: .85rem; color: #f0ebe0; font-weight: 500; margin-bottom: 2px;
  }
  .co-pay-label span { font-size: .72rem; color: rgba(240,235,224,.3); }
  .co-pay-badge {
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    padding: 3px 8px; border-radius: 2px;
    background: rgba(201,168,76,.1); color: #c9a84c;
    border: 1px solid rgba(201,168,76,.2);
  }

  .co-summary {
    border: 1px solid rgba(201,168,76,.18);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    padding: 36px 32px;
    position: relative;
    animation: fadeUp .5s .12s cubic-bezier(.16,1,.3,1) both;
  }
  .co-summary::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }
  .co-summary-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700;
    margin-bottom: 24px; color: #f0ebe0;
  }

  .co-order-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(201,168,76,.07);
  }
  .co-order-item:last-child { border-bottom: none; }
  .co-order-img {
    width: 46px; height: 46px; border-radius: 2px;
    object-fit: cover;
    border: 1px solid rgba(201,168,76,.12);
    flex-shrink: 0;
  }
  .co-order-info { flex: 1; min-width: 0; }
  .co-order-name {
    font-size: .8rem; font-weight: 500; color: #f0ebe0;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    margin-bottom: 2px;
  }
  .co-order-qty { font-size: .7rem; color: rgba(240,235,224,.3); }
  .co-order-price {
    font-family: 'Playfair Display', serif;
    font-size: .9rem; font-weight: 700; color: #c9a84c;
    white-space: nowrap;
  }

  .co-summary-row {
    display: flex; justify-content: space-between;
    margin-bottom: 10px;
    font-size: .82rem; color: rgba(240,235,224,.45);
  }
  .co-summary-divider {
    height: 1px; background: rgba(201,168,76,.1); margin: 14px 0;
  }
  .co-summary-total {
    display: flex; justify-content: space-between;
    font-size: 1rem; color: #f0ebe0; font-weight: 600;
    margin-top: 4px;
  }
  .co-summary-total .val {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem; font-weight: 900; color: #c9a84c;
  }

  .co-btn {
    width: 100%; margin-top: 24px;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: .78rem;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 15px; border: none; border-radius: 2px;
    cursor: pointer; position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s, opacity .3s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .co-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .co-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .co-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,.4); }
  .co-btn:disabled { opacity: .55; cursor: not-allowed; }

  .co-back {
    position: relative; z-index: 1;
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    color: rgba(240,235,224,.3);
    font-family: 'DM Sans', sans-serif;
    font-size: .72rem; letter-spacing: .1em; text-transform: uppercase;
    transition: color .2s; padding: 0;
  }
  .co-back:hover { color: #c9a84c; }

  .co-trust {
    display: flex; flex-direction: column; gap: 8px;
    margin-top: 20px; padding-top: 20px;
    border-top: 1px solid rgba(240,235,224,.07);
  }
  .co-trust-item {
    display: flex; align-items: center; gap: 8px;
    font-size: .68rem; letter-spacing: .1em;
    text-transform: uppercase; color: rgba(240,235,224,.22);
  }
  .co-trust-dot { width: 3px; height: 3px; border-radius: 50%; background: #c9a84c; flex-shrink: 0; }

  .co-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(8,8,16,.3);
    border-top-color: #080810;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .co-error-msg { color: #e05c5c; font-size: .72rem; margin-top: 4px; }
`;

const IconArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconBag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CheckOut = () => {
  const navigate = useNavigate();
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [address, setAddress] = useState({
    fullName: "", phone: "", address: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREE_SHIPPING_AT = 999;
  const shipping = totalAmount >= FREE_SHIPPING_AT ? 0 : 80;

  const validate = () => {
    const e = {};
    if (!address.fullName.trim()) e.fullName = "Required";
    if (!address.phone.trim()) e.phone = "Required";
    else if (!/^\d{10}$/.test(address.phone.trim())) e.phone = "Enter a valid 10-digit number";
    if (!address.address.trim()) e.address = "Required";
    if (!address.city.trim()) e.city = "Required";
    if (!address.state.trim()) e.state = "Required";
    if (!address.pincode.trim()) e.pincode = "Required";
    else if (!/^\d{6}$/.test(address.pincode.trim())) e.pincode = "Enter a valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/order/create",
        {
          products: cart,
          totalAmount: totalAmount + shipping,
          shippingAddress: address,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      localStorage.removeItem("cart");
      alert("✅ Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("❌ Order failed: " + (error.response?.data?.message || "Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, placeholder, opts = {}) => (
    <div className={`co-field${opts.full ? " full" : ""}`}>
      <label className="co-label">{label}</label>
      <input
        className={`co-input${errors[key] ? " error" : ""}`}
        placeholder={placeholder}
        value={address[key]}
        onChange={e => {
          setAddress({ ...address, [key]: e.target.value });
          if (errors[key]) setErrors({ ...errors, [key]: undefined });
        }}
        maxLength={opts.maxLength}
      />
      {errors[key] && <span className="co-error-msg">{errors[key]}</span>}
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="co-wrap">
        <div className="co-grid-bg" />
        <div className="co-glow-a" />
        <div className="co-glow-b" />

        {/* Back */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto 24px" }}>
          <button className="co-back" onClick={() => navigate("/cart")}>
            <IconArrowLeft /> Back to Cart
          </button>
        </div>

        {/* Header */}
        <div className="co-header">
          <div className="co-eyebrow">
            <div className="co-eyebrow-dot" />
            <span>Secure Checkout</span>
          </div>
          <h1 className="co-title">Complete Order</h1>
        </div>

        <div className="co-layout">
          {/* Left: Form */}
          <div>
            {/* Shipping Address */}
            <div className="co-card">
              <div className="co-card-title">
                <div className="co-card-title-num">1</div>
                Shipping Address
              </div>
              <div className="co-form-grid">
                {field("fullName", "Full Name", "John Doe", { full: true })}
                {field("phone", "Phone Number", "10-digit mobile number", { maxLength: 10 })}
                {field("address", "Street Address", "House no., Street, Area", { full: true })}
                {field("city", "City", "Mumbai")}
                {field("state", "State", "Maharashtra")}
                {field("pincode", "Pincode", "400001", { maxLength: 6 })}
              </div>
            </div>

            {/* Payment */}
            <div className="co-card">
              <div className="co-card-title">
                <div className="co-card-title-num">2</div>
                Payment Method
              </div>
              <div className="co-pay-options">
                {[
                  { value: "COD", label: "Cash on Delivery", sub: "Pay when your order arrives", badge: "Popular" },
                  { value: "ONLINE", label: "Online Payment", sub: "UPI, Cards, Net Banking", badge: "Instant" },
                ].map(opt => (
                  <div
                    key={opt.value}
                    className={`co-pay-option${paymentMethod === opt.value ? " active" : ""}`}
                    onClick={() => setPaymentMethod(opt.value)}
                  >
                    <div className="co-pay-radio">
                      <div className="co-pay-radio-dot" />
                    </div>
                    <div className="co-pay-label">
                      <strong>{opt.label}</strong>
                      <span>{opt.sub}</span>
                    </div>
                    <div className="co-pay-badge">{opt.badge}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="co-summary">
            <div className="co-summary-title">Order Summary</div>

            <div style={{ marginBottom: 20 }}>
              {cart.map(item => (
                <div key={item._id} className="co-order-item">
                  <img
                    src={item.image || null}
                    alt={item.name}
                    className="co-order-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/46x46/0f0f1a/c9a84c?text=?'; }}
                  />
                  <div className="co-order-info">
                    <div className="co-order-name">{item.name}</div>
                    <div className="co-order-qty">Qty: {item.quantity}</div>
                  </div>
                  <div className="co-order-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="co-summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="co-summary-row">
              <span>Shipping</span>
              <span style={{ color: shipping === 0 ? "#40916c" : undefined }}>
                {shipping === 0 ? "Free" : `₹${shipping}`}
              </span>
            </div>

            <div className="co-summary-divider" />

            <div className="co-summary-total">
              <span>Total</span>
              <span className="val">₹{(totalAmount + shipping).toLocaleString()}</span>
            </div>

            <button className="co-btn" onClick={handleOrder} disabled={loading || cart.length === 0}>
              {loading ? (
                <><div className="co-spinner" /> Processing…</>
              ) : (
                <><IconBag /> Place Order <IconArrow /></>
              )}
            </button>

            <div className="co-trust">
              {["Secure Checkout", "Easy Returns", "Encrypted Payment"].map(t => (
                <div key={t} className="co-trust-item">
                  <span className="co-trust-dot" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;