import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import {
  createProduct,
  fetchProducts,
  adminSubscribeProduct,
  adminUnsubscribeProduct,
  setActiveTab,
  setSearch,
  selectFilteredProducts,
  selectSubscribedProductIds,
} from "../../features/products/productsSlice";
import { toast } from "react-toastify";

const PAGE_SIZE = 5;

const CreateProduct = () => {
  const dispatch = useDispatch();

  const products = useSelector(selectFilteredProducts);
  const subscribedIds = useSelector(selectSubscribedProductIds);
  const { loading, activeTab, search } = useSelector(
    (state) => state.products
  );

  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState([]);
const [selectedClient, setSelectedClient] = useState("");

  const [data, setData] = useState({
    name: "",
    code: "",
    category: "Utility",
    description: "",
    trial: 0,
    preApproved: false,
  });

  /* ================= LOAD ================= */
  useEffect(() => {
  if (selectedClient) {
    dispatch(fetchProducts(selectedClient)); // client-wise
  } else {
    dispatch(fetchProducts()); // 🔥 LOAD ALL PRODUCTS
  }
  setPage(1);
}, [selectedClient, dispatch]);



 /* ================= LOAD CLIENTS (ADMIN) ================= */
  useEffect(() => {
  const fetchClients = async () => {
    try {
      const res = await axios.get("/admin/products/clients");
      setClients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load clients", err.response?.data || err.message);
    }
  };

  fetchClients();
}, []);
  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await dispatch(createProduct(data));

    if (createProduct.fulfilled.match(res)) {
      toast.success("Product created");
      setShowForm(false);
      setData({
        name: "",
        code: "",
        category: "Utility",
        description: "",
        trial: 0,
        preApproved: false,
      });
    }
  };

  const toggleSubscribe = (productId) => {
  if (!selectedClient) {
    toast.error("Please select a client first");
    return;
  }

  if (subscribedIds.includes(productId)) {
    dispatch(
      adminUnsubscribeProduct({
        clientId: selectedClient,
        productId,
      })
    );
    toast.info("Product unsubscribed");
  } else {
    dispatch(
      adminSubscribeProduct({
        clientId: selectedClient,
        productId,
      })
    );
    toast.success("Product subscribed");
  }
};


  /* ================= UI ================= */
  return (
    <div className="container-fluid py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Products</h4>
        <button
          className={`btn ${showForm ? "btn-danger" : "btn-primary"}`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Product"}
        </button>
      </div>

        {/* 🔹 CLIENT DROPDOWN (ADMIN) */}
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
      </div>


      {/* CATEGORY TABS */}
      <ul className="nav nav-tabs mb-3">
        {["All", "Utility", "Identity", "Financial", "Fraud"].map(
          (tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${
                  activeTab === tab ? "active" : ""
                }`}
                onClick={() => {
                  dispatch(setActiveTab(tab));
                  setPage(1);
                }}
              >
                {tab}
              </button>
            </li>
          )
        )}

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "PreApproved" ? "active" : ""
            }`}
            onClick={() => {
              dispatch(setActiveTab("PreApproved"));
              setPage(1);
            }}
          >
            Pre-Approved
          </button>
        </li>
      </ul>

      {/* CREATE FORM */}
      {showForm && (
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <form onSubmit={submitHandler} className="row g-3">
              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Code"
                  name="code"
                  value={data.code}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <select
                  className="form-select"
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                >
                  <option>Utility</option>
                  <option>Identity</option>
                  <option>Financial</option>
                  <option>Fraud</option>
                </select>
              </div>

              <div className="col-md-6">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Trial"
                  name="trial"
                  value={data.trial}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <textarea
                  className="form-control"
                  placeholder="Description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="preApproved"
                    checked={data.preApproved}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">
                    Pre-Approved
                  </label>
                </div>
              </div>

              <div className="col-12 text-end">
                <button className="btn btn-success">
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRODUCT TABLE */}
      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Trial</th>
              <th>Pre</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.trial}</td>
                <td>
                  {p.preApproved ? "✅" : "❌"}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      subscribedIds.includes(p._id)
                        ? "btn-outline-danger"
                        : "btn-outline-success"
                    }`}
                    onClick={() => toggleSubscribe(p._id)}
                  >
                    {subscribedIds.includes(p._id)
                      ? "Unsubscribe"
                      : "Subscribe"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-light me-2"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span className="align-self-center">
          Page {page} / {totalPages}
        </span>
        <button
          className="btn btn-light ms-2"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CreateProduct;
