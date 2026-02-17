import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllRechargeRequests,
  approveRechargeThunk,
  rejectRechargeThunk,
  clearStatus,
} from "../../features/balance/balanceSlice";
import { Table, Badge, Button, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const Balance = () => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { requests = [], loading, error, successMessage } = useSelector(
    (state) => state.balance
  );

  const [rejectModal, setRejectModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [selected, setSelected] = useState(null);

  /* ================= PAGINATION ================= */
  const rowsPerPage = 5;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(requests.length / rowsPerPage);
  const currentRows = requests.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (accessToken) {
      dispatch(getAllRechargeRequests(accessToken));
    }
  }, [dispatch, accessToken]);

  
  /* ================= ACTIONS ================= */

  const approve = async (r) => {
  try {
    await dispatch(
      approveRechargeThunk({
        walletId: r.walletId,
        requestId: r.requestId,
        token: accessToken,
      })
    ).unwrap();

    toast.success("Recharge approved successfully ✅");
    dispatch(getAllRechargeRequests(accessToken));
  } catch (err) {
    toast.error("Failed to approve recharge ❌");
  }
};


  const openReject = (r) => {
    setSelected(r);
    setRejectModal(true);
  };

  const reject = async () => {
  try {
    await dispatch(
      rejectRechargeThunk({
        walletId: selected.walletId,
        requestId: selected.requestId,
        remark,
        token: accessToken,
      })
    ).unwrap();

    toast.success("Recharge rejected successfully ❌");
    dispatch(getAllRechargeRequests(accessToken));
  } catch (err) {
    toast.error("Failed to reject recharge ❌");
  }

  setRejectModal(false);
  setRemark("");
};


  /* ================= SUMMARY ================= */

  // const totalAmount = requests.reduce((s, r) => s + r.amount, 0);
  // const pending = requests.filter((r) => r.status === "Pending").length;
  // const approved = requests.filter((r) => r.status === "Approved").length;

  // ✅ ONLY approved recharge amount
const approvedAmount = requests
  .filter((r) => r.status === "Approved")
  .reduce((sum, r) => sum + Number(r.amount || 0), 0);

const pending = requests.filter((r) => r.status === "Pending").length;
const approved = requests.filter((r) => r.status === "Approved").length;
  return (
    <div className="container py-4">
      <h3 className="mb-4">Admin Wallet</h3>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Approved Balance</h6>
<h4 className="text-success">₹{approvedAmount}</h4>

          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Pending Requests</h6>
            <h4 className="text-warning">{pending}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 shadow-sm text-center">
            <h6>Approved</h6>
            <h4 className="text-primary">{approved}</h4>
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Client</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((r) => (
            <tr key={r.requestId}>
              <td>{r.clientName}</td>
              <td>{r.email}</td>
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
              <td>
                {r.status === "Pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      className="me-2"
                      onClick={() => approve(r)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openReject(r)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="d-flex gap-2 mt-3">
          <Button
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>
          <span className="px-3 py-1 border rounded">
            Page {page} / {totalPages}
          </span>
          <Button
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* ===== REJECT MODAL ===== */}
      <Modal show={rejectModal} onHide={() => setRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reject Recharge</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            placeholder="Admin remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRejectModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={reject}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Balance;
