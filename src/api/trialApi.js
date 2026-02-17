import axios from "./axios";

// ================= TRIAL LIST =================
export const fetchTrialProductsApi = async () => {
  const res = await axios.get("/trials/list");
  return res.data;
};

// ================= RUN RESTRICTED TRIAL =================
export const runTrialApi = async ({ trialId, payload }) => {
  const res = await axios.post("/trials/run", {
    trialId,
    payload,
  });
  return res.data;
};

// ================= RUN PUBLIC FREE API =================
export const runPublicTrialApi = async (data) => {
  // ✅ OCR CASE (FormData)
  if (data instanceof FormData) {
    const res = await axios.post("/trials/public", data, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
    return res.data; // 🔥 FIX
  }

  // ✅ NORMAL APIs
  const { trialId, payload } = data;
  const res = await axios.post("/trials/public", {
    trialId,
    payload,
  });
  return res.data; // 🔥 FIX
};



// ================= USAGE HISTORY =================
export const fetchTrialUsageApi = async () => {
  const res = await axios.get("/trials/usage");
  return res.data;
};
