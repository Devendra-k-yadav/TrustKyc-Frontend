import { createContext, useContext, useState, useEffect } from "react";

const VendorApiKeysContext = createContext();

export const VendorApiKeysProvider = ({ children }) => {
  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem("vendors");
    return saved ? JSON.parse(saved) : [];
  });

  // persist + notify clients
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
    // 🔹 Fire custom event whenever vendors update
    window.dispatchEvent(new Event("vendorsUpdated"));
  }, [vendors]);

  // ---------- Vendors CRUD ----------
  const addVendor = (vendorObj) => {
    setVendors((prev) => [
      { id: Date.now(), keys: [], ...vendorObj },
      ...prev,
    ]);
  };

  const updateVendor = (id, updatedObj) => {
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updatedObj } : v))
    );
  };

  const deleteVendor = (id) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  // ---------- Keys CRUD inside vendor ----------
  const addApi = (vendorId, keyObj) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              keys: [{ id: Date.now(), ...keyObj }, ...(v.keys || [])],
            }
          : v
      )
    );
  };

  const updateApi = (vendorId, keyId, updatedObj) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? {
              ...v,
              keys: v.keys.map((k) =>
                k.id === keyId ? { ...k, ...updatedObj } : k
              ),
            }
          : v
      )
    );
  };

  const deleteApi = (vendorId, keyId) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId
          ? { ...v, keys: v.keys.filter((k) => k.id !== keyId) }
          : v
      )
    );
  };

  return (
    <VendorApiKeysContext.Provider
      value={{
        vendors,
        addVendor,
        updateVendor,
        deleteVendor,
        addApi,
        updateApi,
        deleteApi,
      }}
    >
      {children}
    </VendorApiKeysContext.Provider>
  );
};

export const useVendorApiKeys = () => useContext(VendorApiKeysContext);
