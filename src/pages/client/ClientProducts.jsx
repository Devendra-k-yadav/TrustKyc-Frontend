// src/pages/client/ClientProducts.jsx
import React, { useEffect } from "react";
import { Card, Button, Badge, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  setActiveTab,
  setSearch,
  subscribeProduct,
  unsubscribeProduct,
  selectFilteredProducts,
  selectActiveTab,
  selectSearch,
  selectSubscribedProductIds,
  fetchProducts,              // ✅ ADD
  fetchSubscribedProducts,    // ✅ ADD
} from "../../features/products/productsSlice";

const TABS = ["All", "Utility", "Identity","Merchant", "Vehicle", "Financial", "Fraud"];

export default function ClientProducts() {
  const dispatch = useDispatch();

  const products = useSelector(selectFilteredProducts);
  const activeTab = useSelector(selectActiveTab);
  const search = useSelector(selectSearch);
  const subscribedIds = useSelector(selectSubscribedProductIds);

  /* ✅✅ YAHI PE ADD KARNA HAI */
  useEffect(() => {
    dispatch(fetchProducts());             // 🔥 backend products
    dispatch(fetchSubscribedProducts());   // 🔥 subscribed list
  }, [dispatch]);

  const handleToggleSubscribe = async (product) => {
    const isSubscribed = subscribedIds.includes(product._id);

    try {
      if (isSubscribed) {
        await dispatch(unsubscribeProduct(product._id)).unwrap();
        toast.info(`${product.name} removed`);
      } else {
        await dispatch(subscribeProduct(product._id)).unwrap();
        toast.success(`${product.name} added`);
      }

      // 🔁 refresh subscribed list
      dispatch(fetchSubscribedProducts());
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4" style={{ marginTop: "40px" }}>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Services <span className="badge bg-dark ms-2">
    {products.length}
  </span></h3>
        <Form.Control
          style={{ width: "260px" }}
          placeholder="Search product here"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
      </div>

      {/* TABS */}
      <div className="d-flex gap-4 border-bottom mb-4">
        {TABS.map((tab) => (
          <span
            key={tab}
            onClick={() => dispatch(setActiveTab(tab))}
            style={{
              cursor: "pointer",
              paddingBottom: "8px",
              borderBottom: activeTab === tab ? "2px solid #28a745" : "none",
              color: activeTab === tab ? "#28a745" : "#555",
              fontWeight: 500,
            }}
          >
            {tab}
          </span>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div className="row g-4">
        {products.map((product) => {
          const isSubscribed = subscribedIds.includes(product._id);

          return (
            <div key={product._id} className="col-md-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <Card.Title className="fw-bold">
                      {product.name}
                    </Card.Title>
                    {product.preApproved && (
                      <Badge bg="warning" text="dark">
                        Pre-Approved
                      </Badge>
                    )}
                  </div>

                  <Card.Text className="text-muted mt-2">
                    {product.description}
                  </Card.Text>

                  <div className="mt-2 text-success fw-semibold">
                    Trial Transactions: {product.trial}
                  </div>

                  <div className="mt-auto">
                    <Button
                      variant={isSubscribed ? "outline-dark" : "dark"}
                      className="w-50 mt-3"
                      onClick={() => handleToggleSubscribe(product)}
                    >
                      {isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
