import API from "../../api/axios";

/* ================= AUTH SERVICES ================= */

export const refreshToken = async () => {
  const res = await API.post("/auth/refresh-token");
  return res.data;
};



export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const sendOtp = async (email) => {
  const res = await API.post("/auth/login/otp/send", { email });
  return res.data;
};

export const verifyOtp = async (data) => {
  const res = await API.post("/auth/login/otp/verify", data);
  return res.data;
};

export const updatePassword = async (data) => {
  const res = await API.put("/auth/password/update", data);
  return res.data;
};

export const forgotPassword = async (email) => {
  const res = await API.post("/auth/password/forgot", { email });
  return res.data;
};

export const logout = async () => {
  await API.post("/auth/logout");
};
