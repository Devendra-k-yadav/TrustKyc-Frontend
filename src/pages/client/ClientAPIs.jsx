import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  ProgressBar,
  Form,
  InputGroup,
  Modal,
  Spinner,
} from "react-bootstrap";
import { Search, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientSubscribedProducts,
  executeProductThunk,
} from "../../features/products/productsSlice";
import { toast } from "react-toastify";

export default function ClientAPIs() {
  const dispatch = useDispatch();

  const { accessToken } = useSelector((state) => state.auth);

  const {
    list = [],
    loading,
    executing,
  } = useSelector((state) => state.products);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [executingId, setExecutingId] = useState(null);

  /* ================= FETCH PRODUCTS ================= */

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchClientSubscribedProducts());
    }
  }, [accessToken, dispatch]);

  /* ================= FILTER ================= */

  const filteredProducts = useMemo(() => {
    return list.filter((p) =>
      p.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [list, search]);

  /* ================= OPEN MODAL ================= */

  const openExecuteModal = (product) => {
    setSelectedProduct(product);
    setInputValue("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setInputValue("");
  };

  /* ================= EXECUTE API ================= */

  const handleExecute = async () => {
    if (!selectedProduct || !inputValue.trim()) {
      toast.error("Please enter a value");
      return;
    }

    try {
      setExecutingId(selectedProduct._id);

      const res = await dispatch(
        executeProductThunk({
          code: selectedProduct.code,
          payload: { value: inputValue },
        })
      ).unwrap();

      toast.success(
        `Charged ₹${res.charged} • Remaining ₹${res.remainingBalance}`
      );

      closeModal();

    } catch (err) {
      toast.error(err || "Execution failed");
    } finally {
      setExecutingId(null);
    }
  };

  /* ================= LOADING STATE ================= */

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading APIs...</p>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold">My APIs</h4>
      </div>

      {/* SEARCH */}
      <Row className="mb-4">
        <Col md={5}>
          <InputGroup>
            <InputGroup.Text>
              <Search size={16} />
            </InputGroup.Text>

            <Form.Control
              placeholder="Search APIs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {/* EMPTY STATE */}

      {filteredProducts.length === 0 && (
        <div className="text-center py-5 text-muted">
          No APIs assigned to your account
        </div>
      )}

      {/* API GRID */}

      <Row>
        {filteredProducts.map((product) => {

          const used = product.used || 0;
          const limit = product.limit || 0;

          const percent =
            limit > 0
              ? Math.min((used / limit) * 100, 100)
              : 0;

          const price =
            product.pricing?.finalPrice ?? 0;

          const isExecuting =
            executingId === product._id;

          return (
            <Col
              key={product._id}
              xl={3}
              lg={4}
              md={6}
              sm={12}
            >
              <Card className="mb-4 shadow-sm border-0">

                <Card.Body>

                  {/* TITLE */}
                  <Card.Title className="fw-semibold">
                    {product.name}
                  </Card.Title>

                  {/* STATUS */}
                  <Badge bg="success">
                    Active
                  </Badge>

                  {/* PRICE */}

                  <div className="mt-3">
                    <small className="text-muted">
                      Price
                    </small>

                    <div className="fw-semibold">
                      ₹{price}
                    </div>
                  </div>

                  {/* USAGE */}

                  <div className="mt-3">

                    <div className="d-flex justify-content-between small">
                      <span>Usage</span>
                      <span>
                        {used} / {limit}
                      </span>
                    </div>

                    <ProgressBar
                      now={percent}
                      className="mt-1"
                    />

                  </div>

                  {/* BUTTON */}

                  <Button
                    className="w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                    disabled={executing || isExecuting}
                    onClick={() =>
                      openExecuteModal(product)
                    }
                  >
                    {isExecuting ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                        />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Execute API
                      </>
                    )}
                  </Button>

                </Card.Body>

              </Card>
            </Col>
          );
        })}
      </Row>

      {/* MODAL */}

      <Modal
        show={showModal}
        onHide={closeModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Execute {selectedProduct?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form.Group>
            <Form.Label>
              Enter Value
            </Form.Label>

            <Form.Control
              value={inputValue}
              onChange={(e) =>
                setInputValue(e.target.value)
              }
              placeholder="Enter input value"
            />
          </Form.Group>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={closeModal}
          >
            Cancel
          </Button>

          <Button
            onClick={handleExecute}
            disabled={executing}
          >
            Execute
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}
