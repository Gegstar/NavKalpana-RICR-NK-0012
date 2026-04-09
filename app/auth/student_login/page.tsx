"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TextField,
  Skeleton,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Chrome, Facebook, Mic2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import gsap from "gsap";
import * as THREE from "three";
import styles from "@/styles/StudentLogin.module.css";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";
import { useAppSelector } from "@/redux/store";
import Logo from "@/components/ui/Logo";
import PlainButton from "@/components/ui/PlainButton";

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
  const cardRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [touched, setTouched] = useState({ identifier: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const settings = useAppSelector((state) => state.global.settings);
  const authSettings = settings?.auth_settings;
  const loading = !settings;

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
    if (loading) return;
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power3.out" } });
    tl.fromTo(cardRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0 })
      .fromTo(logoRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }, "-=0.3")
      .fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.2")
      .fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.2")
      .fromTo(socialRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, "-=0.1");
  }, [loading]);

  const validateIdentifier = (value: string) => value.trim() !== "";
  const validatePassword = (value: string) => value.length >= 6;
  const isFormValid = () => validateIdentifier(form.identifier) && validatePassword(form.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      setTouched({ identifier: true, password: true });
      return;
    }
    setLoginLoading(true);
    try {
      const res = await toastService.promise(
        authService.login({ identifier: form.identifier, password: form.password, role: "STUDENT" }),
        { loading: "Signing in...", success: "Login successful 🎉", error: (err) => err?.response?.data?.message || "Login failed" }
      );
      authService.setToken(res.access_token);
      router.push("/dashboard");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => authService.loginWithGoogle();
  const handleFacebookLogin = () => authService.loginWithFacebook();
  const handleMicrosoftLogin = () => authService.loginWithMicrosoft();

  return (
    <div className={styles.authWrapper}>
      {/* Three.js canvas container */}
      <div ref={canvasContainerRef} className={styles.canvasContainer} />

      <div className={styles.bgCircle1}></div>
      <div className={styles.bgCircle2}></div>

      <div ref={cardRef} className={`${styles.authCard} ${styles.fadeIn}`}>
        <div ref={logoRef} className={styles.logoSection}>
          <Logo />
        </div>

        <div className={styles.headerSection}>
          <h2 ref={titleRef} className={styles.title}>
            {loading ? <Skeleton width="60%" height={40} /> : "Welcome Back"}
          </h2>
          {!loading && <p className={styles.subtitle}>Sign in to continue learning</p>}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className={styles.formElement}>
          {loading ? (
            <>
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={56} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="rectangular" height={48} sx={{ mt: 2, borderRadius: 1 }} />
            </>
          ) : (
            <div ref={formRef}>
              <div className={styles.formGroup}>
                <TextField
                  fullWidth
                  name="identifier"
                  value={form.identifier}
                  onChange={handleChange}
                  onBlur={() => handleBlur("identifier")}
                  placeholder="Enter your email or username"
                  variant="outlined"
                  error={touched.identifier && !validateIdentifier(form.identifier)}
                  helperText={touched.identifier && !validateIdentifier(form.identifier) ? "Email or username is required" : ""}
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

              <div className={styles.formGroup}>
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
                  helperText={touched.password && !validatePassword(form.password) ? "Minimum 6 characters required" : ""}
                  sx={muiThemeStyles}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock size={18} color="#64748B" /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#64748B" }}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div style={{ textAlign: "right", marginTop: "8px" }}>
                <Link href="/auth/forgot_password" className={styles.forgotLink}>Forgot Password?</Link>
              </div>

              <PlainButton
                variant="primary"
                size="large"
                fullWidth
                loading={loginLoading}
                onClick={handleLogin}
                disabled={loginLoading}
              >
                Sign In
              </PlainButton>
            </div>
          )}
        </form>

        {!loading && authSettings?.social_login && (
          <div ref={socialRef} className={styles.socialSection}>
            <div className={styles.socialDivider}><span>Or continue with</span></div>
            <div className={styles.socialButtons}>
              {authSettings.social_login.google && (
                <button onClick={handleGoogleLogin} className={styles.socialButton}>
                  <Chrome size={20} /> Continue with Google
                </button>
              )}
              {authSettings.social_login.facebook && (
                <button onClick={handleFacebookLogin} className={styles.socialButton}>
                  <Facebook size={20} /> Continue with Facebook
                </button>
              )}
              {authSettings.social_login.microsoft && (
                <button onClick={handleMicrosoftLogin} className={styles.socialButton}>
                  <Mic2 size={20} /> Continue with Microsoft
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && authSettings?.student_signup_enabled && (
          <p className={styles.footerText}>
            Don’t have an account? <Link href="/auth/student_signup" className={styles.signupLink}>Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
}