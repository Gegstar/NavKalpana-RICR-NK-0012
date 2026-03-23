"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TextField,
  Skeleton,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Chrome, Facebook, Mic2, Mail, Lock, Eye, EyeOff } from "lucide-react";

import styles from "@/styles/StudentLogin.module.css";
import { defaultService } from "@/services/default.service";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";
import { useAppSelector } from "@/redux/store";

// Shared styles for TextFields (matches signup page)
const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "var(--border-light)",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "var(--primary-yellow)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--primary-yellow)",
      borderWidth: "2px",
    },
    "&.Mui-error fieldset": {
      borderColor: "#EF4444",
    },
  },
  "& .MuiInputBase-input": {
    padding: "14px 14px 14px 0",
    "&::placeholder": {
      color: "var(--text-secondary)",
      opacity: 0.7,
    },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0",
    color: "#EF4444",
    fontSize: "0.75rem",
  },
};

export default function LoginPage() {
  const router = useRouter();


  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
//  REDUX DATA
const settings = useAppSelector((state) => state.global.settings);
const authSettings = settings?.auth_settings;

// LOADING STATE
const loading = !settings;
  useEffect(() => {
   // fetchSettings();
  }, []);

  // ================= VALIDATION =================
  const validateIdentifier = (value: string) => {
    return value.trim() !== "";
  };

  const validatePassword = (value: string) => {
    return value.length >= 6;
  };

  const isFormValid = () => {
    return validateIdentifier(form.identifier) && validatePassword(form.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ================= LOGIN HANDLER =================
  const handleLogin = async () => {
    if (!isFormValid()) {
      setTouched({ identifier: true, password: true });
      return;
    }

    setLoginLoading(true);

    try {
      const res = await toastService.promise(
        authService.login({
          identifier: form.identifier,
          password: form.password,
          role:"STUDENT"
        }),
        {
          loading: "Signing in...",
          success: "Login successful 🎉",
          error: (err) => err?.response?.data?.message || "Login failed",
        }
      );

      authService.setToken(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      // already handled by toast
    } finally {
      setLoginLoading(false);
    }
  };

  // ================= SOCIAL LOGIN =================
  const handleGoogleLogin = () => {
    authService.loginWithGoogle();
  };

  const handleFacebookLogin = () => {
    authService.loginWithFacebook();
  };

  const handleMicrosoftLogin = () => {
    authService.loginWithMicrosoft();
  };

  // ================= UI =================
  return (
    <div className={styles.authWrapper}>
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div className={`${styles.authCard} ${styles.fadeIn}`}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Skill</span>
            <span className={styles.logoHighlight}>Verse</span>
          </div>
        </div>

        <div className={styles.headerSection}>
          <h2 className={styles.title}>
            {loading ? <Skeleton width="60%" height={40} /> : "Welcome Back"}
          </h2>
          {!loading && (
            <p className={styles.subtitle}>Sign in to continue learning</p>
          )}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className={styles.formElement}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: 1 }} />
            </>
          ) : (   
            <>
              {/* Email / Username Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Mail size={16} className={styles.labelIcon} />
                  User ID
                </label>
                <TextField
                  fullWidth
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  onBlur={() => handleBlur("identifier")}
                  placeholder="Enter your email or username"
                  variant="outlined"
                  error={touched.identifier && !validateIdentifier(form.identifier)}
                  helperText={
                    touched.identifier && !validateIdentifier(form.identifier)
                      ? "Email or username is required"
                      : ""
                  }
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Password Field */}
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  <Lock size={16} className={styles.labelIcon} />
                 Password
                </label>
                <TextField
                  fullWidth
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  variant="outlined"
                  error={touched.password && !validatePassword(form.password)}
                  helperText={
                    touched.password && !validatePassword(form.password)
                      ? "Minimum 6 characters required"
                      : ""
                  }
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={18} color="#64748B" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#64748B" }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <button
                type="submit"
                className={`${styles.loginBtn} ${loginLoading ? styles.loading : ""}`}
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? "Signing in..." : "Sign In"}
              </button>
            </>
          )}
        </form>

        {/* Social Login Section */}
        {!loading && authSettings?.social_login && (
          <div className={styles.socialSection}>
            <div className={styles.socialDivider}>
              <span>Or continue with</span>
            </div>
            <div className={styles.socialButtons}>
              {authSettings.social_login.google && (
                <button onClick={handleGoogleLogin} className={styles.socialButton}>
                  <Chrome size={20} />
                  Continue with Google
                </button>
              )}
              {authSettings.social_login.facebook && (
                <button onClick={handleFacebookLogin} className={styles.socialButton}>
                  <Facebook size={20} />
                  Continue with Facebook
                </button>
              )}
              {authSettings.social_login.microsoft && (
                <button onClick={handleMicrosoftLogin} className={styles.socialButton}>
                  <Mic2 size={20} />
                  Continue with Microsoft
                </button>
              )}
            </div>
          </div>
        )}

        {/* Signup Link */}
        {!loading && authSettings?.student_signup_enabled && (
          <p className={styles.footerText}>
            Don’t have an account?{" "}
            <Link href="/auth/student_signup" className={styles.signupLink}>
              Sign Up
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}