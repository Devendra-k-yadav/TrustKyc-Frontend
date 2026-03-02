// FILE: src/pages/VendorApiKeys.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  ChevronRight,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchVendorsThunk,
  fetchKeysThunk,
  fetchApisThunk,
  addVendorThunk,
  updateVendorThunk,
  deleteVendorThunk,
  addKeyThunk,
  updateKeyThunk,
  deleteKeyThunk,
  createProductVendorMappingThunk,
  fetchProductVendorMappingsThunk,
} from "../../features/vendorApiKeys/vendorApiKeysSlice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../components/css/vendorapikey.css";
import { confirmToast } from "../../utils/confirmToast";



const VendorApiKeys = () => {
  const dispatch = useDispatch();
  const vendors = useSelector((state) => state.vendorApiKeys.vendors);
  const apis = useSelector((state) => state.vendorApiKeys.apis);

  const [activeVendor, setActiveVendor] = useState(null);
  const [openVendorDrawer, setOpenVendorDrawer] = useState(false);
  const [vendorMode, setVendorMode] = useState("add");
  const [editingVendorId, setEditingVendorId] = useState(null);

  const [vendorForm, setVendorForm] = useState({
    vendor_name: "",
    base_url: "",
    contact_person: "",
    email: "",
    status: "active",
  });

  const [openKeysDrawer, setOpenKeysDrawer] = useState(false);
  const [openKeyEditor, setOpenKeyEditor] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  const [keyForm, setKeyForm] = useState({
    key_label: "",
    api_key: "",
    api_secret: "",
    env: "test",
    valid_till: "",
    assigned_apis: [],
    status: "active",
  });

  const [showSecrets, setShowSecrets] = useState({});
  const productMappings = useSelector(
  (state) => state.vendorApiKeys.productMappings
);

const [mappingForm, setMappingForm] = useState({
  product_id: "",
  priority: 1,
  vendor_price: "",
});

  const keysContainerRef = useRef(null);

  /* ================= INIT ================= */

  useEffect(() => {
    dispatch(fetchVendorsThunk());
    dispatch(fetchKeysThunk());
    dispatch(fetchApisThunk());
  }, [dispatch]);

  useEffect(() => {
    if (activeVendor) {
      const updated = vendors.find((v) => v.id === activeVendor.id);
      if (updated) setActiveVendor(updated);
    }
  }, [vendors]);

  /* ================= VENDOR ================= */

  const openAddVendor = () => {
    setVendorMode("add");
    setEditingVendorId(null);
    setVendorForm({
      vendor_name: "",
      base_url: "",
      contact_person: "",
      email: "",
      status: "active",
    });
    setOpenVendorDrawer(true);
  };

  const openEditVendor = (v) => {
    setVendorMode("edit");
    setEditingVendorId(v.id);
    setVendorForm(v);
    setOpenVendorDrawer(true);
  };

  const saveVendor = async () => {
    if (vendorMode === "add") {
      await dispatch(addVendorThunk(vendorForm));
      toast.success("Vendor added");
    } else {
      await dispatch(
        updateVendorThunk({ id: editingVendorId, data: vendorForm })
      );
      toast.info("Vendor updated");
    }
    setOpenVendorDrawer(false);
  };

  const confirmDeleteVendor = (id) => {
    confirmToast("Delete this vendor?", async () => {
      await dispatch(deleteVendorThunk(id));
      toast.warn("Vendor deleted");
    });
  };

  /* ================= KEYS ================= */

const openKeysForVendor = (v) => {
  setActiveVendor(v);
  setOpenKeysDrawer(true);

  // 🔥 Fetch mappings for all products
  apis.forEach((api) => {
    dispatch(fetchProductVendorMappingsThunk(api.id));
  });
};


const openAddKey = () => {
  setEditingKey(null);
  setKeyForm({
    key_label: "",
    api_key: "",
    api_secret: "",
    env: "test",
    valid_till: "",
    assigned_apis: [],
    status: "active",
  });
  setOpenKeyEditor(true);
};

const openEditKey = (k) => {
  setEditingKey(k);
  setKeyForm({
    key_label: k.key_label || "",
    api_key: "",              // 🔒 never re-fill secrets
    api_secret: "",
    env: k.env || "test",
    valid_till: k.valid_till || "",
    assigned_apis: k.api_id ? [k.api_id] : [],
    status: k.status || "active",
  });
  setOpenKeyEditor(true);
};

const saveKey = async () => {
  if (!activeVendor?.id) {
    toast.error("Vendor not selected");
    return;
  }

  if (!keyForm.api_key) {
    toast.error("API Key is required");
    return;
  }

  if (!keyForm.assigned_apis.length) {
    toast.error("Please assign at least one API");
    return;
  }

  // 🔥 BACKEND-COMPATIBLE PAYLOAD
  const payload = {
    vendor_id: activeVendor.id,
    api_id: keyForm.assigned_apis[0], // backend supports single api_id
    api_key: keyForm.api_key,
    api_secret: keyForm.api_secret || null,
    valid_till: keyForm.valid_till || null,
  };

  try {
    if (editingKey) {
      await dispatch(
        updateKeyThunk({
          id: editingKey.id,
          data: payload,
        })
      ).unwrap();

      toast.info("Key updated");
    } else {
      await dispatch(addKeyThunk(payload)).unwrap();
      toast.success("Key added");
    }

    setOpenKeyEditor(false);

    // 🔄 refresh from backend
    // 🔄 refresh from backend
dispatch(fetchKeysThunk());
dispatch(fetchVendorsThunk()); // ✅ IMPORTANT


    setTimeout(() => {
      if (keysContainerRef.current) {
        const keys =
          keysContainerRef.current.querySelectorAll(".key-card");
        if (keys.length) {
          keys[keys.length - 1].scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 50);

  } catch (err) {
    toast.error(
      err?.message || err?.error || "Failed to save key"
    );
  }
};

const confirmDeleteKey = (keyId) => {
  confirmToast("Are you sure you want to delete this key?", async () => {
    try {
      await dispatch(deleteKeyThunk(keyId)).unwrap();
      toast.warn("Key deleted");
      dispatch(fetchKeysThunk());
    } catch (err) {
      toast.error("Failed to delete key");
    }
  });
};
const saveMapping = async () => {
  if (!mappingForm.product_id) {
    toast.error("Select product");
    return;
  }

  try {
    await dispatch(
      createProductVendorMappingThunk({
        product_id: mappingForm.product_id,
        vendor_id: activeVendor.id,
        priority: Number(mappingForm.priority),
        vendor_price: Number(mappingForm.vendor_price),
      })
    ).unwrap();

    toast.success("Product mapped to vendor");

    // 🔄 refresh list
    dispatch(fetchProductVendorMappingsThunk(mappingForm.product_id));

    // ✅ RESET FORM
    setMappingForm({
      product_id: "",
      priority: 1,
      vendor_price: "",
    });

  } catch (err) {
    toast.error("Mapping failed");
  }
};



  /* ================= UTILS ================= */

  const toggleAssign = (id) => {
    setKeyForm((prev) => ({
      ...prev,
      assigned_apis: prev.assigned_apis.includes(id)
        ? prev.assigned_apis.filter((x) => x !== id)
        : [...prev.assigned_apis, id],
    }));
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.info("URL copied");
  };

  const toggleSecret = (id) => {
    setShowSecrets((p) => ({ ...p, [id]: !p[id] }));
  };

  const vendorMappedProducts = Object.values(productMappings || {})
  .flat()
  .filter(
    (m) =>
      m &&
      String(m.vendor_id?._id || m.vendor_id) ===
        String(activeVendor?.id) &&
      m.active !== false
  );

  /* ================= UI ================= */

  return (
    <div className="vpk-root">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="vpk-container">
        <div className="vpk-header">
          <h2>Vendor & API Keys</h2>
          <button className="vpk-add-btn" onClick={openAddVendor}>
            <Plus size={16} /> Add Vendor
          </button>
        </div>

        <div className="vpk-grid">
          {vendors.map((v) => (
            <div key={v.id} className="vpk-card">
              <div className="vpk-card-top">
                <div>
                  <div className="vpk-vendor-name">{v.vendor_name}</div>
                  <div className="vpk-base-url">{v.base_url}</div>
                </div>
                <div className="vpk-card-actions">
                  <div className={`vpk-status ${v.status}`}>
                    {v.status}
                  </div>
                  <button className="icon-btn" onClick={() => openEditVendor(v)}>
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => confirmDeleteVendor(v.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="vpk-card-body">
                <div className="vpk-contact">
                  <strong>Contact:</strong> {v.contact_person} • {v.email}
                </div>
                <div className="vpk-keys-count">
                  Keys: {v.keys?.length || 0}
                </div>
              </div>

              <div className="vpk-card-footer">
                <button
                  className="link-btn"
                  onClick={() => openKeysForVendor(v)}
                >
                  View Keys <ChevronRight size={14} />
                </button>
                <button
                  className="link-muted"
                  onClick={() => copyUrl(v.base_url)}
                >
                  <Copy size={14} /> Copy URL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Drawer */}
      {openVendorDrawer && (
        <div className="vpk-drawer-wrap">
          <div className="vpk-overlay" onClick={() => setOpenVendorDrawer(false)} />
          <aside className="vpk-drawer-panel">
            <div className="drawer-head">
              <h3>{vendorMode === "add" ? "Add Vendor" : "Edit Vendor"}</h3>
              <button className="icon-btn" onClick={() => setOpenVendorDrawer(false)}><X size={18} /></button>
            </div>
            <div className="drawer-body">
              <label>Vendor Name</label>
              <input value={vendorForm.vendor_name} onChange={(e)=>setVendorForm({...vendorForm, vendor_name:e.target.value})} />
              <label>Base URL</label>
              <input value={vendorForm.base_url} onChange={(e)=>setVendorForm({...vendorForm, base_url:e.target.value})} />
              <label>Contact Person</label>
              <input value={vendorForm.contact_person} onChange={(e)=>setVendorForm({...vendorForm, contact_person:e.target.value})} />
              <label>Email</label>
              <input value={vendorForm.email} onChange={(e)=>setVendorForm({...vendorForm, email:e.target.value})} />
              <label>Status</label>
              <select value={vendorForm.status} onChange={(e)=>setVendorForm({...vendorForm, status:e.target.value})}>
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </select>
              <div className="drawer-actions">
                <button className="vpk-save-btn" onClick={saveVendor}>Save</button>
                <button className="vpk-cancel-btn" onClick={()=>setOpenVendorDrawer(false)}>Cancel</button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Keys Drawer */}
      {openKeysDrawer && activeVendor && (
        <div className="vpk-drawer-wrap">
          <div className="vpk-overlay" onClick={() => setOpenKeysDrawer(false)} />
          <aside className="vpk-drawer-panel">
            <div className="drawer-head">
              <h3>{activeVendor.vendor_name} — Keys</h3>
              <button className="icon-btn" onClick={() => setOpenKeysDrawer(false)}><X size={18} /></button>
            </div>
            <div className="drawer-body" ref={keysContainerRef}>
              <div className="keys-header">
                <div className="keys-title">Keys ({activeVendor.keys?.length || 0})</div>
                <div>
                  <button className="vpk-add-key-btn" onClick={openAddKey}><Plus size={14} /> Add Key</button>
                </div>
              </div>

              <div className="keys-list">
                {(activeVendor.keys || []).map((k) => (
                  <div key={k.id} className="key-card">
                    <div className="key-row-top">
                      <div>
                        <div className="key-label">{k.key_label}</div>
                        <div className="muted">Env: {k.env} • Expires: {k.valid_till || "—"}</div>
                      </div>
                      <div className="key-actions">
                        <button className="icon-btn" onClick={() => openEditKey(k)} title="Edit"><Edit2 size={16} /></button>
                        <button className="icon-btn" onClick={() => confirmDeleteKey(k.id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    <div className="muted small">Assigned: {(k.assigned_apis || [])
  .map(aid => apis.find(a => a.id === aid)?.name)
.join(", ") || "—"}</div>
                    <div className="muted tiny">
                      API Secret: 
                      <span className="key-value">{showSecrets[k.id] ? k.api_secret : "••••••••••"}</span>
                      <button className="icon-btn ms-2" onClick={()=>toggleSecret(k.id)}>
                        {showSecrets[k.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                ))}
                {(activeVendor.keys || []).length === 0 && <div className="muted small">No keys yet.</div>}
              </div>
                <hr style={{ margin: "20px 0" }} />

<h4>Product Vendor Mapping</h4>

<label>Select Product</label>
<select
  value={mappingForm.product_id}
  onChange={(e) =>
    setMappingForm({
      ...mappingForm,
      product_id: e.target.value,
    })
  }
>
  <option value="">-- Select Product --</option>
  {apis.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>

<div className="grid-2">
  <div>
    <label>Priority</label>
    <input
      type="number"
      min="0"
      value={mappingForm.priority}
      onChange={(e) =>
        setMappingForm({
          ...mappingForm,
          priority: e.target.value,
        })
      }
    />
  </div>

  <div>
    <label>Vendor Price</label>
    <input
      type="number"
      min="0"
      value={mappingForm.vendor_price}
      onChange={(e) =>
        setMappingForm({
          ...mappingForm,
          vendor_price: e.target.value,
        })
      }
    />
  </div>
</div>

<button
  className="vpk-save-btn"
  onClick={saveMapping}
  style={{ marginTop: 10 }}
>
  Map Product
</button>
<hr style={{ margin: "20px 0" }} />

<h5>Mapped Products</h5>

{vendorMappedProducts.length === 0 && (
  <div className="muted small">No product mappings yet.</div>
)}

{vendorMappedProducts.map((m) => {
  const product = apis.find((p) => p.id === m.product_id);

  return (
    <div key={m._id} className="key-card">
      <div>
        <strong>{product?.name || "Unknown Product"}</strong>
      </div>

      <div className="muted small">
        Priority: {m.priority}
      </div>

      <div className="muted small">
        Vendor Price: ₹{m.vendor_price || m.pricing_from_vendor}
      </div>
    </div>
  );
})}


              {openKeyEditor && (
                <div className="key-editor">
                  <h4>{editingKey ? "Edit Key" : "Add Key"}</h4>
                  <label>Label</label>
                  <input value={keyForm.key_label} onChange={(e)=>setKeyForm({...keyForm, key_label:e.target.value})} />
                  <label>API Key</label>
                  <input value={keyForm.api_key} onChange={(e)=>setKeyForm({...keyForm, api_key:e.target.value})} />
                  <label>API Secret</label>
                  <input value={keyForm.api_secret} onChange={(e)=>setKeyForm({...keyForm, api_secret:e.target.value})} />
                  <div className="grid-2">
                    <div>
                      <label>Environment</label>
                      <select value={keyForm.env} onChange={(e)=>setKeyForm({...keyForm, env:e.target.value})}>
                        <option value="test">test</option>
                        <option value="prod">prod</option>
                      </select>
                    </div>
                    <div>
                      <label>Valid Till</label>
                      <input type="date" value={keyForm.valid_till} onChange={(e)=>setKeyForm({...keyForm, valid_till:e.target.value})} />
                    </div>
                  </div>
                  <label>Assign APIs</label>
                  <div className="assign-list">
                    {apis.map(a => (
                      <label className="assign-item" key={a.id}>
                        <input type="checkbox" checked={keyForm.assigned_apis.includes(a.id)} onChange={()=>toggleAssign(a.id)} /> <span>{a.name}</span>
                      </label>
                    ))}
                  </div>
                  <label>Status</label>
                  <select value={keyForm.status} onChange={(e)=>setKeyForm({...keyForm, status:e.target.value})}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                  <div className="drawer-actions">
                    <button className="vpk-save-btn" onClick={saveKey}>Save Key</button>
                    <button className="vpk-cancel-btn" onClick={()=>setOpenKeyEditor(false)}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default VendorApiKeys;
