import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userExist: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.isLoggedIn = false;
      state.user = null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const { userExist, userNotExist, logout } = userSlice.actions;
export default userSlice.reducer;
