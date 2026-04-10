"use client";

import { useEffect } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

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
        <AlertCircle size={64} style={{ color: "var(--color-primary)" }} />
        <Typography variant="h3" fontWeight={700} color="var(--color-text-primary)">
          Something went wrong!
        </Typography>
        <Typography variant="body1" color="var(--color-text-secondary)">
          We encountered an unexpected error while loading this page. Our team has been notified.
        </Typography>
        <Button
          variant="contained"
          onClick={() => reset()}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            backgroundColor: "var(--color-primary)",
            "&:hover": { backgroundColor: "var(--color-primary-dark)" },
          }}
        >
          Try again
        </Button>
      </Box>
    </Container>
  );
}
