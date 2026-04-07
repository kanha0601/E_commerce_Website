import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .prod-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810;
    min-height: 100vh;
    color: #f0ebe0;
    padding: 80px 24px 120px;
    position: relative;
    overflow-x: hidden;
  }
  .prod-wrap::before {
    content: '';
    position: fixed; top: -20%; right: -10%;
    width: 600px; height: 600px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,.1) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .prod-grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── header ── */
  .prod-header { position: relative; z-index: 1; text-align: center; margin-bottom: 48px; }
  .prod-eyebrow {
    display: inline-flex; align-items: center; gap: 10px; margin-bottom: 18px;
    border: 1px solid rgba(201,168,76,.4); padding: 6px 18px; border-radius: 2px;
  }
  .prod-eyebrow-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #c9a84c;
    box-shadow: 0 0 8px rgba(201,168,76,.7);
  }
  .prod-eyebrow span { font-size: .68rem; letter-spacing: .2em; text-transform: uppercase; color: #c9a84c; font-weight: 500; }
  .prod-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.4rem, 6vw, 4rem); font-weight: 900; line-height: 1.05;
    background: linear-gradient(90deg,#c9a84c,#e8d08a,#fff8df,#c9a84c);
    background-size: 300%; -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: shimmer 6s ease infinite; margin-bottom: 14px;
  }
  @keyframes shimmer { 0%,100%{background-position:0%} 50%{background-position:100%} }
  .prod-subtitle { color: rgba(240,235,224,.4); font-size: .9rem; font-weight: 300; letter-spacing: .04em; }
  .prod-rule { width: 60px; height: 2px; margin: 20px auto 0; background: linear-gradient(90deg, transparent, #c9a84c, transparent); }

  /* ── CATEGORY TABS ── */
  .prod-tabs {
    position: relative; z-index: 1;
    display: flex; align-items: flex-end; gap: 0;
    justify-content: center; flex-wrap: wrap;
    margin-bottom: 40px;
    border-bottom: 1px solid rgba(201,168,76,.15);
    max-width: 900px; margin-left: auto; margin-right: auto;
  }
  .prod-tab {
    position: relative; background: none; border: none;
    color: rgba(240,235,224,.3);
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem; font-weight: 500;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 13px 24px 13px; cursor: pointer;
    transition: color .25s; display: flex; align-items: center; gap: 8px;
  }
  .prod-tab::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
    transform: scaleX(0); transform-origin: center;
    transition: transform .3s cubic-bezier(.16,1,.3,1);
  }
  .prod-tab:hover { color: rgba(240,235,224,.65); }
  .prod-tab.active { color: #c9a84c; }
  .prod-tab.active::after { transform: scaleX(1); }
  .prod-tab-count {
    background: rgba(201,168,76,.1); border: 1px solid rgba(201,168,76,.2);
    color: rgba(201,168,76,.5); font-size: .5rem; font-weight: 700;
    padding: 1px 6px; border-radius: 10px; min-width: 20px; text-align: center;
  }
  .prod-tab.active .prod-tab-count {
    background: rgba(201,168,76,.2); border-color: rgba(201,168,76,.45); color: #c9a84c;
  }

  /* ── filter bar ── */
  .prod-filter-bar {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 12px;
    justify-content: center; flex-wrap: wrap; margin-bottom: 48px;
  }
  .prod-search-wrap { position: relative; }
  .prod-search-icon {
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
    color: rgba(201,168,76,.5); pointer-events: none; display: flex;
  }
  .prod-search {
    background: rgba(255,255,255,.04); border: 1px solid rgba(201,168,76,.2);
    color: #f0ebe0; font-family: 'DM Sans', sans-serif;
    font-size: .85rem; font-weight: 300;
    padding: 11px 16px 11px 40px; border-radius: 2px; outline: none; width: 260px;
    transition: border-color .3s, box-shadow .3s;
  }
  .prod-search::placeholder { color: rgba(240,235,224,.2); }
  .prod-search:focus { border-color: rgba(201,168,76,.6); box-shadow: 0 0 0 3px rgba(201,168,76,.07); }
  .prod-sort {
    background: rgba(255,255,255,.04); border: 1px solid rgba(201,168,76,.2);
    color: #f0ebe0; font-family: 'DM Sans', sans-serif; font-size: .8rem;
    padding: 11px 36px 11px 14px; border-radius: 2px; outline: none; cursor: pointer; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23c9a84c' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center; transition: border-color .3s;
  }
  .prod-sort:focus { border-color: rgba(201,168,76,.6); }
  .prod-count { font-size: .72rem; letter-spacing: .1em; text-transform: uppercase; color: rgba(240,235,224,.3); padding: 0 4px; }

  /* ── grid ── */
  .prod-grid {
    position: relative; z-index: 1; max-width: 1280px; margin: 0 auto;
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2px;
  }

  /* ── card ── */
  .prod-card {
    position: relative;
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    border: 1px solid rgba(201,168,76,.12);
    display: flex; flex-direction: column;
    transition: transform .4s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .4s;
    animation: cardIn .6s cubic-bezier(.16,1,.3,1) both; overflow: hidden;
  }
  @keyframes cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .prod-card:hover { transform: translateY(-6px); border-color: rgba(201,168,76,.45); box-shadow: 0 20px 56px rgba(201,168,76,.1); z-index: 2; }
  .prod-img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/3; }
  .prod-img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s cubic-bezier(.16,1,.3,1); display: block; }
  .prod-card:hover .prod-img { transform: scale(1.07); }
  .prod-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(8,8,16,.7) 0%, transparent 60%); }
  .prod-badge {
    position: absolute; top: 12px; left: 12px;
    background: #c9a84c; color: #080810;
    font-size: .6rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 1px;
  }
  .prod-cat-tag {
    position: absolute; top: 12px; right: 12px;
    background: rgba(8,8,16,.75); border: 1px solid rgba(201,168,76,.3);
    color: rgba(201,168,76,.8); font-size: .52rem; font-weight: 500;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 3px 9px; backdrop-filter: blur(6px);
  }
  .prod-body { padding: 22px 22px 24px; display: flex; flex-direction: column; flex: 1; }
  .prod-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 6px; line-height: 1.25; color: #f0ebe0; }
  .prod-desc {
    font-size: .82rem; font-weight: 300; color: rgba(240,235,224,.45);
    line-height: 1.65; margin-bottom: 18px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1;
  }
  .prod-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .prod-price { font-family: 'Playfair Display', serif; font-size: 1.3rem; font-weight: 700; color: #c9a84c; }
  .prod-price span { font-size: .7rem; font-weight: 400; color: rgba(240,235,224,.3); font-family: 'DM Sans', sans-serif; margin-right: 2px; }
  .prod-btn {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #c9a84c, #e8d08a); color: #080810;
    font-family: 'DM Sans', sans-serif; font-size: .7rem; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 18px; border: none; border-radius: 2px;
    cursor: pointer; white-space: nowrap; position: relative; overflow: hidden;
    transition: transform .3s, box-shadow .3s; flex-shrink: 0;
  }
  .prod-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.2); transform: translateX(-110%) skewX(-15deg); transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .prod-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .prod-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,.4); }
  .prod-btn:active { transform: scale(.97); }
  .prod-btn.added { background: linear-gradient(135deg, #2d6a4f, #40916c); color: #fff; }

  /* ── empty ── */
  .prod-empty { position: relative; z-index: 1; text-align: center; padding: 100px 24px; color: rgba(240,235,224,.3); }
  .prod-empty-icon { font-size: 3rem; margin-bottom: 16px; opacity: .4; }
  .prod-empty p { font-size: .9rem; letter-spacing: .08em; }

  /* ── skeleton ── */
  @keyframes skelShimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .skel { background: linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.08) 50%, rgba(255,255,255,.04) 75%); background-size: 800px 100%; animation: skelShimmer 1.4s infinite linear; }
  .skel-card { border: 1px solid rgba(201,168,76,.08); }
  .skel-img { aspect-ratio: 4/3; }
  .skel-line { border-radius: 2px; margin-bottom: 10px; }
