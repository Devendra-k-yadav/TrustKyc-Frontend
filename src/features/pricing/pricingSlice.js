import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./pricingService";

/* ================= THUNKS ================= */

export const fetchPricingThunk = createAsyncThunk(
  "pricing/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchPricing();
      return res.data.pricing || [];
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const createPricingThunk = createAsyncThunk(
  "pricing/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createPricingApi(data);
      return res.data.pricing;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* 🔥 FIXED UPDATE THUNK */
export const updatePricingThunk = createAsyncThunk(
  "pricing/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updatePricingApi(id, data);
      return res.data.pricing;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deletePricingThunk = createAsyncThunk(
  "pricing/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.deletePricingApi(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* ================= SLICE ================= */

const pricingSlice = createSlice({
  name: "pricing",
  initialState: {
    pricingList: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* ================= FETCH ================= */
      .addCase(fetchPricingThunk.fulfilled, (state, action) => {
        state.pricingList = action.payload.map((p) => ({
          _id: p._id, // ✅ keep original _id
          productId: p.productId?._id || p.productId,
          name: p.productId?.name || p.name,
          basePrice: p.basePrice,
          sellingPrice: p.sellingPrice,
          discount: p.discount,
          finalPrice: p.finalPrice,
          profit: p.profit,
          updatedOn: p.updatedOn,
        }));
      })

      /* ================= CREATE ================= */
      .addCase(createPricingThunk.fulfilled, (state, action) => {
        state.pricingList.unshift({
          _id: action.payload._id,
          productId: action.payload.productId,
          name: action.payload.name,
          basePrice: action.payload.basePrice,
          sellingPrice: action.payload.sellingPrice,
          discount: action.payload.discount,
          finalPrice: action.payload.finalPrice,
          profit: action.payload.profit,
          updatedOn: action.payload.updatedOn,
        });
      })

      /* ================= 🔥 FIXED UPDATE ================= */
      .addCase(updatePricingThunk.fulfilled, (state, action) => {
        const index = state.pricingList.findIndex(
          (item) => item._id === action.payload._id
        );

        if (index !== -1) {
          state.pricingList[index] = {
            ...state.pricingList[index],
            ...action.payload,
          };
        }
      })

      /* ================= DELETE ================= */
      .addCase(deletePricingThunk.fulfilled, (state, action) => {
        state.pricingList = state.pricingList.filter(
          (item) => item._id !== action.payload
        );
      });
  },
});

export default pricingSlice.reducer;
