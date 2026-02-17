import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, Row, Col, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { BsTrash, BsToggleOn, BsToggleOff } from "react-icons/bs";

import {
  addAppKey,
  removeAppKey,
  toggleAppKeyStatus,
  assignProductsToApp,
  changeAppEnvironment,
  fetchSingleApp,
} from "../../features/client/clientAppsSlice";

import {
  fetchProducts,
  fetchSubscribedProducts,
  selectSubscribedProducts,
} from "../../features/products/productsSlice";

const ClientAppDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const subscribedProducts = useSelector(selectSubscribedProducts);
  const { selectedApp, loadingSingleApp } = useSelector(
    (state) => state.clientApps
  );

  const app = selectedApp;

  const [showAddKeyForm, setShowAddKeyForm] = useState(false);
  const [keyValue, setKeyValue] = useState("");
  const [keyError, setKeyError] = useState("");

  // 🔹 Manage Products modal state
  const [showManageProducts, setShowManageProducts] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [showInfo, setShowInfo] = useState(false);

  // Fetch single app if not loaded
  useEffect(() => {
  if (id) {
    dispatch(fetchSingleApp(id));
  }
}, [id, dispatch]);

  // ✅ FIX: load products + subscribed products
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSubscribedProducts());
  }, [dispatch]);
  

  // Initialize selectedProducts from app.services
 useEffect(() => {
  if (app?.services) {
    const uniqueIds = [
      ...new Set(app.services.map(p => p._id || p))
    ];
    setSelectedProducts(uniqueIds);
  }
}, [app?.services]);






  if (loadingSingleApp)
    return <p className="text-center mt-5">Loading app details...</p>;

  if (!app)
    return (
      <div className="text-center mt-5">
        <h6>App not found</h6>
        <Button variant="dark" onClick={() => navigate("/client/apps")}>
          Back
        </Button>
      </div>
    );

  const handleAddKey = async () => {
    if (!keyValue.trim()) {
      setKeyError("Key is required");
      return;
    }
    try {
      await dispatch(addAppKey({ appId: app._id || app.id, key: keyValue })).unwrap();
      setKeyValue("");
      setKeyError("");
      setShowAddKeyForm(false);
      toast.success("Key added successfully");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm("Are you sure you want to delete this key?")) return;
    try {
      await dispatch(removeAppKey({ appId: app._id || app.id, keyId })).unwrap();
      toast.success("Key deleted");
    } catch (err) {
      toast.error(err);
    }
  };

  const handleAssignProducts = async () => {
  try {
    const res = await dispatch(
      assignProductsToApp({
        appId: app._id || app.id,
        products: selectedProducts,
      })
    ).unwrap();

    // sync frontend with backend
    setSelectedProducts(res?.services?.length ? res.services : selectedProducts);

    toast.success("Products assigned successfully");
    setShowManageProducts(false);
  } catch (err) {
    toast.error(err || "Failed to assign products");
  }
};

  const handleEnvironmentToggle = () => {
    const newEnv = (app.environment || "Test") === "Test" ? "Live" : "Test";
    dispatch(changeAppEnvironment({ appId: app._id || app.id, environment: newEnv }));
    toast.success(`Environment switched to ${newEnv}`);
  };

  

  const getProductName = (id) =>
  subscribedProducts.find((p) => p._id === id)?.name || id;


  return (
    <>
      {/* BACK */}
      <Button variant="link" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      {/* INFO BAR + ACTIONS */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="alert alert-primary py-2 px-3 mb-0" style={{ maxWidth: 700 }}>
          <span style={{ cursor: "pointer" }} onClick={() => setShowInfo((p) => !p)}>
            ℹ️
          </span>{" "}
          Integration with this app can only be used for testing
          {showInfo && " and will deduct trial credits."}
        </div>

        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-secondary">
            App Settings
          </Button>
          <Button size="sm" variant="dark" onClick={() => setShowAddKeyForm(true)}>
            Add Key
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => navigate("/client/trial-center")}
          >
            Trial
          </Button>
        </div>
      </div>

      {/* ADD KEY FORM */}
      {showAddKeyForm && (
        <div className="d-flex justify-content-center mb-4">
          <Card style={{ width: 360 }} className="shadow-sm">
            <Card.Body>
              <h6>Add New Key</h6>
              <input
                className="form-control mt-2"
                placeholder="Enter key"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
              />
              {keyError && <small className="text-danger">{keyError}</small>}
              <div className="d-flex justify-content-end gap-2 mt-3">
                <Button size="sm" variant="secondary" onClick={() => setShowAddKeyForm(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="dark" onClick={handleAddKey}>
                  Add
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* APP DETAILS + PRODUCTS */}
      <Row>
        <Col md={5}>
          <Card>
            <Card.Body>
              <h6>App Details</h6>
              {/* <p>
                <b>Environment:</b>{" "}
                <Badge bg={(app.environment || "Test") === "Live" ? "success" : "warning"}>
                  {app.environment || "Test"}
                </Badge>
                <Button size="sm" variant="link" className="ms-2" onClick={handleEnvironmentToggle}>
                  Change
                </Button>
              </p> */}
              <p><b>App ID:</b> {app._id || app.id}</p>
              <p><b>Name:</b> {app.name}</p>
              <p><b>Keys:</b> {app.keysList?.length || 0}</p>
              <p><b>Products:</b> {selectedProducts.length}</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between">
                <h6>Product Level Settings</h6>
                <Button size="sm" variant="link" onClick={() => setShowManageProducts(true)}>
                  Manage Products
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {selectedProducts.map((p) => (
                  <Badge key={p} bg="success" pill>
                    {getProductName(p)}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MANAGE PRODUCTS MODAL */}
      {showManageProducts && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
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
            <Card style={{ width: 760 }} className="shadow-lg">
              <Card.Body>
                <h5 className="mb-3">Manage Services</h5>
                <Row>
                  <Col md={6}>
                    <h6 className="text-muted">Subscribed Products</h6>
                    <div className="border rounded p-2">
                      {subscribedProducts.length ? (
                        subscribedProducts.map((p) => (
                          <div
                            key={p._id}
                            className={`p-2 mb-2 rounded ${
                              selectedProducts.includes(p._id) ? "bg-success text-white" : "bg-light"
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setSelectedProducts((prev) =>
                                prev.includes(p._id) ? prev.filter((x) => x !== p._id) : [...prev, p._id]
                              )
                            }
                          >
                            {p.name}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted text-center mb-0">No subscribed products</p>
                      )}
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-muted">Products Added to App</h6>
                    <div className="border rounded p-2">
                      {selectedProducts.length ? (
                        selectedProducts.map((id) => (
                          <div
                            key={id}
                            className="p-2 mb-2 bg-primary text-white rounded"
                            onClick={() =>
                              setSelectedProducts((prev) => prev.filter((x) => x !== id))
                            }
                          >
                            {getProductName(id)}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted text-center mb-0">No product added</p>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button size="sm" variant="secondary" onClick={() => setShowManageProducts(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="dark" onClick={handleAssignProducts}>
                    Submit
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        </>
      )}

      {/* MANAGE KEYS TABLE */}
      <Card className="mt-4">
        <Card.Body>
          <h6>Manage Keys</h6>
          <Table hover responsive className="mt-3">
            <thead>
              <tr>
                <th>Key</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {app.keysList?.length ? (
                app.keysList.map((k) => (
                  <tr key={k._id}>
                    <td>{k.name}</td>
                    <td>{k.createdAt || "—"}</td>
                    <td>{k.updatedAt || "—"}</td>
                    <td>
                      <Badge bg={k.status === "Enabled" ? "success" : "secondary"}>
                        {k.status === "Enabled" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="d-flex gap-2">
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteKey(k._id)}>
                        <BsTrash />
                      </Button>
                      <button
  className={`btn btn-sm ${
    k.status === "Enabled"
      ? "btn-success"
      : "btn-outline-secondary opacity-50"
  }`}
  title={k.status === "Enabled" ? "Disable key" : "Enable key"}
  onClick={async () => {
    try {
      await dispatch(
        toggleAppKeyStatus({
          appId: app._id || app.id,
          keyId: k._id,
        })
      ).unwrap();

      toast.success(
        k.status === "Enabled"
          ? "Key Disabled successfully"
          : "Key Enabled successfully"
      );
    } catch {
      toast.error("Failed to update key status");
    }
  }}
>
  <BsToggleOn size={18} />
</button>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No keys added
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default ClientAppDetails;
