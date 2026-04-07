import React, { useEffect, useState } from "react";
import axios from "axios";

const css = `
  .pf-wrap { padding: 28px; font-family: 'JetBrains Mono', monospace; }
  .pf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .pf-field { display: flex; flex-direction: column; gap: 6px; }
  .pf-field.full { grid-column: 1 / -1; }
  .pf-label { font-size: .52rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.5); }
  .pf-input, .pf-textarea, .pf-select {
    background: rgba(56,139,253,.05); border: 1px solid rgba(56,139,253,.15);
    color: #a8c4e0; font-family: 'JetBrains Mono', monospace; font-size: .75rem;
    font-weight: 300; padding: 10px 14px; outline: none;
    transition: border-color .25s, box-shadow .25s; width: 100%; box-sizing: border-box;
  }
  .pf-input::placeholder, .pf-textarea::placeholder { color: rgba(168,196,224,.18); }
  .pf-input:focus, .pf-textarea:focus, .pf-select:focus {
    border-color: rgba(56,139,253,.5); box-shadow: 0 0 0 3px rgba(56,139,253,.07);
  }
  .pf-textarea { resize: vertical; min-height: 88px; line-height: 1.6; }
  .pf-select {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23388bfd' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 12px center;
    background-color: rgba(56,139,253,.05); padding-right: 32px;
  }
  .pf-select option { background: #070b14; color: #a8c4e0; }

  .pf-img-divider {
    grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; margin: 4px 0;
  }
  .pf-img-divider-line { flex: 1; height: 1px; background: rgba(56,139,253,.1); }
  .pf-img-divider-text { font-size: .52rem; letter-spacing: .2em; text-transform: uppercase; color: rgba(56,139,253,.3); white-space: nowrap; }

  .pf-file-zone {
    grid-column: 1 / -1; border: 1px dashed rgba(56,139,253,.2);
    background: rgba(56,139,253,.03); padding: 20px; text-align: center;
    cursor: pointer; transition: border-color .25s, background .25s; position: relative;
  }
  .pf-file-zone:hover { border-color: rgba(56,139,253,.45); background: rgba(56,139,253,.06); }
  .pf-file-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .pf-file-icon { font-size: 1.4rem; margin-bottom: 6px; color: rgba(56,139,253,.4); }
  .pf-file-text { font-size: .6rem; letter-spacing: .12em; text-transform: uppercase; color: rgba(168,196,224,.3); }
  .pf-file-names { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center; }
  .pf-file-name { font-size: .58rem; color: rgba(56,139,253,.7); background: rgba(56,139,253,.08); border: 1px solid rgba(56,139,253,.2); padding: 2px 8px; }

  .pf-url-list { grid-column: 1 / -1; display: flex; flex-direction: column; gap: 8px; }
  .pf-url-row { display: flex; gap: 8px; align-items: center; }
  .pf-url-row .pf-input { flex: 1; margin: 0; }
  .pf-url-remove {
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.25);
    color: #f87171; cursor: pointer; padding: 10px 12px; font-family: 'JetBrains Mono', monospace;
    font-size: .6rem; white-space: nowrap; transition: background .2s;
  }
  .pf-url-remove:hover { background: rgba(239,68,68,.15); }
  .pf-url-add {
    background: rgba(56,139,253,.06); border: 1px dashed rgba(56,139,253,.2);
    color: rgba(56,139,253,.6); cursor: pointer; padding: 8px 14px;
    font-family: 'JetBrains Mono', monospace; font-size: .6rem;
    letter-spacing: .1em; text-transform: uppercase; align-self: flex-start;
    transition: border-color .2s, color .2s;
  }
  .pf-url-add:hover { border-color: rgba(56,139,253,.4); color: #79b8ff; }

  /* preview grid */
  .pf-preview-grid { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 10px; }
  .pf-preview-item { position: relative; }
  .pf-preview-item img { width: 72px; height: 72px; object-fit: cover; border: 1px solid rgba(56,139,253,.2); }
  .pf-preview-item-rm {
    position: absolute; top: -6px; right: -6px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #ef4444; color: #fff; border: none; cursor: pointer;
    font-size: .65rem; display: flex; align-items: center; justify-content: center;
  }

  .pf-or { grid-column: 1 / -1; display: flex; align-items: center; gap: 10px; }
  .pf-or-line { flex: 1; height: 1px; background: rgba(56,139,253,.08); }
  .pf-or-text { font-size: .52rem; letter-spacing: .18em; text-transform: uppercase; color: rgba(168,196,224,.2); }

  .pf-footer { grid-column: 1 / -1; display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding-top: 8px; border-top: 1px solid rgba(56,139,253,.08); margin-top: 4px; }
  .pf-cancel {
    display: flex; align-items: center; gap: 8px;
    background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.35); color: #f87171;
    font-family: 'JetBrains Mono', monospace; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 600; padding: 10px 28px; cursor: pointer; transition: background .25s; position: relative; overflow: hidden;
  }
  .pf-cancel:hover { background: rgba(239,68,68,.15); }
  .pf-submit {
    display: flex; align-items: center; gap: 8px;
    background: rgba(56,139,253,.15); border: 1px solid rgba(56,139,253,.45); color: #79b8ff;
    font-family: 'JetBrains Mono', monospace; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
    font-weight: 600; padding: 10px 28px; cursor: pointer; transition: background .25s; position: relative; overflow: hidden;
  }
  .pf-submit:hover { background: rgba(56,139,253,.25); }
  .pf-error {
    grid-column: 1 / -1; font-size: .6rem; letter-spacing: .1em; text-transform: uppercase;
    color: #f87171; padding: 8px 12px; border: 1px solid rgba(239,68,68,.2); background: rgba(239,68,68,.06);
  }
`;

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing',    label: 'Clothing'    },
  { value: 'footwear',    label: 'Footwear'    },
  { value: 'accessories', label: 'Accessories' },
  { value: 'home',        label: 'Home'        },
];

