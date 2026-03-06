// src/features/client/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "./clientService";

/* ================= INITIAL STATE ================= */

const initialState = {
  // APIs
  apis: [],
  usage: [],

  // Wallet
  wallet: {
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
    transactions: [],
    rechargeRequests: [],
  },
  vendors: [],

  loading: false,
  error: null,

  // Client Profile
  profile: null,
};

/* ================= THUNKS ================= */

// -------- Fetch Client APIs --------
export const getClientApis = createAsyncThunk(
  "client/getApis",
  async (token, thunkAPI) => {
    try {
      const data = await clientService.fetchClientApis(token);
      return Array.isArray(data) ? data : [];
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch client APIs");
    }
  }
);

// -------- Refresh Usage --------
export const refreshClientUsage = createAsyncThunk(
  "client/refreshUsage",
  async (token, thunkAPI) => {
    try {
      return await clientService.fetchClientUsage(token);
    } catch {
      return thunkAPI.rejectWithValue("Failed to refresh usage");
    }
  }
);

// -------- Call Client API --------
export const callClientApi = createAsyncThunk(
  "client/callApi",
  async ({ apiId, token }, thunkAPI) => {
    try {
      return await clientService.callApi(apiId, token);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "API call failed"
      );
    }
  }
);

// -------- Get Wallet --------
export const getClientWallet = createAsyncThunk(
  "client/getWallet",
  async (token, thunkAPI) => {
    try {
      return await clientService.fetchWallet(token);
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch wallet");
    }
  }
);

// -------- Recharge Wallet --------
export const rechargeWalletThunk = createAsyncThunk(
  "client/rechargeWallet",
  async ({ amount, method, token }, thunkAPI) => {
    try {
      await clientService.rechargeWallet({ amount, method }, token);
      return await clientService.fetchWallet(token);
    } catch {
      return thunkAPI.rejectWithValue("Recharge failed");
    }
  }
);

// -------- Recharge Request --------
export const requestRechargeThunk = createAsyncThunk(
  "client/requestRecharge",
  async ({ amount, method, token }, thunkAPI) => {
    try {
      await clientService.requestRecharge({ amount, method }, token);
      return await clientService.fetchWallet(token);
    } catch {
      return thunkAPI.rejectWithValue("Recharge request failed");
    }
  }
);

// -------- Pay Vendor --------
export const payVendorThunk = createAsyncThunk(
  "client/payVendor",
  async ({ vendor, amount, token }, thunkAPI) => {
    try {
      await clientService.payVendor({ vendor, amount }, token);
      return await clientService.fetchWallet(token);
    } catch {
      return thunkAPI.rejectWithValue("Vendor payment failed");
    }
  }
);



/* ================= SLICE ================= */

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    // ---------- Update Profile ----------
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    // ---------- Clear Errors ----------
    clearClientError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ---------- APIs ---------- */
      .addCase(getClientApis.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientApis.fulfilled, (state, action) => {
        state.loading = false;
        state.apis = action.payload; // ALWAYS ARRAY
      })
      .addCase(getClientApis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- Usage ---------- */
      .addCase(refreshClientUsage.fulfilled, (state, action) => {
        state.usage = Array.isArray(action.payload) ? action.payload : [];
      })

      /* ---------- Call API ---------- */
      .addCase(callClientApi.pending, (state) => {
        state.loading = true;
      })
      .addCase(callClientApi.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(callClientApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- Wallet ---------- */
      .addCase(getClientWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.wallet;
        state.vendors = action.payload.vendors || [];
      })
      .addCase(getClientWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(rechargeWalletThunk.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      })
      .addCase(requestRechargeThunk.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      })
      .addCase(payVendorThunk.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      });

      
  },
});

/* ================= EXPORTS ================= */

export const { updateProfile, clearClientError } = clientSlice.actions;
export default clientSlice.reducer;
