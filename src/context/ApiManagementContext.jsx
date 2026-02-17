import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ApiManagementContext = createContext();

export const ApiManagementProvider = ({ children }) => {
  // ✅ Redux Auth (FIX)
  const { accessToken, user } = useSelector((state) => state.auth);

  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/api",
  });

  // ===============================
  // FETCH ALL APIS (ADMIN ONLY)
  // ===============================
  const fetchApis = async () => {
    try {
      if (!accessToken) return;

      // ✅ BLOCK CLIENT ACCESS
      if (user?.role !== "ADMIN") return;

      setLoading(true);

      const res = await api.get("/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setApis(
        res.data.data.map((a) => ({
          id: a._id,
          name: a.name,
          endpoint: a.endpoint,
          price: a.base_price,
          vendor: a.vendor || "N/A",
          status: a.status || "Active",
        }))
      );
    } catch (err) {
      toast.error("Failed to load APIs");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // ADD API
  // ===============================
  const addApi = async (form) => {
    try {
      const payload = {
        name: form.name,
        endpoint: form.endpoint,
        base_price: form.price,
      };

      const res = await api.post("/add", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("API Added");

      setApis((prev) => [
        ...prev,
        {
          id: res.data.data._id,
          name: res.data.data.name,
          endpoint: res.data.data.endpoint,
          price: res.data.data.base_price,
          vendor: form.vendor,
          status: form.status,
        },
      ]);
    } catch (err) {
      toast.error("Add API failed");
    }
  };

  // ===============================
  // UPDATE API
  // ===============================
  const updateApi = async (id, form) => {
    try {
      const payload = {
        name: form.name,
        endpoint: form.endpoint,
        base_price: form.price,
      };

      await api.put(`/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("API Updated");

      setApis((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...form } : a))
      );
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // ===============================
  // DELETE API
  // ===============================
  const deleteApi = async (id) => {
    try {
      await api.delete(`/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("API Deleted");
      setApis((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ===============================
  // ASSIGN API TO CLIENT
  // ===============================
  const assignApiToClient = async ({ clientId, apiId, env = "Test" }) => {
    try {
      if (!accessToken) {
        toast.error("Admin not authenticated");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/admin/client/assign-api",
        {
          client_id: clientId,
          api_id: apiId,
          env,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("API assigned to client successfully");
    } catch (err) {
      console.error("ASSIGN API ERROR:", err.response?.data || err.message);
      toast.error("Failed to assign API to client");
    }
  };

  useEffect(() => {
    if (accessToken && user?.role === "ADMIN") {
      fetchApis();
    }
  }, [accessToken, user]);

  return (
    <ApiManagementContext.Provider
      value={{
        apis,
        loading,
        addApi,
        updateApi,
        deleteApi,
        assignApiToClient,
      }}
    >
      {children}
    </ApiManagementContext.Provider>
  );
};

export const useApiManagement = () => useContext(ApiManagementContext);
