import { useState } from "react";
import { useDispatch } from "react-redux";
import { forgotPasswordThunk } from "../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await dispatch(forgotPasswordThunk(email));

    if (res.meta.requestStatus === "fulfilled") {
      setMessage("Password reset link sent to your email!");
      toast.success("Reset link sent");
    } else {
      setMessage("Something went wrong");
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ background: "linear-gradient(135deg, #cfd9df, #e2ebf0)" }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 fw-bold text-primary">
          Forgot Password
        </h3>

        <p className="text-center text-muted mb-4">
          Enter your email to receive a reset link
        </p>

        {message && (
          <div
            className={`alert ${
              message.includes("sent")
                ? "alert-success"
                : "alert-danger"
            } text-center`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3 position-relative">
            <FaEnvelope
              className="position-absolute"
              style={{ top: "12px", left: "12px", color: "#888" }}
            />
            <input
              type="email"
              placeholder="Enter email"
              className="form-control ps-5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary w-100 py-2 fw-semibold"
            type="submit"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-3">
          {/* ✅ FIXED ROUTE */}
          <Link to="/login" className="text-decoration-none text-secondary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
