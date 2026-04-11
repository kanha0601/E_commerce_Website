import { useEffect } from "react";
import homeData from "../../data/homeData";
import { Link } from "react-router-dom";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --ink:   #0a0a0f;
    --paper: #f5f0e8;
    --gold:  #c9a84c;
    --gold2: #e8c97a;
    --gold3: #fff8e7;
    --mist:  rgba(201,168,76,0.12);
  }

  .hr * { box-sizing: border-box; margin: 0; padding: 0; }
  .hr {
    font-family: 'DM Sans', sans-serif;
    background: var(--ink);
    color: var(--paper);
    overflow-x: hidden;
  }

  /* ── grain overlay ── */
  .hr::before {
    content: ''; position: fixed; inset: 0;
    pointer-events: none; z-index: 998;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.3;
  }

  /* ════════════════════════════════
     HERO — split layout
  ════════════════════════════════ */
  .hr-hero {
    position: relative;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    overflow: hidden;
  }

  /* left panel */
  .hr-hero-left {
    position: relative; z-index: 2;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 120px 60px 120px 80px;
    border-right: 1px solid rgba(201,168,76,.12);
  }

  .hr-tag {
    display: inline-flex; align-items: center; gap: 10px;
    margin-bottom: 32px;
  }
  .hr-tag-line {
    width: 32px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }
  .hr-tag span {
    font-size: .65rem; letter-spacing: .25em;
    text-transform: uppercase; color: var(--gold);
    font-weight: 500;
  }

  .hr-hero-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3.5rem, 6vw, 6rem);
    font-weight: 900; line-height: .9;
    letter-spacing: -.02em;
    margin-bottom: 32px;
  }
  .hr-hero-title em {
    font-style: italic;
    background: linear-gradient(90deg, var(--gold), var(--gold2), var(--gold3), var(--gold));
    background-size: 300%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: goldShimmer 6s ease infinite;
  }
  @keyframes goldShimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }

  .hr-hero-sub {
    font-size: 1rem; font-weight: 300; line-height: 1.8;
    color: rgba(245,240,232,.5);
    max-width: 400px; margin-bottom: 52px;
  }

  .hr-hero-actions {
    display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
  }
  .hr-btn-gold {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: .75rem;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 16px 40px; border-radius: 2px;
    text-decoration: none; display: inline-block;
    transition: transform .3s, box-shadow .3s;
  }
  .hr-btn-gold::after {
    content: ''; position: absolute; inset: 0;
    background: rgba(255,255,255,.2);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .hr-btn-gold:hover::after { transform: translateX(110%) skewX(-15deg); }
  .hr-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(201,168,76,.4); }

  .hr-btn-text {
    display: inline-flex; align-items: center; gap: 8px;
    color: rgba(245,240,232,.5); font-size: .8rem;
    text-decoration: none; letter-spacing: .06em;
    transition: color .3s;
  }
  .hr-btn-text:hover { color: var(--gold); }
  .hr-btn-text::after {
    content: '→';
    transition: transform .3s;
  }
  .hr-btn-text:hover::after { transform: translateX(4px); }

  /* stats strip */
  .hr-stats {
    display: flex; gap: 0;
    margin-top: 64px; padding-top: 40px;
    border-top: 1px solid rgba(245,240,232,.08);
  }
  .hr-stat {
    flex: 1; padding-right: 28px;
    border-right: 1px solid rgba(245,240,232,.07);
  }
  .hr-stat:last-child { border-right: none; padding-right: 0; padding-left: 28px; }
  .hr-stat:not(:first-child):not(:last-child) { padding-left: 28px; }
  .hr-stat-num {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem; font-weight: 700;
    color: var(--gold); line-height: 1;
    margin-bottom: 4px;
  }
  .hr-stat-label {
    font-size: .62rem; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(245,240,232,.3);
  }

  /* right panel */
  .hr-hero-right {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  /* decorative gold circle */
  .hr-circle-lg {
    position: absolute;
    width: 520px; height: 520px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,.12);
  }
  .hr-circle-md {
    position: absolute;
    width: 380px; height: 380px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,.18);
  }
  .hr-circle-sm {
    position: absolute;
    width: 240px; height: 240px; border-radius: 50%;
    border: 1px solid rgba(201,168,76,.25);
    animation: rotateSlow 20s linear infinite;
  }
  @keyframes rotateSlow { to { transform: rotate(360deg); } }
  .hr-circle-sm::before {
    content: '';
    position: absolute; top: -4px; left: 50%;
    transform: translateX(-50%);
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--gold);
    box-shadow: 0 0 12px var(--gold);
  }
  /* center text art */
  .hr-hero-center-text {
    position: relative; z-index: 2;
    text-align: center;
  }
  .hr-hero-year {
    font-family: 'Playfair Display', serif;
    font-size: 7rem; font-weight: 900; font-style: italic;
    color: rgba(201,168,76,.06);
    line-height: 1; display: block;
    letter-spacing: -.04em;
  }
  .hr-hero-tagline {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem; font-style: italic;
    color: rgba(245,240,232,.25);
    letter-spacing: .08em;
  }
  /* floating badges */
  .hr-badge {
    position: absolute;
    background: rgba(201,168,76,.08);
    border: 1px solid rgba(201,168,76,.25);
    padding: 10px 18px;
    font-size: .6rem; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(201,168,76,.7);
    backdrop-filter: blur(8px);
  }
  .hr-badge-1 { top: 20%; left: 8%; animation: floatA 4s ease infinite; }
  .hr-badge-2 { bottom: 25%; right: 6%; animation: floatB 5s ease infinite; }
  .hr-badge-3 { top: 60%; left: 5%; animation: floatA 3.5s ease infinite .5s; }
  @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(10px)} }

  /* vertical text */
  .hr-vert-text {
    position: absolute; right: 0; top: 50%;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    font-size: .55rem; letter-spacing: .3em; text-transform: uppercase;
    color: rgba(245,240,232,.12);
    white-space: nowrap;
  }

  /* ════════════════════════════════
     MARQUEE
  ════════════════════════════════ */
  .hr-marquee {
    background: var(--gold);
    padding: 13px 0; overflow: hidden;
    border-top: 1px solid rgba(201,168,76,.3);
    border-bottom: 1px solid rgba(201,168,76,.3);
  }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .hr-marquee-track {
    display: flex; width: max-content;
    animation: marquee 24s linear infinite;
  }
  .hr-marquee-track:hover { animation-play-state: paused; }
  .hr-marquee-item {
    font-family: 'Playfair Display', serif;
    font-style: italic; font-size: .95rem; font-weight: 700;
    color: var(--ink); padding: 0 36px; white-space: nowrap;
    display: inline-flex; align-items: center; gap: 18px;
  }
  .hr-marquee-dot { opacity: .35; font-style: normal; }

  /* ════════════════════════════════
     ABOUT STRIP — horizontal
  ════════════════════════════════ */
  .hr-about {
    display: grid;
    grid-template-columns: 280px 1fr;
    border-top: 1px solid rgba(245,240,232,.06);
    border-bottom: 1px solid rgba(245,240,232,.06);
  }
  .hr-about-label {
    padding: 60px 40px;
    border-right: 1px solid rgba(245,240,232,.06);
    display: flex; align-items: center;
  }
  .hr-about-label span {
    font-size: .6rem; letter-spacing: .25em; text-transform: uppercase;
    color: rgba(245,240,232,.2); writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
  .hr-about-content {
    padding: 60px 80px;
    display: flex; align-items: center; gap: 80px;
  }
  .hr-about-text {
    flex: 1;
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.4rem, 2.5vw, 2rem);
    font-weight: 400; line-height: 1.5;
    color: rgba(245,240,232,.7);
  }
  .hr-about-text em { font-style: italic; color: var(--gold); }
  .hr-about-divider {
    width: 1px; height: 80px; flex-shrink: 0;
    background: linear-gradient(to bottom, transparent, var(--gold), transparent);
  }
  .hr-about-desc {
    flex: 1;
    font-size: .88rem; line-height: 1.85;
    color: rgba(245,240,232,.4); font-weight: 300;
  }

  /* ════════════════════════════════
     FEATURES — asymmetric grid
  ════════════════════════════════ */
  .hr-features { padding: 120px 0; position: relative; }
  .hr-features-header {
    padding: 0 80px;
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 24px; margin-bottom: 64px;
  }
  .hr-section-label {
    font-size: .6rem; letter-spacing: .24em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 14px;
  }
  .hr-section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 900; line-height: 1.05;
    letter-spacing: -.01em;
  }
  .hr-rule {
    width: 120px; height: 1px;
    background: linear-gradient(90deg, var(--gold), transparent);
    margin-bottom: 8px;
  }

  .hr-features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1px;
    background: rgba(245,240,232,.04);
    border-top: 1px solid rgba(245,240,232,.06);
    border-bottom: 1px solid rgba(245,240,232,.06);
  }
  .hr-feat {
    background: var(--ink);
    padding: 52px 48px;
    position: relative; overflow: hidden;
    transition: background .3s;
  }
  .hr-feat:hover { background: rgba(201,168,76,.03); }
  .hr-feat::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold), transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .4s cubic-bezier(.16,1,.3,1);
  }
  .hr-feat:hover::after { transform: scaleX(1); }
  .hr-feat-num {
    font-family: 'Playfair Display', serif;
    font-size: 5rem; font-weight: 900; font-style: italic;
    color: rgba(201,168,76,.06); line-height: 1;
    position: absolute; top: 16px; right: 24px;
  }
  .hr-feat-icon {
    color: var(--gold); margin-bottom: 24px;
    opacity: .8;
  }
  .hr-feat-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.3rem; font-weight: 700; line-height: 1.2;
    margin-bottom: 14px;
  }
  .hr-feat-desc {
    font-size: .85rem; font-weight: 300; line-height: 1.8;
    color: rgba(245,240,232,.45);
  }
  .hr-feat-line {
    width: 32px; height: 1px; margin-top: 28px;
    background: linear-gradient(90deg, var(--gold), transparent);
  }

  /* ════════════════════════════════
     CTA — full width cinematic
  ════════════════════════════════ */
  .hr-cta {
    position: relative; overflow: hidden;
    padding: 140px 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
    border-top: 1px solid rgba(245,240,232,.06);
  }
  /* large decorative letter */
  .hr-cta-deco {
    position: absolute; top: -60px; left: -20px;
    font-family: 'Playfair Display', serif;
    font-size: 28rem; font-weight: 900; font-style: italic;
    color: rgba(201,168,76,.025); line-height: 1;
    pointer-events: none; user-select: none;
    letter-spacing: -.04em;
  }
  .hr-cta-left { position: relative; z-index: 1; }
  .hr-cta-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 4vw, 4rem);
    font-weight: 900; line-height: 1.05;
    letter-spacing: -.02em; margin-bottom: 24px;
  }
  .hr-cta-title em {
    font-style: italic; color: var(--gold);
  }
  .hr-cta-desc {
    font-size: .95rem; font-weight: 300; line-height: 1.85;
    color: rgba(245,240,232,.45); margin-bottom: 48px;
    max-width: 420px;
  }
  .hr-cta-right {
    position: relative; z-index: 1;
    display: flex; flex-direction: column;
    gap: 20px;
  }
  /* trust items */
  .hr-trust {
    display: flex; align-items: center; gap: 20px;
    padding: 20px 24px;
    border: 1px solid rgba(245,240,232,.07);
    background: rgba(245,240,232,.02);
    transition: border-color .3s, background .3s;
  }
  .hr-trust:hover {
    border-color: rgba(201,168,76,.25);
    background: rgba(201,168,76,.03);
  }
  .hr-trust-icon {
    width: 40px; height: 40px; flex-shrink: 0;
    border: 1px solid rgba(201,168,76,.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold); background: rgba(201,168,76,.06);
  }
  .hr-trust-title {
    font-size: .78rem; font-weight: 600;
    letter-spacing: .06em; text-transform: uppercase;
    margin-bottom: 3px;
  }
  .hr-trust-desc {
    font-size: .72rem; font-weight: 300;
    color: rgba(245,240,232,.35);
  }

  /* ════════════════════════════════
     REVEAL ANIMATIONS
  ════════════════════════════════ */
  .reveal {
    opacity: 0; transform: translateY(32px);
    transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1);
  }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-left { opacity: 0; transform: translateX(-32px); transition: opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1); }
  .reveal-left.visible { opacity: 1; transform: translateX(0); }
  .d1 { transition-delay: .1s; } .d2 { transition-delay: .2s; }
  .d3 { transition-delay: .3s; } .d4 { transition-delay: .45s; }
  .d5 { transition-delay: .55s; }

  /* ════════════════════════════════
     RESPONSIVE
  ════════════════════════════════ */
  @media (max-width: 1024px) {
    .hr-hero { grid-template-columns: 1fr; }
    .hr-hero-right { display: none; }
    .hr-hero-left { padding: 120px 40px; }
    .hr-about { grid-template-columns: 1fr; }
    .hr-about-label { display: none; }
    .hr-about-content { padding: 60px 40px; flex-direction: column; gap: 32px; }
    .hr-about-divider { display: none; }
    .hr-features-header { padding: 0 40px; }
    .hr-features-grid { grid-template-columns: 1fr; }
    .hr-feat { padding: 40px; }
    .hr-cta { grid-template-columns: 1fr; padding: 80px 40px; gap: 48px; }
    .hr-cta-deco { display: none; }
  }
  @media (max-width: 640px) {
    .hr-hero-left { padding: 100px 24px 60px; }
    .hr-hero-title { font-size: 3rem; }
    .hr-stats { flex-wrap: wrap; gap: 24px; }
    .hr-stat { border: none !important; padding: 0 !important; flex: 0 0 40%; }
    .hr-cta { padding: 60px 24px; }
    .hr-features-header { padding: 0 24px; }
    .hr-feat { padding: 32px 24px; }
  }
