import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";

const EmailVerify = () => {
  const { token } = useParams();  // url token capture
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await API.get(`/auth/verify-email/${token}`);
        setStatus("Email verified successfully! Redirecting...");
        toast.success(res.data.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        setStatus("Verification failed or link expired.");
        toast.error(err.response?.data?.message || "Verification failed");
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <h3>{status}</h3>
    </div>
  );
};

export default EmailVerify;
