import React, { useState } from "react";
import { Form, Button, Card, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { registerUser } from "../../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    const res = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "CLIENT",
      })
    );

    setLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(
        "Registration successful 🎉 Please verify your email before login"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Register</h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </Form.Group>

            <Button type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? <Spinner size="sm" /> : "Register"}
            </Button>

            <Link to="/login" className="d-block text-center mt-3">
              Already have an account?
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;