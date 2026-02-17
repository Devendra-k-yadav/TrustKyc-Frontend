import api from "../../api/axios";

/* ========== VENDORS ========== */

export const fetchVendors = () => api.get("/vendor/list");
export const createVendor = (data) => api.post("/vendor/add", data);
export const updateVendorApi = (id, data) =>
  api.put(`/vendor/${id}`, data);
export const deleteVendorApi = (id) =>
  api.delete(`/vendor/${id}`);

/* ========== KEYS ========== */

export const fetchKeys = () => api.get("/vendor/key/list");

export const addVendorKey = (data) =>
  api.post("/vendor/key/add", data);

export const updateVendorKey = (id, data) =>
  api.put(`/vendor/key/${id}`, data);

export const deleteVendorKey = (id) =>
  api.delete(`/vendor/key/${id}`);

/* ========== APIS (for assign) ========== */

// export const fetchApis = () => api.get("/api/list");

// all products (admin level)
export const fetchAllProducts = () =>
  api.get("/products");

/* ========== PRODUCT VENDOR MAPPING ========== */

export const createProductVendorMapping = (data) =>
  api.post("/product/vendor/map", data);

export const fetchProductVendorMappings = (product_id) =>
  api.get(`/product/vendor/${product_id}`);
