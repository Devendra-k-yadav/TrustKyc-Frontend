import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API = "http://localhost:5000/api";

/* ================= FETCH APIS (PRODUCTS) ================= */
export const fetchApis = createAsyncThunk(
  "api/fetchApis",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      const res = await axios.get(`${API}/products`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return res.data.map((p) => ({
        id: p._id,
        name: p.name,
        endpoint: p.code,            // 🔥 PRODUCT CODE AS ENDPOINT
        price: 0,                    // 🔥 UI only (future billing)
        vendor: p.ownerRole,         // admin / client / manager
        status: p.active ? "Active" : "Inactive",
      }));
    } catch (err) {
      toast.error("Failed to load APIs");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= ADD API (CREATE PRODUCT) ================= */
export const addApi = createAsyncThunk(
  "api/addApi",
  async (form, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      const res = await axios.post(
        `${API}/products`,
        {
          name: form.name,
          code: form.endpoint,        // 🔥 endpoint = product code
          category: "Utility",        // default
          description: "API Product",
          trial: 0,
          preApproved: false,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success("API (Product) Added");

      return {
        id: res.data._id,
        name: res.data.name,
        endpoint: res.data.code,
        price: 0,
        vendor: res.data.ownerRole,
        status: res.data.active ? "Active" : "Inactive",
      };
    } catch (err) {
      toast.error("Add API failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= UPDATE API (PRODUCT) ================= */
export const updateApi = createAsyncThunk(
  "api/updateApi",
  async ({ id, form }, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      await axios.put(
        `${API}/products/${id}`,
        {
          name: form.name,
          code: form.endpoint,
          active: form.status === "Active",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      toast.success("API Updated");
      return { id, form };
    } catch (err) {
      toast.error("Update failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= DELETE API (PRODUCT) ================= */
export const deleteApi = createAsyncThunk(
  "api/deleteApi",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      await axios.delete(`${API}/products/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      toast.success("API Deleted");
      return id;
    } catch (err) {
      toast.error("Delete failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

/* ================= ASSIGN API (NO CHANGE) ================= */
export const assignApiToClient = createAsyncThunk(
  "api/assignApi",
  async ({ clientId, apiId, env }, { getState, rejectWithValue }) => {
    try {
      const { accessToken } = getState().auth;

      await axios.post(
        `${API}/admin/client/assign-api`,
        { client_id: clientId, api_id: apiId, env },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("API assigned to client");
    } catch (err) {
      toast.error("Assign failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

const apiManagementSlice = createSlice({
  name: "apiManagement",
  initialState: {
    apis: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApis.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApis.fulfilled, (state, action) => {
        state.loading = false;
        state.apis = action.payload || [];
      })
      .addCase(fetchApis.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addApi.fulfilled, (state, action) => {
        state.apis.unshift(action.payload);
      })
      .addCase(updateApi.fulfilled, (state, action) => {
        const { id, form } = action.payload;
        state.apis = state.apis.map((a) =>
          a.id === id
            ? {
                ...a,
                name: form.name,
                endpoint: form.endpoint,
                status: form.status,
              }
            : a
        );
      })
      .addCase(deleteApi.fulfilled, (state, action) => {
        state.apis = state.apis.filter((a) => a.id !== action.payload);
      });
  },
});

export default apiManagementSlice.reducer;
