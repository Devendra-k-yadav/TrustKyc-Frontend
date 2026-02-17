import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const { accessToken } = useAuth();

  const [client, setClient] = useState({
    apis: [],
    usage: [],
  });

  const [loading, setLoading] = useState(false);

  const updateProfile = (data) => {
    setClient((prev) => ({ ...prev, ...data }));
  };

  // ================= FETCH CLIENT APIS =================
  const fetchClientApis = async () => {
    if (!accessToken) return;

    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/client/my-apis",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      updateProfile({
        apis: res.data.data.apis,
        usage: res.data.data.usage || [],
      });
    } catch {
      toast.error("Failed to fetch client APIs");
    } finally {
      setLoading(false);
    }
  };

  // ================= 🔥 MAIN FIX: FETCH USAGE =================
  const refreshUsage = async () => {
    if (!accessToken) return;

    try {
      const res = await axios.get(
        "http://localhost:5000/api/client/usage",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setClient((prev) => ({
        ...prev,
        usage: res.data.data || [],
      }));
    } catch {
      toast.error("Failed to refresh usage");
    }
  };

  useEffect(() => {
    fetchClientApis();
    refreshUsage(); // 🔥 ensure usage loads on login
  }, [accessToken]);

  return (
    <ClientContext.Provider
      value={{
        client,
        loading,
        updateProfile,
        fetchClientApis,
        refreshUsage, 
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
