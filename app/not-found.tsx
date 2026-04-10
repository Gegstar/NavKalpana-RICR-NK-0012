"use client";

import Link from "next/link";
import { Button, Typography, Container, Box } from "@mui/material";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
        className="animate-fade"
      >
        <AlertTriangle size={64} style={{ color: "var(--color-accent)" }} />
        <Typography variant="h3" fontWeight={700} color="var(--color-text-primary)">
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="var(--color-text-secondary)">
          Oops! The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          component={Link}
          href="/"
          variant="contained"
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            backgroundColor: "var(--color-primary)",
            "&:hover": { backgroundColor: "var(--color-primary-dark)" },
          }}
        >
          Return Home
        </Button>
      </Box>
    </Container>
  );
}
