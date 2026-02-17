import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin/wallet",
});

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const fetchRechargeRequests = async (token) => {
  const res = await API.get("/recharge-requests", authHeader(token));
  return res.data;
};

export const approveRecharge = async ({ walletId, requestId, token }) => {
  const res = await API.put(
    `/recharge-approve/${walletId}/${requestId}`,
    {},
    authHeader(token)
  );
  return res.data;
};

export const rejectRecharge = async ({
  walletId,
  requestId,
  remark,
  token,
}) => {
  const res = await API.put(
    `/recharge-reject/${walletId}/${requestId}`,
    { adminRemark: remark },
    authHeader(token)
  );
  return res.data;
};
