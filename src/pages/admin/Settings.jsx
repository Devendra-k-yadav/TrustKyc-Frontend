import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { selectUser } from "../../features/auth/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDark, setIsDark] = useState(false);

  /* ================= LOAD USER ================= */
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  /* ================= LOAD THEME STATE ONLY ================= */
useEffect(() => {
  const savedTheme = localStorage.getItem("admin-theme") || "light";
  setIsDark(savedTheme === "dark");
}, []);

/* ================= TOGGLE THEME ================= */
const handleThemeToggle = () => {
  const newTheme = isDark ? "light" : "dark";

  setIsDark(newTheme === "dark");
  localStorage.setItem("admin-theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);

  toast.success(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
};

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = () => {
    if (!name.trim()) return toast.error("Name is required");

    // If you have backend update API, call dispatch here
    // Example:
    // dispatch(updateProfileThunk({ name }))

    toast.success("Profile updated successfully");
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ================= TABS ================= */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
        </li>

        <li className="nav-item">
          <button
            className="nav-link"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "theme" ? "active" : ""}`}
            onClick={() => setActiveTab("theme")}
          >
            Theme
          </button>
        </li>
      </ul>

      {/* ================= PROFILE TAB ================= */}
      {activeTab === "profile" && (
        <div>
          <h5>Profile Settings</h5>

          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
            />
          </div>

          <button className="btn btn-primary" onClick={handleUpdateProfile}>
            Update Profile
          </button>
        </div>
      )}

      {/* ================= THEME TAB ================= */}
      {activeTab === "theme" && (
        <div>
          <h5>Theme</h5>
          <p>Select App Appearance Mode</p>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={isDark}
              onChange={handleThemeToggle}
              id="themeSwitch"
            />
            <label className="form-check-label" htmlFor="themeSwitch">
              Dark / Light Mode
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;