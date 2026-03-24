"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  InputAdornment,
  IconButton,
  MenuItem,
} from "@mui/material";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

import styles from "@/styles/StudentLogin.module.css";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";

// SAME THEME STYLE
const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
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
  },
};

export default function StaffLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
    role: "ADMIN",
  });

  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- VALIDATION ----------------
  const validateIdentifier = (value: string) => value.trim() !== "";
  const validatePassword = (value: string) => value.length >= 6;

  const isFormValid = () =>
    validateIdentifier(form.identifier) &&
    validatePassword(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!isFormValid()) {
      setTouched({ identifier: true, password: true });
      return;
    }

    setLoading(true);

    try {
      const res = await toastService.promise(
        authService.login(form),
        {
          loading: "Signing in...",
          success: "Welcome back 🎉",
          error: (err) =>
            err?.response?.data?.message || "Login failed",
        }
      );

      authService.setToken(res.access_token);
      router.push("/admin/dashboard");
    } catch (err) {
      // handled by toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div className={`${styles.authCard} ${styles.fadeIn}`}>
        {/* HEADER */}
        <div className={styles.headerSection}>
          <h2 className={styles.title}>Staff Login</h2>
          <p className={styles.subtitle}>
            Login as Admin or Instructor
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className={styles.formElement}
        >
          {/* ROLE FIELD */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <User size={16} className={styles.labelIcon} />
              Role
            </label>
            <TextField
              select
              fullWidth
              name="role"
              value={form.role}
              onChange={handleChange}
              sx={muiThemeStyles}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
            </TextField>
          </div>

          {/* IDENTIFIER */}
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
              placeholder="Enter email or username"
              error={touched.identifier && !validateIdentifier(form.identifier)}
              helperText={
                touched.identifier && !validateIdentifier(form.identifier)
                  ? "Required"
                  : ""
              }
              sx={muiThemeStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* PASSWORD */}
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
              placeholder="Enter password"
              error={touched.password && !validatePassword(form.password)}
              helperText={
                touched.password && !validatePassword(form.password)
                  ? "Minimum 6 characters"
                  : ""
              }
              sx={muiThemeStyles}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className={`${styles.loginBtn} ${loading ? styles.loading : ""}`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}