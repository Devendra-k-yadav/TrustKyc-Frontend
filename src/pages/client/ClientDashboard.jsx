import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  FaServer,
  FaKey,
  FaClock,
  FaTimesCircle,
  FaWallet,
} from "react-icons/fa";

import {
  fetchProducts,
  fetchSubscribedProducts,
  subscribeProduct,
  unsubscribeProduct,
  selectFilteredProducts,
  selectSubscribedProductIds,
} from "../../features/products/productsSlice";

import {
  refreshClientUsage,
  getClientWallet,
} from "../../features/client/clientSlice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";

/* ===================================================== */

const PAGE_SIZE = 5;

export default function ClientDashboard() {
  const dispatch = useDispatch();

  const products = useSelector(selectFilteredProducts);
  const subscribedIds = useSelector(selectSubscribedProductIds);

  const { usage = [], loading, wallet } = useSelector(
    (state) => state.client
  );

  const [page, setPage] = useState(1);

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchSubscribedProducts());
    dispatch(refreshClientUsage());
    dispatch(getClientWallet()); // ✅ AVAILABLE BALANCE SOURCE
  }, [dispatch]);

  /* ================= SAFE BALANCE ================= */
  const availableBalance = wallet?.balance ?? 0;

  /* ================= MERGE PRODUCT + USAGE ================= */
  const now = new Date();

  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const isSubscribed = subscribedIds.includes(p._id);
      const isExpired =
        p.subscriptionExpiresAt &&
        new Date(p.subscriptionExpiresAt) < now;

      const isTrial =
        !isSubscribed &&
        p.trial > 0 &&
        (!p.subscriptionExpiresAt || isExpired);

      const usageData = usage.find(
        (u) => u.product_id === p._id
      );

      return {
        ...p,
        isSubscribed,
        isTrial,
        isExpired,
        calls: usageData?.total_calls || 0,
      };
    });
  }, [products, subscribedIds, usage]);

  /* ================= KPI COUNTS ================= */
  const kpis = useMemo(() => {
    return {
      total: enrichedProducts.length,
      subscribed: enrichedProducts.filter((p) => p.isSubscribed).length,
      trial: enrichedProducts.filter((p) => p.isTrial).length,
      expired: enrichedProducts.filter((p) => p.isExpired).length,
    };
  }, [enrichedProducts]);

  /* ================= CHART DATA ================= */
  const usageChartData = useMemo(() => {
    return enrichedProducts.map((p) => ({
      name: p.name,
      calls: p.calls,
    }));
  }, [enrichedProducts]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(enrichedProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return enrichedProducts.slice(start, start + PAGE_SIZE);
  }, [page, enrichedProducts]);

  /* ================= ACTION ================= */
  const toggleSubscribe = (product) => {
    if (product.isSubscribed) {
      dispatch(unsubscribeProduct(product._id));
    } else {
      dispatch(subscribeProduct(product._id));
    }
    dispatch(fetchSubscribedProducts());
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Services</h3>

      {/* ================= TOP SECTION ================= */}
      <Row className="g-4 mb-4">
        {/* ===== GRAPH LEFT ===== */}
        <Col md={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-3">API Usage (Per Product)</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Line
                    type="monotone"
                    dataKey="calls"
                    stroke="#0d6efd"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* ===== KPI RIGHT ===== */}
        <Col md={4}>
          <Row className="g-3">

            {/* ✅ AVAILABLE BALANCE */}
            <Kpi
              title="Available Balance"
              value={`₹${availableBalance}`}
              icon={<FaWallet />}
              variant={availableBalance > 0 ? "success" : "danger"}
            />

            <Kpi
              title="Total APIs"
              value={kpis.total}
              icon={<FaServer />}
              variant="primary"
            />
            <Kpi
              title="Subscribed"
              value={kpis.subscribed}
              icon={<FaKey />}
              variant="success"
            />
            <Kpi
              title="Trial"
              value={kpis.trial}
              icon={<FaClock />}
              variant="warning"
            />
            <Kpi
              title="Expired"
              value={kpis.expired}
              icon={<FaTimesCircle />}
              variant="danger"
            />
          </Row>
        </Col>
      </Row>

      {/* ================= MANAGE APIS ================= */}
      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="fw-bold mb-3">Manage Services</h5>

          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Calls</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => (
                <tr key={p._id}>
                  <td className="fw-semibold">{p.name}</td>
                  <td>
                    {p.isSubscribed && <Badge bg="success">Subscribed</Badge>}
                    {p.isTrial && <Badge bg="warning">Trial</Badge>}
                    {p.isExpired && <Badge bg="danger">Expired</Badge>}
                  </td>
                  <td>{p.calls}</td>
                  <td>
                    <Button
                      size="sm"
                      variant={p.isSubscribed ? "outline-danger" : "primary"}
                      onClick={() => toggleSubscribe(p)}
                    >
                      {p.isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Pagination className="justify-content-end">
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item
                  key={i}
                  active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </Card.Body>
      </Card>

      {/* ================= RECENT ACTIVITY ================= */}
      <Card className="shadow-sm mt-4">
        <Card.Body>
          <h5 className="fw-bold mb-3">Recent Activity</h5>

          {enrichedProducts.filter((p) => p.calls > 0).length === 0 ? (
            <p className="text-muted">No recent activity found.</p>
          ) : (
            <table className="table table-sm">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Calls</th>
                </tr>
              </thead>
              <tbody>
                {enrichedProducts
                  .filter((p) => p.calls > 0)
                  .slice(0, 5)
                  .map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td>
                        {p.isSubscribed && <Badge bg="success">Subscribed APIs</Badge>}
                        {p.isTrial && <Badge bg="warning">Trial APIs</Badge>}
                        {p.isExpired && <Badge bg="danger">Expired APIs</Badge>}
                      </td>
                      <td>{p.calls}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

/* ================= KPI CARD ================= */

function Kpi({ title, value, icon, variant }) {
  const colors = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  };

  return (
    <Col xs={6}>
      <Card className="shadow-sm border-0 h-100">
        <Card.Body className="position-relative">
          <div
            className={`position-absolute top-0 end-0 m-3 rounded-circle text-white d-flex align-items-center justify-content-center ${colors[variant]}`}
            style={{ width: 38, height: 38 }}
          >
            {icon}
          </div>
          <div className="text-muted small">{title}</div>
          <div className="fs-4 fw-bold mt-2">{value}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}
