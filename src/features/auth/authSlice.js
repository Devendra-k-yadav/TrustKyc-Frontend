import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  refreshToken,
  getMe,
  register,
  login,
  sendOtp,
  verifyOtp,
  updatePassword,
  forgotPassword,
  logout,
} from "./authService";
import { attachAccessToken } from "../../api/axios";

/* =====================================================
   INIT AUTH (refresh token + /me)
===================================================== */
export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { rejectWithValue }) => {
    try {
      const refreshRes = await refreshToken();

      if (refreshRes?.accessToken) {
        attachAccessToken(refreshRes.accessToken);

        const meRes = await getMe();

        return {
          user: meRes.user,
          accessToken: refreshRes.accessToken,
        };
      }

      return rejectWithValue("No active session");
    } catch (err) {
      return rejectWithValue("Auth init failed");
    }
  }
);

/* =====================================================
   REGISTER
===================================================== */
export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await register({
  email,
  password,
  name: email.split("@")[0],
});

      if (data.accessToken) {
        attachAccessToken(data.accessToken);
      }

    
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   LOGIN
===================================================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await login({ email, password });

      attachAccessToken(data.accessToken);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   OTP SEND
===================================================== */
export const sendOtpThunk = createAsyncThunk(
  "auth/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const data = await sendOtp(email);

      if (data?.success) {
        toast.success(data.message || "OTP sent");
      }

      return data;
    } catch (err) {
      toast.error("OTP sending failed");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   OTP VERIFY
===================================================== */
export const verifyOtpThunk = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const data = await verifyOtp({ email, otp });

      attachAccessToken(data.accessToken);
      toast.success("OTP verified successfully");

      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   PASSWORD UPDATE
===================================================== */
export const updatePasswordThunk = createAsyncThunk(
  "auth/updatePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      await updatePassword({ oldPassword, newPassword });
      toast.success("Password updated");
      return true;
    } catch (err) {
      toast.error("Password update failed");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   FORGOT PASSWORD
===================================================== */
export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      await forgotPassword(email);
      toast.success("Reset link sent to email");
      return true;
    } catch (err) {
      toast.error("Forgot password failed");
      return rejectWithValue();
    }
  }
);

/* =====================================================
   LOGOUT
===================================================== */
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  await logout();
  attachAccessToken(null);
});

/* =====================================================
   SLICE
===================================================== */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    loadingUser: true, // 🔥 IMPORTANT FOR PERSIST FIX
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* INIT */
      .addCase(initAuth.pending, (state) => {
        state.loadingUser = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loadingUser = false;
      })
      .addCase(initAuth.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.loadingUser = false;
      })

      /* LOGIN */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      /* OTP VERIFY */
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })

      /* LOGOUT */
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.loadingUser = false;
      });
  },
});

/* =====================================================
   SELECTORS
===================================================== */
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuth = (state) => Boolean(state.auth.user);
export const selectRole = (state) =>
  state.auth.user?.role?.toUpperCase() || null;

export default authSlice.reducer;
