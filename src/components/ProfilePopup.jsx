// src/components/ProfilePopup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePopup = ({ email }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: "absolute",
      right: 0,
      top: "40px",
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: "6px",
      padding: "15px",
      width: "240px",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
      zIndex: 999
    }}>
      <p><b>User:</b> {email}</p>
      <hr/>
      <button
        style={{ width:"100%", padding:"8px", marginTop:5 }}
        onClick={() => navigate("/change-password")}
      >
        Change Password
      </button>
    </div>
  );
};

export default ProfilePopup;
