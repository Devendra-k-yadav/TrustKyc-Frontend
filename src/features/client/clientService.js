// src/features/client/clientService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api";

// ---------- AUTH HEADER ----------
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// ---------- CLIENT APIS ----------
const fetchClientApis = async (token) => {
  const res = await axios.get(`${API_URL}/client/my-apis`, authHeader(token));
  return res.data.data; // backend sends data
};

const fetchClientUsage = async (token) => {
  const res = await axios.get(`${API_URL}/client/usage`, authHeader(token));
  return res.data.data || [];
};

const callApi = async (apiId, token) => {
  const res = await axios.post(
    `${API_URL}/client/call-api/${apiId}`,
    {},
    authHeader(token)
  );
  return res.data;
};

// ASSIGN PRODUCT TO CLIENT
const assignProductToClient = async (payload, token) => {

  const res = await axios.post(
    `${BASE_URL}/admin/products/assign-product`, // ✅ Clean & Correct
    payload,
    authHeader(token)
  );

  return res.data;
};

// const assignProductToClient = async (payload, token) => {
//   const res = await axios.post(
//     `${API_URL}/products/admin/assign-product`,
//     payload,
//     authHeader(token)
//   );

//   return res.data;
// };

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
  fetchClientApis,
  fetchClientUsage,
  callApi,

  // wallet
  fetchWallet,
  rechargeWallet,
  requestRecharge,
  payVendor,
  assignProductToClient,
};
