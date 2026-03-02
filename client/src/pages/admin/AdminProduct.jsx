import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil, Eye } from "lucide-react";
import ProductForm from "../../components/admin/productForm";
import ViewProductModal from "../../components/admin/ViewProductModal";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

  .ap-wrap {
    font-family: 'JetBrains Mono', monospace;
    background: #03060f;
    min-height: 100vh;
    color: #a8c4e0;
    padding: 0;
    position: relative;
    overflow-x: hidden;
  }

  /* dot grid bg */
  .ap-wrap::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(56,139,253,.18) 1px, transparent 1px);
    background-size: 28px 28px;
    opacity: .3;
  }

  /* glow */
  .ap-wrap::after {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(14,99,233,.07) 0%, transparent 70%);
  }

  .ap-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto;
    padding: 40px 28px 100px;
  }

  /* ── STATUS BAR ── */
  .ap-statusbar {
    position: relative; z-index: 2;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; height: 34px;
    background: rgba(14,99,233,.08);
    border-bottom: 1px solid rgba(56,139,253,.2);
    font-size: .56rem; letter-spacing: .16em; text-transform: uppercase;
  }
  .ap-status-left { display: flex; align-items: center; gap: 16px; color: rgba(168,196,224,.35); }
  .ap-status-live { display: flex; align-items: center; gap: 6px; color: rgba(0,212,180,.7); }
  .ap-status-live::before {
    content: '';
    width: 5px; height: 5px; border-radius: 50%;
    background: #00d4b4; box-shadow: 0 0 6px rgba(0,212,180,.8);
    animation: apPulse 1.5s ease infinite;
  }
  @keyframes apPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .ap-status-right { color: rgba(56,139,253,.5); font-size: .54rem; }

  /* ── HEADER ── */
  .ap-header {
    display: flex; align-items: flex-end;
    justify-content: space-between; flex-wrap: wrap;
    gap: 16px; margin-bottom: 32px; padding-bottom: 20px;
    border-bottom: 1px solid rgba(56,139,253,.12);
    animation: apUp .6s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes apUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

  .ap-header-left {}
  .ap-eyebrow {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px;
  }
  .ap-eyebrow-line { height: 1px; width: 24px; background: linear-gradient(90deg,#388bfd,transparent); }
  .ap-eyebrow-text {
    font-size: .56rem; letter-spacing: .2em;
    text-transform: uppercase; color: rgba(56,139,253,.6);
  }
  .ap-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.6rem, 3.5vw, 2.2rem);
    font-weight: 800; letter-spacing: -.02em;
    color: #e8f4ff; line-height: 1;
  }
  .ap-title span { color: transparent; -webkit-text-stroke: 1px rgba(56,139,253,.45); }
  .ap-count {
    font-size: .56rem; letter-spacing: .16em;
    text-transform: uppercase; color: rgba(168,196,224,.3);
    margin-top: 6px;
  }

  /* add button */
  .ap-add-btn {
    display: flex; align-items: center; gap: 8px;
    background: rgba(56,139,253,.12);
    border: 1px solid rgba(56,139,253,.35);
    color: #79b8ff;
    font-family: 'JetBrains Mono', monospace;
    font-size: .65rem; letter-spacing: .14em;
    text-transform: uppercase; font-weight: 500;
    padding: 10px 20px; cursor: pointer;
    transition: background .25s, border-color .25s, box-shadow .25s, transform .2s;
    position: relative; overflow: hidden;
  }
  .ap-add-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(56,139,253,.15);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .4s cubic-bezier(.16,1,.3,1);
  }
  .ap-add-btn:hover::before { transform: translateX(110%) skewX(-15deg); }
  .ap-add-btn:hover {
    background: rgba(56,139,253,.2);
    border-color: rgba(56,139,253,.65);
    box-shadow: 0 0 20px rgba(56,139,253,.2);
    transform: translateY(-1px);
  }

  /* ── TOOLBAR ── */
  .ap-toolbar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 20px; flex-wrap: wrap;
    animation: apUp .6s cubic-bezier(.16,1,.3,1) .06s both;
  }
  .ap-search-wrap { position: relative; flex:1; min-width:200px; max-width:320px; }
  .ap-search-icon {
    position: absolute; left: 10px; top: 50%;
    transform: translateY(-50%); color: rgba(56,139,253,.4);
    pointer-events: none; display: flex;
  }
  .ap-search {
    width: 100%; box-sizing: border-box;
    background: rgba(56,139,253,.05);
    border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0; font-family: 'JetBrains Mono', monospace;
    font-size: .72rem; font-weight: 300;
    padding: 9px 12px 9px 32px;
    outline: none;
    transition: border-color .25s, box-shadow .25s;
  }
  .ap-search::placeholder { color: rgba(168,196,224,.2); }
  .ap-search:focus {
    border-color: rgba(56,139,253,.5);
    box-shadow: 0 0 0 3px rgba(56,139,253,.07);
  }
  .ap-result-count {
    font-size: .58rem; letter-spacing: .12em; text-transform: uppercase;
    color: rgba(168,196,224,.25); margin-left: auto;
  }

  /* ── PRODUCT GRID ── */
  .ap-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 1px;
    background: rgba(56,139,253,.07);
    animation: apUp .6s cubic-bezier(.16,1,.3,1) .12s both;
  }

  /* ── PRODUCT CARD ── */
  .ap-card {
    background: rgba(3,6,15,.92);
    border: 1px solid rgba(56,139,253,.1);
    display: flex; flex-direction: column;
    transition: border-color .3s, box-shadow .3s;
    animation: apUp .45s cubic-bezier(.16,1,.3,1) both;
    position: relative; overflow: hidden;
  }
  .ap-card:hover {
    border-color: rgba(56,139,253,.38);
    box-shadow: 0 0 24px rgba(56,139,253,.08);
    z-index: 1;
  }
  /* top accent */
  .ap-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, #388bfd, transparent);
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s cubic-bezier(.16,1,.3,1);
  }
  .ap-card:hover::before { transform: scaleX(1); }

  /* image */
  .ap-img-wrap {
    width: 100%; height: 160px; overflow: hidden;
    border-bottom: 1px solid rgba(56,139,253,.08);
    position: relative; background: rgba(56,139,253,.04);
    flex-shrink: 0;
  }
  .ap-img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform .5s cubic-bezier(.16,1,.3,1), filter .5s;
    filter: saturate(.7) brightness(.85);
  }
  .ap-card:hover .ap-img { transform: scale(1.06); filter: saturate(1) brightness(.95); }

  /* card index badge */
  .ap-card-idx {
    position: absolute; top: 8px; left: 8px;
    font-size: .5rem; letter-spacing: .16em; text-transform: uppercase;
    background: rgba(3,6,15,.85);
    border: 1px solid rgba(56,139,253,.25);
    color: rgba(56,139,253,.6);
    padding: 3px 8px;
  }

  /* card body */
  .ap-card-body { padding: 16px 16px 12px; flex: 1; display: flex; flex-direction: column; }
  .ap-card-name {
    font-family: 'Syne', sans-serif;
    font-size: .95rem; font-weight: 700;
    color: #e8f4ff; margin-bottom: 4px; letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ap-card-price {
    font-size: .8rem; font-weight: 700; letter-spacing: .04em;
    color: #388bfd; margin-bottom: 8px;
  }
  .ap-card-price em { font-style: normal; font-weight: 400; color: rgba(56,139,253,.5); font-size: .65rem; margin-right: 2px; }
  .ap-card-desc {
    font-size: .68rem; font-weight: 300; line-height: 1.6;
    color: rgba(168,196,224,.35);
    display: -webkit-box; -webkit-line-clamp: 2;
    -webkit-box-orient: vertical; overflow: hidden;
    flex: 1; margin-bottom: 14px;
  }

  /* card actions */
  .ap-card-actions {
    display: flex; align-items: center;
    border-top: 1px solid rgba(56,139,253,.08);
    padding-top: 12px; gap: 2px;
  }
  .ap-action-btn {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
    background: none; border: none; cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: .55rem; letter-spacing: .1em; text-transform: uppercase;
    padding: 7px 4px;
    transition: background .2s, color .2s;
  }
  .ap-action-btn.view  { color: rgba(0,212,180,.5); border: 1px solid rgba(0,212,180,.12); }
  .ap-action-btn.edit  { color: rgba(56,139,253,.55); border: 1px solid rgba(56,139,253,.12); }
  .ap-action-btn.del   { color: rgba(239,68,68,.45); border: 1px solid rgba(239,68,68,.1); }
  .ap-action-btn.view:hover  { background: rgba(0,212,180,.08); color: #00d4b4; border-color: rgba(0,212,180,.35); }
  .ap-action-btn.edit:hover  { background: rgba(56,139,253,.08); color: #79b8ff; border-color: rgba(56,139,253,.35); }
  .ap-action-btn.del:hover   { background: rgba(239,68,68,.08); color: #f87171; border-color: rgba(239,68,68,.35); }

  /* ── EMPTY ── */
  .ap-empty {
    grid-column: 1/-1; text-align: center;
    padding: 80px 24px;
    border: 1px solid rgba(56,139,253,.08);
    background: rgba(56,139,253,.02);
  }
  .ap-empty-sym {
    font-family: 'Syne', sans-serif;
    font-size: 4rem; font-weight: 800;
    color: rgba(56,139,253,.06); line-height: 1; margin-bottom: 14px;
  }
  .ap-empty p {
    font-size: .62rem; letter-spacing: .18em;
    text-transform: uppercase; color: rgba(168,196,224,.2);
  }

  /* ── SKELETON ── */
  @keyframes skel { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel {
    background: linear-gradient(90deg,
      rgba(56,139,253,.03) 25%, rgba(56,139,253,.08) 50%, rgba(56,139,253,.03) 75%);
    background-size: 800px 100%;
    animation: skel 1.4s infinite linear;
  }

  /* ── CONFIRM MODAL ── */
  .ap-modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(3,6,15,.85); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: apFadeIn .2s ease both;
  }
  @keyframes apFadeIn { from{opacity:0} to{opacity:1} }
  .ap-modal {
    background: #070b14;
    border: 1px solid rgba(56,139,253,.2);
    padding: 40px 36px; max-width: 380px; width: 100%;
    position: relative;
    animation: apUp .35s cubic-bezier(.16,1,.3,1) both;
  }
  .ap-modal::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(239,68,68,.6), transparent);
  }
  .ap-modal-icon {
    width: 42px; height: 42px;
    border: 1px solid rgba(239,68,68,.3);
    display: flex; align-items: center; justify-content: center;
    color: #f87171; background: rgba(239,68,68,.07); margin-bottom: 18px;
  }
  .ap-modal h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem; font-weight: 700; color: #e8f4ff; margin-bottom: 8px;
  }
  .ap-modal p {
    font-size: .72rem; font-weight: 300;
    color: rgba(168,196,224,.4); line-height: 1.7; margin-bottom: 24px;
  }
  .ap-modal-btns { display: flex; gap: 8px; }
  .ap-modal-cancel {
    flex: 1; background: none;
    border: 1px solid rgba(168,196,224,.12);
    color: rgba(168,196,224,.4);
    font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .14em; text-transform: uppercase;
    padding: 10px; cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .ap-modal-cancel:hover { border-color: rgba(168,196,224,.35); color: #a8c4e0; }
  .ap-modal-confirm {
    flex: 1;
    background: rgba(239,68,68,.85); border: none;
    color: #fff; font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .14em; text-transform: uppercase;
    padding: 10px; cursor: pointer;
    transition: opacity .2s, transform .2s;
  }
  .ap-modal-confirm:hover { opacity: .85; transform: translateY(-1px); }

  /* ── TOAST ── */
  .ap-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #00d4b4; color: #03060f;
    font-family: 'JetBrains Mono', monospace;
    font-size: .65rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 24px;
    box-shadow: 0 0 24px rgba(0,212,180,.35);
    z-index: 300;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
  }
  .ap-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .ap-toast.error { background: #ef4444; color: #fff; box-shadow: 0 0 24px rgba(239,68,68,.35); }
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
const IconPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

function AdminProduct() {
  const url = import.meta.env.VITE_BACKEND_URL;

  const [product,   setProduct]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [viewData,  setViewData]  = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [search,    setSearch]    = useState('');
  const [toast,     setToast]     = useState({ show: false, msg: '', error: false });

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 2800);
  };

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${url}/product/get`);
      if (res.data.status) setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, []);

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      const res = await axios.delete(`${url}/product/delete/${id}`);
      showToast(res.data.message || 'Product deleted');
      fetchProduct();
    } catch (err) {
      console.log(err);
      showToast('Failed to delete product', true);
    }
  };

  const filtered = product.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <>
      <style>{css}</style>
      <div className="ap-wrap">

        {/* STATUS BAR */}
        <div className="ap-statusbar">
          <div className="ap-status-left">
            <div className="ap-status-live">System Online</div>
            <span>Product.Module</span>
            <span>{product.length} records loaded</span>
          </div>
          <div className="ap-status-right">{timeStr}</div>
        </div>

        <div className="ap-inner">

          {/* HEADER */}
          <div className="ap-header">
            <div className="ap-header-left">
              <div className="ap-eyebrow">
                <div className="ap-eyebrow-line" />
                <span className="ap-eyebrow-text">Admin / Products</span>
              </div>
              <h1 className="ap-title">PRODUCT <span>MGMT</span></h1>
              {!loading && <div className="ap-count">{product.length} products in database</div>}
            </div>
            <button
              className="ap-add-btn"
              onClick={() => { setEditData(null); setShowForm(true); }}
            >
              <IconPlus /> Add Product
            </button>
          </div>

          {/* PRODUCT FORM */}
          {showForm && (
            <div style={{ marginBottom: 24 }}>
              <ProductForm
                fetchProduct={fetchProduct}
                setShowForm={setShowForm}
                editData={editData}
                url={url}
              />
            </div>
          )}

          {/* TOOLBAR */}
          {!loading && product.length > 0 && (
            <div className="ap-toolbar">
              <div className="ap-search-wrap">
                <span className="ap-search-icon"><IconSearch /></span>
                <input
                  className="ap-search"
                  placeholder="Search products…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {search && (
                <div className="ap-result-count">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
              )}
            </div>
          )}

          {/* GRID */}
          <div className="ap-grid">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="ap-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="skel" style={{ height: 160 }} />
                  <div style={{ padding: 16 }}>
                    <div className="skel" style={{ height: 13, width: '70%', marginBottom: 8 }} />
                    <div className="skel" style={{ height: 11, width: '40%', marginBottom: 12 }} />
                    <div className="skel" style={{ height: 10, width: '90%', marginBottom: 4 }} />
                    <div className="skel" style={{ height: 10, width: '60%' }} />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="ap-empty">
                <div className="ap-empty-sym">[ ]</div>
                <p>{search ? `No results for "${search}"` : 'No products found'}</p>
              </div>
            ) : (
              filtered.map((ele, idx) => (
                <div
                  key={ele._id}
                  className="ap-card"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <div className="ap-img-wrap">
                    <img
                      src={ele.image}
                      alt={ele.name}
                      className="ap-img"
                      onError={e => { e.target.src = 'https://via.placeholder.com/230x160/03060f/388bfd?text=◈'; }}
                    />
                    <div className="ap-card-idx">{String(idx + 1).padStart(2, '0')}</div>
                  </div>

                  <div className="ap-card-body">
                    <div className="ap-card-name">{ele.name}</div>
                    <div className="ap-card-price"><em>₹</em>{ele.price?.toLocaleString()}</div>
                    <div className="ap-card-desc">{ele.description}</div>

                    <div className="ap-card-actions">
                      <button className="ap-action-btn view" onClick={() => setViewData(ele)}>
                        <Eye size={11} /> View
                      </button>
                      <button
                        className="ap-action-btn edit"
                        onClick={() => { setEditData(ele); setShowForm(true); }}
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button className="ap-action-btn del" onClick={() => setConfirmId(ele._id)}>
                        <Trash2 size={11} /> Del
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* VIEW MODAL */}
      {viewData && (
        <ViewProductModal viewData={viewData} setViewData={setViewData} />
      )}

      {/* CONFIRM MODAL */}
      {confirmId && (
        <div className="ap-modal-overlay" onClick={() => setConfirmId(null)}>
          <div className="ap-modal" onClick={e => e.stopPropagation()}>
            <div className="ap-modal-icon"><IconWarn /></div>
            <h3>Delete Product?</h3>
            <p>This product will be permanently removed from the database. This action cannot be undone.</p>
            <div className="ap-modal-btns">
              <button className="ap-modal-cancel" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="ap-modal-confirm" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`ap-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
}

export default AdminProduct;
