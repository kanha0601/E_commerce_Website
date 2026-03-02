import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .login-wrap {
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
  .login-glow-a {
    position: absolute; top: -20%; left: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.14) 0%, transparent 70%);
    pointer-events: none;
  }
  .login-glow-b {
    position: absolute; bottom: -15%; right: -8%;
    width: 500px; height: 500px; border-radius: 50%;
    background: radial-gradient(circle, rgba(80,60,200,.12) 0%, transparent 70%);
    pointer-events: none;
  }

  /* grid */
  .login-grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(201,168,76,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  /* card */
  .login-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    border: 1px solid rgba(201,168,76,.2);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    backdrop-filter: blur(20px);
    border-radius: 4px;
    padding: 52px 44px;
    box-shadow: 0 40px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(201,168,76,.05);
    animation: loginFadeUp .7s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes loginFadeUp {
    from { opacity:0; transform: translateY(32px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 10%; right: 10%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
  }

  /* brand */
  .login-brand {
    text-align: center;
    margin-bottom: 36px;
  }
  .login-brand-icon {
    width: 48px; height: 48px;
    border: 1px solid rgba(201,168,76,.4);
    border-radius: 2px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: #c9a84c;
    background: rgba(201,168,76,.06);
  }
  .login-brand h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 900;
    color: #f0ebe0;
    line-height: 1.1;
    margin: 0 0 8px;
  }
  .login-brand p {
    font-size: .8rem;
    color: rgba(240,235,224,.4);
    letter-spacing: .06em;
    margin: 0;
  }

  /* divider */
  .login-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(201,168,76,.3), transparent);
    margin-bottom: 32px;
  }

  /* label */
  .login-label {
    display: block;
    font-size: .68rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(240,235,224,.45);
    margin-bottom: 8px;
    font-weight: 500;
  }

  /* input wrapper */
  .login-input-wrap {
    position: relative;
    margin-bottom: 22px;
  }
  .login-input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: rgba(201,168,76,.5);
    pointer-events: none;
    display: flex;
  }
  .login-input {
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
  .login-input::placeholder { color: rgba(240,235,224,.2); }
  .login-input:focus {
    border-color: rgba(201,168,76,.7);
    background: rgba(201,168,76,.04);
    box-shadow: 0 0 0 3px rgba(201,168,76,.08);
  }

  /* error */
  .login-error {
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

  /* submit */
  .login-btn {
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
    margin-top: 6px;
    position: relative;
    overflow: hidden;
    transition: transform .3s, box-shadow .3s;
  }
  .login-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .login-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .login-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(201,168,76,.4); }
  .login-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; }

  /* spinner */
  @keyframes loginSpin { to { transform: rotate(360deg); } }
  .login-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(8,8,16,.3);
    border-top-color: #080810;
    border-radius: 50%;
    animation: loginSpin .7s linear infinite;
    display: inline-block;
    vertical-align: middle;
    margin-right: 8px;
  }

  /* footer */
  .login-footer {
    text-align: center;
    margin-top: 28px;
    font-size: .8rem;
    color: rgba(240,235,224,.35);
  }
  .login-footer a {
    color: #c9a84c;
    text-decoration: none;
    font-weight: 500;
    transition: opacity .2s;
  }
  .login-footer a:hover { opacity: .75; }

  /* security row */
  .login-security {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(240,235,224,.07);
    flex-wrap: wrap;
  }
  .login-security-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: .65rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(240,235,224,.25);
  }
  .login-security-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: #c9a84c;
    flex-shrink: 0;
  }

  /* pulse on brand icon */
  @keyframes loginPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,.4); }
    50%       { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
  }
  .login-brand-icon { animation: loginPulse 3s ease infinite; }
`;

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
const IconKey = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
);
const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-glow-a" />
        <div className="login-glow-b" />
        <div className="login-grid" />

        <div className="login-card">

          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <IconKey />
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          <div className="login-divider" />

          {/* Error */}
          {error && (
            <div className="login-error">
              <IconAlert /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><IconMail /></span>
              <input
                type="email"
                className="login-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon"><IconLock /></span>
              <input
                type="password"
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading && <span className="login-spinner" />}
              {loading ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className="login-footer">
            Don't have an account?{' '}
            <Link to="/register">Register here</Link>
          </p>

          {/* Security row */}
          <div className="login-security">
            {['SSL Secured', 'Encrypted', 'Private'].map(t => (
              <div key={t} className="login-security-item">
                <span className="login-security-dot" /> {t}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;