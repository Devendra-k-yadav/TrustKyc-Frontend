import React, { useEffect, useState } from "react";
import { Card, Form, Button, Row, Col, Spinner, Badge } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProfileThunk } from "../../features/auth/authSlice";

const ClientProfile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await dispatch(updateProfileThunk(formData));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Profile updated successfully");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-wrapper">
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5 className="mb-3">
            Profile Information{" "}
            {user?.isVerified ? (
  <Badge bg="success">Email Verified</Badge>
) : (
  <Badge bg="warning">Email Not Verified</Badge>
)}
          </h5>

          <Form onSubmit={handleProfileUpdate}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Col>

              <Col md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control value={user?.email} disabled />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                />
              </Col>
            </Row>

            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔐 SECURITY */}
      <Card className="mt-4 shadow-sm border-0">
        <Card.Body>
          <h5>Security</h5>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Control type="password" placeholder="Current Password" />
              </Col>
              <Col md={4}>
                <Form.Control type="password" placeholder="New Password" />
              </Col>
              <Col md={4}>
                <Button variant="outline-danger">Update Password</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClientProfile;