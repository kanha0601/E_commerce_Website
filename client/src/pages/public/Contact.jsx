import React, { useState } from 'react';
import axios from "axios";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ct-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    color: #f0ebe0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    position: relative;
    overflow: hidden;
  }

  /* glows */
  .ct-glow-a {
    position: fixed; top: -20%; left: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.13) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .ct-glow-b {
    position: fixed; bottom: -20%; right: -10%;
    width: 550px; height: 550px; border-radius: 50%;
    background: radial-gradient(circle, rgba(80,60,200,.1) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  /* grid */
  .ct-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── layout ── */
  .ct-inner {
    position: relative; z-index: 1;
    width: 100%; max-width: 1040px;
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 2px;
    animation: ctFadeUp .7s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes ctFadeUp {
    from { opacity:0; transform: translateY(32px); }
    to   { opacity:1; transform: translateY(0); }
  }
  @media (max-width: 720px) {
    .ct-inner { grid-template-columns: 1fr; }
    .ct-sidebar { display: none; }
  }

  /* ── sidebar ── */
  .ct-sidebar {
    background: linear-gradient(160deg, rgba(201,168,76,.1), rgba(201,168,76,.03));
    border: 1px solid rgba(201,168,76,.2);
    padding: 52px 40px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .ct-sidebar::before {
    content: '';
    position: absolute; top: 0; left: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, #c9a84c, transparent);
  }
  .ct-sidebar-brand-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: #c9a84c; box-shadow: 0 0 12px rgba(201,168,76,.7);
    margin-bottom: 20px;
  }
  .ct-sidebar-title {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900;
    line-height: 1.1; margin-bottom: 16px;
    background: linear-gradient(90deg,#c9a84c,#e8d08a,#fff8df,#c9a84c);
    background-size: 300%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 6s ease infinite;
  }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .ct-sidebar-sub {
    font-size: .85rem; font-weight: 300;
    color: rgba(240,235,224,.45); line-height: 1.75;
    margin-bottom: 48px;
  }

  /* contact info items */
  .ct-info-list { display: flex; flex-direction: column; gap: 22px; }
  .ct-info-item {
    display: flex; align-items: flex-start; gap: 14px;
  }
  .ct-info-icon {
    width: 36px; height: 36px; flex-shrink: 0;
    border: 1px solid rgba(201,168,76,.35);
    border-radius: 2px; display: flex;
    align-items: center; justify-content: center;
    color: #c9a84c; background: rgba(201,168,76,.06);
  }
  .ct-info-label {
    font-size: .65rem; letter-spacing: .18em;
    text-transform: uppercase; color: #c9a84c;
    font-weight: 500; margin-bottom: 4px;
  }
  .ct-info-value {
    font-size: .85rem; font-weight: 300;
    color: rgba(240,235,224,.55); line-height: 1.5;
  }

  /* watermark */
  .ct-sidebar-wm {
    position: absolute; bottom: -20px; right: -10px;
    font-family: 'Playfair Display', serif;
    font-size: 9rem; font-style: italic; font-weight: 900;
    color: rgba(201,168,76,.05); line-height: 1;
    user-select: none; pointer-events: none;
  }

  /* ── form card ── */
  .ct-form-card {
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    border: 1px solid rgba(201,168,76,.15);
    padding: 52px 44px;
    position: relative;
  }
  .ct-form-card::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }
  .ct-form-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 24px;
    border: 1px solid rgba(201,168,76,.3);
    padding: 5px 14px; border-radius: 2px;
  }
  .ct-form-eyebrow span {
    font-size: .65rem; letter-spacing: .2em;
    text-transform: uppercase; color: #c9a84c; font-weight: 500;
  }
  .ct-form-heading {
    font-family: 'Playfair Display', serif;
    font-size: 1.7rem; font-weight: 900;
    color: #f0ebe0; margin-bottom: 32px; line-height: 1.15;
  }

  /* row for name + phone */
  .ct-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 480px) { .ct-row { grid-template-columns: 1fr; } }

  /* field */
  .ct-field { margin-bottom: 18px; }
  .ct-label {
    display: block;
    font-size: .65rem; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(240,235,224,.4);
    font-weight: 500; margin-bottom: 8px;
  }
  .ct-input-wrap { position: relative; }
  .ct-input-icon {
    position: absolute; left: 13px; top: 50%;
    transform: translateY(-50%);
    color: rgba(201,168,76,.45); pointer-events: none; display: flex;
  }
  .ct-input-icon.top { top: 16px; transform: none; }
  .ct-input, .ct-textarea {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(201,168,76,.18);
    color: #f0ebe0;
    font-family: 'DM Sans', sans-serif;
    font-size: .88rem; font-weight: 300;
    padding: 13px 14px 13px 40px;
    border-radius: 2px; outline: none;
    transition: border-color .3s, background .3s, box-shadow .3s;
  }
  .ct-input::placeholder, .ct-textarea::placeholder { color: rgba(240,235,224,.18); }
  .ct-input:focus, .ct-textarea:focus {
    border-color: rgba(201,168,76,.65);
    background: rgba(201,168,76,.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,.07);
  }
  .ct-textarea {
    resize: none; min-height: 120px;
    padding-top: 13px; line-height: 1.6;
  }

  /* submit */
  .ct-btn {
    width: 100%; margin-top: 6px;
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
  .ct-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .ct-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .ct-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,.4); }
  .ct-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }
  .ct-btn.success { background: linear-gradient(135deg, #2d6a4f, #40916c); color: #fff; }

  /* spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .ct-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(8,8,16,.25);
    border-top-color: #080810;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    flex-shrink: 0;
  }

  /* toast */
  .ct-toast {
    position: fixed; bottom: 32px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #c9a84c; color: #080810;
    font-size: .8rem; font-weight: 600;
    letter-spacing: .08em; text-transform: uppercase;
    padding: 12px 28px; border-radius: 2px;
    box-shadow: 0 12px 32px rgba(201,168,76,.4);
    z-index: 999;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
  }
  .ct-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ct-toast.error { background: #c0392b; color: #fff; box-shadow: 0 12px 32px rgba(192,57,43,.4); }
`;

const IconUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconMsg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const IconSend = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconMailBig = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhoneBig = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', error: false });

  const url = import.meta.env.VITE_BACKEND_URL;

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 3200);
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone || !message) {
      showToast('Please fill in all fields.', true);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${url}/contact/add`, { name, email, phone, message });
      if (res?.data?.status) {
        setSent(true);
        showToast(res?.data?.message || 'Message sent successfully!');
        setName(""); setEmail(""); setPhone(""); setMessage("");
        setTimeout(() => setSent(false), 3000);
      } else {
        showToast('Something went wrong. Please try again.', true);
      }
    } catch (err) {
      console.log(err);
      showToast('Something went wrong. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="ct-wrap">
        <div className="ct-glow-a" />
        <div className="ct-glow-b" />
        <div className="ct-grid-bg" />

        <div className="ct-inner">

          {/* ── SIDEBAR ── */}
          <div className="ct-sidebar">
            <div>
              <div className="ct-sidebar-brand-dot" />
              <h2 className="ct-sidebar-title">Let's Talk</h2>
              <p className="ct-sidebar-sub">
                Have a question, suggestion, or just want to say hello? We'd love to hear from you.
              </p>
            </div>

            <div className="ct-info-list">
              <div className="ct-info-item">
                <div className="ct-info-icon"><IconMapPin /></div>
                <div>
                  <div className="ct-info-label">Location</div>
                  <div className="ct-info-value">Bhubaneswar, Odisha, India</div>
                </div>
              </div>
              <div className="ct-info-item">
                <div className="ct-info-icon"><IconMailBig /></div>
                <div>
                  <div className="ct-info-label">Email Us</div>
                  <div className="ct-info-value">support@yourstore.com</div>
                </div>
              </div>
              <div className="ct-info-item">
                <div className="ct-info-icon"><IconPhoneBig /></div>
                <div>
                  <div className="ct-info-label">Call Us</div>
                  <div className="ct-info-value">+91 81149 59593</div>
                </div>
              </div>
            </div>

            <div className="ct-sidebar-wm">C</div>
          </div>

          {/* ── FORM ── */}
          <div className="ct-form-card">
            <div className="ct-form-eyebrow">
              <div style={{ width:5, height:5, borderRadius:'50%', background:'#c9a84c' }}/>
              <span>Get In Touch</span>
            </div>
            <h2 className="ct-form-heading">Send Us a Message</h2>

            {/* Name + Phone row */}
            <div className="ct-row">
              <div className="ct-field">
                <label className="ct-label">Full Name</label>
                <div className="ct-input-wrap">
                  <span className="ct-input-icon"><IconUser /></span>
                  <input className="ct-input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
              <div className="ct-field">
                <label className="ct-label">Phone Number</label>
                <div className="ct-input-wrap">
                  <span className="ct-input-icon"><IconPhone /></span>
                  <input className="ct-input" placeholder="+91 00000 00000" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="ct-field">
              <label className="ct-label">Email Address</label>
              <div className="ct-input-wrap">
                <span className="ct-input-icon"><IconMail /></span>
                <input className="ct-input" type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Message */}
            <div className="ct-field">
              <label className="ct-label">Your Message</label>
              <div className="ct-input-wrap">
                <span className="ct-input-icon top"><IconMsg /></span>
                <textarea className="ct-textarea" placeholder="Tell us how we can help you…" value={message} onChange={e => setMessage(e.target.value)} />
              </div>
            </div>

            <button
              className={`ct-btn${sent ? ' success' : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <><span className="ct-spinner" /> Sending…</>
                : sent
                ? <><IconCheck /> Message Sent!</>
                : <><IconSend /> Send Message</>
              }
            </button>
          </div>
        </div>

        {/* ── TOAST ── */}
        <div className={`ct-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
          {toast.msg}
        </div>
      </div>
    </>
  );
};

export default Contact;