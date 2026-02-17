import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Run Report
export const runReport = createAsyncThunk(
  "clientReports/runReport",
  async (_, { getState }) => {
    const { filters } = getState().clientReports;
    const res = await API.post("/reports/client", filters, {
      withCredentials: true,
    });
    return res.data.data;
  }
);

// Fetch Meta
export const fetchMetaData = createAsyncThunk(
  "clientReports/fetchMetaData",
  async () => {
    const [appsRes, statusRes, durationsRes] = await Promise.all([
      API.get("/reports/client/apps", { withCredentials: true }),
      API.get("/reports/status", { withCredentials: true }),
      API.get("/reports/durations", { withCredentials: true }),
    ]);

    return {
      apps: appsRes.data.data,
      statusList: statusRes.data.data,
      durations: durationsRes.data.data,
    };
  }
);

// Fetch Products of App
export const fetchAppProducts = createAsyncThunk(
  "clientReports/fetchAppProducts",
  async (appId) => {
    const res = await API.get(
      `/reports/client/apps/${appId}/products`,
      { withCredentials: true }
    );
    return res.data.data;
  }
);

const initialState = {
  filters: {
    clientId: "",
    product: "",
    appId: "",
    status: "",
    duration: "",
    chargeType: "",
    environment: "",
  },
  filteredReports: [],
  products: [],
  apps: [],
  statusList: [],
  durations: [],
  loading: false,
  error: null,
};

const clientReportsSlice = createSlice({
  name: "clientReports",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filters[action.payload.name] = action.payload.value;
    },
    clearAll: (state) => {
      state.filters = initialState.filters;
      state.filteredReports = [];
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(runReport.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredReports = action.payload;
      })
      .addCase(runReport.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchMetaData.fulfilled, (state, action) => {
        state.apps = action.payload.apps;
        state.statusList = action.payload.statusList;
        state.durations = action.payload.durations;
      })
      .addCase(fetchAppProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      });
  },
});

export const { setFilter, clearAll } = clientReportsSlice.actions;
export default clientReportsSlice.reducer;
