import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GlobalState {
  accessToken: string | null;
  refreshToken: string | null;
  settings: any; // 🔥 ADD THIS
}

const initialState: GlobalState = {
  accessToken: null,
  refreshToken: null,
  settings: null, // 🔥 INIT
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // 🔐 AUTH TOKENS
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

    // ⚙️ SETTINGS (NEW)
    setSettings: (state, action: PayloadAction<any>) => {
      state.settings = action.payload;
    },

    // 🌗 TOGGLE DARK MODE
    toggleDarkMode: (state) => {
      if (!state.settings) {
        state.settings = { theme_settings: { dark_mode_enabled: true } };
      } else if (!state.settings.theme_settings) {
        state.settings.theme_settings = { dark_mode_enabled: true };
      } else {
        state.settings.theme_settings.dark_mode_enabled = !state.settings.theme_settings.dark_mode_enabled;
      }
    },

    // 🚪 LOGOUT
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.settings = null; 
    },
  },
});

export const { setTokens, setSettings, toggleDarkMode, logout } = globalSlice.actions;
export default globalSlice.reducer;
