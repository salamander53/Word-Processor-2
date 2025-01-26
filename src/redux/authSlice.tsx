// redux/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

const initialState: AuthState = {
  token: null,
  tokenPayload: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
    },
    setTokenPayload(state, action: PayloadAction<{ tokenPayload: any }>) {
      state.tokenPayload = action.payload.tokenPayload;
    },
    clearAuth(state) {
      state.token = null;
      state.tokenPayload = null;
    },
  },
});

export const { setToken, setTokenPayload, clearAuth } = authSlice.actions;

export default authSlice.reducer;
