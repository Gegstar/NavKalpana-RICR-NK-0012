"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
  Box,
} from "@mui/material";
import { ArrowBack, Email, Lock } from "@mui/icons-material";
import gsap from "gsap";
import * as THREE from "three";
import styles from "@/styles/ForgotPassword.module.css";
import Logo from "@/components/ui/Logo";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";

// Shared MUI styles (matches login page)
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

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [error, setError] = useState<{ type: "email" | "otp" | "api"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null); // will be attached to the wrapper div
  const footerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isEmailValid = validateEmail(email);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Three.js background
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      posArray[i * 3] = (Math.random() - 0.5) * 20;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 15;
      posArray[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0x3B82F6, transparent: true, opacity: 0.4 });
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
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  // GSAP entrance
  useEffect(() => {
    if (!cardRef.current) return;
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });
    tl.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(headerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.3")
      .fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.2")
      .fromTo(footerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.1");
  }, []);

  // API handlers
  const handleSendOtp = async () => {
    if (!email) {
      setError({ type: "email", text: "Please enter your email" });
      return;
    }
    if (!validateEmail(email)) {
      setError({ type: "email", text: "Invalid email address" });
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await toastService.promise(
        authService.forgotPassword({ email }),
        {
          loading: "Sending OTP...",
          success: "OTP sent successfully! Check your email.",
          error: (err) => err?.response?.data?.message || "Failed to send OTP",
        }
      );
      setOtpSent(true);
      setTimer(30);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch {
      setError({ type: "api", text: "Failed to send OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await toastService.promise(
        authService.resendOtp(email),
        {
          loading: "Resending OTP...",
          success: "OTP resent successfully!",
          error: (err) => err?.response?.data?.message || "Failed to resend OTP",
        }
      );
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setError(null);
    } catch {
      setError({ type: "api", text: "Failed to resend OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
  if (e.key === 'Backspace' && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      pastedData.split("").forEach((char, i) => { if (i < 6) newOtp[i] = char; });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError({ type: "otp", text: "Please enter all 6 digits" });
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await toastService.promise(
        authService.verifyResetOtp({ email, otp: otpValue }),
        {
          loading: "Verifying OTP...",
          success: "OTP verified! Redirecting to reset password...",
          error: (err) => err?.response?.data?.message || "Invalid OTP",
        }
      );
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => router.push("/reset-password"), 2000);
    } catch {
      setError({ type: "otp", text: "Invalid OTP. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div ref={canvasContainerRef} className={styles.canvasContainer} />
      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div ref={cardRef} className={`${styles.authCard} ${styles.fadeIn}`}>
        <div className={styles.logoSection}>
          <Logo />
        </div>

        <div className={styles.headerSection}>
          <h2 ref={headerRef} className={styles.title}>
            {!otpSent ? "Forgot Password?" : "Verify OTP"}
          </h2>
          <p className={styles.subtitle}>
            {!otpSent
              ? "No worries! We'll send you reset instructions."
              : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {/* Outer form wrapper – keeps the onSubmit and prevents page reload */}
        <form onSubmit={(e) => e.preventDefault()} className={styles.formElement}>
          {/* This div holds the dynamic content and receives the GSAP ref */}
          <div ref={formRef}>
            {!otpSent ? (
              // Email step
              <>
                <div className={styles.formGroup}>
                  <TextField
                    fullWidth
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    variant="outlined"
                    error={error?.type === "email"}
                    helperText={error?.type === "email" ? error.text : ""}
                    disabled={isLoading}
                    sx={muiThemeStyles}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" htmlColor="#64748B" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
                {error?.type === "api" && <Alert severity="error" sx={{ mb: 2 }}>{error.text}</Alert>}

                <button
                  type="button"
                  className={`${styles.loginBtn} ${isLoading ? styles.loading : ""}`}
                  onClick={handleSendOtp}
                  disabled={!isEmailValid || isLoading}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Send OTP"}
                </button>
              </>
            ) : (
              // OTP step
              <form onSubmit={handleVerifyOtp}>
                <div className={styles.otpSection}>
                  <label className={styles.label}>6-Digit Code</label>
                  <div className={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}  // ✅ now works
                        onPaste={index === 0 ? handlePaste : undefined}
                        disabled={isLoading}
                        autoComplete="off"
                        error={error?.type === "otp"}
                        size="small"
                        sx={{
                          width: "56px",
                          "& .MuiInputBase-input": { textAlign: "center", fontSize: "1.2rem", fontWeight: 600 },
                        }}
                      />
                    ))}
                  </div>
                  {error?.type === "otp" && <Alert severity="error" sx={{ mt: 1 }}>{error.text}</Alert>}
                  <div className={styles.timerSection}>
                    {!canResend ? (
                      <p className={styles.timer}>Resend code in <span>{timer}s</span></p>
                    ) : (
                      <button type="button" onClick={handleResendOtp} className={styles.resendButton} disabled={isLoading}>
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>

                {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

                <button
                  type="submit"
                  className={`${styles.loginBtn} ${isLoading ? styles.loading : ""}`}
                  disabled={otp.join("").length !== 6 || isLoading}
                >
                  {isLoading ? <CircularProgress size={20} color="inherit" /> : "Verify OTP"}
                </button>
              </form>
            )}
          </div>
        </form>

        <div ref={footerRef} className={styles.footerText}>
          <Button
            component={Link}
            href="/auth/student_login"
            startIcon={<ArrowBack />}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: "var(--color-text-secondary)",
              "&:hover": { color: "var(--color-primary)" },
            }}
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
