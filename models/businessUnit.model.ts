export interface BusinessUnit {
  id: string;
  name: string;
  description?: string | null;

  // DOMAIN
  domain?: string | null;
  subdomain?: string | null;

  // SETTINGS
  email_verification_required: boolean;
  student_signup_enabled: boolean;

  // SOCIAL AUTH FLAGS
  google_login_enabled: boolean;
  facebook_login_enabled: boolean;
  microsoft_login_enabled: boolean;
  github_login_enabled: boolean;

  // SOCIAL AUTH KEYS 🔥
  google_client_id?: string | null;
  google_client_secret?: string | null;

  facebook_client_id?: string | null;
  facebook_app_secret?: string | null;

  microsoft_client_id?: string | null;
  microsoft_client_secret?: string | null;

  github_client_id?: string | null;
  github_client_secret?: string | null;

  // THEME 🎨
  dark_mode_enabled: boolean;

  primary_color?: string | null;
  primary_dark?: string | null;
  primary_light?: string | null;

  secondary_color?: string | null;
  accent_color?: string | null;

  background_color?: string | null;
  surface_color?: string | null;

  text_primary?: string | null;
  text_secondary?: string | null;
  text_muted?: string | null;

  border_color?: string | null;

  background_dark?: string | null;
  surface_dark?: string | null;

  text_primary_dark?: string | null;
  text_secondary_dark?: string | null;

  border_dark?: string | null;

  gradient_primary?: string | null;
  gradient_dark?: string | null;

  created_at: string;
}