import {
  fetchTrialProductsApi,
  runTrialApi,
  runPublicTrialApi,
  fetchTrialUsageApi,
} from "../../api/trialApi";

const trialCenterService = {
  // ✅ Fetch trial products
  fetchTrials: fetchTrialProductsApi,

  // ✅ Run restricted trial (normal JSON)
  runRestricted: runTrialApi,

  // ✅ Run public trial (supports FormData or JSON)
  runPublic: (data) => {
    // 🔹 If data is FormData (OCR case), send as is
    if (data instanceof FormData) {
      return runPublicTrialApi(data);
    }

    // 🔹 Normal payload case
    const { trialId, payload } = data;
    return runPublicTrialApi({ trialId, payload });
  },

  // ✅ Fetch usage history
  fetchUsage: fetchTrialUsageApi,
};

export default trialCenterService;
