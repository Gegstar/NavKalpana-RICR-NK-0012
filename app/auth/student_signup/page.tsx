"use client";

import { useState, useEffect } from 'react';
import styles from '@/styles/StudentSignup.module.css';
import { authService } from "@/services/auth.service";
import { TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { LocalSignupRequest, VerifyAccountRequest } from '@/models/auth.model';

export default function StudentSignup() {
  const router = useRouter();

  const [form, setForm] = useState<LocalSignupRequest>({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ fullName: false, username: false, email: false, password: false });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usernameEdited, setUsernameEdited] = useState(false); // tracks if user manually changed username

  const settings = useAppSelector(state => state.global?.settings);
  const studentSignupEnabled = settings?.auth_settings?.student_signup_enabled;

  // ------------------ Effects ------------------
  useEffect(() => {
    if (settings && studentSignupEnabled === false) {
      router.replace("/404");
    }
  }, [settings, studentSignupEnabled, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  useEffect(() => {
    let strength = 0;
    const password = form.password;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [form.password]);

  // ------------------ Validation ------------------
  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;
  const validateName = (name: string) => name.trim().length >= 2;
  const validateUsername = (username: string) => /^[a-zA-Z0-9_.]{3,100}$/.test(username);
  const isFormValid = () => validateName(form.fullName) && validateEmail(form.email) && validatePassword(form.password) && validateUsername(form.username);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setForm(prev => {
    const updated = { ...prev, [name]: value };

    // Auto-fill username ONLY from fullName if not manually edited
    if (!usernameEdited && name === 'fullName') {
      let suggestedUsername = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, ''); // remove invalid chars

      // Optionally add a small random number for uniqueness
      const randomNumber = Math.floor(Math.random() * 100);
      suggestedUsername = suggestedUsername + randomNumber;

      updated.username = suggestedUsername;
    }

    return updated;
  });
};

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, username: e.target.value }));
    setUsernameEdited(true);
  };

  const handleBlur = (field: string) =>
    setTouched(prev => ({ ...prev, [field]: true }));

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp]; newOtp[index] = value; setOtp(newOtp);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp]; pastedData.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
      setOtp(newOtp);
      document.getElementById(`otp-${Math.min(pastedData.length, 5)}`)?.focus();
    }
  };

