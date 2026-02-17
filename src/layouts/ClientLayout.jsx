const ClientLayout = () => {
  const location = useLocation();

  const titles = {
    "/client/dashboard": "Client Dashboard",
    "/client/apis": "My APIs",
    "/client/usage": "API Usage",
    "/client/wallet": "Wallet Balance",
    "/client/profile": "My Profile",
  };

  const title = titles[location.pathname] || "Client Panel";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="d-flex">
      <Sidebar /> {/* (Optional) Client Sidebar अलग बनाना हो तो बदल देना */}
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        <Navbar pageTitle={title} />

        <div className="p-4">
          <Routes>
            <Route path="/client/dashboard" element={<Protected allowedRoles={["client"]}><ClientDashboard /></Protected>} />
            <Route path="/client/apis" element={<Protected allowedRoles={["client"]}><ClientAPIs /></Protected>} />
            <Route path="/client/usage" element={<Protected allowedRoles={["client"]}><ClientUsage /></Protected>} />
            <Route path="/client/wallet" element={<Protected allowedRoles={["client"]}><ClientWallet /></Protected>} />
            <Route path="/client/profile" element={<Protected allowedRoles={["client"]}><ClientProfile /></Protected>} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ClientLayout;
