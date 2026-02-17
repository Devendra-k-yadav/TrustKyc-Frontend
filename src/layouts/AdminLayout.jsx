const AdminLayout = () => {
  const location = useLocation();

  const titles = {
    "/": "Admin Dashboard",
    "/vendor": "Vendor & API Key Management",
    "/user-management": "Users & Manager Management",
    "/api-management": "API Management",
    "/pricing": "Pricing Management",
    "/balance": "Balance Management",
    "/client-portal": "Client Portal Access",
    "/settings": "Settings",
  };

  const title = titles[location.pathname] || "Admin Panel";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        <Navbar pageTitle={title} />

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Protected allowedRoles={["admin"]}><Dashboard /></Protected>} />
            <Route path="/vendor" element={<Protected allowedRoles={["admin"]}><VendorApiKeys /></Protected>} />
            <Route path="/user-management" element={<Protected allowedRoles={["admin"]}><Users /></Protected>} />
            <Route path="/api-management" element={<Protected allowedRoles={["admin"]}><ApiManagement /></Protected>} />
            <Route path="/pricing" element={<Protected allowedRoles={["admin"]}><Pricing /></Protected>} />
            <Route path="/balance" element={<Protected allowedRoles={["admin"]}><Balance /></Protected>} />
            <Route path="/client-portal" element={<Protected allowedRoles={["admin"]}><ClientPortal /></Protected>} />
            <Route path="/settings" element={<Protected allowedRoles={["admin"]}><Settings /></Protected>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
