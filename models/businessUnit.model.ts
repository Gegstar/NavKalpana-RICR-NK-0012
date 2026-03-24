export interface BusinessUnit {
  id: string;
  name: string;
  description?: string;

  // DOMAIN
  domain?: string;
  subdomain?: string;

  // SETTINGS
  email_verification_required: boolean;
  student_signup_enabled: boolean;

  // SOCIAL AUTH
  google_login_enabled: boolean;
  facebook_login_enabled: boolean;
  microsoft_login_enabled: boolean;
  github_login_enabled: boolean;

  // THEME 🎨
  dark_mode_enabled: boolean;

  primary_color?: string;
  primary_dark?: string;
  primary_light?: string;

  secondary_color?: string;
  accent_color?: string;

  background_color?: string;
  surface_color?: string;

  text_primary?: string;
  text_secondary?: string;
  text_muted?: string;

  border_color?: string;

  background_dark?: string;
  surface_dark?: string;

  text_primary_dark?: string;
  text_secondary_dark?: string;

  border_dark?: string;

  gradient_primary?: string;
  gradient_dark?: string;

  created_at: string;
}