`;

const IconCart = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const CATEGORIES = [
  { value: 'all',         label: 'All'         },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing',    label: 'Clothing'    },
  { value: 'footwear',    label: 'Footwear'    },
  { value: 'accessories', label: 'Accessories' },
  { value: 'home',        label: 'Home'        },
];

const SkeletonCards = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="prod-card skel-card" style={{ animationDelay: `${i * 0.07}s` }}>
        <div className="skel skel-img" />
        <div style={{ padding: '22px 22px 24px' }}>
          <div className="skel skel-line" style={{ height: 18, width: '70%' }} />
          <div className="skel skel-line" style={{ height: 12, width: '90%' }} />
          <div className="skel skel-line" style={{ height: 12, width: '60%', marginBottom: 18 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="skel skel-line" style={{ height: 22, width: 70, marginBottom: 0 }} />
            <div className="skel skel-line" style={{ height: 36, width: 110, marginBottom: 0, borderRadius: 2 }} />
          </div>
        </div>
      </div>
    ))}
  </>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // for tab counts
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [sort, setSort]         = useState('default');
  const [category, setCategory] = useState('all');
  const [added, setAdded]       = useState({});
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // fetch all products once for tab counts
  useEffect(() => {
    api.get('/product/get').then(res => {
      if (res.data.status) setAllProducts(res.data.product);
    }).catch(() => {});
  }, []);

  // fetch by category whenever tab changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setSearch('');
      try {
        const url = category === 'all'
          ? '/product/get'
          : `/product/get?category=${category}`;
        const res = await api.get(url);
        if (res.data.status) setProducts(res.data.product);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => setAdded(prev => ({ ...prev, [product._id]: false })), 1600);
  };

  const filtered = products
    .filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name')       return a.name?.localeCompare(b.name);
      return 0;
    });

  const countFor = (cat) => {
    if (cat === 'all') return allProducts.length;
    return allProducts.filter(p => p.category === cat).length;
  };

  return (
    <>
      <style>{css}</style>
      <div className="prod-wrap">
        <div className="prod-grid-bg" />

        {/* ── Header ── */}
        <div className="prod-header">
          <div className="prod-eyebrow">
            <div className="prod-eyebrow-dot" />
            <span>Curated Collection</span>
          </div>
          <h1 className="prod-title">Our Products</h1>
          <p className="prod-subtitle">Handpicked for quality, crafted for excellence</p>
          <div className="prod-rule" />
        </div>

        {/* ── CATEGORY TABS ── */}
        <div className="prod-tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`prod-tab${category === cat.value ? ' active' : ''}`}
              onClick={() => setCategory(cat.value)}
            >
              {cat.label}
              <span className="prod-tab-count">{countFor(cat.value)}</span>
            </button>
          ))}
        </div>

        {/* ── Filter Bar ── */}
        <div className="prod-filter-bar">
          <div className="prod-search-wrap">
            <span className="prod-search-icon"><IconSearch /></span>
            <input
              className="prod-search"
              placeholder={`Search ${category === 'all' ? 'all products' : category}…`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="prod-sort" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
          {!loading && <span className="prod-count">{filtered.length} items</span>}
        </div>

        {/* ── Grid ── */}
        <div className="prod-grid">
          {loading ? (
            <SkeletonCards />
          ) : filtered.length === 0 ? (
            <div className="prod-empty" style={{ gridColumn: '1 / -1' }}>
              <div className="prod-empty-icon">◈</div>
              <p>No products found{search ? ' matching your search' : ` in ${category}`}.</p>
            </div>
          ) : (
            filtered.map((product, idx) => (
              <div
                key={product._id}
                className="prod-card"
                style={{ animationDelay: `${Math.min(idx, 8) * 0.06}s` }}
                 onClick={() => navigate(`/product/${product._id}`)}              >
                <div className="prod-img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="prod-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/400x300/0f0f1a/c9a84c?text=No+Image'; }}
                  />
                  <div className="prod-img-overlay" />
                  {idx < 3 && <div className="prod-badge">New</div>}
                  {product.category && category === 'all' && (
                    <div className="prod-cat-tag">{product.category}</div>
                  )}
                </div>

                <div className="prod-body">
                  <h3 className="prod-name">{product.name}</h3>
                  <p className="prod-desc">{product.description}</p>
                  <div className="prod-footer">
                    <div className="prod-price">
                      <span>₹</span>{product.price?.toLocaleString()}
                    </div>
                    <button
                      className={`prod-btn${added[product._id] ? ' added' : ''}`}
                      onClick={() => handleAddToCart(product)}
                    >
                      {added[product._id] ? <IconCheck /> : <IconCart />}
                      {added[product._id] ? 'Added!' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Products;