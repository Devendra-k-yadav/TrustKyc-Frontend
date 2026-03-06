import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Table,
  Badge,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientWallet,
  rechargeWalletThunk,
  requestRechargeThunk,
  payVendorThunk,
} from "../../features/client/clientSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../components/css/clientwallet.css";
/* ================= PAGINATION HELPER ================= */
const paginate = (data = [], page = 1, limit = 5) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    totalPages: Math.ceil(data.length / limit) || 1,
  };
};
/* ================= PAGINATION UI ================= */
const PaginationControls = ({ page, totalPages, onChange }) => (
  <div className="d-flex justify-content-end align-items-center gap-2 mt-2">
    <Button
      size="sm"
      variant="outline-secondary"
      disabled={page === 1}
      onClick={() => onChange(page - 1)}
    >
      Prev
    </Button>
    <span className="small">
      Page {page} / {totalPages}
    </span>
    <Button
      size="sm"
      variant="outline-secondary"
      disabled={page === totalPages}
      onClick={() => onChange(page + 1)}
    >
      Next
    </Button>
  </div>
);

export default function ClientWallet() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { wallet, vendors } = useSelector((state) => state.client);
  
  /* ================= SAFE DEFAULTS ================= */
  const balance = wallet?.balance ?? 0;
  const transactions = Array.isArray(wallet?.transactions)
    ? wallet.transactions
    : [];
  const rechargeRequests = Array.isArray(wallet?.rechargeRequests)
    ? wallet.rechargeRequests
    : [];
    /* ================= PAGINATION STATE ================= */
  const [txPage, setTxPage] = useState(1);
  const [rechargePage, setRechargePage] = useState(1);
  const [vendorPage, setVendorPage] = useState(1);
  const limit = 5;

  /* ================================================= */

  useEffect(() => {
    if (accessToken) {
      dispatch(getClientWallet(accessToken));
    }
  }, [accessToken, dispatch]);

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeMethod, setRechargeMethod] = useState("UPI");
  const [useRequest, setUseRequest] = useState(false);

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [payAmount, setPayAmount] = useState("");

  const [search, setSearch] = useState("");

  /* ================= HANDLERS ================= */

  const handleRecharge = () => {
    const amount = Number(rechargeAmount);
    if (!amount || amount <= 0)
      return toast.error("Enter a valid amount");

    if (useRequest) {
      dispatch(
        requestRechargeThunk({
          amount,
          method: rechargeMethod,
          token: accessToken,
        })
      );
      toast.info(`Recharge request for ₹${amount} sent`);
    } else {
      dispatch(
        rechargeWalletThunk({
          amount,
          method: rechargeMethod,
          token: accessToken,
        })
      );
      toast.success(`₹${amount} added to wallet`);
    }

    setShowRechargeModal(false);
    setRechargeAmount("");
    setUseRequest(false);
    setRechargeMethod("UPI");
  };

  const handlePayVendor = () => {
    const amount = Number(payAmount);
    if (!selectedVendor) return toast.warning("Select a vendor");
    if (!amount || amount <= 0)
      return toast.warning("Enter valid amount");
    if (amount > balance)
      return toast.error("Insufficient balance");

    dispatch(
      payVendorThunk({
        vendor: selectedVendor,
        amount,
        token: accessToken,
      })
    );

    toast.success(`₹${amount} paid to ${selectedVendor}`);

    setShowPayModal(false);
    setSelectedVendor("");
    setPayAmount("");
  };

  /* ================= FILTER ================= */

  const filteredTx = transactions.filter((t) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      String(t._id).includes(s) ||
      (t.vendor && t.vendor.toLowerCase().includes(s)) ||
      (t.method && String(t.method).toLowerCase().includes(s)) ||
      String(t.amount).includes(s) ||
      (t.date && t.date.toLowerCase().includes(s))
    );
  });
