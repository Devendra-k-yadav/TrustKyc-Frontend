// src/api/axios
import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const attachAccessToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  res => res,
  async error => {
    const originalReq = error.config;

    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.includes("refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalReq.headers.Authorization = `Bearer ${token}`;
          return API(originalReq);
        });
      }

      originalReq._retry = true;
      isRefreshing = true;

      try {
        const res = await API.post(
  "/auth/refresh-token",
  {},
  { withCredentials: true }
);


        const { accessToken } = res.data;
        attachAccessToken(accessToken);
        processQueue(null, accessToken);

        originalReq.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalReq);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
