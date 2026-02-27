import API from "../../api/axios";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientAppsService } from "../client/clientAppsService";
import { toast } from "react-toastify";

/* ==============================
   ASYNC THUNKS
=============================== */

export const fetchAdminApps = createAsyncThunk(
  "adminApps/fetchAll",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await API.get(`/admin/clients/${clientId}/apps`);

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;

      return [];

    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchAdminAppById = createAsyncThunk(
  "adminApps/fetchById",
  async (appId, { rejectWithValue }) => {
    try {
      return await clientAppsService.getAppById(appId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createAdminApp = createAsyncThunk(
  "adminApps/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await clientAppsService.createApp(payload);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const changeAdminAppEnvironment = createAsyncThunk(
  "adminApps/changeEnvironment",
  async ({ appId, env }, { rejectWithValue }) => {
    try {
      return await clientAppsService.changeEnvironment(appId, env);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addAdminAppKey = createAsyncThunk(
  "adminApps/addKey",
  async ({ appId, key }, { rejectWithValue }) => {
    try {
      const res = await clientAppsService.addKey(appId, { key });
      // res = { appId, key }
      return {
        appId,
        keyData: res.key,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const removeAdminAppKey = createAsyncThunk(
  "adminApps/removeKey",
  async ({ appId, keyId }, { rejectWithValue }) => {
    try {
      await clientAppsService.deleteKey(appId, keyId);
      return { appId, keyId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ✅ TOGGLE KEY STATUS (Enable / Disable)
export const toggleAdminAppKeyStatus = createAsyncThunk(
  "adminApps/toggleKeyStatus",
  async ({ appId, keyId }, { rejectWithValue }) => {
    try {
      return await clientAppsService.toggleAppKeyStatus(appId, keyId);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const assignProductsToClientApp = createAsyncThunk(
  "adminApps/assignClientProducts",
  async ({ appId, clientId, productIds }, { rejectWithValue }) => {
    try {
      const res = await API.post(
        `/admin/apps/${appId}/products`,
        { clientId, productIds }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const deleteAdminApp = createAsyncThunk(
  "adminApps/delete",
  async (appId, { rejectWithValue }) => {
    try {
      await clientAppsService.deleteApp(appId);
      return appId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



/* ==============================
   GET CLIENT SUBSCRIBED PRODUCTS (ADMIN)
=============================== */
export const fetchClientSubscribedProductsAdmin = createAsyncThunk(
  "adminApps/fetchClientSubscribedProducts",
  async (clientId, { rejectWithValue }) => {
    try {
      const res = await API.get(
  `/admin/products/clients/${clientId}/subscribed-products`
);



      // 🔥 normalize response
      if (Array.isArray(res.data)) {
        return res.data;
      }

      if (Array.isArray(res.data?.data)) {
        return res.data.data;
      }

      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchClientAppProducts = createAsyncThunk(
  "adminApps/fetchClientAppProducts",
  async ({ appId, clientId }, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/admin/apps/${appId}/clients/${clientId}/products`
      );

      // normalize
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;

      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);





/* ==============================
   SLICE
=============================== */

const adminAppSlice = createSlice({
  name: "adminApps",
  initialState: {
  apps: [],
  selectedApp: null,
  loading: false,
  error: null,
  clientSubscribedProducts: [], // ✅ ADD
    clientAppProductsByClient: {},
  clientAppProducts: [],
},

  reducers: {
    clearSelectedApp(state) {
      state.selectedApp = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminApps.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminApps.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload;
      })
      .addCase(fetchAdminApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(`Fetch Apps Failed: ${action.payload}`);
      })

      .addCase(fetchAdminAppById.fulfilled, (state, action) => {
        state.selectedApp = action.payload;
      })

      .addCase(createAdminApp.fulfilled, (state, action) => {
        state.apps.unshift(action.payload);
        
      })

      .addCase(changeAdminAppEnvironment.fulfilled, (state, action) => {
        state.selectedApp = action.payload;
        state.apps = state.apps.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
        
      })

      .addCase(addAdminAppKey.fulfilled, (state, action) => {
        const { appId, keyData } = action.payload;

  const normalizedKey = {
    ...keyData,
    status: keyData.status || "Enabled",
    createdAt: keyData.createdAt || new Date().toISOString(),
    updatedAt: keyData.updatedAt || new Date().toISOString(),
  };

  // update apps list
  const app = state.apps.find((a) => a._id === appId);
  if (app) {
    app.keysList = app.keysList || [];
    app.keysList.push(normalizedKey);
  }

  // update selected app
  if (state.selectedApp && state.selectedApp._id === appId) {
    state.selectedApp.keysList = state.selectedApp.keysList || [];
    state.selectedApp.keysList.push(normalizedKey);
  }
        
      })

      .addCase(removeAdminAppKey.fulfilled, (state, action) => {
        const { appId, keyId } = action.payload;

  const app = state.apps.find((a) => a._id === appId);
  if (app) {
    app.keysList = app.keysList.filter((k) => k._id !== keyId);
    if (app.keys > 0) app.keys -= 1;
  }

  if (
    state.selectedApp &&
    state.selectedApp._id?.toString() === appId.toString()
  ) {
    state.selectedApp.keysList =
      state.selectedApp.keysList.filter((k) => k._id !== keyId);
    if (state.selectedApp.keys > 0) state.selectedApp.keys -= 1;
  }
      })

      .addCase(toggleAdminAppKeyStatus.fulfilled, (state, action) => {
  const { appId, keyData } = action.payload;

  // update apps list
  state.apps = state.apps.map((app) =>
    app._id.toString() === appId.toString()
      ? {
          ...app,
          keysList: app.keysList.map((k) =>
            k._id === keyData._id
              ? { ...k, status: keyData.status }
              : k
          ),
        }
      : app
  );

  // update selected app
  if (state.selectedApp?._id?.toString() === appId.toString()) {
    state.selectedApp.keysList =
      state.selectedApp.keysList.map((k) =>
        k._id === keyData._id
          ? { ...k, status: keyData.status }
          : k
      );
  }
})

      .addCase(fetchClientSubscribedProductsAdmin.pending, (state) => {
  state.clientSubscribedProducts = [];
})

.addCase(fetchClientSubscribedProductsAdmin.fulfilled, (state, action) => {
  state.clientSubscribedProducts = Array.isArray(action.payload)
    ? action.payload
    : [];
})

.addCase(fetchClientSubscribedProductsAdmin.rejected, (state) => {
  state.clientSubscribedProducts = [];
})





.addCase(fetchClientAppProducts.pending, (state) => {
  state.clientAppProducts = [];
})
.addCase(fetchClientAppProducts.fulfilled, (state, action) => {
  const { clientId } = action.meta.arg;

  state.clientAppProductsByClient[clientId] =
    Array.isArray(action.payload) ? action.payload : [];
})

.addCase(fetchClientAppProducts.rejected, (state) => {
  state.clientAppProducts = [];
})


      .addCase(deleteAdminApp.fulfilled, (state, action) => {
        state.apps = state.apps.filter((a) => a._id !== action.payload);
        state.selectedApp = null;
        
      });
  },
});

export const { clearSelectedApp } = adminAppSlice.actions;
export default adminAppSlice.reducer;
