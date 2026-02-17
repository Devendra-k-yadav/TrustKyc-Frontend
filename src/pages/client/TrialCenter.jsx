import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchTrialProducts,
  runRestrictedTrial,
  runPublicTrial,
} from "../../features/trialCenter/trialCenterSlice";

const TrialCenter = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.trialCenter);

  const [selected, setSelected] = useState(null);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [agreed, setAgreed] = useState(false);

  // ✅ NEW STATES (ADDED ONLY)
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [cardType, setCardType] = useState("");

  useEffect(() => {
    dispatch(fetchTrialProducts());
  }, [dispatch]);

  const navigate = useNavigate();


  // ================= SUBMIT =================
  const submit = async () => {
    if (!selected) return;

    // ================= OCR CASE =================
    if (selected.code === "OCR_EXTRACT") {
      if (!frontImage) {
        toast.error("Front image is required");
        return;
      }

      if (!cardType) {
        toast.error("Please select card type");
        return;
      }

      const needsBack = ["AADHAAR", "PASSPORT", "VOTER_ID"].includes(cardType);
      if (needsBack && !backImage) {
        toast.error("Back image is mandatory for selected card type");
        return;
      }

      const formData = new FormData();
      formData.append("trialId", selected._id);
      formData.append("cardType", cardType);
      formData.append("front", frontImage);
      if (backImage) formData.append("back", backImage);

      try {
        setLoading(true);
        const res = await dispatch(runPublicTrial(formData)).unwrap();
        setResult(res.result || res);
        toast.success("OCR completed successfully");
        dispatch(fetchTrialProducts());
      } catch (e) {
        console.error(e);
        toast.error(e.message || "OCR failed");
      } finally {
        setLoading(false);
      }
      return;
    }

    // ================= NORMAL API CASE =================
    if (!agreed) {
      toast.error("Please confirm and agree before running verification");
      return;
    }

    try {
      setLoading(true);

      let payload = {};
      switch (selected.code) {
        case "IFSC_VERIFY":
          payload = { ifsc: value };
          break;
        case "EMAIL_VERIFY":
          payload = { email: value };
          break;
        case "PHONE_VERIFY":
          payload = { phone: value };
          break;
        case "ADDRESS_VERIFY":
          payload = { address: value };
          break;
        default:
          payload = { value };
      }

      const action =
        selected.type === "public"
          ? runPublicTrial
          : runRestrictedTrial;

      const res = await dispatch(
        action({ trialId: selected._id, payload })
      ).unwrap();

      setResult(res.result || res);
      toast.success("Verification successful");
      dispatch(fetchTrialProducts());
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const closeForm = () => {
    setSelected(null);
    setValue(null);
    setResult(null);
    setAgreed(false);
    setFrontImage(null);
    setBackImage(null);
    setCardType("");
  };

  // ================= RESULT RENDER =================
  const renderPublicResult = () => {
    if (!result) return null;

    switch (selected.code) {
      case "IFSC_VERIFY":
        return (
          <div>
            <h5>{result.BANK}</h5>
            <p>
              <strong>Branch:</strong> {result.BRANCH}<br />
              <strong>IFSC:</strong> {result.IFSC}<br />
              <strong>MICR:</strong> {result.MICR}<br />
              <strong>Address:</strong> {result.ADDRESS}<br />
              <strong>City:</strong> {result.CITY}, {result.STATE}
            </p>
          </div>
        );

      case "EMAIL_VERIFY":
        return (
          <p>
            <strong>Email:</strong> {result.email}<br />
            <strong>Valid:</strong> {result.validFormat ? "Yes" : "No"}<br />
            <strong>Disposable:</strong> {result.disposable ? "Yes" : "No"}
          </p>
        );

      case "PHONE_VERIFY":
        return (
          <p>
            <strong>Phone:</strong> {result.phone}<br />
            <strong>Valid:</strong> {result.valid ? "Yes" : "No"}<br />
            <strong>Country:</strong> {result.country}
          </p>
        );

      case "ADDRESS_VERIFY":
        return Array.isArray(result) && result.length ? (
          <ul>
            {result.map((r, i) => (
              <li key={i}>{r.display_name}</li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        );

      case "OCR_EXTRACT":
        if (!result.extracted) return <p>No text extracted</p>;
        return (
          <div>
            {Object.entries(result.extracted).map(([key, val]) => (
              <p key={key}>
                <strong>{key}:</strong> {val || "N/A"}
              </p>
            ))}
          </div>
        );

      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Available Products for Trial</h3>

      <Row style={{ filter: selected ? "blur(5px)" : "none" }}>
        <Col lg={9}>
          <Row>
            {products.map((p) => (
              <Col md={6} key={p._id} className="mb-3">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column">
                    <h5>{p.name}</h5>
                    <p className="text-muted flex-grow-1">{p.description}</p>
                    <div className="d-flex justify-content-between">
                      <strong>Credits: {p.creditsLeft ?? 0}</strong>

                      <Button onClick={() => setSelected(p)}>
                        Run Trial
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {/* ================= BROWSE PRODUCTS BOX ================= */}
<Row className="mt-4">
  <Col lg={5} md={6}>
    <Card
      onClick={() => navigate("/client/products")}
      style={{
        cursor: "pointer",
        height: "180px",
        textAlign: "center",
        border: "2px dashed transparent",
        background:
          "linear-gradient(#fff, #fff) padding-box, linear-gradient(90deg, #0d6efd, #20c997) border-box",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 12px 30px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <Card.Body
        className="d-flex flex-column justify-content-center align-items-center h-100"
      >
        {/* 🔹 ICON */}
        <div
          style={{
            fontSize: "34px",
            lineHeight: 1,
            marginBottom: "8px",
          }}
        >
          🧩
        </div>

        {/* 🔹 GRADIENT DASHED HEADING */}
        <h4
          style={{
            fontWeight: 600,
            background: "linear-gradient(90deg, #0d6efd, #20c997)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            borderBottom: "2px dashed #0d6efd",
            paddingBottom: "6px",
            marginBottom: "6px",
            display: "inline-block",
          }}
        >
          Browse Products
        </h4>

        <p
          style={{
            color: "#6c757d",
            marginBottom: 0,
            fontSize: "14px",
          }}
        >
          Explore all available products
        </p>
      </Card.Body>
    </Card>
  </Col>
</Row>


      {selected && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <Card style={{ width: 520 }}>
            <Card.Body>
              <Button className="float-end" onClick={closeForm}>✕</Button>
              <h4>{selected.name}</h4>

              <Form>
                {selected.code === "OCR_EXTRACT" ? (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Front side</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setFrontImage(e.target.files[0])}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Back side</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setBackImage(e.target.files[0])}
                      />
                      <small className="text-danger">
                        ** Only for passport, Aadhaar & Voter ID
                      </small>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Card Type</Form.Label>
                      <Form.Select
                        value={cardType}
                        onChange={(e) => setCardType(e.target.value)}
                      >
                        <option value="">Select Card Type</option>
                        <option value="PAN">PAN</option>
                        <option value="AADHAAR">Aadhaar</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="VOTER_ID">Voter ID</option>
                      </Form.Select>
                    </Form.Group>
                  </>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Control
                      placeholder="Enter value"
                      value={value || ""}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </Form.Group>
                )}

                <Form.Check
                  label="I confirm and agree"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />

                <Button className="mt-3 w-100" onClick={submit} disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Run Verification"}
                </Button>
              </Form>

              {result && (
                <div className="mt-3 p-3 bg-light border rounded">
                  {renderPublicResult()}
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrialCenter;
