import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
      state.didTryAutoLogin = true;
    },
    logout: (state) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
    setDidTryAutoLogin: (state, action) => {
      state.didTryAutoLogin = true;
    },
    updateLoggedInUserData: (state, action) => {
      state.userData = { ...state.userData, ...action.payload.newData };
    },
    firstTimeUser: (state, action) => {
      state.firstTime = true;
    },
  },
});
// export const subsriptionPurchased = authSlice.actions.subsriptionPurchased;
export const firstTimeUser = authSlice.actions.firstTimeUser;
export const updateLoggedInUserData = authSlice.actions.updateLoggedInUserData;
export const setDidTryAutoLogin = authSlice.actions.setDidTryAutoLogin;
export const logout = authSlice.actions.logout;
export const authenticate = authSlice.actions.authenticate;
export default authSlice.reducer;
