import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    logout: (state) => {
        state.currentUser = null;
    },
    updateUserInfo: (state, action) => {
      const updatedUser = {
        ...state.currentUser,
        ...action.payload,
        accessToken: state.currentUser.accessToken,
      };

      state.currentUser = updatedUser;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;