import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trash2 } from "lucide-react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .ac-wrap {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    min-height: 100vh;
    color: #a8c4e0;
    position: relative;
    overflow-x: hidden;
  }

  /* dot grid */
  .ac-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px; opacity: .3;
  }
  /* glow */
  .ac-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14,99,233,.07) 0%, transparent 70%);
  }

  /* ── STATUS BAR ── */
  .ac-statusbar {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 34px;
    background: rgba(14,99,233,.08);
    border-bottom: 1px solid rgba(56,139,253,.2);
    font-size: .56rem; letter-spacing: .16em; text-transform: uppercase;
  }
  .ac-status-left { display: flex; align-items: center; gap: 16px; color: rgba(168,196,224,.35); }
  .ac-status-live { display: flex; align-items: center; gap: 6px; color: rgba(0,212,180,.7); }
  .ac-status-live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4; box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: acPulse 1.5s ease infinite;
  }
  @keyframes acPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ac-status-right { color: rgba(56,139,253,.5); font-size: .54rem; }

  .ac-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 40px 28px 100px;
  }

  /* ── HEADER ── */
  .ac-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid rgba(56,139,253,.12);
    animation: acUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes acUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .ac-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .ac-eyebrow-line { height: 1px; width: 24px; background: linear-gradient(90deg,#388bfd,transparent); }
  .ac-eyebrow-text { font-size: .56rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.6); }

  .ac-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    font-weight: 800; letter-spacing: -.02em;
    color: #e8f4ff; line-height: 1;
  }
  .ac-title span { color: transparent; -webkit-text-stroke: 1px rgba(56,139,253,.45); }
  .ac-count { font-size: .56rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(168,196,224,.3); margin-top: 6px; }

  .ac-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(56,139,253,.08); border: 1px solid rgba(56,139,253,.25);
    color: rgba(56,139,253,.7);
    font-size: .6rem; letter-spacing: .16em; text-transform: uppercase; font-weight: 600;
    padding: 6px 14px; align-self: flex-start; margin-top: 4px;
  }
  .ac-badge-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #388bfd; box-shadow: 0 0 6px rgba(56,139,253,.8);
    animation: acPulse 2s ease infinite;
  }

  /* ── TOOLBAR ── */
  .ac-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; flex-wrap: wrap;
    animation: acUp .6s cubic-bezier(.16,1,.3,1) .06s both;
  }
  .ac-search-wrap { position: relative; flex:1; min-width:200px; max-width:340px; }
  .ac-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%); color: rgba(56,139,253,.4); pointer-events: none; display: flex;
  }
  .ac-search {
    width: 100%; box-sizing: border-box;
    background: rgba(56,139,253,.05); border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0; font-family: 'JetBrains Mono', monospace;
    font-size: .72rem; font-weight: 300; padding: 9px 12px 9px 32px; outline: none;
    transition: border-color .25s, box-shadow .25s;
  }
  .ac-search::placeholder { color: rgba(168,196,224,.2); }
  .ac-search:focus { border-color: rgba(56,139,253,.5); box-shadow: 0 0 0 3px rgba(56,139,253,.07); }
  .ac-result-count {
    font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(168,196,224,.25); margin-left: auto;
  }

  /* ── TABLE WRAP ── */
  .ac-table-wrap {
    border: 1px solid rgba(56,139,253,.12);
    background: rgba(3,6,15,.85);
    overflow-x: auto; position: relative;
    animation: acUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .ac-table-wrap::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, rgba(56,139,253,.3), transparent);
  }

  /* ── TABLE ── */
  .ac-table { width: 100%; border-collapse: collapse; min-width: 700px; }

  .ac-table thead tr { border-bottom: 1px solid rgba(56,139,253,.12); }
  .ac-table thead th {
    padding: 13px 18px; text-align: left;
    font-size: .56rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(56,139,253,.55); font-weight: 500;
    background: rgba(56,139,253,.04); white-space: nowrap;
  }
  .ac-table thead th:last-child { text-align: center; }

  .ac-table tbody tr {
    border-bottom: 1px solid rgba(56,139,253,.06);
    transition: background .2s;
    animation: acUp .4s cubic-bezier(.16,1,.3,1) both;
  }
  .ac-table tbody tr:last-child { border-bottom: none; }
  .ac-table tbody tr:hover { background: rgba(56,139,253,.04); }
  .ac-table td { padding: 15px 18px; vertical-align: top; }

  /* index */
  .ac-cell-idx { font-size: .52rem; letter-spacing: .14em; color: rgba(56,139,253,.3); }

  /* name */
  .ac-cell-name {
    font-family: 'Syne', sans-serif;
    font-size: .88rem; font-weight: 700;
    color: #e8f4ff; letter-spacing: -.01em; white-space: nowrap;
  }

  /* email */
  .ac-cell-email { font-size: .72rem; font-weight: 300; color: rgba(168,196,224,.45); }
  .ac-cell-email a { color: inherit; text-decoration: none; transition: color .2s; }
  .ac-cell-email a:hover { color: #388bfd; }

  /* phone */
  .ac-cell-phone { font-size: .72rem; font-weight: 300; color: rgba(168,196,224,.4); white-space: nowrap; }

  /* message */
  .ac-cell-msg {
    font-size: .72rem; font-weight: 300; color: rgba(168,196,224,.4);
    line-height: 1.65; max-width: 300px;
  }
  .ac-cell-msg.collapsed {
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
  }
  .ac-read-more {
    background: none; border: none; padding: 0; margin-top: 4px;
    font-size: .58rem; letter-spacing: .1em; text-transform: uppercase;
    color: rgba(56,139,253,.6); cursor: pointer;
    font-family: 'JetBrains Mono', monospace; font-weight: 500; display: block;
    transition: color .2s;
  }
  .ac-read-more:hover { color: #79b8ff; }

  /* delete */
  .ac-del-btn {
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto; width: 32px; height: 32px;
    border: 1px solid rgba(239,68,68,.2); background: rgba(239,68,68,.06);
    color: rgba(239,68,68,.55); cursor: pointer;
    transition: background .2s, border-color .2s, color .2s, transform .2s;
  }
  .ac-del-btn:hover {
    background: rgba(239,68,68,.14); border-color: rgba(239,68,68,.5);
    color: #f87171; transform: scale(1.08);
  }

  /* ── EMPTY ── */
  .ac-empty {
    text-align: center; padding: 72px 24px;
    border: 1px solid rgba(56,139,253,.07);
    background: rgba(56,139,253,.02);
    animation: acUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .ac-empty-sym {
    font-family: 'Syne', sans-serif;
    font-size: 3.5rem; font-weight: 800;
    color: rgba(56,139,253,.07); line-height: 1; margin-bottom: 12px;
  }
  .ac-empty p { font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.2); }

  /* ── SKELETON ── */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg,
      rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 800px 100%; animation: skel 1.4s infinite linear; border-radius: 1px;
  }

  /* ── CONFIRM MODAL ── */
  .ac-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(3,6,15,.85); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: acFadeIn .2s ease both;
  }
  @keyframes acFadeIn { from{opacity:0} to{opacity:1} }
  .ac-modal {
    background: #070b14; border: 1px solid rgba(56,139,253,.18);
    padding: 40px 36px; max-width: 380px; width: 100%;
    position: relative; animation: acUp .35s cubic-bezier(.16,1,.3,1) both;
  }
  .ac-modal::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239,68,68,.6), transparent);
  }
  /* corner bracket */
  .ac-modal::after {
    content: '';
    position: absolute; bottom: 0; right: 0;
    width: 12px; height: 12px;
    border-bottom: 1px solid rgba(56,139,253,.3);
    border-right: 1px solid rgba(56,139,253,.3);
  }
  .ac-modal-icon {
    width: 42px; height: 42px; border: 1px solid rgba(239,68,68,.3);
    display: flex; align-items: center; justify-content: center;
    color: #f87171; background: rgba(239,68,68,.07); margin-bottom: 18px;
  }
  .ac-modal h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: #e8f4ff; margin-bottom: 8px;
  }
  .ac-modal p {
    font-size: .72rem; font-weight: 300;
    color: rgba(168,196,224,.4); line-height: 1.7; margin-bottom: 24px;
  }
  .ac-modal-btns { display: flex; gap: 8px; }
  .ac-modal-cancel {
    flex: 1; background: none; border: 1px solid rgba(168,196,224,.12);
    color: rgba(168,196,224,.4); font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .14em; text-transform: uppercase;
    padding: 10px; cursor: pointer; transition: border-color .2s, color .2s;
  }
  .ac-modal-cancel:hover { border-color: rgba(168,196,224,.35); color: #a8c4e0; }
  .ac-modal-confirm {
    flex: 1; background: rgba(239,68,68,.85); border: none;
    color: #fff; font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .14em; text-transform: uppercase;
    padding: 10px; cursor: pointer; transition: opacity .2s, transform .2s;
  }
  .ac-modal-confirm:hover { opacity: .85; transform: translateY(-1px); }

  /* ── TOAST ── */
  .ac-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #00d4b4; color: #03060f;
    font-family: 'JetBrains Mono', monospace;
    font-size: .65rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 24px; box-shadow: 0 0 24px rgba(0,212,180,.35);
    z-index: 300;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
  }
  .ac-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ac-toast.error { background: #ef4444; color: #fff; box-shadow: 0 0 24px rgba(239,68,68,.35); }
`;

const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconWarn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const useClock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const MessageCell = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text?.length > 90;
  return (
    <div>
      <div className={`ac-cell-msg ${isLong && !expanded ? 'collapsed' : ''}`}>{text}</div>
      {isLong && (
        <button className="ac-read-more" onClick={() => setExpanded(e => !e)}>
          {expanded ? 'show less ↑' : 'read more ↓'}
        </button>
      )}
    </div>
  );
};

function AdminContact() {
  const [contact,   setContact]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [toast,     setToast]     = useState({ show: false, msg: '', error: false });
  const time = useClock();

  const fetchContact = async () => {
    try {
      const res = await api.get("/contact/get");
      if (res.data.status) setContact(res.data.contact);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContact(); }, []);

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 2800);
  };

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      const res = await api.delete(`/contact/delete/${id}`);
      setContact(prev => prev.filter(item => item._id !== id));
      showToast(res.data.message || 'Contact deleted');
    } catch (err) {
      console.log(err);
      showToast('Failed to delete contact', true);
    }
  };

  const filtered = contact.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search) ||
    c.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{css}</style>
      <div className="ac-wrap">

        {/* STATUS BAR */}
        <div className="ac-statusbar">
          <div className="ac-status-left">
            <div className="ac-status-live">System Online</div>
            <span>Contact.Module</span>
            <span>{contact.length} records loaded</span>
          </div>
          <div className="ac-status-right">{time}</div>
        </div>

        <div className="ac-inner">

          {/* HEADER */}
          <div className="ac-header">
            <div>
              <div className="ac-eyebrow">
                <div className="ac-eyebrow-line" />
                <span className="ac-eyebrow-text">Admin / Messages</span>
              </div>
              <h1 className="ac-title">CONTACT <span>MSGS</span></h1>
              {!loading && <div className="ac-count">{contact.length} message{contact.length !== 1 ? 's' : ''} in inbox</div>}
            </div>
            {!loading && (
              <div className="ac-badge">
                <div className="ac-badge-dot" />
                {contact.length} record{contact.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* TOOLBAR */}
          {!loading && contact.length > 0 && (
            <div className="ac-toolbar">
              <div className="ac-search-wrap">
                <span className="ac-search-icon"><IconSearch /></span>
                <input
                  className="ac-search"
                  placeholder="Search name, email, phone, message…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {search && (
                <div className="ac-result-count">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* CONTENT */}
          {loading ? (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>{['#','Name','Email','Phone','Message','Action'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[1,2,3,4].map(i => (
                    <tr key={i}>
                      {[20,90,150,80,220,32].map((w,j) => (
                        <td key={j} style={{ padding:'16px 18px' }}>
                          <div className="skel" style={{ height:11, width:w }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : contact.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-sym">[ ]</div>
              <p>No contact messages yet</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ac-empty">
              <div className="ac-empty-sym">[ ]</div>
              <p>No results for "{search}"</p>
            </div>
          ) : (
            <div className="ac-table-wrap">
              <table className="ac-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th style={{ textAlign:'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ele, idx) => (
                    <tr key={ele._id} style={{ animationDelay: `${idx * 0.04}s` }}>
                      <td><div className="ac-cell-idx">{String(idx+1).padStart(2,'0')}</div></td>
                      <td><div className="ac-cell-name">{ele.name}</div></td>
                      <td>
                        <div className="ac-cell-email">
                          <a href={`mailto:${ele.email}`}>{ele.email}</a>
                        </div>
                      </td>
                      <td><div className="ac-cell-phone">{ele.phone}</div></td>
                      <td><MessageCell text={ele.message} /></td>
                      <td style={{ textAlign:'center' }}>
                        <button
                          className="ac-del-btn"
                          onClick={() => setConfirmId(ele._id)}
                          title="Delete message"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmId && (
        <div className="ac-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="ac-modal" onClick={e => e.stopPropagation()}>
            <div className="ac-modal-icon"><IconWarn /></div>
            <h3>Delete Message?</h3>
            <p>This contact message will be permanently deleted from the database. This action cannot be undone.</p>
            <div className="ac-modal-btns">
              <button className="ac-modal-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="ac-modal-confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`ac-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
}

export default AdminContact;
