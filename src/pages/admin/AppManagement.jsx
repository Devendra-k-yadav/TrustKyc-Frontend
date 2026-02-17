
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsToggleOn } from "react-icons/bs";
import { toggleAdminAppKeyStatus } from "../../features/appManagement/adminAppSlice";

import {
  fetchAdminApps,
  fetchAdminAppById,
  createAdminApp,
  changeAdminAppEnvironment,
  deleteAdminApp,
  addAdminAppKey,
  removeAdminAppKey,
  assignProductsToClientApp,
  clearSelectedApp,
  fetchClientAppProducts,
} from "../../features/appManagement/adminAppSlice";
import { fetchAdminClients } 
from "../../features/adminClients/adminClientsSlice";
import {
  fetchClientSubscribedProductsAdmin,
} from "../../features/appManagement/adminAppSlice";



import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppManagement = () => {
  const dispatch = useDispatch();
  const { apps, selectedApp, loading } = useSelector((state) => state.adminApps);


const { clients = [] } = useSelector(
  (state) => state.adminClients || {}
);
const { clientSubscribedProducts: availableProducts = [] } = useSelector(
  (state) => state.adminApps
);
const [selectedClientId, setSelectedClientId] = useState("");
const clientAppProducts =
  useSelector(
    (state) =>
      state.adminApps.clientAppProductsByClient[selectedClientId]
  ) || [];






  const [view, setView] = useState("list");
  const [newAppName, setNewAppName] = useState("");
  const [newKey, setNewKey] = useState("");
 

  const [activeTab, setActiveTab] = useState("keys"); // tabs: keys / apis / info
 const [showManageProducts, setShowManageProducts] = useState(false);
const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminApps());
  }, [dispatch]);

  


useEffect(() => {
  dispatch(fetchAdminClients());
}, [dispatch]);


