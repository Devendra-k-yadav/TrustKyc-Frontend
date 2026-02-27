import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CLIENT", // 🔥 default & hidden
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return alert("Password and confirm password do not match");
    }

    const res = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "CLIENT", // 🔒 force client role
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Register</h3>

          <Form onSubmit={handleSubmit}>
            {/* NAME */}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* EMAIL */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* CONFIRM PASSWORD */}
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* 🔒 ROLE NOT SHOWN IN UI */}

            <Link to="/login">Already have an account?</Link>

            <Button type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;