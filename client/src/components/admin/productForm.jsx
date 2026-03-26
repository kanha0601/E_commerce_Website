import React, { useEffect, useState } from "react";
import axios from "axios";

const css = `
  .pf-wrap {
    padding: 28px;
    font-family: 'JetBrains Mono', monospace;
  }

  .pf-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* ── FIELD ── */
  .pf-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .pf-field.full { grid-column: 1 / -1; }

  .pf-label {
    font-size: .52rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(56,139,253,.5);
  }

  .pf-input, .pf-textarea, .pf-select {
    background: rgba(56,139,253,.05);
    border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0;
    font-family: 'JetBrains Mono', monospace;
    font-size: .75rem;
    font-weight: 300;
    padding: 10px 14px;
    outline: none;
    transition: border-color .25s, box-shadow .25s;
    width: 100%;
    box-sizing: border-box;
  }
  .pf-input::placeholder, .pf-textarea::placeholder { color: rgba(168,196,224,.18); }
  .pf-input:focus, .pf-textarea:focus, .pf-select:focus {
    border-color: rgba(56,139,253,.5);
    box-shadow: 0 0 0 3px rgba(56,139,253,.07);
  }
  .pf-input:disabled {
    opacity: .35;
    cursor: not-allowed;
  }
  .pf-textarea {
    resize: vertical;
    min-height: 88px;
    line-height: 1.6;
  }
  .pf-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23388bfd' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-color: rgba(56,139,253,.05);
    padding-right: 32px;
  }
  .pf-select option { background: #070b14; color: #a8c4e0; }

  /* ── IMAGE SECTION ── */
  .pf-img-divider {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 4px 0;
  }
  .pf-img-divider-line {
    flex: 1;
    height: 1px;
    background: rgba(56,139,253,.1);
  }
  .pf-img-divider-text {
    font-size: .52rem;
    letter-spacing: .2em;
    text-transform: uppercase;
    color: rgba(56,139,253,.3);
    white-space: nowrap;
  }

  /* file drop zone */
  .pf-file-zone {
    grid-column: 1 / -1;
    border: 1px dashed rgba(56,139,253,.2);
    background: rgba(56,139,253,.03);
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color .25s, background .25s;
    position: relative;
  }
  .pf-file-zone:hover:not(.disabled) {
    border-color: rgba(56,139,253,.45);
    background: rgba(56,139,253,.06);
  }
  .pf-file-zone.disabled {
    opacity: .3;
    cursor: not-allowed;
    pointer-events: none;
  }
  .pf-file-zone input[type="file"] {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer; width: 100%; height: 100%;
  }
  .pf-file-icon {
    font-size: 1.4rem;
    margin-bottom: 6px;
    color: rgba(56,139,253,.4);
  }
  .pf-file-text {
    font-size: .6rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(168,196,224,.3);
  }
  .pf-file-name {
    margin-top: 6px;
    font-size: .62rem;
    color: rgba(56,139,253,.7);
    letter-spacing: .06em;
  }

  /* or divider */
  .pf-or {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 10px;
  }
  .pf-or-line { flex: 1; height: 1px; background: rgba(56,139,253,.08); }
  .pf-or-text {
    font-size: .52rem; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(168,196,224,.2);
  }

  /* preview */
  .pf-preview {
    grid-column: 1 / -1;
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    border: 1px solid rgba(56,139,253,.12);
    background: rgba(56,139,253,.03);
  }
  .pf-preview img {
    width: 52px; height: 52px;
    object-fit: cover;
    border: 1px solid rgba(56,139,253,.15);
    flex-shrink: 0;
  }
  .pf-preview-info { flex: 1; min-width: 0; }
  .pf-preview-label {
    font-size: .5rem; letter-spacing: .18em; text-transform: uppercase;
    color: rgba(56,139,253,.4); margin-bottom: 3px;
  }
  .pf-preview-url {
    font-size: .62rem; color: rgba(168,196,224,.45);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pf-preview-clear {
    background: none; border: 1px solid rgba(239,68,68,.2);
    color: rgba(239,68,68,.5); cursor: pointer; padding: 4px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: .52rem; letter-spacing: .12em; text-transform: uppercase;
    transition: border-color .2s, color .2s; flex-shrink: 0;
  }
  .pf-preview-clear:hover { border-color: rgba(239,68,68,.5); color: #f87171; }

  /* ── FOOTER ── */
  .pf-footer {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid rgba(56,139,253,.08);
    margin-top: 4px;
  }

  .pf-cancel {
    display: flex; align-items: center; gap: 8px;
    background: rgba(239,68,68,.08);
    border: 1px solid rgba(239,68,68,.35);
    color: #f87171;
    font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 600; padding: 10px 28px; cursor: pointer;
    transition: background .25s, box-shadow .25s, transform .2s;
    position: relative; overflow: hidden;
  }
  .pf-cancel::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(239,68,68,.15);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .4s cubic-bezier(.16,1,.3,1);
  }
  .pf-cancel:hover::before { transform: translateX(110%) skewX(-15deg); }
  .pf-cancel:hover {
    background: rgba(239,68,68,.15);
    box-shadow: 0 0 20px rgba(239,68,68,.2);
    transform: translateY(-1px);
  }

  .pf-submit {
    display: flex; align-items: center; gap: 8px;
    background: rgba(56,139,253,.15);
    border: 1px solid rgba(56,139,253,.45);
    color: #79b8ff;
    font-family: 'JetBrains Mono', monospace;
    font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 600; padding: 10px 28px; cursor: pointer;
    transition: background .25s, box-shadow .25s, transform .2s;
    position: relative; overflow: hidden;
  }
  .pf-submit::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(56,139,253,.2);
    transform: translateX(-110%) skewX(-15deg);
    transition: transform .4s cubic-bezier(.16,1,.3,1);
  }
  .pf-submit:hover::before { transform: translateX(110%) skewX(-15deg); }
  .pf-submit:hover {
    background: rgba(56,139,253,.25);
    box-shadow: 0 0 20px rgba(56,139,253,.2);
    transform: translateY(-1px);
  }

  /* error */
  .pf-error {
    grid-column: 1 / -1;
    font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    color: #f87171;
    padding: 8px 12px;
    border: 1px solid rgba(239,68,68,.2);
    background: rgba(239,68,68,.06);
  }
`;

