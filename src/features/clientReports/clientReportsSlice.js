import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* =========================================================
   BUILD PAYLOAD
========================================================= */

const buildPayload = (filters, pagination) => {

  const payload = {
    page: pagination.page || 1,
    limit: pagination.limit || 10,
  };

  if (filters.product)
    payload.productId = filters.product;

  if (filters.status)
    payload.status = filters.status;

  if (filters.environment)
    payload.environment = filters.environment;

  if (filters.duration)
    payload.duration = filters.duration;

  if (filters.chargeType)
    payload.chargeType = filters.chargeType;

  console.log("FINAL REPORT PAYLOAD:", payload);

  return payload;
};



/* =========================================================
   RUN REPORT
========================================================= */

export const runReport = createAsyncThunk(
  "clientReports/runReport",
  async (_, { getState, rejectWithValue }) => {

    try {

      const state = getState().clientReports;

      const payload = buildPayload(
        state.filters,
        state.pagination
      );

      const res = await API.post(
        "/reports/client",
        payload,
        { withCredentials: true }
      );

      console.log("REPORT RESPONSE:", res.data);

      return res.data;

    }
    catch (err) {

      console.error("REPORT ERROR:", err);

      return rejectWithValue(
        err.response?.data || err.message
      );

    }

  }
);



/* =========================================================
   FETCH META DATA
========================================================= */

export const fetchMetaData = createAsyncThunk(
  "clientReports/fetchMetaData",
  async (_, { rejectWithValue }) => {

    try {

      const [appsRes, statusRes, durationsRes] =
        await Promise.all([

          API.get("/reports/client/apps", {
            withCredentials: true,
          }),

          API.get("/reports/status", {
            withCredentials: true,
          }),

          API.get("/reports/durations", {
            withCredentials: true,
          }),

        ]);

      return {
        apps: appsRes.data.data || [],
        statusList: statusRes.data.data || [],
        durations: durationsRes.data.data || [],
      };

    }
    catch (err) {

      return rejectWithValue(err.message);

    }

  }
);



/* =========================================================
   FETCH PRODUCTS
========================================================= */

export const fetchAppProducts = createAsyncThunk(
  "clientReports/fetchAppProducts",
  async (appId, { rejectWithValue }) => {

    try {

      const res = await API.get(
        `/reports/client/apps/${appId}/products`,
        { withCredentials: true }
      );

      return res.data.data || [];

    }
    catch (err) {

      return rejectWithValue(err.message);

    }

  }
);



/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {

  filters: {
    product: "",
    appId: "",
    status: "",
    duration: "",
    chargeType: "",
    environment: "",
  },

  reports: [],

  apps: [],
  products: [],

  statusList: [],
  durations: [],

  stats: {
    success: 0,
    failed: 0,
    total: 0,
  },

  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },

  loading: false,

  error: null,

};



/* =========================================================
   SLICE
========================================================= */

const slice = createSlice({

  name: "clientReports",

  initialState,

  reducers: {

    setFilter: (state, action) => {

      const { name, value } = action.payload;

      state.filters[name] = value;

      // Reset page when filter changes
      state.pagination.page = 1;

    },



    clearAll: (state) => {

      state.filters = initialState.filters;

      state.reports = [];

      state.products = [];

      state.stats = initialState.stats;

      state.pagination = initialState.pagination;

      state.error = null;

    },



    setPage: (state, action) => {

      state.pagination.page = action.payload;

    },

  },



  extraReducers: (builder) => {

    builder



      /* RUN REPORT */

      .addCase(runReport.pending, (state) => {

        state.loading = true;

        state.error = null;

      })



      .addCase(runReport.fulfilled, (state, action) => {

        state.loading = false;

        const payload = action.payload || {};

        state.reports = payload.data || [];

        state.pagination =
          payload.pagination ||
          initialState.pagination;



        /* SUPPORT BOTH summary OR stats FROM BACKEND */

        if (payload.summary) {

          state.stats = {
            success: payload.summary.success || 0,
            failed: payload.summary.failed || 0,
            total: payload.summary.total || 0,
          };

        }
        else if (payload.stats) {

          state.stats = payload.stats;

        }
        else {

          // fallback calculate from data

          const success =
            state.reports.filter(
              r => r.status === "Success"
            ).length;

          const failed =
            state.reports.filter(
              r => r.status === "Failed"
            ).length;

          state.stats = {
            success,
            failed,
            total: state.reports.length,
          };

        }

      })



      .addCase(runReport.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

        state.reports = [];

      })



      /* FETCH META */

      .addCase(fetchMetaData.pending, (state) => {

        state.loading = true;

      })



      .addCase(fetchMetaData.fulfilled, (state, action) => {

        state.loading = false;

        state.apps = action.payload.apps;

        state.statusList =
          action.payload.statusList;

        state.durations =
          action.payload.durations;

      })



      .addCase(fetchMetaData.rejected, (state) => {

        state.loading = false;

      })



      /* FETCH PRODUCTS */

      .addCase(fetchAppProducts.pending, (state) => {

        state.products = [];

      })



      .addCase(fetchAppProducts.fulfilled, (state, action) => {

        state.products = action.payload;

      })



      .addCase(fetchAppProducts.rejected, (state) => {

        state.products = [];

      });

  },

});



export const {
  setFilter,
  clearAll,
  setPage,
} = slice.actions;

export default slice.reducer;
