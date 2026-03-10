// src/features/client/clientService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// ---------- AUTH HEADER ----------
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});



/* ================= WALLET ================= */

// GET WALLET
const fetchWallet = async (token) => {
  const res = await axios.get(`${API_URL}/client/wallet`, authHeader(token));

  // backend response: { success, wallet, vendors }
  return {
    wallet: res.data.wallet,
    vendors: res.data.vendors || [],
  };
};

// INSTANT RECHARGE
const rechargeWallet = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/client/wallet/recharge`,
    payload,
    authHeader(token)
  );
  return res.data;
};

// RECHARGE REQUEST (FIXED ROUTE)
const requestRecharge = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/client/wallet/recharge-request`,
    payload,
    authHeader(token)
  );
  return res.data;
};

// PAY VENDOR
const payVendor = async (payload, token) => {
  const res = await axios.post(
    `${API_URL}/client/wallet/pay-vendor`,
    payload,
    authHeader(token)
  );
  return res.data;
};

export default {
  
  fetchWallet,
  rechargeWallet,
  requestRecharge,
  payVendor,
 
};
