import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./vendorApiKeysService";

/* ================= THUNKS ================= */

/* Vendors */
export const fetchVendorsThunk = createAsyncThunk(
  "vendorApiKeys/fetchVendors",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchVendors();
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const addVendorThunk = createAsyncThunk(
  "vendorApiKeys/addVendor",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createVendor(data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateVendorThunk = createAsyncThunk(
  "vendorApiKeys/updateVendor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateVendorApi(id, data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteVendorThunk = createAsyncThunk(
  "vendorApiKeys/deleteVendor",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteVendorApi(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* Keys */
export const fetchKeysThunk = createAsyncThunk(
  "vendorApiKeys/fetchKeys",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchKeys();
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const addKeyThunk = createAsyncThunk(
  "vendorApiKeys/addKey",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.addVendorKey(data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const updateKeyThunk = createAsyncThunk(
  "vendorApiKeys/updateKey",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.updateVendorKey(id, data);
      return res.data.data;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

export const deleteKeyThunk = createAsyncThunk(
  "vendorApiKeys/deleteKey",
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteVendorKey(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);

/* APIs */
export const fetchApisThunk = createAsyncThunk(
  "vendorApiKeys/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.fetchAllProducts();

      // 🔥 handle all backend shapes
      return (
        res.data?.data ||
        res.data?.products ||
        res.data ||
        []
      );

    } catch (e) {
      return rejectWithValue(
        e.response?.data || e.message
      );
    }
  }
);
/* Product Vendor Mapping */

export const createProductVendorMappingThunk = createAsyncThunk(
  "vendorApiKeys/createMapping",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.createProductVendorMapping(data);
      return res.data.mapping;
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);


export const fetchProductVendorMappingsThunk = createAsyncThunk(
  "vendorApiKeys/fetchMappings",
  async (product_id, { rejectWithValue }) => {
    try {
      const res = await api.fetchProductVendorMappings(product_id);

      return {
        product_id,
        mappings: res.data.mappings || [],
      };
    } catch (e) {
      return rejectWithValue(e.response?.data || e.message);
    }
  }
);



/* ================= SLICE ================= */

const vendorApiKeysSlice = createSlice({
  name: "vendorApiKeys",
  initialState: {
    vendors: [],
    apis: [],
    productMappings: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* Vendors */
      .addCase(fetchVendorsThunk.fulfilled, (state, action) => {
        state.vendors = action.payload.map(v => ({
    ...v,
    id: v._id,
    keys: state.vendors.find(x => x.id === v._id)?.keys || [],
  }));
      })

      .addCase(addVendorThunk.fulfilled, (state, action) => {
        state.vendors.push({
          ...action.payload,
          id: action.payload._id,
          keys: [],
        });
      })

      .addCase(updateVendorThunk.fulfilled, (state, action) => {
        const v = state.vendors.find(x => x.id === action.payload._id);
        if (v) Object.assign(v, action.payload);
      })

      .addCase(deleteVendorThunk.fulfilled, (state, action) => {
        state.vendors = state.vendors.filter(v => v.id !== action.payload);
      })

      /* Keys */
      .addCase(fetchKeysThunk.fulfilled, (state, action) => {
        // reset keys
  state.vendors.forEach(v => (v.keys = []));

  // 🔥 ensure payload is always array
  const keys = Array.isArray(action.payload)
    ? action.payload
    : [action.payload];

  keys.forEach(k => {
    const vendorId =
      k.vendor_id ||
      k.vendor?._id ||
      k.vendor;

    const apiId =
      k.api_id ||
      k.api;

    const vendor = state.vendors.find(v => v.id === vendorId);

    if (vendor) {
      vendor.keys.push({
  id: k._id || k.key_id,

  key_label: k.key_label || "Default Key",

  api_key: k.api_key || "",

  api_secret: k.api_secret || "",

  env: k.env || "test",

  valid_till: k.valid_till || null,

  status: k.status || "active",

  vendor_id: vendorId,

  api_id: apiId,

  // 🔥 UI expects array
  assigned_apis: apiId ? [apiId] : [],
});

    }
  });
      })

      .addCase(addKeyThunk.fulfilled, (state, action) => {
        const vendorId = String(action.payload.vendor_id);

  const vendor = state.vendors.find(
    v => String(v.id) === vendorId
  );

  if (vendor) {
    vendor.keys.push({
      id: action.payload.key_id || action.payload._id,
      key_label: "API Key",
      api_key: "••••••••",
      api_secret: "••••••••",
      env: "test",
      valid_till: null,
      status: "active",
      vendor_id: vendorId,
      api_id: action.payload.api_id,
      assigned_apis: [action.payload.api_id],
    });
  }
      })

      .addCase(updateKeyThunk.fulfilled, (state, action) => {
        state.vendors.forEach(v => {
          const k = v.keys.find(x => x.id === action.payload._id);
          if (k) Object.assign(k, action.payload);
        });
      })

      .addCase(deleteKeyThunk.fulfilled, (state, action) => {
        state.vendors.forEach(v => {
          v.keys = v.keys.filter(k => k.id !== action.payload);
        });
      })
      /* Product Vendor Mapping */

.addCase(fetchProductVendorMappingsThunk.fulfilled, (state, action) => {
  state.productMappings[action.payload.product_id] =
    action.payload.mappings;
})

.addCase(createProductVendorMappingThunk.fulfilled, (state, action) => {
  if (!action.payload) return;

  const pId = action.payload.product_id;
  if (!pId) return;

  if (!state.productMappings[pId]) {
    state.productMappings[pId] = [];
  }

  state.productMappings[pId].push(action.payload);
})


      /* APIs */
      .addCase(fetchApisThunk.fulfilled, (state, action) => {
        const products = Array.isArray(action.payload)
    ? action.payload
    : [];

  state.apis = products.map(p => ({
    id: p._id,
    name: p.product_name || p.name,
  }));
      });
  },
});

export default vendorApiKeysSlice.reducer;
