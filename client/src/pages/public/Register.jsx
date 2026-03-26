import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .reg-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 24px;
    position: relative;
    overflow: hidden;
  }

  /* bg glows */
  .reg-glow-a {
    position: absolute; top: -20%; right: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.14) 0%, transparent 70%);
    pointer-events: none;
  }
  .reg-glow-b {
    position: absolute; bottom: -15%; left: -8%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(80,60,200,.12) 0%, transparent 70%);
    pointer-events: none;
  }

  /* grid lines */
  .reg-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  /* card */
  .reg-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 460px;
    border: 1px solid rgba(201,168,76,.2);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    backdrop-filter: blur(20px);
    border-radius: 4px;
    padding: 52px 44px;
    box-shadow: 0 40px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.05);
    animation: fadeUp .7s cubic-bezier(.16,1,.3,1) both;
  }

  @keyframes fadeUp {
    from { opacity:0; transform: translateY(32px); }
    to   { opacity:1; transform: translateY(0); }
  }

  /* top accent line */
  .reg-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }

  /* logo / brand mark */
  .reg-brand {
    text-align: center;
    margin-bottom: 36px;
  }
  .reg-brand-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #c9a84c;
    display: inline-block;
    margin-bottom: 14px;
    box-shadow: 0 0 16px rgba(201,168,76,.6);
  }
  .reg-brand h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900;
    color: #f0ebe0;
    line-height: 1.1;
    margin: 0 0 8px;
  }
  .reg-brand p {
    font-size: .8rem; color: rgba(240,235,224,.4);
    letter-spacing: .08em;
    margin: 0;
  }

  /* divider */
  .reg-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,.3), transparent);
    margin-bottom: 32px;
  }

  /* label */
  .reg-label {
    display: block;
    font-size: .68rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(240,235,224,.45);
    margin-bottom: 8px;
    font-weight: 500;
  }

  /* input wrapper (for icon) */
  .reg-input-wrap {
    position: relative;
    margin-bottom: 22px;
  }
  .reg-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: rgba(201,168,76,.5);
    pointer-events: none;
    display: flex;
  }
  .reg-input {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(201,168,76,.2);
    color: #f0ebe0;
    font-family: 'DM Sans', sans-serif;
    font-size: .9rem;
    font-weight: 300;
    padding: 13px 14px 13px 42px;
    border-radius: 2px;
    outline: none;
    transition: border-color .3s, background .3s, box-shadow .3s;
    box-sizing: border-box;
  }
  .reg-input::placeholder { color: rgba(240,235,224,.2); }
  .reg-input:focus {
    border-color: rgba(201,168,76,.7);
    background: rgba(201,168,76,.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,.08);
  }

  /* error */
  .reg-error {
    background: rgba(220,50,50,.1);
    border: 1px solid rgba(220,50,50,.35);
    color: #ff8080;
    font-size: .82rem;
    padding: 11px 16px;
    border-radius: 2px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* submit button */
  .reg-btn {
    width: 100%;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810;
    font-family: 'DM Sans', sans-serif;
    font-weight: 700;
    font-size: .78rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 15px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: transform .3s, box-shadow .3s;
  }
  .reg-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .reg-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .reg-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,.4); }
  .reg-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }

  /* loading spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .reg-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(8,8,16,.3);
    border-top-color: #080810;
    border-radius: 50%;
    animation: spin .7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* footer link */
  .reg-footer {
    text-align: center;
    margin-top: 28px;
    font-size: .8rem;
    color: rgba(240,235,224,.35);
  }
  .reg-footer a {
    color: #c9a84c;
    text-decoration: none;
    font-weight: 500;
    transition: opacity .2s;
  }
  .reg-footer a:hover { opacity: .75; }

  /* trust row */
  .reg-trust {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(240,235,224,.07);
    flex-wrap: wrap;
  }
  .reg-trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: .65rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(240,235,224,.25);
  }
  .reg-trust-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: #c9a84c;
    display: inline-block;
  }
`;

// ── SVG icons
const IconUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconLock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="reg-wrap">
        <div className="reg-glow-a" />
        <div className="reg-glow-b" />
        <div className="reg-grid" />

        <div className="reg-card">

          {/* Brand */}
          <div className="reg-brand">
            <div className="reg-brand-dot" />
            <h2>Create Account</h2>
            <p>Join our exclusive community</p>
          </div>

          <div className="reg-divider" />

          {/* Error */}
          {error && (
            <div className="reg-error">
              <IconAlert /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <label className="reg-label">Full Name</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon"><IconUser /></span>
              <input
                type="text"
                className="reg-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <label className="reg-label">Email Address</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon"><IconMail /></span>
              <input
                type="email"
                className="reg-input"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="reg-label">Password</label>
            <div className="reg-input-wrap">
              <span className="reg-input-icon"><IconLock /></span>
              <input
                type="password"
                className="reg-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="reg-btn" disabled={loading}>
              {loading && <span className="reg-spinner" />}
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <p className="reg-footer">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>

          {/* Trust badges */}
          <div className="reg-trust">
            {['Secure & Encrypted', 'No Spam', 'Free Forever'].map(t => (
              <div key={t} className="reg-trust-item">
                <span className="reg-trust-dot" /> {t}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;