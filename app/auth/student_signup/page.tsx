"use client";

import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/StudentSignup.module.css';
import { authService } from "@/services/auth.service";
import { TextField, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { useAppSelector } from "@/store/store";
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { setTokens, setSettings } from "@/store/globalSlice";
import { LocalSignupRequest, VerifyAccountRequest } from '@/models/auth.model';
import Logo from '@/components/ui/Logo';
import gsap from 'gsap';
import * as THREE from 'three';
import PlainButton from '@/components/ui/PlainButton';

// MUI TextField styles (moved outside to avoid re‑creation)
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

export default function StudentSignup() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

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
  const [usernameEdited, setUsernameEdited] = useState(false);

  const settings = useAppSelector(state => state.global?.settings);
  const studentSignupEnabled = settings?.auth_settings?.student_signup_enabled;

  // Three.js particle background
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 20;
      posArray[i*3+1] = (Math.random() - 0.5) * 15;
      posArray[i*3+2] = (Math.random() - 0.5) * 10 - 5;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x3B82F6,
      transparent: true,
      opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 8;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.002;
      particlesMesh.rotation.y = time * 0.2;
      particlesMesh.rotation.x = Math.sin(time * 0.1) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    if (!settings) return;
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });
    tl.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(logoRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }, "-=0.3")
      .fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.2")
      .fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.2")
      .fromTo(footerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.1");
  }, [settings]);

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

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;
  const validateName = (name: string) => name.trim().length >= 2;
  const validateUsername = (username: string) => /^[a-zA-Z0-9_.]{3,100}$/.test(username);
  const isFormValid = () => validateName(form.fullName) && validateEmail(form.email) && validatePassword(form.password) && validateUsername(form.username);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updated = { ...prev, [name]: value };
      if (!usernameEdited && name === 'fullName') {
        let suggestedUsername = value.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
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

  const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

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
    if (!canResend) return;
    setLoading(true);
    const toastId = toast.loading("Resending OTP...");
    try {
      await authService.resendOtp(form.email);
      toast.success("OTP resent successfully! 📧", { id: toastId });
      setTimer(60);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resend OTP", { id: toastId });
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
        const verifyData: VerifyAccountRequest = { userId: form.email, otp: otpValue };
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
      {/* Three.js canvas container */}
      <div ref={canvasContainerRef} className={styles.canvasContainer} />

      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div ref={cardRef} className={styles.authCard}>
        <div ref={logoRef} className={styles.logoSection}>
          <Logo />
        </div>

        <div className={styles.headerSection}>
          <h2 ref={titleRef} className={styles.title}>
            {isOtpSent ? 'Verify Email' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {isOtpSent ? `Enter the 6-digit code sent to ${form.email}` : 'Fill in your details to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.formElement}>
          {!isOtpSent ? (
            <div ref={formRef}>
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
            </div>
          ) : (
            <div ref={formRef} className={styles.otpSection}>
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

          {/* Submit Button – using PlainButton */}
          <PlainButton
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            loading={loading}
            disabled={loading || (!isOtpSent && !isFormValid())}
          >
            {isOtpSent ? 'Verify & Create Account' : 'Get OTP'}
          </PlainButton>
        </form>

        <p ref={footerRef} className={styles.footerText}>Already have an account? <Link href="/auth/student_login" className={styles.loginLink}>Sign in</Link></p>
      </div>
    </div>
  );
}
