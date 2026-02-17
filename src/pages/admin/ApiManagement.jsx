import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchApis,
  addApi,
  updateApi,
  deleteApi,
  assignApiToClient,
} from "../../features/apiManagement/apiManagementSlice";


const ApiManagement = () => {
  const dispatch = useDispatch();

  /* ================= AUTH ================= */
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);

  /* ================= API REDUX ================= */
  const { apis, loading } = useSelector(
    (state) => state.apiManagement
  );

  /* ================= API FORM ================= */
  const [form, setForm] = useState({
    name: "",
    endpoint: "",
    price: "",
    vendor: "",
    status: "Active",
    apiId: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  /* ================= CLIENT ================= */
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [env, setEnv] = useState("Test");

  /* ================= ASSIGNED ================= */
  const [assignedApis, setAssignedApis] = useState([]);
  const [loadingAssigned, setLoadingAssigned] = useState(false);

  /* ================= FETCH APIS ================= */
  useEffect(() => {
    if (accessToken && user?.role === "ADMIN") {
      dispatch(fetchApis());
    }
  }, [accessToken, user, dispatch]);

  /* ================= FETCH CLIENTS ================= */
  useEffect(() => {
    if (!accessToken) return;

    axios
      .get("http://localhost:5000/api/admin/client/clients", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setClients(res.data.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, [accessToken]);

  /* ================= FETCH CLIENT APIS ================= */
  const fetchClientApis = async (clientId) => {
    if (!clientId || !accessToken) return;

    try {
      setLoadingAssigned(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/client/${clientId}/apis`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setAssignedApis(res.data.data || []);
    } catch {
      toast.error("Failed to load assigned APIs");
    } finally {
      setLoadingAssigned(false);
    }
  };

  /* ================= SUBMIT API ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.endpoint || !form.price || !form.vendor) {
      toast.warning("Fill all fields");
      return;
    }

    if (editingId) {
      dispatch(updateApi({ id: editingId, form }));
    } else {
      dispatch(addApi(form));
    }

    setForm({
      name: "",
      endpoint: "",
      price: "",
      vendor: "",
      status: "Active",
      apiId: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  /* ================= ASSIGN API ================= */
  const handleAssign = async (e) => {
    e.preventDefault();

    if (!selectedClient || !form.apiId) {
      toast.warning("Select client and API");
      return;
    }

    await dispatch(
      assignApiToClient({
        clientId: selectedClient,
        apiId: form.apiId,
        env,
      })
    );

    fetchClientApis(selectedClient);
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer autoClose={2000} />

      <h3>API Management</h3>

      {/* ================= ADD API ================= */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close" : "Add API"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="border p-3 mb-4">
          <div className="row g-2">
            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="API Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="Endpoint"
                value={form.endpoint}
                onChange={(e) =>
                  setForm({ ...form, endpoint: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="Base Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <input
                className="form-control form-control-sm"
                placeholder="Vendor"
                value={form.vendor}
                onChange={(e) =>
                  setForm({ ...form, vendor: e.target.value })
                }
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select form-select-sm"
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button className="btn btn-success btn-sm w-50">
                {editingId ? "Update API" : "Add API"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= API LIST ================= */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>API Name</th>
            <th>Endpoint</th>
            <th>Base Price</th>
            <th>Vendor</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7">Loading...</td>
            </tr>
          ) : (
            apis.map((api, i) => (
              <tr key={api.id}>
                <td>{i + 1}</td>
                <td>{api.name}</td>
                <td>{api.endpoint}</td>
                <td>{api.price}</td>
                <td>{api.vendor}</td>
                <td>
                  <span
                    className={`badge ${
                      api.status === "Active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {api.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingId(api.id);
                      setForm({
                        name: api.name,
                        endpoint: api.endpoint,
                        price: api.price,
                        vendor: api.vendor,
                        status: api.status,
                        apiId: "",
                      });
                      setShowForm(true);
                    }}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this API?"
                        )
                      ) {
                        dispatch(deleteApi(api.id));
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= ASSIGN API ================= */}
      <h4 className="mt-4">Assign API to Client</h4>

      <form onSubmit={handleAssign} className="border p-3 mb-3">
        <select
          className="form-select mb-2"
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
            fetchClientApis(e.target.value);
          }}
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.email})
            </option>
          ))}
        </select>

        <select
          className="form-select mb-2"
          value={form.apiId}
          onChange={(e) =>
            setForm({ ...form, apiId: e.target.value })
          }
        >
          <option value="">Select API</option>
          {apis.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <button className="btn btn-success">Assign</button>
      </form>

      {/* ================= ASSIGNED LIST ================= */}
      <h4>Client Assigned APIs</h4>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>API</th>
            <th>Env</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {loadingAssigned ? (
            <tr>
              <td colSpan="3">Loading...</td>
            </tr>
          ) : assignedApis.length ? (
            assignedApis.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.env}</td>
                <td>{a.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No APIs assigned</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApiManagement;
