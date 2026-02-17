import React, { useState, useEffect } from "react";

import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaKey,
  FaUser,
  FaChartLine,
  FaWallet,
  FaCogs,
  FaUsers,
  FaCoins,
  FaServer,
  FaRupeeSign,
  FaUserShield,
  FaBoxOpen,
  FaChartBar,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux"; 
import "../components/css/sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // get role from Redux
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "ADMIN"; 

  // Title changes dynamically
  const title = role === "CLIENT" ? "Client Panel" : "Admin Panel";

  // Admin Menus
  const adminMenus = [
    { name: "Dashboard", path: "/", icon: <FaHome /> },
    { name: "Vendor & API Keys", path: "/vendor", icon: <FaKey /> },
    { name: "User & Manager", path: "/user-management", icon: <FaUsers /> },
    // { name: "API Management", path: "/api-management", icon: <FaServer /> },
    { name: "App Management", path: "/admin/apps", icon: <FaServer /> },
    { name: "Create Product", path: "/admin/create-product", icon: <FaBoxOpen /> },
    { name: "Pricing", path: "/pricing", icon: <FaCoins /> },
    { name: "Balance", path: "/balance", icon: <FaRupeeSign /> },
    { name: "Client Portal", path: "/client-portal", icon: <FaUserShield /> },
    { name: "Settings", path: "/settings", icon: <FaCogs /> },
  ];

  // Client Menus
  const clientMenus = [
    { name: "Dashboard", path: "/client/dashboard", icon: <FaHome /> },
    { name: "My APIs", path: "/client/apis", icon: <FaKey /> },
    // { name: "Usage", path: "/client/usage", icon: <FaChartLine /> },
    { name: "Apps", path: "/client/apps", icon: <FaServer /> },
    { name: "Products", path: "/client/products", icon: <FaBoxOpen /> },
    { name: "Wallet", path: "/client/wallet", icon: <FaWallet /> },
    { name: "Reports", path: "/client/reports", icon: <FaChartBar /> },
    { name: "Trial Center", path: "/client/trial-center", icon: <FaCoins /> },
    { name: "Profile", path: "/client/profile", icon: <FaUser /> },
  ];

  // Choose menus by role
  const menus = role === "CLIENT" ? clientMenus : adminMenus;

  useEffect(() => {
  if (collapsed) {
    document.body.classList.add("sidebar-collapsed");
  } else {
    document.body.classList.remove("sidebar-collapsed");
  }
}, [collapsed]);


  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* <div className="brand d-flex align-items-center justify-content-between">
        <span className="brand-text">{title}</span>
        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>
      </div> */}
      <div className="brand d-flex align-items-center justify-content-between">
  <img src="/assets/image4.png" alt="Logo" className="sidebar-logo" />
  <button
    className="collapse-btn"
    onClick={() => setCollapsed(!collapsed)}
  >
    {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
  </button>
</div>

      <ul className="sidebar-menu list-unstyled">
        {menus.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
