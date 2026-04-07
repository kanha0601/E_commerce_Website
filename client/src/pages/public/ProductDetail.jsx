import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pd-wrap {
    font-family: 'DM Sans', sans-serif;
    background: #080810; min-height: 100vh;
    color: #f0ebe0; padding: 80px 24px 120px;
    position: relative; overflow-x: hidden;
  }
  .pd-grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(201,168,76,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .pd-inner { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; }

  /* back btn */
  .pd-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    color: rgba(240,235,224,.3); font-family: 'DM Sans', sans-serif;
    font-size: .72rem; letter-spacing: .1em; text-transform: uppercase;
    transition: color .2s; padding: 0; margin-bottom: 32px;
  }
  .pd-back:hover { color: #c9a84c; }

  /* main layout */
  .pd-main { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-bottom: 64px; }
  @media(max-width:768px) { .pd-main { grid-template-columns: 1fr; } }

  /* gallery */
  .pd-gallery {}
  .pd-main-img {
    width: 100%; aspect-ratio: 1; object-fit: cover;
    border: 1px solid rgba(201,168,76,.15); border-radius: 2px;
    margin-bottom: 12px; transition: opacity .3s;
  }
  .pd-thumbs { display: flex; gap: 8px; flex-wrap: wrap; }
  .pd-thumb {
    width: 72px; height: 72px; object-fit: cover;
    border: 2px solid rgba(201,168,76,.15); border-radius: 2px;
    cursor: pointer; transition: border-color .2s, transform .2s; flex-shrink: 0;
  }
  .pd-thumb:hover { border-color: rgba(201,168,76,.5); transform: scale(1.05); }
  .pd-thumb.active { border-color: #c9a84c; }

  /* info */
  .pd-info {}
  .pd-category {
    font-size: .65rem; letter-spacing: .2em; text-transform: uppercase;
    color: #c9a84c; margin-bottom: 12px;
  }
  .pd-name {
    font-family: 'Playfair Display', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900;
    color: #f0ebe0; line-height: 1.1; margin-bottom: 16px;
  }

  /* rating */
  .pd-rating { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .pd-stars { display: flex; gap: 2px; }
  .pd-star { color: #c9a84c; font-size: 1rem; }
  .pd-star.empty { color: rgba(201,168,76,.2); }
  .pd-rating-count { font-size: .75rem; color: rgba(240,235,224,.35); }

  /* price */
  .pd-price {
    font-family: 'Playfair Display', serif;
    font-size: 2.2rem; font-weight: 900; color: #c9a84c; margin-bottom: 24px;
  }
  .pd-price span { font-size: .9rem; font-family: 'DM Sans', sans-serif; font-weight: 400; color: rgba(240,235,224,.3); margin-right: 4px; }

  /* desc */
  .pd-desc { font-size: .88rem; color: rgba(240,235,224,.5); line-height: 1.8; margin-bottom: 32px; }

  /* actions */
  .pd-actions { display: flex; flex-direction: column; gap: 12px; }
  .pd-btn {
    width: 100%; padding: 15px; border: none; border-radius: 2px;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: .78rem;
    letter-spacing: .14em; text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden; transition: transform .3s, box-shadow .3s;
  }
  .pd-btn::after {
    content: ''; position: absolute; inset: 0; background: rgba(255,255,255,.18);
    transform: translateX(-110%) skewX(-15deg); transition: transform .5s cubic-bezier(.16,1,.3,1);
  }
  .pd-btn:hover::after { transform: translateX(110%) skewX(-15deg); }
  .pd-btn:hover { transform: translateY(-2px); }
  .pd-btn.buy {
    background: linear-gradient(135deg, #c9a84c, #e8d08a); color: #080810;
  }
  .pd-btn.buy:hover { box-shadow: 0 14px 36px rgba(201,168,76,.4); }
  .pd-btn.cart {
    background: transparent; color: #c9a84c;
    border: 1px solid rgba(201,168,76,.4);
  }
  .pd-btn.cart:hover { border-color: #c9a84c; box-shadow: 0 14px 36px rgba(201,168,76,.15); }
  .pd-btn.cart.added { background: rgba(64,145,108,.15); border-color: #40916c; color: #40916c; }
  .pd-btn.wishlist {
    background: transparent; color: rgba(240,235,224,.4);
    border: 1px solid rgba(240,235,224,.12);
  }
  .pd-btn.wishlist:hover { border-color: rgba(240,235,224,.3); color: #f0ebe0; }
  .pd-btn.wishlist.active { border-color: #e05c5c; color: #e05c5c; }

  /* divider */
  .pd-divider { height: 1px; background: rgba(201,168,76,.1); margin: 48px 0; }

  /* reviews section */
  .pd-reviews-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px;
  }
  .pd-reviews-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem; font-weight: 700; color: #f0ebe0;
  }

  /* review form */
  .pd-review-form {
    border: 1px solid rgba(201,168,76,.12);
    background: linear-gradient(140deg, rgba(255,255,255,.04), rgba(255,255,255,.01));
    padding: 28px; margin-bottom: 32px;
  }
  .pd-review-form-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem; font-weight: 700; color: #f0ebe0; margin-bottom: 20px;
  }
  .pd-stars-input { display: flex; gap: 6px; margin-bottom: 16px; }
  .pd-star-btn {
    background: none; border: none; cursor: pointer;
    font-size: 1.4rem; color: rgba(201,168,76,.2);
    transition: color .2s, transform .2s; padding: 0;
  }
  .pd-star-btn:hover, .pd-star-btn.active { color: #c9a84c; transform: scale(1.2); }
  .pd-review-input {
    width: 100%; box-sizing: border-box;
    background: rgba(255,255,255,.04); border: 1px solid rgba(201,168,76,.18);
    border-radius: 2px; color: #f0ebe0; font-family: 'DM Sans', sans-serif;
    font-size: .88rem; padding: 12px 16px; outline: none; resize: vertical;
    min-height: 100px; margin-bottom: 14px;
    transition: border-color .25s;
  }
  .pd-review-input:focus { border-color: rgba(201,168,76,.5); }
  .pd-review-input::placeholder { color: rgba(240,235,224,.18); }
  .pd-review-submit {
    background: linear-gradient(135deg, #c9a84c, #e8d08a); color: #080810;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: .72rem;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 11px 28px; border: none; border-radius: 2px; cursor: pointer;
    transition: transform .3s, box-shadow .3s;
  }
  .pd-review-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,168,76,.4); }
  .pd-review-submit:disabled { opacity: .5; cursor: not-allowed; }

  /* review cards */
  .pd-review-list { display: flex; flex-direction: column; gap: 16px; }
  .pd-review-card {
    border: 1px solid rgba(201,168,76,.1);
    background: linear-gradient(140deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
    padding: 20px 24px;
    animation: fadeUp .4s cubic-bezier(.16,1,.3,1) both;
  }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  .pd-review-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .pd-review-name { font-weight: 600; font-size: .88rem; color: #f0ebe0; }
  .pd-review-date { font-size: .68rem; color: rgba(240,235,224,.3); }
  .pd-review-stars { display: flex; gap: 2px; margin-bottom: 8px; }
  .pd-review-comment { font-size: .82rem; color: rgba(240,235,224,.5); line-height: 1.7; }
  .pd-no-reviews { text-align: center; padding: 48px; color: rgba(240,235,224,.25); font-size: .82rem; letter-spacing: .08em; }

  /* loading */
  .pd-loading { text-align: center; padding: 120px 24px; color: rgba(240,235,224,.3); font-size: .88rem; letter-spacing: .1em; }

  /* toast */
  .pd-toast {
    position: fixed; bottom: 28px; left: 50%;
    transform: translateX(-50%) translateY(60px);
    background: #c9a84c; color: #080810;
    font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    padding: 10px 24px; border-radius: 2px; z-index: 300;
    transition: transform .4s cubic-bezier(.16,1,.3,1), opacity .4s;
    opacity: 0; pointer-events: none;
  }
  .pd-toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
  .pd-toast.error { background: #ef4444; color: #fff; }
`;

const StarDisplay = ({ rating }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`pd-star${i <= Math.round(rating) ? '' : ' empty'}`}>★</span>
    ))}
  </div>
);

const IconArrowLeft = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconCart = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const IconBuy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);
const IconHeart = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#e05c5c" : "none"} stroke={filled ? "#e05c5c" : "currentColor"} strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const ProductDetail = () => {
  const { id } = useParams();
  console.log("Product ID:", id);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', error: false });

  const showToast = (msg, error = false) => {
    setToast({ show: true, msg, error });
    setTimeout(() => setToast({ show: false, msg: '', error: false }), 2800);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/get/${id}`);
        if (res.data.status) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    showToast("Added to cart!");
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/Checkout");
  };

  const handleWishlist = async () => {
    try {
      const res = await api.post(`/product/${id}/wishlist`);
      if (res.data.status) {
        setWishlisted(res.data.wishlisted);
        showToast(res.data.wishlisted ? "Added to wishlist!" : "Removed from wishlist");
      }
    } catch {
      showToast("Please login to use wishlist", true);
    }
  };

  const handleReview = async () => {
    if (!rating) { showToast("Please select a rating", true); return; }
    if (!comment.trim()) { showToast("Please write a comment", true); return; }
    setReviewLoading(true);
    try {
      const res = await api.post(`/product/${id}/review`, { rating, comment });
      if (res.data.status) {
        setProduct(res.data.product);
        setRating(0);
        setComment("");
        showToast("Review submitted!");
      } else {
        showToast(res.data.message || "Failed to submit review", true);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Please login to review", true);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return (
    <>
      <style>{css}</style>
      <div className="pd-wrap"><div className="pd-loading">Loading product…</div></div>
    </>
  );

  if (!product) return (
    <>
      <style>{css}</style>
      <div className="pd-wrap"><div className="pd-loading">Product not found</div></div>
    </>
  );

  // Build image list
  const allImages = product.images?.length > 0
    ? product.images
    : product.image ? [product.image] : [];

  const displayImage = allImages[activeImg] || product.image;

  return (
    <>
      <style>{css}</style>
      <div className="pd-wrap">
        <div className="pd-grid-bg" />
        <div className="pd-inner">

          {/* Back */}
          <button className="pd-back" onClick={() => navigate(-1)}>
            <IconArrowLeft /> Back
          </button>

          {/* Main: Gallery + Info */}
          <div className="pd-main">

            {/* Gallery */}
            <div className="pd-gallery">
              <img
                src={displayImage}
                alt={product.name}
                className="pd-main-img"
                onError={e => { e.target.src = 'https://via.placeholder.com/500x500/0f0f1a/c9a84c?text=?'; }}
              />
              {allImages.length > 1 && (
                <div className="pd-thumbs">
                  {allImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className={`pd-thumb${activeImg === idx ? ' active' : ''}`}
                      onClick={() => setActiveImg(idx)}
                      onError={e => { e.target.src = 'https://via.placeholder.com/72x72/0f0f1a/c9a84c?text=?'; }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="pd-info">
              <div className="pd-category">{product.category}</div>
              <h1 className="pd-name">{product.name}</h1>

              {/* Rating */}
              <div className="pd-rating">
                <StarDisplay rating={product.rating || 0} />
                <span className="pd-rating-count">
                  {product.rating ? product.rating.toFixed(1) : '0'} ({product.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="pd-price">
                <span>₹</span>{product.price?.toLocaleString()}
              </div>

              {/* Description */}
              <p className="pd-desc">{product.description}</p>

              {/* Actions */}
              <div className="pd-actions">
                <button className="pd-btn buy" onClick={handleBuyNow}>
                  <IconBuy /> Buy Now
                </button>
                <button className={`pd-btn cart${added ? ' added' : ''}`} onClick={handleAddToCart}>
                  <IconCart /> {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>
                <button className={`pd-btn wishlist${wishlisted ? ' active' : ''}`} onClick={handleWishlist}>
                  <IconHeart filled={wishlisted} />
                  {wishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          <div className="pd-divider" />

          {/* Reviews */}
          <div>
            <div className="pd-reviews-header">
              <div className="pd-reviews-title">Customer Reviews</div>
            </div>

            {/* Review Form */}
            <div className="pd-review-form">
              <div className="pd-review-form-title">Write a Review</div>
              <div className="pd-stars-input">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    className={`pd-star-btn${(hoverRating || rating) >= i ? ' active' : ''}`}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(i)}
                  >★</button>
                ))}
              </div>
              <textarea
                className="pd-review-input"
                placeholder="Share your experience with this product…"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button
                className="pd-review-submit"
                onClick={handleReview}
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Submitting…' : 'Submit Review'}
              </button>
            </div>

            {/* Review List */}
            <div className="pd-review-list">
              {product.reviews?.length === 0 ? (
                <div className="pd-no-reviews">No reviews yet — be the first to review!</div>
              ) : (
                product.reviews?.map((review, idx) => (
                  <div key={idx} className="pd-review-card" style={{ animationDelay: `${idx * 0.06}s` }}>
                    <div className="pd-review-top">
                      <span className="pd-review-name">{review.name}</span>
                      <span className="pd-review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="pd-review-stars">
                      <StarDisplay rating={review.rating} />
                    </div>
                    <div className="pd-review-comment">{review.comment}</div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <div className={`pd-toast${toast.show ? ' show' : ''}${toast.error ? ' error' : ''}`}>
        {toast.msg}
      </div>
    </>
  );
};

export default ProductDetail;