export default function ProductForm({ fetchProduct, setShowForm, editData, url }) {
  const [product, setProduct] = useState({ name: "", price: "", description: "", category: "electronics" });
  const [files, setFiles] = useState([]);       // uploaded files
  const [urlInputs, setUrlInputs] = useState([""]); // image URL inputs
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setProduct({ name: editData.name, price: editData.price, description: editData.description, category: editData.category || "electronics" });
      if (editData.images?.length > 0) setUrlInputs(editData.images);
      else if (editData.image) setUrlInputs([editData.image]);
      setFiles([]);
    }
  }, [editData]);

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleUrlChange = (idx, val) => {
    const updated = [...urlInputs];
    updated[idx] = val;
    setUrlInputs(updated);
  };

  const addUrlInput = () => setUrlInputs(prev => [...prev, ""]);
  const removeUrl = (idx) => setUrlInputs(prev => prev.filter((_, i) => i !== idx));

  const validUrls = urlInputs.filter(u => u.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length === 0 && validUrls.length === 0) {
      setError("Please upload at least one image or enter an image URL.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("description", product.description);
      formData.append("category", product.category);

      // Append files
      files.forEach(f => formData.append("images", f));

      // Append URLs as JSON
      if (validUrls.length > 0) {
        formData.append("imageUrls", JSON.stringify(validUrls));
        // Also set primary image if no file
        if (files.length === 0) formData.append("image", validUrls[0]);
      }

      if (editData) {
        await axios.put(`${url}/product/edit/${editData._id}`, formData);
      } else {
        await axios.post(`${url}/product/add`, formData);
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

          <div className="pf-field">
            <label className="pf-label">Product Name</label>
            <input className="pf-input" type="text" name="name" value={product.name} onChange={handleChange} placeholder="e.g. Premium Hoodie" required />
          </div>

          <div className="pf-field">
            <label className="pf-label">Price (₹)</label>
            <input className="pf-input" type="number" name="price" value={product.price} onChange={handleChange} placeholder="e.g. 1299" required />
          </div>

          <div className="pf-field">
            <label className="pf-label">Category</label>
            <select className="pf-select" name="category" value={product.category} onChange={handleChange} required>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="pf-field full">
            <label className="pf-label">Description</label>
            <textarea className="pf-textarea" name="description" value={product.description} onChange={handleChange} placeholder="Short product description…" />
          </div>

          {/* IMAGE SECTION */}
          <div className="pf-img-divider">
            <div className="pf-img-divider-line" />
            <span className="pf-img-divider-text">Images — Upload files + Add URLs (multiple allowed)</span>
            <div className="pf-img-divider-line" />
          </div>

          {/* FILE UPLOAD */}
          <div className="pf-file-zone">
            <input type="file" accept="image/*" multiple onChange={handleFiles} />
            <div className="pf-file-icon">◈</div>
            <div className="pf-file-text">Click or drag to upload images (select multiple)</div>
            {files.length > 0 && (
              <div className="pf-file-names">
                {files.map((f, i) => <span key={i} className="pf-file-name">✓ {f.name}</span>)}
              </div>
            )}
          </div>

          {/* File previews */}
          {files.length > 0 && (
            <div className="pf-preview-grid">
              {files.map((f, i) => (
                <div key={i} className="pf-preview-item">
                  <img src={URL.createObjectURL(f)} alt={f.name} />
                  <button type="button" className="pf-preview-item-rm" onClick={() => removeFile(i)}>✕</button>
                </div>
              ))}
            </div>
          )}

          <div className="pf-or">
            <div className="pf-or-line" />
            <span className="pf-or-text">and / or add image URLs</span>
            <div className="pf-or-line" />
          </div>

          {/* URL INPUTS */}
          <div className="pf-url-list">
            {urlInputs.map((url, idx) => (
              <div key={idx} className="pf-url-row">
                <input
                  className="pf-input"
                  type="text"
                  placeholder={`Image URL ${idx + 1}`}
                  value={url}
                  onChange={e => handleUrlChange(idx, e.target.value)}
                />
                {urlInputs.length > 1 && (
                  <button type="button" className="pf-url-remove" onClick={() => removeUrl(idx)}>✕</button>
                )}
              </div>
            ))}
            <button type="button" className="pf-url-add" onClick={addUrlInput}>+ Add another URL</button>
          </div>

          {/* URL previews */}
          {validUrls.length > 0 && (
            <div className="pf-preview-grid">
              {validUrls.map((u, i) => (
                <div key={i} className="pf-preview-item">
                  <img src={u} alt={`url-${i}`} onError={e => { e.target.style.opacity = '.3'; }} />
                </div>
              ))}
            </div>
          )}

          {error && <div className="pf-error">⚠ {error}</div>}

          <div className="pf-footer">
            <button type="button" className="pf-cancel" onClick={() => setShowForm(false)}>✕ Cancel</button>
            <button type="submit" className="pf-submit" disabled={loading}>
              {loading ? '...' : (editData ? '✓ Update Product' : '+ Add Product')}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}