import { useEffect, useState } from "react";
import api from "../../services/api";
import UserOrdersModal from "../../components/admin/UserOrdersModal";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .au-wrap {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    min-height: 100vh;
    color: #a8c4e0;
    position: relative;
    overflow-x: hidden;
  }

  /* dot grid */
  .au-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px; opacity: .3;
  }
  /* glow */
  .au-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14,99,233,.07) 0%, transparent 70%);
  }

  /* ── STATUS BAR ── */
  .au-statusbar {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 34px;
    background: rgba(14,99,233,.08);
    border-bottom: 1px solid rgba(56,139,253,.2);
    font-size: .56rem; letter-spacing: .16em; text-transform: uppercase;
  }
  .au-status-left { display: flex; align-items: center; gap: 16px; color: rgba(168,196,224,.35); }
  .au-status-live { display: flex; align-items: center; gap: 6px; color: rgba(0,212,180,.7); }
  .au-status-live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4; box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: auPulse 1.5s ease infinite;
  }
  @keyframes auPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .au-status-right { color: rgba(56,139,253,.5); font-size: .54rem; }

  .au-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    padding: 40px 28px 100px;
  }

  /* ── HEADER ── */
  .au-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 28px; padding-bottom: 20px;
    border-bottom: 1px solid rgba(56,139,253,.12);
    animation: auUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes auUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .au-eyebrow { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .au-eyebrow-line { height: 1px; width: 24px; background: linear-gradient(90deg,#388bfd,transparent); }
  .au-eyebrow-text { font-size: .56rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.6); }
  .au-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    font-weight: 800; letter-spacing: -.02em;
    color: #e8f4ff; line-height: 1;
  }
  .au-title span { color: transparent; -webkit-text-stroke: 1px rgba(56,139,253,.45); }
  .au-count { font-size: .56rem; letter-spacing: .16em; text-transform: uppercase; color: rgba(168,196,224,.3); margin-top: 6px; }

  /* ── TOOLBAR ── */
  .au-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 16px; flex-wrap: wrap;
    animation: auUp .6s cubic-bezier(.16,1,.3,1) .06s both;
  }
  .au-search-wrap { position: relative; flex:1; min-width:200px; max-width:320px; }
  .au-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%); color: rgba(56,139,253,.4); pointer-events: none; display: flex;
  }
  .au-search {
    width: 100%; box-sizing: border-box;
    background: rgba(56,139,253,.05); border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0; font-family: 'JetBrains Mono', monospace;
    font-size: .72rem; font-weight: 300; padding: 9px 12px 9px 32px; outline: none;
    transition: border-color .25s, box-shadow .25s;
  }
  .au-search::placeholder { color: rgba(168,196,224,.2); }
  .au-search:focus { border-color: rgba(56,139,253,.5); box-shadow: 0 0 0 3px rgba(56,139,253,.07); }
  .au-result-count { font-size: .58rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(168,196,224,.25); margin-left: auto; }

  /* filter pills */
  .au-filters { display: flex; gap: 6px; flex-wrap: wrap; }
  .au-filter-btn {
    font-family: 'JetBrains Mono', monospace;
    font-size: .55rem; letter-spacing: .14em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid rgba(56,139,253,.15);
    background: none; color: rgba(168,196,224,.3); cursor: pointer;
    transition: all .2s;
  }
  .au-filter-btn:hover { border-color: rgba(56,139,253,.4); color: rgba(56,139,253,.7); background: rgba(56,139,253,.06); }
  .au-filter-btn.active { border-color: rgba(56,139,253,.55); color: #79b8ff; background: rgba(56,139,253,.1); }

  /* ── TABLE WRAP ── */
  .au-table-wrap {
    border: 1px solid rgba(56,139,253,.12);
    background: rgba(3,6,15,.85);
    overflow-x: auto;
    position: relative;
    animation: auUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .au-table-wrap::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, rgba(56,139,253,.3), transparent);
  }

  /* ── TABLE ── */
  .au-table {
    width: 100%; border-collapse: collapse; min-width: 640px;
  }

  /* head */
  .au-table thead tr { border-bottom: 1px solid rgba(56,139,253,.12); }
  .au-table thead th {
    padding: 13px 18px; text-align: left;
    font-size: .56rem; letter-spacing: .2em; text-transform: uppercase;
    color: rgba(56,139,253,.55); font-weight: 500;
    background: rgba(56,139,253,.04); white-space: nowrap;
  }
  .au-table thead th:last-child { text-align: center; }

  /* rows */
  .au-table tbody tr {
    border-bottom: 1px solid rgba(56,139,253,.06);
    transition: background .2s;
    animation: auUp .4s cubic-bezier(.16,1,.3,1) both;
  }
  .au-table tbody tr:last-child { border-bottom: none; }
  .au-table tbody tr:hover { background: rgba(56,139,253,.04); }
  .au-table td { padding: 14px 18px; vertical-align: middle; }

  /* index */
  .au-cell-idx { font-size: .52rem; letter-spacing: .14em; color: rgba(56,139,253,.3); }

  /* avatar + name */
  .au-cell-user { display: flex; align-items: center; gap: 12px; }
  .au-avatar {
    width: 34px; height: 34px; border-radius: 2px;
    border: 1px solid rgba(56,139,253,.25);
    background: linear-gradient(135deg, rgba(56,139,253,.15), rgba(56,139,253,.05));
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: .85rem; font-weight: 800;
    color: #388bfd; flex-shrink: 0;
  }
  .au-cell-name {
    font-family: 'Syne', sans-serif;
    font-size: .9rem; font-weight: 700; color: #e8f4ff; letter-spacing: -.01em;
  }

  /* email */
  .au-cell-email {
    font-size: .72rem; font-weight: 300; color: rgba(168,196,224,.45); letter-spacing: .02em;
  }
  .au-cell-email a { color: inherit; text-decoration: none; transition: color .2s; }
  .au-cell-email a:hover { color: #388bfd; }

  /* role badge */
  .au-role {
    display: inline-block;
    font-size: .55rem; letter-spacing: .18em; text-transform: uppercase; font-weight: 700;
    padding: 4px 10px;
  }
  .au-role.admin { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: #f87171; }
  .au-role.user  { background: rgba(0,212,180,.07); border: 1px solid rgba(0,212,180,.25); color: #00d4b4; }

  /* action btn */
  .au-view-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(56,139,253,.08); border: 1px solid rgba(56,139,253,.22);
    color: rgba(56,139,253,.7);
    font-family: 'JetBrains Mono', monospace;
    font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
    padding: 7px 14px; cursor: pointer;
    transition: background .25s, border-color .25s, color .25s, box-shadow .25s;
    margin: 0 auto; display: flex;
  }
  .au-view-btn:hover {
    background: rgba(56,139,253,.16);
    border-color: rgba(56,139,253,.55);
    color: #79b8ff;
    box-shadow: 0 0 14px rgba(56,139,253,.15);
  }

  /* ── EMPTY ── */
  .au-empty {
    text-align: center; padding: 72px 24px;
    border: 1px solid rgba(56,139,253,.07);
    background: rgba(56,139,253,.02);
    animation: auUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }
  .au-empty-sym {
    font-family: 'Syne', sans-serif;
    font-size: 3.5rem; font-weight: 800;
    color: rgba(56,139,253,.07); line-height: 1; margin-bottom: 12px;
  }
  .au-empty p { font-size: .6rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.2); }

  /* ── SKELETON ── */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg,
      rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 800px 100%; animation: skel 1.4s infinite linear; border-radius: 1px;
  }

  /* ── STATS ROW ── */
  .au-stats {
    display: flex; gap: 2px; margin-bottom: 20px;
    animation: auUp .6s cubic-bezier(.16,1,.3,1) .04s both;
  }
  .au-stat {
    flex: 1; padding: 14px 18px;
    border: 1px solid rgba(56,139,253,.1);
    background: rgba(56,139,253,.03);
    display: flex; flex-direction: column; gap: 4px;
  }
  .au-stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem; font-weight: 800; color: #e8f4ff; line-height: 1;
  }
  .au-stat-label { font-size: .52rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.25); }
