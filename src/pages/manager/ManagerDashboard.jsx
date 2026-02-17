import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Card, Table, Badge } from "react-bootstrap";
import { toast } from "react-toastify";

const ManagerDashboard = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyClients = async () => {
    try {
      const res = await API.get("/manager/my-clients");
      setClients(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load assigned clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClients();
  }, []);

  return (
    <div className="container">
      <h4 className="mb-4">My Assigned Clients</h4>

      <Card className="shadow-sm">
        <Card.Body>
          {loading ? (
            <p>Loading...</p>
          ) : clients.length === 0 ? (
            <p className="text-muted">No clients assigned yet</p>
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c, i) => (
                  <tr key={c._id}>
                    <td>{i + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>
                      <Badge bg={c.isActive ? "success" : "secondary"}>
                        {c.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
