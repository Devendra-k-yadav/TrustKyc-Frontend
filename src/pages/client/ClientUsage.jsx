import React, { useEffect, useState } from "react";
import { Table, Card, Form, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { refreshClientUsage } from "../../features/client/clientSlice";

export default function ClientUsage() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);
  const { usage, loading } = useSelector((state) => state.client);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (accessToken) {
      dispatch(refreshClientUsage(accessToken));
    }
  }, [accessToken, dispatch]);

  const filtered = usage.filter((u) =>
  (u.api_name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);


  return (
    <div className="container py-4" style={{ marginTop: "40px" }}>
      <Form.Control
        className="mb-3"
        placeholder="Search API..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Card>
        <Table hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>API</th>
              <th>Total Calls</th>
              <th>Last Used</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((u, i) => (
                <tr key={u.api_id}>
                  <td>{i + 1}</td>
                  <td>{u.api_name}</td>
                  <td>{u.total_calls}</td>
                  <td>{u.last_used || "-"}</td>
                  <td>
                    <Badge bg={u.status === "active" ? "success" : "danger"}>
                      {u.status}
                    </Badge>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">
                  No usage found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
