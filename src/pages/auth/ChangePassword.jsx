import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePasswordThunk } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error("Passwords do not match");
      return;
    }

    const res = await dispatch(
      updatePasswordThunk({
        oldPassword: oldPass,
        newPassword: newPass,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Password updated successfully");
      navigate("/");
    } else {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="p-4 shadow-sm" style={{ width: "400px" }}>
        <Card.Body>
          <h3 className="mb-4 text-center">Change Password</h3>

          <Form onSubmit={handleChange}>
            <Form.Group className="mb-3">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter old password"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
