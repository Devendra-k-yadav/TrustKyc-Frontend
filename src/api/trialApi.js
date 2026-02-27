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
      headers: {
        // 🔥 IMPORTANT: let browser set boundary automatically
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

  // ✅ NORMAL APIs (JSON)
  const { trialId, payload } = data;
  const res = await axios.post("/trials/public", {
    trialId,
    payload,
  });
  return res.data;
};



// ================= USAGE HISTORY =================
export const fetchTrialUsageApi = async () => {
  const res = await axios.get("/trials/usage");
  return res.data;
};