`;

const IconSearch = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconOrders = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
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

const AdminUsers = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch]           = useState('');
  const [roleFilter, setRoleFilter]   = useState('all');
  const time = useClock();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUsers(res.data.users);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const admins  = users.filter(u => u.role === 'admin').length;
  const members = users.filter(u => u.role !== 'admin').length;

  const initials = (name) =>
    name ? name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : '?';

  return (
    <>
      <style>{css}</style>
      <div className="au-wrap">

        {/* STATUS BAR */}
        <div className="au-statusbar">
          <div className="au-status-left">
            <div className="au-status-live">System Online</div>
            <span>Users.Module</span>
            <span>{users.length} records loaded</span>
          </div>
          <div className="au-status-right">{time}</div>
        </div>

        <div className="au-inner">

          {/* HEADER */}
          <div className="au-header">
            <div>
              <div className="au-eyebrow">
                <div className="au-eyebrow-line" />
                <span className="au-eyebrow-text">Admin / Users</span>
              </div>
              <h1 className="au-title">USER <span>MGMT</span></h1>
              {!loading && <div className="au-count">{users.length} registered accounts</div>}
            </div>
          </div>

          {/* MINI STATS */}
          {!loading && (
            <div className="au-stats">
              <div className="au-stat">
                <div className="au-stat-val">{users.length}</div>
                <div className="au-stat-label">Total Users</div>
              </div>
              <div className="au-stat">
                <div className="au-stat-val">{members}</div>
                <div className="au-stat-label">Members</div>
              </div>
              <div className="au-stat">
                <div className="au-stat-val">{admins}</div>
                <div className="au-stat-label">Admins</div>
              </div>
            </div>
          )}

          {/* TOOLBAR */}
          {!loading && users.length > 0 && (
            <div className="au-toolbar">
              <div className="au-search-wrap">
                <span className="au-search-icon"><IconSearch /></span>
                <input
                  className="au-search"
                  placeholder="Search name or email…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="au-filters">
                {['all', 'user', 'admin'].map(f => (
                  <button
                    key={f}
                    className={`au-filter-btn${roleFilter === f ? ' active' : ''}`}
                    onClick={() => setRoleFilter(f)}
                  >
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
              {search && (
                <div className="au-result-count">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* TABLE */}
          {loading ? (
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    {['#', 'User', 'Email', 'Role', 'Action'].map(h => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {[1,2,3,4,5].map(i => (
                    <tr key={i}>
                      <td><div className="skel" style={{ height:10, width:20 }}/></td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div className="skel" style={{ width:34, height:34, flexShrink:0 }}/>
                          <div className="skel" style={{ height:12, width:100 }}/>
                        </div>
                      </td>
                      <td><div className="skel" style={{ height:10, width:150 }}/></td>
                      <td><div className="skel" style={{ height:20, width:50 }}/></td>
                      <td><div className="skel" style={{ height:28, width:90, margin:'0 auto' }}/></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filtered.length === 0 ? (
            <div className="au-empty">
              <div className="au-empty-sym">[ ]</div>
              <p>{search ? `No results for "${search}"` : 'No users found'}</p>
            </div>
          ) : (
            <div className="au-table-wrap">
              <table className="au-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style={{ textAlign:'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, idx) => (
                    <tr
                      key={user._id}
                      style={{ animationDelay: `${idx * 0.04}s` }}
                    >
                      <td>
                        <div className="au-cell-idx">
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </td>
                      <td>
                        <div className="au-cell-user">
                          <div className="au-avatar">{initials(user.name)}</div>
                          <div className="au-cell-name">{user.name}</div>
                        </div>
                      </td>
                      <td>
                        <div className="au-cell-email">
                          <a href={`mailto:${user.email}`}>{user.email}</a>
                        </div>
                      </td>
                      <td>
                        <span className={`au-role ${user.role === 'admin' ? 'admin' : 'user'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="au-view-btn"
                          onClick={() => setSelectedUser(user)}
                        >
                          <IconOrders /> View Orders
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

      {/* MODAL */}
      {selectedUser && (
        <UserOrdersModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
};

export default AdminUsers;
