import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">
     
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "profile" && "active"}`} onClick={() => setActiveTab("profile")}>
            Profile
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "password" && "active"}`} onClick={() => navigate("/change-password")}>
            Change Password
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "theme" && "active"}`} onClick={() => setActiveTab("theme")}>
            Theme
          </button>
        </li>
      </ul>

      {/* TAB BODY */}
      {activeTab === "profile" && (
        <div>
          <h5>Profile Settings</h5>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" placeholder="Enter name" />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Enter email" />
          </div>
          <button className="btn btn-primary">Update Profile</button>
        </div>
      )}

      {activeTab === "password" && (
        <div>
          <h5>Change Password</h5>
          <div className="mb-3">
            <label>Old Password</label>
            <input type="password" className="form-control" placeholder="Enter old password" />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input type="password" className="form-control" placeholder="Enter new password" />
          </div>
          <button className="btn btn-warning">Change Password</button>
        </div>
      )}

      {activeTab === "theme" && (
        <div>
          <h5>Theme</h5>
          <p>Select App Appearance Mode</p>

          <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Dark / Light Mode
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