const handleResendOtp = async () => {
  if (!canResend) return; // ✅ prevent spam click

  setLoading(true);
  const toastId = toast.loading("Resending OTP...");

  try {
    await authService.resendOtp(form.email); // ✅ FIXED

    toast.success("OTP resent successfully! 📧", { id: toastId });

    setTimer(60);
    setCanResend(false);
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to resend OTP",
      { id: toastId }
    );
  } finally {
    setLoading(false);
  }
};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isOtpSent) {
      setTouched({ fullName: true, username: true, email: true, password: true });
      if (!isFormValid()) return toast.error("Please fix the errors in the form");

      setLoading(true);
      const toastId = toast.loading("Sending OTP to your email...");
      try {
        await authService.signup(form);
        toast.success("OTP sent successfully! 📧", { id: toastId });
        setIsOtpSent(true); setTimer(60);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to send OTP", { id: toastId });
      } finally { setLoading(false); }
    } else {
      setLoading(true);
      const toastId = toast.loading("Verifying OTP...");
      try {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) throw new Error("Please enter complete OTP");
        const verifyData: VerifyAccountRequest = { userId: form.email, otp: otpValue }; // assuming email as userId
        await authService.verifyAccount(verifyData);
        toast.success("Account verified successfully!", { id: toastId });
        setTimeout(() => router.push("/auth/student_login"), 2000);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Invalid OTP", { id: toastId });
        const otpContainer = document.querySelector(`.${styles.otpContainer}`);
        otpContainer?.classList.add(styles.shake);
        setTimeout(() => otpContainer?.classList.remove(styles.shake), 500);
      } finally { setLoading(false); }
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return '#EF4444';
    if (passwordStrength <= 3) return '#F59E0B';
    if (passwordStrength <= 4) return '#3B82F6';
    return '#10B981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  // ------------------ Render ------------------
  if (!settings) {
    return (
      <div className={styles.authWrapper}>
        <div className={styles.loaderContainer}>
          <CircularProgress size={40} color="inherit" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!studentSignupEnabled) {
    return (
      <div className={styles.authWrapper}>
        <p className={styles.disabledText}>Student signup is currently disabled.</p>
      </div>
    );
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div className={styles.authCard}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Skill</span>
            <span className={styles.logoHighlight}>Verse</span>
          </div>
        </div>

        <div className={styles.headerSection}>
          <h2 className={styles.title}>
            {isOtpSent ? 'Verify Email' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {isOtpSent ? `Enter the 6-digit code sent to ${form.email}` : 'Fill in your details to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formElement}>
          {!isOtpSent ? (
            <>
              {/* Full Name */}
              <div className={styles.formGroup}>
                <TextField
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  onBlur={() => handleBlur('fullName')}
                  required fullWidth
                  placeholder="Full Name"
                  variant="outlined"
                  error={touched.fullName && !validateName(form.fullName)}
                  helperText={touched.fullName && !validateName(form.fullName) ? "Name must be at least 2 characters" : ""}
                  sx={muiThemeStyles}
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color="#64748B" /></InputAdornment> }}
                />
              </div>

              {/* Username */}
              <div className={styles.formGroup}>
                <TextField
                  name="username"
                  value={form.username}
                  onChange={handleUsernameChange}
                  onBlur={() => handleBlur('username')}
                  required fullWidth
                  placeholder="Username"
                  variant="outlined"
                  error={touched.username && !validateUsername(form.username)}
                  helperText={touched.username && !validateUsername(form.username) ? "Invalid username" : ""}
                  sx={muiThemeStyles}
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color="#64748B" /></InputAdornment> }}
                />
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <TextField
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur('email')}
                  required fullWidth type="email"
                  placeholder="Email"
                  variant="outlined"
                  error={touched.email && !validateEmail(form.email)}
                  helperText={touched.email && !validateEmail(form.email) ? "Invalid email" : ""}
                  sx={muiThemeStyles}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color="#64748B" /></InputAdornment> }}
                />
              </div>

              {/* Password */}
              <div className={styles.formGroup}>
                <TextField
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  fullWidth required type={showPassword ? "text" : "password"}
                  placeholder="Password" variant="outlined"
                  error={touched.password && !validatePassword(form.password)}
                  helperText={touched.password && !validatePassword(form.password) ? "Password must be at least 6 characters" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} color="#64748B" /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</IconButton></InputAdornment>
                  }}
                />
              </div>
            </>
          ) : (
            <div className={styles.otpSection}>
              <label className={styles.label}>6-Digit Verification Code</label>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1}
                    value={digit} onChange={e => handleOtpChange(e.target.value, index)}
                    onKeyDown={e => handleOtpKeyDown(e, index)} onPaste={index === 0 ? handlePaste : undefined}
                    className={styles.otpInput} disabled={loading}
                  />
                ))}
              </div>
              <div className={styles.timerSection}>
                {!canResend ? <p className={styles.timer}>Resend code in <span>{timer}s</span></p>
                  : <button type="button" onClick={handleResendOtp} className={styles.resendButton} disabled={loading}>Resend OTP</button>}
              </div>
            </div>
          )}

          <button type="submit" className={`${styles.loginBtn} ${loading ? styles.loading : ''}`} disabled={loading || (!isOtpSent && !isFormValid())}>
            {loading ? <><CircularProgress size={20} color="inherit" /><span>Processing...</span></> : (isOtpSent ? 'Verify & Create Account' : 'Get OTP')}
          </button>
        </form>

        <p className={styles.footerText}>Already have an account? <Link href="/auth/student_login" className={styles.loginLink}>Sign in</Link></p>
      </div>
    </div>
  );
}

// MUI TextField Styles
const muiThemeStyles = {
  "& .MuiOutlinedInput-root": {
    color: "var(--text-primary)",
    borderRadius: "12px",
    backgroundColor: "#F8FAFC",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "var(--border-light)", borderWidth: "2px" },
    "&:hover fieldset": { borderColor: "var(--primary-yellow)" },
    "&.Mui-focused fieldset": { borderColor: "var(--primary-yellow)", borderWidth: "2px" },
    "&.Mui-error fieldset": { borderColor: "#EF4444" },
  },
  "& .MuiInputBase-input": {
    padding: "14px 14px 14px 0",
    "&::placeholder": { color: "var(--text-secondary)", opacity: 0.7 },
  },
  "& .MuiFormHelperText-root": {
    marginLeft: "0",
    color: "#EF4444",
    fontSize: "0.75rem",
  },
};