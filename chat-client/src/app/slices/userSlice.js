import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { isAuthenticated: false, user: null },
  reducers: {
    setLogin: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    // eslint-disable-next-line no-unused-vars
    setLogout: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;

export default userSlice.reducer;
