import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtpThunk } from "../../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function OtpVerify() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  /* 🔁 Redirect after login */
  useEffect(() => {
    if (user?.role === "ADMIN") navigate("/admin/dashboard", { replace: true });
    else if (user?.role === "CLIENT")
      navigate("/dashboard", { replace: true });
    else if (user?.role === "MANAGER")
      navigate("/manager/dashboard", { replace: true });
  }, [user, navigate]);

  const handleVerify = async () => {
    if (!otp || !email) {
      toast.error("OTP or Email missing");
      return;
    }

    const res = await dispatch(
      verifyOtpThunk({
        email,
        otp,
      })
    );

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("OTP verified successfully");
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="text-center mb-3">OTP Verification</h4>

        <input
          type="text"
          maxLength="6"
          className="form-control mb-3 text-center"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="btn btn-primary w-100" onClick={handleVerify}>
          Verify OTP
        </button>
      </div>
    </div>
  );
}
