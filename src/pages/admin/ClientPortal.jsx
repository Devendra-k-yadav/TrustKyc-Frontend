import React, { useEffect, useState } from "react";
import API, { attachAccessToken } from "../../api/axios";
import { useSelector, useDispatch } from "react-redux";
import { assignProductToClient } from "../../features/adminClients/adminClientsSlice";
import { toast } from "react-toastify";


const ClientPortal = () => {

  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
const [currentPage, setCurrentPage] = useState(1);
const pageSize = 5; // per page clients (change as needed)
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const [assignData, setAssignData] = useState({
    clientId: "",
    productId: "",
    balance: "",
    limit: "",
  });
const totalPages = Math.ceil(clients.length / pageSize);

const paginatedClients = clients.slice(
  (currentPage - 1) * pageSize,
  currentPage * pageSize
);
 // ================= ATTACH TOKEN =================
  useEffect(() => {
    if (accessToken) {
      attachAccessToken(accessToken);
    }
  }, [accessToken]);

  // ================= FETCH CLIENTS =================
  const fetchClients = async () => {

    try {

      setLoading(true);

      const res = await API.get("/admin/client/clients");

      const normalizedClients = (res.data.data || []).map((c) => ({
        ...c,
        _id: c._id || c.id,
      }));

      setClients(normalizedClients);

    } catch (err) {

      toast.error("Failed to fetch clients");

    } finally {

      setLoading(false);

    }

  };

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {

    try {

      const res = await API.get("/products");

      const productList =
        res.data.products ||
        res.data.data ||
        res.data ||
        [];

      setProducts(productList);

    } catch (err) {

      toast.error("Failed to fetch products");

    }

  };

  useEffect(() => {
    if (accessToken) {
      fetchClients();
      fetchProducts();
    }
  }, [accessToken]);

  // ================= OPEN MODAL =================
  const openAssignModal = (clientId) => {

    console.log("OPEN MODAL CLIENT ID:", clientId);

    setAssignData({
      clientId: clientId,
      productId: "",
      balance: "",
      limit: "",
    });

    setShowAssignModal(true);
  };

  // ================= ASSIGN PRODUCT =================
  const handleAssignProduct = async () => {

  if (!assignData.clientId) {
    toast.error("Client not selected");
    return;
  }

  if (!assignData.productId) {
    toast.error("Select product");
    return;
  }

  try {

    const payload = {
      clientId: assignData.clientId,
      productId: assignData.productId,
      balance: Number(assignData.balance || 0),
      limit: Number(assignData.limit || 0),
      token: accessToken
    };

    const res = await dispatch(assignProductToClient(payload)).unwrap();

    toast.success(res?.message || "Product assigned successfully");

    setShowAssignModal(false);

  } catch (err) {
    toast.error(err || "Assignment failed");
  }
};

  // ================= DELETE =================
  const handleDelete = (clientId) => {

    if (!window.confirm("Revoke client access?")) return;

    setClients((prev) =>
      prev.filter((x) => x._id !== clientId)
    );
  };

  // ================= UI =================
  return (
    <div className="dashboard-wrapper">

      <h3 className="mb-3">Client Portal</h3>

      <table className="table table-bordered">

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th width="260">Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : (
            paginatedClients.map((c) => (

              <tr key={c._id}>

                <td>{c.name}</td>

                <td>{c.email}</td>

                <td>
                  <span className="badge bg-success">
                    Active
                  </span>
                </td>

                <td>

                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() =>
                      openAssignModal(c._id)
                    }
                  >
                    Assign Product
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleDelete(c._id)
                    }
                  >
                    Revoke
                  </button>

                </td>

              </tr>

            ))
          )}

        </tbody>

      </table>
          {totalPages > 1 && (
  <nav className="mt-3">
    <ul className="pagination justify-content-end">

      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
      </li>

      {[...Array(totalPages)].map((_, i) => (
        <li
          key={i}
          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        </li>
      ))}

      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
        <button
          className="page-link"
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </li>

    </ul>
  </nav>
)}
      {/* ================= ASSIGN MODAL ================= */}

      {showAssignModal && (

        <div className="modal d-block">

          <div className="modal-dialog">

            <div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.15)", // optional backdrop
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1050
  }}
>

  <div
    className="modal-content border-0 shadow-sm"
    style={{
      borderRadius: "10px",
      maxWidth: "420px",
      width: "100%",
      background: "#fff"
    }}
  >

    {/* Header */}
    <div
      className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom"
      style={{
        background: "#f8fafc",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px"
      }}
    >
      <h6 className="mb-0 fw-semibold" style={{ fontSize: "15px" }}>
        Assign Product
      </h6>

      <button
        className="btn btn-sm btn-light"
        style={{ fontSize: "12px", padding: "2px 8px" }}
        onClick={() => setShowAssignModal(false)}
      >
        ✕
      </button>
    </div>

    {/* Body */}
    <div className="px-3 py-3">

      <div className="mb-3">
        <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>
          Client ID
        </label>
        <div className="form-control form-control-sm bg-light" style={{ fontSize: "12px" }}>
          {assignData.clientId}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>
          Product
        </label>
        <select
          className="form-select form-select-sm"
          style={{ fontSize: "13px" }}
          value={assignData.productId}
          onChange={(e) =>
            setAssignData((prev) => ({
              ...prev,
              productId: e.target.value,
            }))
          }
        >
          <option value="">Select product</option>

          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>
          Balance
        </label>
        <input
          type="number"
          min="0"
          className="form-control form-control-sm"
          style={{ fontSize: "13px" }}
          placeholder="Enter balance"
          value={assignData.balance}
          onChange={(e) =>
            setAssignData((prev) => ({
              ...prev,
              balance: e.target.value,
            }))
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label text-muted mb-1" style={{ fontSize: "12px" }}>
          Limit
        </label>
        <input
          type="number"
          min="0"
          className="form-control form-control-sm"
          style={{ fontSize: "13px" }}
          placeholder="Enter limit"
          value={assignData.limit}
          onChange={(e) =>
            setAssignData((prev) => ({
              ...prev,
              limit: e.target.value,
            }))
          }
        />
      </div>

    </div>

    {/* Footer */}
    <div
      className="d-flex justify-content-end gap-2 px-3 py-2 border-top"
      style={{
        background: "#f8fafc",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px"
      }}
    >
      <button
        className="btn btn-light btn-sm"
        style={{
          fontSize: "13px",
          padding: "4px 14px",
          borderRadius: "6px"
        }}
        onClick={() => setShowAssignModal(false)}
      >
        Cancel
      </button>

      <button
        className="btn btn-primary btn-sm shadow-sm"
        style={{
          fontSize: "13px",
          padding: "4px 16px",
          borderRadius: "6px"
        }}
        onClick={handleAssignProduct}
      >
        Assign
      </button>

    </div>

  </div>

</div>


          </div>

        </div>

      )}

    </div>
  );
};

export default ClientPortal;
