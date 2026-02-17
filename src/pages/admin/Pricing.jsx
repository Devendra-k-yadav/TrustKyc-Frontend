import React, { useState, useEffect } from "react";
import "../../components/css/pricing.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPricingThunk,
  createPricingThunk,
  updatePricingThunk,
  deletePricingThunk,
} from "../../features/pricing/pricingSlice";
import { fetchProducts } from "../../features/products/productsSlice";
import { toast } from "react-toastify";

const Pricing = () => {
  const dispatch = useDispatch();

  const { pricingList = [], loading } =
    useSelector((state) => state.pricing);

  const { list: productList = [], loading: productLoading } =
    useSelector((state) => state.products);

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");

  const [formData, setFormData] = useState({
    basePrice: "",
    sellingPrice: "",
    discount: "",
  });

  useEffect(() => {
    dispatch(fetchPricingThunk());
    dispatch(fetchProducts());
  }, [dispatch]);

  /* ================= SAFE CALCULATIONS ================= */

  const basePrice = Number(formData.basePrice) || 0;
  const sellingPrice = Number(formData.sellingPrice) || 0;
  const discount = Number(formData.discount) || 0;

  const finalPrice = sellingPrice - discount;
  const profit = finalPrice - basePrice;

  /* ================= HANDLERS ================= */

  const handleOpenAdd = () => {
    setEditId(null);
    setSelectedProductId("");
    setFormData({
      basePrice: "",
      sellingPrice: "",
      discount: "",
    });
    setShowForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item._id);
    setSelectedProductId(item.productId);

    setFormData({
      basePrice: item.basePrice,
      sellingPrice: item.sellingPrice,
      discount: item.discount,
    });

    setShowForm(true);
  };

  const handleSubmit = async () => {
  if (!selectedProductId)
    return toast.error("Please select a product");

  if (sellingPrice < basePrice)
    return toast.error("Selling price cannot be less than base price");

  const selectedProduct = productList.find(
    (p) => p._id === selectedProductId
  );

  if (!selectedProduct)
    return toast.error("Invalid product selected");

  try {
    if (editId) {
      // ✅ UPDATE MODE
      const updatePayload = {
        basePrice,
        sellingPrice,
        discount,
      };

      await dispatch(
        updatePricingThunk({
          id: editId,
          data: updatePayload,
        })
      ).unwrap();

      toast.success("Pricing updated successfully");
    } else {
      // ✅ CREATE MODE
      const createPayload = {
        productId: selectedProductId,
        name: selectedProduct.name,
        basePrice,
        sellingPrice,
        discount,
      };

      await dispatch(
        createPricingThunk(createPayload)
      ).unwrap();

      toast.success("Pricing created successfully");
    }

    setShowForm(false);
    dispatch(fetchPricingThunk());
  } catch (err) {
    toast.error(
      err?.message ||
        err?.response?.data?.message ||
        "Operation failed"
    );
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete pricing?")) return;

    try {
      await dispatch(deletePricingThunk(id)).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Pricing Management</h3>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          + Add Pricing
        </button>
      </div>

      <div className="card shadow-sm border-0 p-3">
        {loading ? (
          <div className="text-center p-4">Loading...</div>
        ) : (
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Base Price</th>
                <th>Selling Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Profit</th>
                <th>Updated</th>
                <th width="140">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No pricing records found.
                  </td>
                </tr>
              ) : (
                pricingList.map((p) => {
                  const base = Number(p.basePrice) || 0;
                  const sell = Number(p.sellingPrice) || 0;
                  const disc = Number(p.discount) || 0;

                  const final =
                    Number(p.finalPrice) ||
                    sell - disc;

                  const profitVal =
                    Number(p.profit) ||
                    final - base;

                  return (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>₹{base.toFixed(2)}</td>
                      <td>₹{sell.toFixed(2)}</td>
                      <td>{disc}</td>
                      <td className="text-primary fw-semibold">
                        ₹{final.toFixed(2)}
                      </td>
                      <td
                        className={`fw-semibold ${
                          profitVal >= 0
                            ? "text-success"
                            : "text-danger"
                        }`}
                      >
                        ₹{profitVal.toFixed(2)}
                      </td>
                      <td>
                        {new Date(
                          p.updatedOn
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() =>
                            handleOpenEdit(p)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(p._id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showForm && (
        <div
          className="position-fixed top-50 start-50 translate-middle p-4 bg-white shadow rounded"
          style={{ width: 400, zIndex: 9999 }}
        >
          <h5 className="mb-3">
            {editId ? "Edit Pricing" : "Add Pricing"}
          </h5>

          <select
            className="form-control mb-2"
            value={selectedProductId}
            onChange={(e) =>
              setSelectedProductId(e.target.value)
            }
            disabled={editId}
          >
            <option value="">
              {productLoading
                ? "Loading..."
                : "Select Product"}
            </option>
            {productList.map((prod) => (
              <option
                key={prod._id}
                value={prod._id}
              >
                {prod.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Base Price"
            className="form-control mb-2"
            value={formData.basePrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                basePrice: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Selling Price"
            className="form-control mb-2"
            value={formData.sellingPrice}
            onChange={(e) =>
              setFormData({
                ...formData,
                sellingPrice: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Discount"
            className="form-control mb-2"
            value={formData.discount}
            onChange={(e) =>
              setFormData({
                ...formData,
                discount: e.target.value,
              })
            }
          />

          <div className="alert alert-info p-2">
            <div>
              Final Price:{" "}
              <strong>
                ₹{finalPrice.toFixed(2)}
              </strong>
            </div>
            <div>
              Profit:{" "}
              <strong
                className={
                  profit >= 0
                    ? "text-success"
                    : "text-danger"
                }
              >
                ₹{profit.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success me-2"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
