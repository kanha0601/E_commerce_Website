import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import CartSidebar from "./CartSidebar";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .nb-root {
    font-family: 'DM Sans', sans-serif;
  }

  /* ── NAV ── */
  .nb-nav {
    position: fixed;
    top: 0;
    z-index: 100;
    height: 64px;
    width:100%;
    display: flex;
    align-items: center;
    padding: 0 28px;
    transition: background .4s, border-color .4s, box-shadow .4s;
  }
  .nb-nav.scrolled {
    background: rgba(8,8,16,.92);
    border-bottom: 1px solid rgba(201,168,76,.18);
    box-shadow: 0 8px 32px rgba(0,0,0,.4);
    backdrop-filter: blur(16px);
  }
  .nb-nav.top {
    background: rgba(8,8,16,.6);
    border-bottom: 1px solid rgba(201,168,76,.08);
    backdrop-filter: blur(10px);
  }

  .nb-inner {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* ── LOGO ── */
  .nb-logo {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    line-height: 1;
    flex-shrink: 0;
  }
  .nb-logo-main {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    font-weight: 900;
    background: linear-gradient(90deg, #c9a84c, #e8d08a, #c9a84c);
    background-size: 200%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: logoShimmer 4s ease infinite;
    letter-spacing: .02em;
  }
  @keyframes logoShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .nb-logo-sub {
    font-size: .48rem;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: rgba(201,168,76,.5);
    font-weight: 500;
    margin-top: 1px;
  }

  /* ── LINKS ── */
  .nb-links {
    display: flex;
    align-items: center;
    gap: 4px;
    list-style: none;
    margin: 0; padding: 0;
  }
  .nb-link {
    text-decoration: none;
    font-size: .72rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-weight: 500;
    color: rgba(240,235,224,.5);
    padding: 6px 12px;
    border-radius: 2px;
    position: relative;
    transition: color .25s;
  }
  .nb-link::after {
    content: '';
    position: absolute;
    bottom: 0; left: 12px; right: 12px;
    height: 1px;
    background: #c9a84c;
    transform: scaleX(0);
    transition: transform .3s cubic-bezier(.16,1,.3,1);
    transform-origin: left;
  }
  .nb-link:hover { color: #f0ebe0; }
  .nb-link:hover::after { transform: scaleX(1); }
  .nb-link.active {
    color: #c9a84c;
  }
  .nb-link.active::after { transform: scaleX(1); }

  /* admin link */
  .nb-link.admin-link {
    color: rgba(201,168,76,.7);
    border: 1px solid rgba(201,168,76,.2);
    background: rgba(201,168,76,.06);
  }
  .nb-link.admin-link:hover {
    color: #c9a84c;
    border-color: rgba(201,168,76,.45);
    background: rgba(201,168,76,.1);
  }
  .nb-link.admin-link::after { display: none; }

  /* divider */
  .nb-divider {
    width: 1px; height: 18px;
    background: rgba(201,168,76,.18);
    flex-shrink: 0;
    margin: 0 4px;
  }

  /* ── RIGHT CLUSTER ── */
  .nb-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  /* greeting */
  .nb-greeting {
    font-size: .7rem;
    letter-spacing: .1em;
    color: rgba(240,235,224,.35);
    font-weight: 300;
    white-space: nowrap;
  }
  .nb-greeting strong {
    color: rgba(201,168,76,.75);
    font-weight: 500;
  }

  /* cart button */
  .nb-cart-btn {
    position: relative;
    background: none;
    border: 1px solid rgba(201,168,76,.2);
    border-radius: 2px;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(240,235,224,.55);
    cursor: pointer;
    transition: border-color .25s, color .25s, background .25s;
  }
  .nb-cart-btn:hover {
    border-color: rgba(201,168,76,.55);
    color: #c9a84c;
    background: rgba(201,168,76,.06);
  }
  .nb-cart-count {
    position: absolute;
    top: -6px; right: -6px;
    background: #c9a84c;
    color: #080810;
    font-size: .52rem;
    font-weight: 800;
    width: 16px; height: 16px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    letter-spacing: 0;
    animation: cartPop .3s cubic-bezier(.16,1,.3,1);
  }
  @keyframes cartPop { from{transform:scale(0)} to{transform:scale(1)} }

  /* logout */
  .nb-logout-btn {
    background: none;
    border: 1px solid rgba(239,68,68,.25);
    color: rgba(239,68,68,.6);
    font-family: 'DM Sans', sans-serif;
    font-size: .68rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 2px;
    cursor: pointer;
    transition: background .25s, border-color .25s, color .25s;
    white-space: nowrap;
  }
  .nb-logout-btn:hover {
    background: rgba(239,68,68,.1);
    border-color: rgba(239,68,68,.5);
    color: #f87171;
  }

  /* register btn */
  .nb-register-btn {
    text-decoration: none;
    background: linear-gradient(135deg, #c9a84c, #e8d08a);
    color: #080810;
    font-size: .68rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 2px;
    transition: transform .25s, box-shadow .25s;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
  }
  .nb-register-btn::after {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .4s cubic-bezier(.16,1,.3,1);
  }
  .nb-register-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .nb-register-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 20px rgba(201,168,76,.35);
  }

  /* ── MOBILE TOGGLE ── */
  .nb-mobile-toggle {
    display: none;
    background: none;
    border: 1px solid rgba(201,168,76,.2);
    border-radius: 2px;
    width: 38px; height: 38px;
    align-items: center; justify-content: center;
    color: rgba(240,235,224,.6);
    cursor: pointer;
    flex-shrink: 0;
  }

  /* ── MOBILE MENU ── */
  .nb-mobile-menu {
    display: none;
    flex-direction: column;
    background: rgba(8,8,16,.97);
    border-bottom: 1px solid rgba(201,168,76,.15);
    padding: 16px 28px 20px;
    gap: 2px;
    backdrop-filter: blur(16px);
  }
  .nb-mobile-menu.open { display: flex; }
  .nb-mobile-link {
    text-decoration: none;
    font-size: .75rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    font-weight: 500;
    color: rgba(240,235,224,.5);
    padding: 11px 0;
    border-bottom: 1px solid rgba(201,168,76,.07);
    transition: color .2s;
  }
  .nb-mobile-link:last-child { border-bottom: none; }
  .nb-mobile-link:hover, .nb-mobile-link.active { color: #c9a84c; }
  .nb-mobile-divider { height: 1px; background: rgba(201,168,76,.1); margin: 8px 0; }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .nb-links { display: none; }
    .nb-greeting { display: none; }
    .nb-mobile-toggle { display: flex; }
    .nb-right { gap: 8px; }
  }
  @media (max-width: 480px) {
    .nb-nav { padding: 0 16px; }
  }
`;

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`nb-link${active ? ' active' : ''}`} onClick={onClick}>
      {children}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const cartCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <>
      <style>{css}</style>
      <div className="nb-root">

        {/* ── MAIN NAV ── */}
        <nav className={`nb-nav ${scrolled ? 'scrolled' : 'top'}`}>
          <div className="nb-inner">



            {/* CART ICON */}
            <button onClick={() => setOpen(true)} className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cart.length}
                </span>
              )}
              </button>

            {/* Logo */}
            <Link to="/" className="nb-logo">
              <span className="nb-logo-main">GET READY</span>
              <span className="nb-logo-sub">Premium Store</span>
            </Link>

            {/* Center links */}
            <ul className="nb-links">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/about">About</NavLink></li>
              <li><NavLink to="/product">Products</NavLink></li>
              <li><NavLink to="/contact">Contact</NavLink></li>
              {user?.role === 'admin' && (
                <>
                  <li><div className="nb-divider" /></li>
                  <li>
                    <Link to="/admin" className="nb-link admin-link">Admin Panel</Link>
                  </li>
                </>

              )}
            </ul>

            {/* Right cluster */}
            <div className="nb-right">


                {/* ✅ ADD THIS */}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Profile
                </Link>

                {user?.role === "admin" && (
                  <Link to="/admin" className="text-blue-600 font-semibold">
                    Admin Panel 
                  </Link>
                )}

              {/* Cart */}
              <button className="nb-cart-btn" onClick={() => setCartOpen(true)}>
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span className="nb-cart-count" key={cartCount}>{cartCount}</span>
                )}
              </button>

              

              {user ? (
                <>
                  <span className="nb-greeting">
                    Hi, <strong>{user?.name?.split(' ')[0]}</strong>
                  </span>
                  <NavLink to="/profile">Profile</NavLink>
                  <button className="nb-logout-btn" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <Link to="/register" className="nb-register-btn">Register</Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="nb-mobile-toggle"
                onClick={() => setMobileOpen(o => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                )}
              </button>
            </div>

          </div>
        </nav>

        {/* ── MOBILE MENU ── */}
        <div className={`nb-mobile-menu${mobileOpen ? ' open' : ''}`}>
          <NavLink to="/" onClick={closeMobile}>Home</NavLink>
          <NavLink to="/about" onClick={closeMobile}>About</NavLink>
          <NavLink to="/product" onClick={closeMobile}>Products</NavLink>
          <NavLink to="/contact" onClick={closeMobile}>Contact</NavLink>

          {user?.role === 'admin' && (
            <NavLink to="/admin" onClick={closeMobile}>Admin Panel</NavLink>
          )}

          <div className="nb-mobile-divider" />

          {user ? (
            <>
              <NavLink to="/profile" onClick={closeMobile}>Profile</NavLink>
              <button
                className="nb-mobile-link"
                style={{ background:'none', border:'none', textAlign:'left', color:'rgba(239,68,68,.6)', cursor:'pointer', fontFamily:'inherit' }}
                onClick={() => { logout(); closeMobile(); }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMobile}>Login</NavLink>
              <NavLink to="/register" onClick={closeMobile}>Register</NavLink>
            </>
          )}
        </div>

      </div>

      <CartSidebar showCart={cartOpen} setShowCart={setCartOpen} />
    </>
  );
};

export default Navbar;
