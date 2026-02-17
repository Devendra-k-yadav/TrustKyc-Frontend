import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clientService from "./clientService";

/* ================= THUNKS ================= */

export const getClientWallet = createAsyncThunk(
  "client/getWallet",
  async (token, thunkAPI) => {
    try {
      return await clientService.getClientWallet(token);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch wallet"
      );
    }
  }
);

export const rechargeWalletThunk = createAsyncThunk(
  "client/recharge",
  async (data, thunkAPI) => {
    try {
      return await clientService.rechargeWallet(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Recharge failed"
      );
    }
  }
);

export const requestRechargeThunk = createAsyncThunk(
  "client/rechargeRequest",
  async (data, thunkAPI) => {
    try {
      return await clientService.requestRecharge(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Recharge request failed"
      );
    }
  }
);

export const payVendorThunk = createAsyncThunk(
  "client/payVendor",
  async (data, thunkAPI) => {
    try {
      return await clientService.payVendor(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Payment failed"
      );
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState: {
    wallet: null,
    vendors: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ================= GET WALLET ================= */
      .addCase(getClientWallet.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClientWallet.fulfilled, (state, action) => {
        state.loading = false;
        state.wallet = action.payload.wallet;
        state.vendors = action.payload.vendors;
        state.error = null;
      })
      .addCase(getClientWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= RECHARGE ================= */
      .addCase(rechargeWalletThunk.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      })

      /* ================= RECHARGE REQUEST ================= */
      .addCase(requestRechargeThunk.fulfilled, (state) => {
        // Wallet refresh recommended
      })

      /* ================= PAY VENDOR ================= */
      .addCase(payVendorThunk.fulfilled, (state, action) => {
        state.wallet = action.payload.wallet;
      });
  },
});

export default clientSlice.reducer;