`;

function injectStyles(css) {
  if (typeof document === "undefined") return;
  if (document.getElementById("home-styles-v2")) return;
  const el = document.createElement("style");
  el.id = "home-styles-v2";
  el.textContent = css;
  document.head.appendChild(el);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const icons = [
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>,
];

const trustIcons = [
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
];

const marqueeItems = [
  "Premium Quality", "Exclusive Designs", "Trusted Worldwide",
  "Crafted With Care", "New Collection", "Free Shipping",
];

const Home = () => {
  injectStyles(STYLES);
  useReveal();

  return (
    <div className="hr">

      {/* ══════════════ HERO ══════════════ */}
      <section className="hr-hero">

        {/* LEFT */}
        <div className="hr-hero-left">
          <div className="hr-tag reveal">
            <div className="hr-tag-line" />
            <span>New Collection Available</span>
          </div>

          <h1 className="hr-hero-title reveal d1">
            {homeData.hero.title.split(' ').map((word, i) =>
              i % 2 === 0
                ? <span key={i}>{word} </span>
                : <em key={i}>{word} </em>
            )}
          </h1>

          <p className="hr-hero-sub reveal d2">{homeData.hero.subtitle}</p>

          <div className="hr-hero-actions reveal d3">
            <Link to="/product" className="hr-btn-gold">{homeData.hero.shopBtn}</Link>
            <Link to="/register" className="hr-btn-text">{homeData.hero.registerBtn}</Link>
          </div>

          <div className="hr-stats reveal d4">
            {[["10K+","Customers"],["500+","Products"],["99%","Satisfaction"]].map(([n,l]) => (
              <div key={l} className="hr-stat">
                <div className="hr-stat-num">{n}</div>
                <div className="hr-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — decorative */}
        <div className="hr-hero-right">
          <div className="hr-circle-lg" />
          <div className="hr-circle-md" />
          <div className="hr-circle-sm" />

          <div className="hr-hero-center-text">
            <span className="hr-hero-year">GR</span>
            <div className="hr-hero-tagline">Est. 2024</div>
          </div>

          <div className="hr-badge hr-badge-1">Premium Quality</div>
          <div className="hr-badge hr-badge-2">New Arrivals ✦</div>
          <div className="hr-badge hr-badge-3">Free Shipping</div>

          <div className="hr-vert-text">NEXOVA — FASHION REDEFINED — 2024</div>
        </div>

      </section>

      {/* ══════════════ MARQUEE ══════════════ */}
      <div className="hr-marquee">
        <div className="hr-marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="hr-marquee-item">
              {item} <span className="hr-marquee-dot">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ ABOUT STRIP ══════════════ */}
      <div className="hr-about">
        <div className="hr-about-label">
          <span>Our Story</span>
        </div>
        <div className="hr-about-content">
          <div className="hr-about-text reveal-left">
            We craft <em>fashion</em> that speaks before you say a word.
          </div>
          <div className="hr-about-divider" />
          <div className="hr-about-desc reveal d1">
            Get Ready is more than a brand — it's a statement. Every piece in our collection is thoughtfully designed to blend timeless elegance with modern confidence. From premium fabrics to meticulous finishing, we believe great style should feel effortless.
          </div>
        </div>
      </div>

      {/* ══════════════ FEATURES ══════════════ */}
      <section className="hr-features">
        <div className="hr-features-header">
          <div className="reveal">
            <div className="hr-section-label">Why Choose Us</div>
            <h2 className="hr-section-title">{homeData.featuresTitle}</h2>
          </div>
          <div className="hr-rule reveal d2" />
        </div>

        <div className="hr-features-grid">
          {homeData.features.map((feature, idx) => (
            <div key={feature.id} className={`hr-feat reveal d${idx + 1}`}>
              <div className="hr-feat-num">{String(idx + 1).padStart(2, "0")}</div>
              <div className="hr-feat-icon">{icons[idx % icons.length]}</div>
              <h3 className="hr-feat-title">{feature.title}</h3>
              <p className="hr-feat-desc">{feature.desc}</p>
              <div className="hr-feat-line" />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section className="hr-cta">
        <div className="hr-cta-deco">G</div>

        <div className="hr-cta-left">
          <div className="hr-section-label reveal">Ready to Begin?</div>
          <h2 className="hr-cta-title reveal d1">
            {homeData.cta.title.split(' ').map((word, i) =>
              i % 3 === 2
                ? <em key={i}> {word}</em>
                : <span key={i}> {word}</span>
            )}
          </h2>
          <p className="hr-cta-desc reveal d2">{homeData.cta.desc}</p>
          <div className="reveal d3">
            <Link to="/product" className="hr-btn-gold">{homeData.cta.btn}</Link>
          </div>
        </div>

        <div className="hr-cta-right">
          {[
            ["Free Shipping", "On all orders above ₹999", 0],
            ["Easy Returns",  "30-day hassle-free returns", 1],
            ["Secure Payment","100% encrypted transactions", 2],
          ].map(([title, desc, i]) => (
            <div key={title} className={`hr-trust reveal d${i + 2}`}>
              <div className="hr-trust-icon">{trustIcons[i]}</div>
              <div>
                <div className="hr-trust-title">{title}</div>
                <div className="hr-trust-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;