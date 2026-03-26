import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --ink:   #0a0a0f;
    --paper: #f5f0e8;
    --gold:  #c9a84c;
    --gold2: #e8c97a;
  }

  .ml-root {
    min-height: 100vh;
    background: var(--ink);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
  }

  .ml-main {
    flex: 1;
    width: 100%;
  }

  /* ── FOOTER ── */
  .ml-footer {
    border-top: 1px solid rgba(201,168,76,.12);
    background: rgba(10,10,15,.97);
    padding: 28px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    z-index: 10;
  }

  /* top gold line accent */
  .ml-footer::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    opacity: .35;
  }

  .ml-footer-brand {
    font-family: 'Playfair Display', serif;
    font-size: .95rem;
    font-weight: 900;
    background: linear-gradient(90deg, var(--gold), var(--gold2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .ml-footer-copy {
    font-size: .65rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(245,240,232,.2);
    font-family: 'DM Sans', sans-serif;
  }

  .ml-footer-rule {
    width: 1px;
    height: 14px;
    background: rgba(201,168,76,.25);
    display: inline-block;
    margin: 0 10px;
    vertical-align: middle;
  }
`;

const MainLayout = () => {
  return (
    <>
      <style>{css}</style>
      <div className="ml-root">

        <Navbar />

        <main className="ml-main">
          <Outlet />
        </main>

        {/* ── FOOTER ── */}
        <footer className="ml-footer">
          <div className="ml-footer-brand">Get Ready</div>
          <div className="ml-footer-copy">
            © {new Date().getFullYear()} Get Ready
            <span className="ml-footer-rule" />
            All rights reserved
          </div>
        </footer>

      </div>
    </>
  );
};

export default MainLayout;