/* ================= PAGINATED DATA ================= */
  const txPaginated = paginate(filteredTx, txPage, limit);
  const rechargePaginated = paginate(rechargeRequests, rechargePage, limit);
  const vendorPaginated = paginate(vendors, vendorPage, limit);
  /* ================= UI ================= */

  return (
    <div className="client-wallet container py-4" style={{ marginTop: "40px" }}>
      <ToastContainer position="top-right" autoClose={2200} />

      <h3 className="mb-4 text-primary">Wallet & Payments</h3>
      
      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="stat-card p-3">
            <small className="muted">Available Balance</small>
            <div className="d-flex align-items-baseline justify-content-between">
              <h3 className="mb-0">₹{balance}</h3>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowRechargeModal(true)}
              >
                + Add / Request
              </Button>
            </div>
            <small className="text-muted d-block mt-2">
              Credits: ₹{wallet?.totalCredits ?? 0} • Debits: ₹{wallet?.totalDebits ?? 0}
            </small>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card p-3">
            <small className="muted">Quick Pay</small>
            <div className="d-flex gap-2 mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPayModal(true)}
              >
                Pay Vendor
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => toast.info("Refund request coming soon")}
              >
                Request Refund
              </Button>
            </div>
            <small className="text-muted d-block mt-2">
              Vendors: {vendors?.length || 0}
            </small>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card p-3">
            <small className="muted">Recharge Requests</small>
            <div className="mt-2">
              Pending Requests:{" "}
              <Badge bg="warning" text="dark">
                {
                  rechargeRequests.filter((r) => r.status === "Pending").length
                }
              </Badge>
            </div>
            <small className="text-muted d-block mt-2">
              Admin will review pending requests
            </small>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Search transactions, vendor or amount..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {/* ================= TRANSACTIONS ================= */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Transaction History</h5>
          <div className="table-responsive">
            <Table striped hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Vendor / Method</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.length ? (
                  txPaginated.data.map((t, idx) => (
                    <tr key={t._id || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <Badge bg={t.type === "credit" ? "success" : "danger"}>
                          {t.type === "credit" ? "Credit" : "Debit"}
                        </Badge>
                      </td>
                      <td>{t.vendor || t.method || "—"}</td>
                      <td className={t.type === "credit" ? "text-success" : "text-danger"}>
                        {t.type === "credit" ? "+" : "-"}₹{t.amount}
                      </td>
                      <td>{t.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No transactions yet
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <PaginationControls
            page={txPage}
            totalPages={txPaginated.totalPages}
            onChange={setTxPage}
          />
          </div>
        </Card.Body>
      </Card>

      {/* ================= RECHARGE REQUESTS ================= */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Recharge Requests</h5>
          <Table striped hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {rechargeRequests.length ? (
                rechargePaginated.data.map((r, i) => (
                  <tr key={r._id || i}>
                    <td>{i + 1}</td>
                    <td>₹{r.amount}</td>
                    <td>{r.method}</td>
                    <td>
                      <Badge
                        bg={
                          r.status === "Pending"
                            ? "warning"
                            : r.status === "Approved"
                            ? "success"
                            : "danger"
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td>{r.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No recharge requests
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <PaginationControls
            page={rechargePage}
            totalPages={rechargePaginated.totalPages}
            onChange={setRechargePage}
          />
        </Card.Body>
      </Card>

      {/* ================= VENDORS ================= */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Vendors</h5>
          {vendors?.length ? (
            <Table hover responsive>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Base URL</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {vendorPaginated.data.map((v, i) => (
                  <tr key={v._id || i}>
                    <td>{i + 1}</td>
                    <td className="fw-semibold">{v.vendor_name}</td>
                    <td className="text-muted small">{v.base_url}</td>
                    <td>
                      <Badge bg={v.status === "active" ? "success" : "secondary"}>
                        {v.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
          ) : (
            <p className="text-muted">No vendors available</p>
          )}
          <PaginationControls
            page={vendorPage}
            totalPages={vendorPaginated.totalPages}
            onChange={setVendorPage}
          />
        </Card.Body>
      </Card>

      {/* ================= MODALS ================= */}
      {/* Recharge Modal */}
      <Modal show={showRechargeModal} onHide={() => setShowRechargeModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{useRequest ? "Request Recharge" : "Instant Recharge"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Payment Method</Form.Label>
              <Form.Select value={rechargeMethod} onChange={(e) => setRechargeMethod(e.target.value)}>
                <option>UPI</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Net Banking</option>
                <option>Bank Transfer</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Send as recharge request to admin"
              checked={useRequest}
              onChange={(e) => setUseRequest(e.target.checked)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRechargeModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRecharge}>
            {useRequest ? "Send Request" : "Recharge"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Vendor Pay Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pay Vendor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Select Vendor</Form.Label>
              <Form.Select value={selectedVendor} onChange={(e) => setSelectedVendor(e.target.value)}>
                <option value="">-- select --</option>
                {vendors?.filter((v) => v.status === "active").map((v) => (
                  <option key={v._id} value={v.vendor_name}>
                    {v.vendor_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPayModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePayVendor}>
            Pay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
