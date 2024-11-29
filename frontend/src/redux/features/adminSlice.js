import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  loading: false,
  isLoggedIn: false,
};

export const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    adminExist: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.admin = action.payload;
    },
    adminNotExist: (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.admin = null;
    },
    adminLogout: (state) => {
      state.isLoggedIn = false;
      state.admin = null;
    },
  },
});

export const { adminExist, adminNotExist, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
