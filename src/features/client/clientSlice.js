// src/features/client/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "./clientService";

/* ================= INITIAL STATE ================= */

const initialState = {
  // APIs
  // apis: [],
  // usage: [],

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
