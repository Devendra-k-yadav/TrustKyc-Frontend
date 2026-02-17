import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, sendOtpThunk } from "../../features/auth/authSlice";
import { updateProfile } from "../../features/client/clientSlice"; // ✅ Redux action
import { toast } from "react-toastify";

import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  /* ================= REDIRECT AFTER LOGIN ================= */
  useEffect(() => {
    if (user?.role === "ADMIN") {
      navigate("/", { replace: true });
    } else if (user?.role === "CLIENT") {
      navigate("/client/dashboard", { replace: true });
    } else if (user?.role === "MANAGER") {
      navigate("/manager/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ================= PASSWORD LOGIN ================= */
  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    const res = await dispatch(loginUser({ email, password }));

    if (res.meta.requestStatus !== "fulfilled") {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Login successful");

    if (res.payload?.user?.role === "CLIENT") {
      dispatch(
        updateProfile({
          accessToken: res.payload.accessToken,
        })
      );
    }
  };

  /* ================= OTP SEND ================= */
  const handleOtpSend = async () => {
    if (!otpEmail) {
      toast.error("Enter email");
      return;
    }

    const res = await dispatch(sendOtpThunk(otpEmail));

    if (res.meta.requestStatus === "fulfilled") {
      navigate("/auth/otp", {
        replace: true,
        state: { email: otpEmail },
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "420px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3 fw-bold text-primary">
          Welcome Back
        </h3>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "password" ? "active" : ""
              }`}
              onClick={() => setActiveTab("password")}
              type="button"
            >
              Password Login
            </button>
          </li>

          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "otp" ? "active" : ""}`}
              onClick={() => setActiveTab("otp")}
              type="button"
            >
              OTP Login
            </button>
          </li>
        </ul>

        {activeTab === "password" && (
          <form onSubmit={handlePasswordLogin}>
            <div className="mb-3 position-relative">
              <FaUser
                className="position-absolute"
                style={{ top: 12, left: 12 }}
              />
              <input
                type="email"
                className="form-control ps-5"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <FaLock
                className="position-absolute"
                style={{ top: 12, left: 12 }}
              />
              <input
                type="password"
                className="form-control ps-5"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="btn btn-primary w-100 py-2 fw-semibold"
              type="submit"
            >
              Login
            </button>

            <div className="d-flex justify-content-between mt-3">
              <Link to="/auth/forgotpassword">Forgot Password?</Link>
              <Link to="/auth/register">Register</Link>
            </div>
          </form>
        )}

        {activeTab === "otp" && (
          <div>
            <div className="mb-3 position-relative">
              <FaEnvelope
                className="position-absolute"
                style={{ top: 12, left: 12 }}
              />
              <input
                type="email"
                className="form-control ps-5"
                placeholder="Enter your email"
                value={otpEmail}
                onChange={(e) => setOtpEmail(e.target.value)}
              />
            </div>

            <button
              className="btn btn-success w-100 py-2 fw-semibold"
              onClick={handleOtpSend}
            >
              Send OTP
            </button>

            <div className="text-center mt-3">
              <Link to="/auth/register">New user? Register</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
