import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  apps: [],
  loading: false,
  error: null,
  showCreateModal: false,
  selectedApp: null,
  loadingSingleApp: false,
  clientAppProductsByClient: {},
};

// ================= ASYNC THUNKS =================

// Fetch all apps
export const fetchApps = createAsyncThunk(
  "clientApps/fetchApps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/client/apps");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Fetch single app
export const fetchSingleApp = createAsyncThunk(
  "clientApps/fetchSingleApp",
  async (appId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/client/apps/${appId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create App
export const createApp = createAsyncThunk(
  "clientApps/createApp",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post("/client/apps", { name });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete App
export const removeApp = createAsyncThunk(
  "clientApps/removeApp",
  async (appId, { rejectWithValue }) => {
    try {
      await axios.delete(`/client/apps/${appId}`);
      return appId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Add Key
export const addAppKey = createAsyncThunk(
  "clientApps/addAppKey",
  async ({ appId, key }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/client/apps/${appId}/keys`, { key });
      return { appId, keyData: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete Key
export const removeAppKey = createAsyncThunk(
  "clientApps/removeAppKey",
  async ({ appId, keyId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/client/apps/${appId}/keys/${keyId}`);
      return { appId, keyId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Toggle Key Status
export const toggleAppKeyStatus = createAsyncThunk(
  "clientApps/toggleAppKeyStatus",
  async ({ appId, keyId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/client/apps/${appId}/keys/${keyId}/toggle`);
      return { appId, keyData: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Assign Products / Services
export const assignProductsToApp = createAsyncThunk(
  "clientApps/assignProductsToApp",
  async ({ appId, products }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/apps/products/${appId}`, { products });
      return res.data; // updated app
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to assign products");
    }
  }
);

// Change Environment (Test ↔ Live)
export const changeAppEnvironment = createAsyncThunk(
  "clientApps/changeAppEnvironment",
  async ({ appId, environment }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/client/apps/${appId}/environment`, { environment });
      return { appId, environment: response.data.environment };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const fetchClientAppProducts = createAsyncThunk(
  "clientApps/fetchClientAppProducts",
  async ({ appId, clientId }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `/admin/apps/${appId}/clients/${clientId}/products`
      );

      return {
        appId,
        clientId,
        services: Array.isArray(res.data) ? res.data : [],
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// ================= SLICE =================

const clientAppsSlice = createSlice({
  name: "clientApps",
  initialState,
  reducers: {
    openCreateModal(state) {
      state.showCreateModal = true;
    },
    closeCreateModal(state) {
      state.showCreateModal = false;
    },
    setSelectedApp(state, action) {
      state.selectedApp = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== FETCH APPS =====
      .addCase(fetchApps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApps.fulfilled, (state, action) => {
        state.apps = action.payload.map((a) => ({
          ...a,
          id: a.id?.toString(),
          keysList: a.keysList || [],
          keys: a.keys ?? (a.keysList?.length ?? 0),
        }));
        state.loading = false;
      })
      .addCase(fetchApps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===== FETCH SINGLE APP =====
      .addCase(fetchSingleApp.pending, (state) => {
        state.loadingSingleApp = true;
      })
      .addCase(fetchSingleApp.fulfilled, (state, action) => {
        const app = action.payload;
        state.loadingSingleApp = false;

        // update selected app
  state.selectedApp = app;

  // 🔴 CRITICAL FIX: update servicesCount in apps list
  const index = state.apps.findIndex(
    (a) => (a._id || a.id)?.toString() === app._id.toString()
  );

  if (index !== -1) {
    state.apps[index] = {
      ...state.apps[index],
      servicesCount: app.services?.length || 0,
      
    };
  }
})
      .addCase(fetchSingleApp.rejected, (state) => {
        state.loadingSingleApp = false;
      })

      // ===== CREATE APP =====
      .addCase(createApp.fulfilled, (state, action) => {
        state.apps.unshift({
          ...action.payload,
          id: action.payload.id?.toString(),
          keysList: [],
          keys: 0,
        });
      })

      // ===== REMOVE APP =====
      .addCase(removeApp.fulfilled, (state, action) => {
        state.apps = state.apps.filter((a) => a.id !== action.payload);
      })

      // ===== ADD KEY =====
      .addCase(addAppKey.fulfilled, (state, action) => {
        const { appId, keyData } = action.payload;
        // 🔐 Ensure default fields
  const normalizedKey = {
    ...keyData,
    status: keyData.status || "Enabled",
    createdAt: keyData.createdAt || new Date().toISOString(),
    updatedAt: keyData.updatedAt || new Date().toISOString(),
  };

  const app = state.apps.find((a) => a.id === appId.toString());
  if (app) {
    app.keysList.push(normalizedKey);
    app.keys = (app.keys || 0) + 1;
  }

  if (
    state.selectedApp &&
    (state.selectedApp._id || state.selectedApp.id)?.toString() === appId.toString()
  ) {
    state.selectedApp.keysList.push(normalizedKey);
    state.selectedApp.keys = (state.selectedApp.keys || 0) + 1;
  }
      })

      // ===== REMOVE KEY =====
      .addCase(removeAppKey.fulfilled, (state, action) => {
        const { appId, keyId } = action.payload;
        const app = state.apps.find((a) => a.id === appId.toString());
        if (app) {
          app.keysList = app.keysList.filter((k) => k._id !== keyId);
          if (app.keys > 0) app.keys -= 1;
        }
        if (state.selectedApp && (state.selectedApp._id || state.selectedApp.id)?.toString() === appId.toString()) {
          state.selectedApp.keysList = state.selectedApp.keysList.filter((k) => k._id !== keyId);
          if (state.selectedApp.keys > 0) state.selectedApp.keys -= 1;
        }
      })

      // ===== TOGGLE KEY STATUS =====
      .addCase(toggleAppKeyStatus.fulfilled, (state, action) => {
        const { appId, keyData } = action.payload;
        state.apps = state.apps.map((app) =>
          app.id === appId.toString()
            ? { ...app, keysList: app.keysList.map((k) => k._id === keyData._id ? { ...k, status: keyData.status } : k) }
            : app
        );
        if (state.selectedApp && (state.selectedApp._id || state.selectedApp.id)?.toString() === appId.toString()) {
          state.selectedApp.keysList = state.selectedApp.keysList.map((k) => k._id === keyData._id ? { ...k, status: keyData.status } : k);
        }
      })

      // ===== ASSIGN PRODUCTS (CLIENT + APP LEVEL) =====
.addCase(assignProductsToApp.fulfilled, (state, action) => {
  const { clientId, appId, services } = action.payload;

  if (!clientId || !appId) return;

  // init client
  if (!state.clientAppProductsByClient[clientId]) {
    state.clientAppProductsByClient[clientId] = {};
  }

  // set products
  state.clientAppProductsByClient[clientId][appId] = services || [];

  // ✅ UPDATE servicesCount ONLY from clientappproduct
  const appIndex = state.apps.findIndex(
    (a) => (a._id || a.id)?.toString() === appId.toString()
  );

  if (appIndex !== -1) {
    state.apps[appIndex].servicesCount =
      state.clientAppProductsByClient[clientId][appId].length;
  }

  // selected app sync
  if (
    state.selectedApp &&
    (state.selectedApp._id || state.selectedApp.id)?.toString() === appId.toString()
  ) {
    state.selectedApp.servicesCount =
      state.clientAppProductsByClient[clientId][appId].length;
  }
})

.addCase(fetchClientAppProducts.fulfilled, (state, action) => {
  const { clientId, appId, services } = action.payload;

  // ✅ NORMALIZE KEYS (THIS IS THE FIX)
  const clientKey = clientId?.toString();
  const appKey = appId?.toString();

  if (!clientKey || !appKey) return;

  if (!state.clientAppProductsByClient[clientKey]) {
    state.clientAppProductsByClient[clientKey] = {};
  }

  // ✅ client-wise products only
  state.clientAppProductsByClient[clientKey][appKey] = Array.isArray(services)
    ? services
    : [];

  // 🔁 optional: sync count in apps list
  const idx = state.apps.findIndex(
    (a) => (a._id || a.id)?.toString() === appKey
  );

  if (idx !== -1) {
    state.apps[idx].servicesCount =
      state.clientAppProductsByClient[clientKey][appKey].length;
  }
})




      // ===== CHANGE ENVIRONMENT =====
      .addCase(changeAppEnvironment.fulfilled, (state, action) => {
        const { appId, environment } = action.payload;
        const app = state.apps.find((a) => a.id === appId.toString());
        if (app) app.environment = environment;
        if (state.selectedApp && (state.selectedApp._id || state.selectedApp.id)?.toString() === appId.toString()) {
          state.selectedApp.environment = environment;
        }
      });
  },
});

export const { openCreateModal, closeCreateModal, setSelectedApp } = clientAppsSlice.actions;
export default clientAppsSlice.reducer;
