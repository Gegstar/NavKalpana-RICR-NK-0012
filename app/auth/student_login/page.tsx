"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Skeleton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "@/styles/StudentLogin.module.css";
import { defaultService } from "@/services/default.service";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";

export default function LoginPage() {
  const router = useRouter();

  // ================= STATE =================
  const [authSettings, setAuthSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [loginLoading, setLoginLoading] = useState(false);

  // ================= FETCH SETTINGS =================
  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await defaultService.getSettings({
        subdomain: "test.rajexpress.com",
      });

      setAuthSettings(response.data?.auth_settings);
    } catch (error) {
      toastService.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ================= VALIDATION =================
  const validate = () => {
    const newErrors: any = {};

    if (!form.identifier) {
      newErrors.identifier = "Email or Username is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ================= LOGIN HANDLER =================
  const handleLogin = async () => {
    if (!validate()) return;

    setLoginLoading(true);

    try {
      const res = await toastService.promise(
        authService.login({
          identifier: form.identifier,
          password: form.password,
        }),
        {
          loading: "Signing in...",
          success: "Login successful 🎉",
          error: (err) =>
            err?.response?.data?.message || "Login failed",
        }
      );

      // ✅ use service (BEST PRACTICE)
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
    <div className={styles.loginContainer}>
      <Paper elevation={3} className={styles.paperCard}>
        <Box sx={{ p: 4 }}>
          {/* ===== TITLE ===== */}
          {loading ? (
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              sx={{ mx: "auto" }}
            />
          ) : (
            <Typography variant="h4" align="center">
              Sign In to SkillVerse
            </Typography>
          )}

          {/* ===== FORM ===== */}
          <Box component="form" noValidate>
            {loading ? (
              <>
                <Skeleton variant="rectangular" height={56} sx={{ my: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ my: 1 }} />
                <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Email or Username"
                  margin="normal"
                  value={form.identifier}
                  error={!!errors.identifier}
                  helperText={errors.identifier}
                  onChange={(e) =>
                    setForm({ ...form, identifier: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  value={form.password}
                  error={!!errors.password}
                  helperText={errors.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLogin();
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleLogin}
                  disabled={loginLoading}
                >
                  {loginLoading ? "Signing in..." : "Sign In"}
                </Button>
              </>
            )}
          </Box>

          {/* ===== SOCIAL LOGIN ===== */}
          {!loading && authSettings?.social_login && (
            <Box mt={3} textAlign="center">
              <Typography>Or sign in with</Typography>

              <Box mt={2} display="flex" flexDirection="column" gap={1}>
                {authSettings.social_login.google && (
                  <Button variant="outlined" onClick={handleGoogleLogin}>
                    Continue with Google
                  </Button>
                )}

                {authSettings.social_login.facebook && (
                  <Button variant="outlined" onClick={handleFacebookLogin}>
                    Continue with Facebook
                  </Button>
                )}

                {authSettings.social_login.microsoft && (
                  <Button variant="outlined" onClick={handleMicrosoftLogin}>
                    Continue with Microsoft
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {/* ===== SIGNUP ===== */}
          {!loading && authSettings?.student_signup_enabled && (
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don’t have an account?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => router.push("/signup")}
                >
                  Sign Up
                </span>
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </div>
  );
}