// src/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDocumentText } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk, selectUser, selectRole } from "../features/auth/authSlice";
import "../components/css/navbar.css";

const Navbar = ({ pageTitle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const [showProfile, setShowProfile] = useState(false);
  const popupRef = useRef(null);

  const panelTitle = role?.toUpperCase() === "CLIENT" ? "Client Panel" : "Admin Panel";

  const handleLogout = () => {
    dispatch(logoutThunk());
    navigate("/login");
  };

  //  Outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar navbar-fixed">

      <h3 className="topbar-title">{pageTitle || panelTitle}</h3>

      <div className="topbar-right">
        {/* 📘 Documentation Button */}
  <button
  onClick={() => {
    if (role === "admin") {
      navigate("/admin/documentation");
    } else {
      navigate("/documentation"); // client route
    }
  }}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginRight: 14,
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #e0e0e0",
    background: "#f9f9ff",
    color: "#1a1aa0ff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500
  }}
>
  <HiOutlineDocumentText size={18} />
  Documentation
</button>

  <span style={{ marginRight: 12, color: "#1a1aa0ff", fontWeight: 500 }}>
    {user?.email}
  </span>
        

        <div style={{ position: "relative" }} ref={popupRef}>
          <FaUserCircle
            className="user-icon"
            style={{ cursor: "pointer", fontSize: 28 }}
            onClick={() => setShowProfile(!showProfile)}
          />

          {showProfile && (
            <div className="profile-popup">
              <p style={{ margin: 0, fontWeight: "bold" }}>
                {user?.name}
              </p>
              <p style={{ margin: "4px 0", fontSize: 13 }}>
                {user?.email}
              </p>

              <hr />

              {/* Change Password */}
              <button
                className="profile-btn"
                onClick={() => {
                  setShowProfile(false);
                  navigate("/change-password");
                }}
              >
                Change Password
              </button>

              {/* Logout */}
              <button
                className="profile-btn logout"
                onClick={() => {
                  setShowProfile(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