const CATEGORIES = [
  { value: 'electronics',  label: 'Electronics'  },
  { value: 'clothing',     label: 'Clothing'      },
  { value: 'footwear',     label: 'Footwear'      },
  { value: 'accessories',  label: 'Accessories'   },
  { value: 'home',         label: 'Home'          },
];

export default function ProductForm({ fetchProduct, setShowForm, editData, url }) {
  const [product, setProduct] = useState({
    name: "", price: "", description: "", category: "electronics"
  });
  const [file,     setFile]     = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (editData) {
      setProduct({
        name:        editData.name,
        price:       editData.price,
        description: editData.description,
        category:    editData.category || "electronics",
      });
      if (typeof editData.image === "string") setImageUrl(editData.image);
      setFile(null);
    }
  }, [editData]);

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setImageUrl(""); }
  };

  const clearImage = () => { setFile(null); setImageUrl(""); };

  const previewSrc = file ? URL.createObjectURL(file) : imageUrl || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!file && !imageUrl) {
      setError("Please upload a file or enter an image URL.");
      return;
    }

    setLoading(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append("name",        product.name);
        formData.append("price",       product.price);
        formData.append("description", product.description);
        formData.append("category",    product.category);
        formData.append("image",       file);
        if (editData) await axios.put(`${url}/product/edit/${editData._id}`, formData);
        else          await axios.post(`${url}/product/add`, formData);
      } else {
        const data = { ...product, image: imageUrl };
        if (editData) await axios.put(`${url}/product/edit/${editData._id}`, data);
        else          await axios.post(`${url}/product/add`, data);
      }
      fetchProduct();
      setShowForm(false);
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="pf-wrap">
        <form onSubmit={handleSubmit} className="pf-grid">

          {/* NAME */}
          <div className="pf-field">
            <label className="pf-label">Product Name</label>
            <input
              className="pf-input"
              type="text" name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="e.g. Premium Hoodie"
              required
            />
          </div>

          {/* PRICE */}
          <div className="pf-field">
            <label className="pf-label">Price (₹)</label>
            <input
              className="pf-input"
              type="number" name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="e.g. 1299"
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="pf-field">
            <label className="pf-label">Category</label>
            <select
              className="pf-select"
              name="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className="pf-field full">
            <label className="pf-label">Description</label>
            <textarea
              className="pf-textarea"
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Short product description…"
            />
          </div>

          {/* IMAGE SECTION DIVIDER */}
          <div className="pf-img-divider">
            <div className="pf-img-divider-line" />
            <span className="pf-img-divider-text">Image — Upload or URL</span>
            <div className="pf-img-divider-line" />
          </div>

          {/* FILE UPLOAD */}
          <div className={`pf-file-zone${imageUrl ? ' disabled' : ''}`}>
            <input type="file" accept="image/*" onChange={handleFile} disabled={!!imageUrl} />
            <div className="pf-file-icon">◈</div>
            <div className="pf-file-text">Click or drag to upload image</div>
            {file && <div className="pf-file-name">✓ {file.name}</div>}
          </div>

          {/* OR */}
          <div className="pf-or">
            <div className="pf-or-line" />
            <span className="pf-or-text">or</span>
            <div className="pf-or-line" />
          </div>

          {/* URL INPUT */}
          <div className="pf-field full">
            <label className="pf-label">Image URL</label>
            <input
              className="pf-input"
              type="text"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setFile(null); }}
              disabled={!!file}
            />
          </div>

          {/* PREVIEW */}
          {previewSrc && (
            <div className="pf-preview">
              <img src={previewSrc} alt="preview" />
              <div className="pf-preview-info">
                <div className="pf-preview-label">Preview</div>
                <div className="pf-preview-url">{file ? file.name : imageUrl}</div>
              </div>
              <button type="button" className="pf-preview-clear" onClick={clearImage}>✕ Clear</button>
            </div>
          )}

          {/* ERROR */}
          {error && <div className="pf-error">⚠ {error}</div>}

          {/* FOOTER — Cancel + Submit */}
          <div className="pf-footer">
            <button
              type="button"
              className="pf-cancel"
              onClick={() => setShowForm(false)}
            >
              ✕ Cancel
            </button>
            <button type="submit" className="pf-submit" disabled={loading}>
              {loading ? '...' : (editData ? '✓ Update Product' : '+ Add Product')}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}