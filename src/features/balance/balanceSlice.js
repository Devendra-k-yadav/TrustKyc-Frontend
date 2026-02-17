import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRechargeRequests,
  approveRecharge,
  rejectRecharge,
} from "./adminWalletService";

/* ================= THUNKS ================= */

export const getAllRechargeRequests = createAsyncThunk(
  "balance/getRequests",
  async (token, thunkAPI) => {
    try {
      return await fetchRechargeRequests(token);
    } catch {
      return thunkAPI.rejectWithValue("Failed to load requests");
    }
  }
);

export const approveRechargeThunk = createAsyncThunk(
  "balance/approve",
  async (data, thunkAPI) => {
    try {
      await approveRecharge(data);
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Approve failed");
    }
  }
);

export const rejectRechargeThunk = createAsyncThunk(
  "balance/reject",
  async (data, thunkAPI) => {
    try {
      await rejectRecharge(data);
      return data;
    } catch {
      return thunkAPI.rejectWithValue("Reject failed");
    }
  }
);

/* ================= SLICE ================= */

const balanceSlice = createSlice({
  name: "balance",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    successMessage: null,
  },

  reducers: {
    clearStatus: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllRechargeRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllRechargeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload?.data || [];
      })
      .addCase(getAllRechargeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(approveRechargeThunk.fulfilled, (state) => {
        state.successMessage = "Recharge approved successfully";
      })

      .addCase(rejectRechargeThunk.fulfilled, (state) => {
        state.successMessage = "Recharge rejected successfully";
      });
  },
});

export const { clearStatus } = balanceSlice.actions;
export default balanceSlice.reducer;
