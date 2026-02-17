import React, { createContext, useContext, useState, useEffect } from "react";
import API, { attachAccessToken } from "../api/axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // ================================
  // INIT AUTH (REFRESH + /ME)
  // ================================
  useEffect(() => {
    const init = async () => {
      try {
        const r = await API.post("/auth/refresh-token");

        if (r.data?.success && r.data?.accessToken) {
          setAccessToken(r.data.accessToken);
          attachAccessToken(r.data.accessToken);

          const me = await API.get("/auth/me");
          setUser(me.data.user);
        }
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoadingUser(false);
      }
    };

    init();
  }, []);

  // ================================
  // REGISTER
  // ================================
  const register = async (email, password, role) => {
    try {
      const res = await API.post("/auth/register", {
        email,
        password,
        role,
        name: email.split("@")[0],
      });

      if (res.data?.accessToken) {
        setAccessToken(res.data.accessToken);
        attachAccessToken(res.data.accessToken);
      }

      toast.success(res.data.message || "Registered successfully.");
      return { success: true, data: res.data };
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return { success: false };
    }
  };

  // ================================
  // LOGIN
  // ================================
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      setAccessToken(res.data.accessToken);
      attachAccessToken(res.data.accessToken);
      setUser(res.data.user);

      return { success: true, role: res.data.user.role };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false };
    }
  };

  // ================================
  // SEND OTP
  // ================================
  const sendOtp = async (email) => {
    try {
      const res = await API.post("/auth/login/otp/send", { email });
      if (res.data?.success) toast.success(res.data.message);
      return res.data?.success || false;
    } catch {
      toast.error("OTP failed");
      return false;
    }
  };

  // ================================
  // VERIFY OTP
  // ================================
  const verifyOtp = async (email, otp) => {
  try {
    const res = await API.post("/auth/login/otp/verify", { email, otp });

    setAccessToken(res.data.accessToken);
    attachAccessToken(res.data.accessToken);
    setUser(res.data.user);

    toast.success("OTP verified");
    return res.data.user.role;
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid OTP");
    return null;
  }
};
  // ================================
  // LOGOUT
  // ================================
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    setUser(null);
    setAccessToken(null);
    attachAccessToken(null);
  };

  // ================================
  // PASSWORD + FORGOT
  // ================================
  const updatePassword = async (oldPassword, newPassword) => {
    try {
      await API.put("/auth/password/update", { oldPassword, newPassword });
      toast.success("Password updated");
      return true;
    } catch {
      toast.error("Update failed");
      return false;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await API.post("/auth/password/forgot", { email });
      toast.success("Reset link sent");
      return true;
    } catch {
      toast.error("Failed");
      return false;
    }
  };

  // ================================
  // FINAL STATE VALUES
  // ================================
  const isAuth = !!user;
  const role = user?.role?.toUpperCase() || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loadingUser,
        isAuth,
        role,
        register,
        login,
        sendOtp,
        verifyOtp,
        logout,
        updatePassword,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
