import axios from "../../api/axios"; 
// 🔹 Central axios instance
// 🔹 baseURL = http://localhost:5000/api
// 🔹 Isliye yaha /api likhne ki zarurat nahi

/**
 * clientAppsService
 * -----------------------------------------
 * ⚠️ IMPORTANT:
 * - Ye service CLIENT + ADMIN dono jagah reuse ho rahi hai
 * - Authorization / role check BACKEND me hota hai
 * - Admin ko zyada access milta hai, client ko limited
 * - Frontend me duplicate services banana ❌ BAD PRACTICE
 */

export const clientAppsService = {

  /* =======================
     GET ALL APPS
     - Client: sirf apne apps
     - Admin: saare apps
  ======================= */
  getApps: async () => {
    const response = await axios.get("/client/apps");
    return response.data;
  },

  /* =======================
     CREATE NEW APP
     - Client: allowed
     - Admin: allowed
  ======================= */
  createApp: async (appData) => {
    const response = await axios.post("/client/apps", appData);
    return response.data;
  },

  /* =======================
     GET SINGLE APP DETAILS
     - Client: own app
     - Admin: any app
  ======================= */
  getAppById: async (appId) => {
    const response = await axios.get(`/client/apps/${appId}`);
    return response.data;
  },

  /* =======================
     UPDATE APP (name, etc.)
  ======================= */
  updateApp: async (appId, updatedData) => {
    const response = await axios.put(
      `/client/apps/${appId}`,
      updatedData
    );
    return response.data;
  },

  /* =======================
     DELETE APP
     - Client: own app
     - Admin: any app
  ======================= */
  deleteApp: async (appId) => {
    const response = await axios.delete(`/client/apps/${appId}`);
    return response.data;
  },

  /* =======================
     ADD API KEY
  ======================= */
  addKey: async (appId, keyData) => {
    const response = await axios.post(
      `/client/apps/${appId}/keys`,
      keyData
    );
    return { appId, key: response.data };
  },

  /* =======================
   TOGGLE API KEY STATUS
======================= */
toggleAppKeyStatus: async (appId, keyId) => {
  const response = await axios.patch(
    `/client/apps/${appId}/keys/${keyId}/toggle`
  );
  return {
    appId,
    keyData: response.data, // {_id, status, updatedAt}
  };
},


  /* =======================
     GET API KEYS
  ======================= */
  getKeys: async (appId) => {
    const response = await axios.get(
      `/client/apps/${appId}/keys`
    );
    return response.data;
  },

  /* =======================
     DELETE API KEY
  ======================= */
  deleteKey: async (appId, keyId) => {
    const response = await axios.delete(
      `/client/apps/${appId}/keys/${keyId}`
    );
    return response.data;
  },

  /* =======================
     ASSIGN APIs TO APP
     - Mostly ADMIN use case
     - Client UI me hide reh sakta hai
  ======================= */
  assignAPIs: async (appId, apiList) => {
    const response = await axios.post(
      `/client/apps/${appId}/apis`,
      { apis: apiList }
    );
    return response.data;
  },

  /* =======================
     USAGE REPORT
  ======================= */
  getUsage: async (appId) => {
    const response = await axios.get(
      `/client/apps/${appId}/usage`
    );
    return response.data;
  },

  /* =======================
     CHANGE ENVIRONMENT
     - Client / Admin both
  ======================= */
  changeEnvironment: async (appId, env) => {
    const response = await axios.patch(
      `/client/apps/${appId}/environment`,
      { environment: env }
    );
    return response.data;
  },
};
