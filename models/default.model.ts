/* ============================
   DEFAULT (SETTINGS) MODELS
============================ */

/* ✅ Theme Colors */
export interface ThemeColors {
  primary: string;
  secondary: string;
  text: string;
  background: string;
}

/* ✅ Theme Settings */
export interface ThemeSettings {
  dark_mode_enabled: boolean;
  colors: ThemeColors;
}

/* ✅ Auth Settings */
export interface AuthSettings {
  student_signup_enabled: boolean;

  social_login: {
    google: boolean;
    facebook: boolean;
    microsoft: boolean;
  };
}

/* ✅ Site Settings */
export interface SiteSettings {
  email_verification_required: boolean;
}

/* ✅ Full Business Unit Settings */
export interface DefaultSettings {
  id: string;
  name: string;

  site_settings: SiteSettings;
  auth_settings: AuthSettings;
  theme_settings: ThemeSettings;
}

/* ============================
   REQUEST MODELS
============================ */

export interface GetSettingsRequest {
  subdomain: string;
}

/* ============================
   COMMON API RESPONSE
============================ */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}