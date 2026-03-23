import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// ✅ Extend state
interface GlobalState {
  accessToken: string | null;
  refreshToken: string | null;
  settings: any; // 🔥 ADD THIS
}

// ✅ Initial state
const initialState: GlobalState = {
  accessToken: null,
  refreshToken: null,
  settings: null, // 🔥 INIT
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // ==========================
    // 🔐 AUTH TOKENS
    // ==========================
    setTokens: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    // ==========================
    // ⚙️ SETTINGS (NEW)
    // ==========================
    setSettings: (state, action: PayloadAction<any>) => {
      state.settings = action.payload;
    },

    // ==========================
    // 🚪 LOGOUT
    // ==========================
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.settings = null; // 🔥 CLEAR SETTINGS ALSO
    },
  },
});

// ✅ EXPORT ACTIONS
export const { setTokens, setSettings, logout } = globalSlice.actions;

// ✅ EXPORT REDUCER
export default globalSlice.reducer;