/* 🔹 FIX 2: HELPER */
  const getProductName = (id) => {
  const product = availableProducts.find((p) => p._id === id);
  return product?.name || "Unknown Product";
};


  

  /* ===== Handlers ===== */
  const openDetails = (id) => {
    dispatch(fetchAdminAppById(id));
    setView("details");
    setActiveTab("keys");
  };

  const backToList = () => {
    dispatch(clearSelectedApp());
    setView("list");
  };

  const handleCreateApp = () => {
    if (!newAppName.trim()) return toast.error("Enter app name");
    dispatch(createAdminApp({ name: newAppName }));
    setNewAppName("");
    toast.success("App created successfully!");
  };

  const toggleEnvironment = async () => {
  if (!selectedApp) return;

  const nextEnv =
    selectedApp.environment === "Live" ? "Test" : "Live";

  try {
    const updatedApp = await dispatch(
      changeAdminAppEnvironment({
        appId: selectedApp._id,
        env: nextEnv,
      })
    ).unwrap();

    toast.success(`Environment switched to ${updatedApp.environment}`);
  } catch (err) {
    toast.error(
      err?.message ||
      err?.error ||
      "Failed to switch environment"
    );
  }
};


  const handleDeleteApp = () => {
    if (!selectedApp) return;
    if (window.confirm("Are you sure to delete this app?")) {
      dispatch(deleteAdminApp(selectedApp._id));
      setView("list");
      toast.success("App deleted successfully");
    }
  };

  const handleAddKey = async () => {
  if (!newKey.trim()) return toast.error("Enter key value");

  try {
    await dispatch(
      addAdminAppKey({
        appId: selectedApp._id,
        key: newKey,
      })
    ).unwrap();

    toast.success("Key added successfully");
    setNewKey("");
  } catch {
    toast.error("Failed to add key");
  }
};


  const handleToggleKeyStatus = async (keyId) => {
  try {
    const res = await dispatch(
      toggleAdminAppKeyStatus({
        appId: selectedApp._id,
        keyId,
      })
    ).unwrap();

    toast.success(
      res.status === "Enabled"
        ? "Key Enabled successfully"
        : "Key Disabled successfully"
    );
  } catch (err) {
    toast.error("Failed to update key status");
  }
};
const handleRemoveKey = async (keyId) => {
  if (!window.confirm("Remove this key?")) return;

  try {
    await dispatch(
      removeAdminAppKey({
        appId: selectedApp._id,
        keyId,
      })
    ).unwrap();

    toast.success("Key removed successfully");
  } catch {
    toast.error("Failed to remove key");
  }
};


  const handleAssignProducts = async () => {
  if (!selectedClientId || !selectedApp?._id || !selectedProducts.length) {
    return toast.error("Missing required data");
  }

  try {
    const res = await dispatch(
      assignProductsToClientApp({
        appId: selectedApp._id,
        clientId: selectedClientId,
        productIds: selectedProducts,
      })
    ).unwrap();

    toast.success(res.message || "Products assigned");

    // 🔥 IMPORTANT: refresh client-app products
    dispatch(
      fetchClientAppProducts({
        appId: selectedApp._id,
        clientId: selectedClientId,
      })
    );

    setShowManageProducts(false);
  } catch (err) {
    toast.error(err?.message || "Failed to assign products");
  }
};





  /* ================= LIST VIEW ================= */
  if (view === "list") {
    return (
      <div className="container-fluid py-3">
        <ToastContainer />
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>App Management</h4>
          <div className="input-group w-auto">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="New app name..."
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleCreateApp}>
              Create
            </button>
          </div>
        </div>

        <div className="row">
          {loading ? (
            <div className="col-12 text-center py-5">Loading...</div>
          ) : apps.length > 0 ? (
            apps.map((app) => (
              <div className="col-md-4 mb-3" key={app._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{app.name}</h5>
                    <p>
                      Environment:{" "}
                      <span
                        className={`badge ${
                          app.environment === "live"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {app.environment.toUpperCase()}
                      </span>
                    </p>
                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openDetails(app._id)}
                      >
                        Manage
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (window.confirm("Delete this app?")) {
                            dispatch(deleteAdminApp(app._id));
                            toast.success("App deleted successfully");
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted py-5">No apps found</div>
          )}
        </div>
      </div>
    );
  }

  /* ================= DETAILS VIEW ================= */
  if (!selectedApp) return null;

  return (
    <div className="container-fluid py-3">
      <ToastContainer />
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={backToList}>
              ← Back
            </button>
            <strong>{selectedApp.name}</strong>
          </div>
          <div>
            <button className="btn btn-sm btn-outline-primary me-2" onClick={toggleEnvironment}>
              Switch to {selectedApp.environment === "Live" ? "TEST" : "LIVE"}
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={handleDeleteApp}>
              Delete
            </button>
          </div>
        </div>

        <div className="card-body">
          {/* ===== Tabs ===== */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "keys" ? "active" : ""}`}
                onClick={() => setActiveTab("keys")}
              >
                Keys
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "apis" ? "active" : ""}`}
                onClick={() => setActiveTab("apis")}
              >
                APIs / Products
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                Info
              </button>
            </li>
          </ul>

          {/* ===== Keys Tab ===== */}
          {activeTab === "keys" && (
            <div>
              <div className="input-group mb-2 w-50">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add new key..."
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAddKey}>
                  Add
                </button>
              </div>
              {selectedApp.keysList?.length > 0 ? (
                <ul className="list-group">
                  {selectedApp.keysList.map((k) => (
                    <li
  key={k._id}
  className="list-group-item d-flex justify-content-between align-items-center"
>
  <div>
    <strong>{k.key || k.name}</strong>
    <span
      className={`badge ms-2 ${
        k.status === "Enabled" ? "bg-success" : "bg-secondary"
      }`}
    >
      {k.status === "Enabled" ? "Active" : "Inactive"}
    </span>
  </div>

  <div className="d-flex gap-2">
    <button
  className={`btn btn-sm ${
    k.status === "Enabled"
      ? "btn-success"
      : "btn-outline-secondary opacity-50"
  }`}
  onClick={() => handleToggleKeyStatus(k._id)}
  title={k.status === "Enabled" ? "Disable key" : "Enable key"}
>
  <BsToggleOn />
</button>



    <button
      className="btn btn-sm btn-outline-danger"
      onClick={() => handleRemoveKey(k._id)}
    >
      Remove
    </button>
  </div>
</li>

                  ))}
                </ul>
              ) : (
                <p>No keys added</p>
              )}
            </div>
          )}

          {/* ===== APIs / PRODUCTS TAB ===== */}
{activeTab === "apis" && (
  <div>
    <button
      className="btn btn-outline-dark mb-3"
      onClick={() => setShowManageProducts(true)}
    >
      Manage Products
    </button>

    {selectedApp.appProducts?.length ? (
      <ul className="list-group">
        {selectedApp.appProducts.map((p) => (
          <li key={p._id} className="list-group-item">
            {p.name || p.productName}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted">No products assigned</p>
    )}
  </div>
)}

{showManageProducts && (
  <>
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 1040,
      }}
      onClick={() => setShowManageProducts(false)}
    />

    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <div className="card shadow-lg" style={{ width: 760 }}>
        <div className="card-body">
          <h5 className="mb-3">Manage Products</h5>

          <div className="row">
            <div className="col-md-6">
                {/* ===== CLIENT DROPDOWN (ADDED) ===== */}
<div className="mb-3">
  <label className="form-label fw-semibold">
    Select Client
  </label>
  <select
    className="form-select"
    value={selectedClientId}
    onChange={(e) => {
  const clientId = e.target.value;

  setSelectedClientId(clientId);
  setSelectedProducts([]);
  
  if (clientId) {
    dispatch(fetchClientSubscribedProductsAdmin(clientId));
    dispatch(
      fetchClientAppProducts({
        appId: selectedApp._id,
        clientId,
      })
    );
  }
}}


  >
    <option value="">-- Select Client --</option>
    {clients.map((c) => (
      <option key={c._id} value={c._id}>
        {c.name} ({c.email})
      </option>
    ))}
  </select>
</div>
              <h6 className="text-muted">Available Products</h6>
              <div
                    className="border rounded p-2"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                    >
                {selectedClientId && availableProducts.length ? (
                    (Array.isArray(availableProducts) ? availableProducts : []).map((p) => (


                    <div
                      key={p._id}
                      className={`p-2 mb-2 rounded ${
                        selectedProducts.includes(p._id)
                          ? "bg-success text-white"
                          : "bg-light"
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        setSelectedProducts((prev) =>
                          prev.includes(p._id)
                            ? prev.filter((x) => x !== p._id)
                            : [...prev, p._id]
                        )
                      }
                    >
                      {p.name}
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center mb-0">
                    No products available
                  </p>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <h6 className="text-muted">Products Added to App</h6>
              <div className="border rounded p-2">
  {!selectedClientId ? (
    <p className="text-muted text-center mb-0">
      Products are assigned per client.<br />
      Please select a client to view assigned products.
    </p>
  ) : clientAppProducts.length ? (
    clientAppProducts.map((p) => (
      <div
        key={p._id}
        className="p-2 mb-2 bg-primary text-white rounded"
      >
        {p.productId?.name}
      </div>
    ))
  ) : (
    <p className="text-muted text-center mb-0">
      No product added
    </p>
  )}
</div>




            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowManageProducts(false)}
            >
              Cancel
            </button>
            <button
             className="btn btn-dark btn-sm"
             disabled={!selectedClientId || !selectedProducts.length}
             onClick={handleAssignProducts}
            >
              Submit
            </button>

          </div>
        </div>
      </div>
    </div>
  </>
)}


          {/* ===== Info Tab ===== */}
{activeTab === "info" && (
  <div className="row">
    <div className="col-md-6">
      <div className="card">
        <div className="card-body">
          <h6 className="mb-3">App Details</h6>

          <p>
            <strong>Environment:</strong>{" "}
            <span
              className={`badge ${
                selectedApp.environment === "Live"
                  ? "bg-success"
                  : "bg-warning text-dark"
              }`}
            >
              {selectedApp.environment}
            </span>
            <button
              className="btn btn-sm btn-link ms-2 p-0"
              onClick={toggleEnvironment}
            >
              Change
            </button>
          </p>

          <p>
            <strong>App ID:</strong>{" "}
            {selectedApp._id || selectedApp.id}
          </p>

          <p>
            <strong>Name:</strong> {selectedApp.name}
          </p>

          <p>
            <strong>Keys:</strong>{" "}
            {selectedApp.keysList?.length || 0}
          </p>

          
        </div>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export default AppManagement;
