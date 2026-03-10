import React from "react"; 
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";

/* Redux */
import { useDispatch, useSelector } from "react-redux";

import { initAuth } from "./features/auth/authSlice";

/* Layout Components */
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Protected from "./components/ProtectedRoute";

/* Context Providers (ONLY non-migrated modules) */
import { VendorApiKeysProvider } from "./context/VendorApiKeysContext";
import { BalanceProvider } from "./context/BalanceContext";

/* Admin Pages */
import Dashboard from "./pages/admin/Dashboard";
import VendorApiKeys from "./pages/admin/VendorApiKeys";
import Users from "./pages/admin/Users";
// import ApiManagement from "./pages/admin/ApiManagement";
import Pricing from "./pages/admin/Pricing";
import Balance from "./pages/admin/Balance";
import ClientPortal from "./pages/admin/ClientPortal";
import Settings from "./pages/admin/Settings";
import CreateProduct from "./pages/admin/CreateProduct";
import AppManagement from "./pages/admin/AppManagement";
/* Manager Pages */
import ManagerDashboard from "./pages/manager/ManagerDashboard";

/* Client Pages */
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProfile from "./pages/client/ClientProfile";
import ClientAPIs from "./pages/client/ClientAPIs";
// import ClientUsage from "./pages/client/ClientUsage";
import ClientApps from "./pages/client/ClientApps";
import ClientProducts from "./pages/client/ClientProducts";
import ClientWallet from "./pages/client/ClientWallet";
import ClientReports from "./pages/client/ClientReports";
import TrialCenter from "./pages/client/TrialCenter";
import ClientAppDetails from "./pages/client/ClientAppDetails";

import DocumentationPage from "./pages/client/documentation/DocumentationPage";


/* Auth Pages */
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import OtpVerify from "./pages/auth/OtpVerify";
import EmailVerify from "./pages/auth/EmailVerify";

/* ================= AUTH INIT FIX ================= */

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loadingUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initAuth());   // Always check backend auth
  }, [dispatch]);

  if (loadingUser) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return children;
};
/* ================= Layout ================= */

const Layout = () => {
  const location = useLocation();
  // 🔥 DOCS PAGE DETECTION
  const isDocsPage = location.pathname.startsWith("/documentation");

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/vendor": "Vendor & API Key Management",
    "/user-management": "Users & Manager Management",
   
    "/admin/apps": "App Management",
    "/pricing": "Pricing Management",
    "/balance": "Balance Management",
    "/client-portal": "Client Portal Access",
    "/settings": "Settings",
    "/change-password": "Change Password",
    "/create-product": "Create Product",

    "/dashboard": "Dashboard",
"/apis": "My APIs",

"/apps": "My Apps",
"/products": "Products",
"/wallet": "Wallet Balance",
"/reports": "Reports",
"/trial-center": "Trial Center",
"/profile": "My Profile",
"/documentation": "Documentation",
    
  };

 let currentTitle = pageTitles[location.pathname] || "Admin Panel";

// Client Apps → Details page
if (location.pathname.startsWith("/apps/") && location.pathname !== "/apps") {
  currentTitle = "App details";
}

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);


  
  return (
    <div className="d-flex">
      
      {/* 🔹 Hide main sidebar on Docs page */}
      {!isDocsPage && <Sidebar />}

      <div
        className={`flex-grow-1  ${
          isDocsPage ? "w-100" : "main-content"
        }`}
        style={{ minHeight: "100vh" }}
      >
        {!isDocsPage && <Navbar pageTitle={currentTitle} />}


        <div className={isDocsPage ? "p-0 m-0" : "p-4"}>
          <Routes>
            {/* Admin */}
            <Route path="/admin/dashboard" element={<Protected allowedRoles={["admin"]}><Dashboard /></Protected>} />
            <Route path="/vendor" element={<Protected allowedRoles={["admin"]}><VendorApiKeys /></Protected>} />
            <Route path="/user-management" element={<Protected allowedRoles={["admin"]}><Users /></Protected>} />
            
            <Route path="/admin/apps" element={<Protected allowedRoles={["admin"]}><AppManagement /></Protected>} />
            <Route path="/pricing" element={<Protected allowedRoles={["admin"]}><Pricing /></Protected>} />
            <Route path="/balance" element={<Protected allowedRoles={["admin"]}><Balance /></Protected>} />
            <Route path="/client-portal" element={<Protected allowedRoles={["admin"]}><ClientPortal /></Protected>} />
            <Route path="/settings" element={<Protected allowedRoles={["admin"]}><Settings /></Protected>} />
            <Route path="/create-product" element={<Protected allowedRoles={["admin"]}><CreateProduct /></Protected>} />

            {/* Manager */}
            <Route
              path="/manager/dashboard"
              element={
                <Protected allowedRoles={["MANAGER"]}>
                  <ManagerDashboard />
                </Protected>
              }
            />

            {/* Shared */}
            <Route
              path="/change-password"
              element={<Protected allowedRoles={["admin", "client"]}><ChangePassword /></Protected>}
            />

            {/* Client */}
            <Route path="/dashboard" element={<Protected allowedRoles={["client"]}><ClientDashboard /></Protected>} />
<Route path="/apis" element={<Protected allowedRoles={["client"]}><ClientAPIs /></Protected>} />

<Route path="/apps" element={<Protected allowedRoles={["client"]}><ClientApps /></Protected>} />
<Route path="/products" element={<Protected allowedRoles={["client"]}><ClientProducts /></Protected>} />
<Route path="/wallet" element={<Protected allowedRoles={["client"]}><ClientWallet /></Protected>} />
<Route path="/reports" element={<Protected allowedRoles={["client"]}><ClientReports /></Protected>} />
<Route path="/trial-center" element={<Protected allowedRoles={["client"]}><TrialCenter /></Protected>} />
<Route path="/profile" element={<Protected allowedRoles={["client"]}><ClientProfile /></Protected>} />
<Route path="/apps/:id" element={<Protected allowedRoles={["client"]}><ClientAppDetails /></Protected>} />
<Route path="/documentation" element={<Protected allowedRoles={["client", "admin"]}><DocumentationPage /></Protected>} />
           
          </Routes>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN APP ================= */
const App = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // ✅ Only apply dark mode for admin
    if (user.role === "admin") {
      const savedTheme = localStorage.getItem("admin-theme") || "light";
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // ✅ Client always light
      document.documentElement.setAttribute("data-theme", "light");
    }

  }, [user]);
  
  return (
    <>
      {/* ✅ GLOBAL TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      
      <BrowserRouter>
        <AuthInitializer>
          <VendorApiKeysProvider>
            <BalanceProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public */}
                <Route path="/auth/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/forgotpassword" element={<ForgotPassword />} />
                <Route path="/auth/otp" element={<OtpVerify />} />
                <Route path="/verify-email/:token" element={<EmailVerify />} />

                {/* Protected */}
                <Route path="/*" element={<Layout />} />
              </Routes>
            </BalanceProvider>
          </VendorApiKeysProvider>
        </AuthInitializer>
      </BrowserRouter>
    </>
  );
};

export default App;

