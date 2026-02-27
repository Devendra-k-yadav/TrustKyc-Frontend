import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import trialCenterService from "./trialCenterService";

// ================= THUNKS =================
export const fetchTrialProducts = createAsyncThunk(
  "trialCenter/fetchTrials",
  async () => {
    const res = await trialCenterService.fetchTrials();

    return res.trials.map((t) => ({
      ...t,
      creditsLeft: t.creditsLeft ?? t.trialCredits,
    }));
  }
);

export const runRestrictedTrial = createAsyncThunk(
  "trialCenter/runRestricted",
  async ({ trialId, payload }) => {
    return await trialCenterService.runRestricted({ trialId, payload });
  }
);

export const runPublicTrial = createAsyncThunk(
  "trialCenter/runPublic",
  async (data) => {
    if (data instanceof FormData) {
      return await trialCenterService.runPublic(data);
    }
    const { trialId, payload } = data;
    return await trialCenterService.runPublic({ trialId, payload });
  }
);

// ================= SLICE =================
const trialCenterSlice = createSlice({
  name: "trialCenter",
  initialState: {
    products: [],
    usages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------------- FETCH ----------------
      .addCase(fetchTrialProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })

      // ---------------- RESTRICTED ----------------
      .addCase(runRestrictedTrial.fulfilled, (state, action) => {
        const { trial, creditsLeft } = action.payload || {};

        // ✅ SAFE GUARD
        if (!trial || !trial._id) return;

        const idx = state.products.findIndex(
          (p) => p._id === trial._id
        );

        if (idx !== -1 && creditsLeft !== undefined) {
          state.products[idx].creditsLeft = creditsLeft;
        }
      })

      // ---------------- PUBLIC ----------------
      .addCase(runPublicTrial.fulfilled, (state, action) => {
        const { trial, creditsLeft } = action.payload || {};

        // ✅ SAFE GUARD
        if (!trial || !trial._id) return;

        const idx = state.products.findIndex(
          (p) => p._id === trial._id
        );

        if (idx !== -1 && creditsLeft !== undefined) {
          state.products[idx].creditsLeft = creditsLeft;
        }
      });
  },
});

export default trialCenterSlice.reducer;