'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authService } from "@/services/auth.service";
import { toastService } from "@/services/toast.service";

export default function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toastService.error("Authentication failed");
      router.replace("/login");
      return;
    }

    try {
      // Save token
      authService.setToken(token);

      // Success message
      toastService.success("Login successful 🎉");

      // Redirect
      router.replace("/dashboard");
    } catch (error) {
      toastService.error("Something went wrong");
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <Box
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="h6">
        Logging you in...
      </Typography>
    </Box>
  );
}