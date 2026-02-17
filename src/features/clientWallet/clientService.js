import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

/* ================= AUTH HEADER ================= */
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* ================= GET WALLET ================= */
const getClientWallet = async (token) => {
  const res = await API.get("/client/wallet", authHeader(token));
  return res.data;
};

/* ================= INSTANT RECHARGE ================= */
const rechargeWallet = async ({ amount, method, token }) => {
  const res = await API.post(
    "/client/wallet/recharge",
    { amount, method },
    authHeader(token)
  );
  return res.data;
};

/* ================= RECHARGE REQUEST ================= */
const requestRecharge = async ({ amount, method, token }) => {
  const res = await API.post(
    "/client/wallet/recharge-request",
    { amount, method },
    authHeader(token)
  );
  return res.data;
};

/* ================= PAY VENDOR ================= */
const payVendor = async ({ vendor, amount, token }) => {
  const res = await API.post(
    "/client/wallet/pay-vendor",
    { vendor, amount },
    authHeader(token)
  );
  return res.data;
};

export default {
  getClientWallet,
  rechargeWallet,
  requestRecharge,
  payVendor,
};
