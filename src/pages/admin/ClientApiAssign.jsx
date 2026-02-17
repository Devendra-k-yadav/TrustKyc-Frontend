import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Badge,
} from "react-bootstrap";
import { Search, PlusCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";
import { useApiManagement } from "../../context/ApiManagementContext";

const ClientApiAssign = () => {
  const { accessToken } = useAuth();
  const {
    apis,
    assignApiToClient,
    getClientAssignedApis,
    toggleClientApiStatus,
    deleteClientAssignedApi,
  } = useApiManagement();

  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [env, setEnv] = useState("TEST");
  const [loading, setLoading] = useState(false);
  const [assignedApis, setAssignedApis] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);

  // ================= FETCH CLIENTS =================
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/client/clients", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setClients(data.data || []);
    } catch (err) {
      toast.error("Failed to load clients");
    }
  };

  // ================= FETCH CLIENT ASSIGNED APIS =================
  const fetchAssignedApis = async (clientId) => {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await getClientAssignedApis(clientId);
      setAssignedApis(data);
    } catch (err) {
      toast.error("Failed to load assigned APIs");
    } finally {
      setLoading(false);
    }
  };

  // ================= ASSIGN API =================
  const handleAssignApi = async (apiId) => {
    if (!selectedClient) {
      toast.warning("Please select a client first");
      return;
    }

    try {
      setAssignLoading(true);
      await assignApiToClient({ clientId: selectedClient, apiId, env });
      toast.success("API assigned successfully");
      fetchAssignedApis(selectedClient);
    } catch (err) {
      toast.error("Failed to assign API");
    } finally {
      setAssignLoading(false);
    }
  };

  // ================= TOGGLE STATUS =================
  const handleToggleStatus = async (row) => {
    try {
      const newStatus = row.status === "Active" ? "Inactive" : "Active";
      await toggleClientApiStatus(row.id, { status: newStatus });
      setAssignedApis((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // ================= UNASSIGN API =================
  const handleUnassign = async (id) => {
    if (!window.confirm("Unassign this API?")) return;
    try {
      await deleteClientAssignedApi(id);
      setAssignedApis((prev) => prev.filter((r) => r.id !== id));
      toast.success("API unassigned successfully");
    } catch (err) {
      toast.error("Failed to unassign API");
    }
  };

  // ================= FILTERED API LIST =================
  const filteredApis = apis.filter((api) =>
    api.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (accessToken) fetchClients();
  }, [accessToken]);

  useEffect(() => {
    if (selectedClient) fetchAssignedApis(selectedClient);
  }, [selectedClient]);

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <h3 className="fw-bold mb-4 text-primary border-bottom pb-2">
        Assign API to Client
      </h3>

      {/* CLIENT + ENV + SEARCH */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </Form.Select>
        </Col>

        <Col md={2}>
          <Form.Select value={env} onChange={(e) => setEnv(e.target.value)}>
            <option value="TEST">TEST</option>
            <option value="LIVE">LIVE</option>
          </Form.Select>
        </Col>

        <Col md={6}>
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

      {/* API LIST */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>API Name</th>
                <th>Endpoint</th>
                <th>Price</th>
                <th>Status</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {filteredApis.length ? (
                filteredApis.map((api, i) => (
                  <tr key={api.id}>
                    <td>{i + 1}</td>
                    <td>{api.name}</td>
                    <td className="text-muted">{api.endpoint}</td>
                    <td>₹ {api.price}</td>
                    <td>
                      <Badge
                        bg={api.status === "Active" ? "success" : "secondary"}
                      >
                        {api.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        disabled={assignLoading}
                        onClick={() => handleAssignApi(api.id)}
                      >
                        <PlusCircle size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No APIs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* ASSIGNED API LIST */}
      <h4 className="mb-3">Client Assigned APIs</h4>
      {loading ? (
        <p>Loading assigned APIs...</p>
      ) : assignedApis.length ? (
        <Table bordered>
          <thead>
            <tr>
              <th>API Name</th>
              <th>Env</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignedApis.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.env}</td>
                <td>
                  <Badge
                    bg={row.status === "Active" ? "success" : "danger"}
                  >
                    {row.status}
                  </Badge>
                </td>
                <td>
                  <Button
                    className="btn-sm btn-warning me-2"
                    onClick={() => handleToggleStatus(row)}
                  >
                    Toggle
                  </Button>
                  <Button
                    className="btn-sm btn-danger"
                    onClick={() => handleUnassign(row.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No APIs assigned to this client.</p>
      )}
    </div>
  );
};

export default ClientApiAssign;
