"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Paper,
  FormGroup,
  Divider,
  Typography,
} from "@mui/material";
import { businessUnitService } from "@/services/businessUnit.service";
import { toastService } from "@/services/toast.service";
import "@/styles/App.css";

export default function BusinessUnitDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  console.log(id)
  const isNew = id === "new";

  const [data, setData] = useState<any>({
    name: "",
    description: "",
    domain: "",
    subdomain: "",

    email_verification_required: false,
    student_signup_enabled: true,

    google_login_enabled: false,
    facebook_login_enabled: false,
    microsoft_login_enabled: false,
    github_login_enabled: false,

    google_client_id: "",
    google_client_secret: "",

    facebook_client_id: "",
    facebook_app_secret: "",

    microsoft_client_id: "",
    microsoft_client_secret: "",

    github_client_id: "",
    github_client_secret: "",

    dark_mode_enabled: false,

    primary_color: "",
    primary_dark: "",
    primary_light: "",

    secondary_color: "",
    accent_color: "",

    background_color: "",
    surface_color: "",

    text_primary: "",
    text_secondary: "",
    text_muted: "",

    border_color: "",

    background_dark: "",
    surface_dark: "",

    text_primary_dark: "",
    text_secondary_dark: "",

    border_dark: "",

    gradient_primary: "",
    gradient_dark: "",
  });

  const [loading, setLoading] = useState(!isNew);

  // ================= VALIDATION =================
  const isFormValid = () => {
    if (!data.name?.trim()) return false;

    const providers = ["google", "facebook", "microsoft", "github"];

    for (const provider of providers) {
      if (data[`${provider}_login_enabled`]) {
        if (!data[`${provider}_client_id`]?.trim()) return false;

        if (provider === "facebook") {
          if (!data.facebook_app_secret?.trim()) return false;
        } else {
          if (!data[`${provider}_client_secret`]?.trim()) return false;
        }
      }
    }

    return true;
  };

  // ================= FETCH =================
  const fetchBusinessUnit = async (unitId: string) => {
    try {
      const res = await businessUnitService.getById(unitId);

      const safeData = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [k, v ?? ""])
      );

      setData((prev: any) => ({
        ...prev,
        ...safeData,
      }));
    } catch (error) {
      console.error("Error fetching business unit:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && id) {
      fetchBusinessUnit(id as string);
    } else {
      setLoading(false);
    }
  }, [id]);

  // ================= CHANGE =================
  const handleChange = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toastService.error("Please fill all required fields properly");
      return;
    }

    try {
      if (isNew) {
        await toastService.promise(
          businessUnitService.create(data),
          {
            loading: "Creating Business Unit...",
            success: "Business Unit created successfully!",
            error: (err) =>
              err?.response?.data?.message || "Failed to create Business Unit",
          }
        );
      } else {
        await toastService.promise(
          businessUnitService.update(id as string, data),
          {
            loading: "Updating Business Unit...",
            success: "Business Unit updated successfully!",
            error: (err) =>
              err?.response?.data?.message || "Failed to update Business Unit",
          }
        );
      }

      router.push("/business-units");
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper className="form-container form-80">
      {/* HEADER */}
      <Box className="form-header">
        <Typography variant="h5">
          {isNew ? "Create Business Unit" : "Edit Business Unit"}
        </Typography>

        <Box className="form-header-actions">
          <Button onClick={() => router.push("/business-units")} color="error">
            Cancel
          </Button>

          <Button
            type="submit"
            form="form"
            variant="contained"
            className="btn-primary"
            disabled={!isFormValid()} // 🔥 key
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* FORM */}
      <Box id="form" component="form" onSubmit={handleSubmit}>
        <FormGroup className="form-group">
          {/* BASIC */}
          <Typography variant="h6">Basic Info</Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Name"
              value={data.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!data.name}
              helperText={!data.name ? "Name is required" : ""}
              fullWidth
              required
            />
          </div>

          <div className="form-row grid-cols-1">
            <TextField
              label="Description"
              multiline
              rows={3}
              value={data.description}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
            />
          </div>

          <div className="form-row grid-cols-2">
            <TextField
              label="Domain"
              value={data.domain}
              onChange={(e) => handleChange("domain", e.target.value)}
              fullWidth
            />

            <TextField
              label="Subdomain"
              value={data.subdomain}
              onChange={(e) => handleChange("subdomain", e.target.value)}
              fullWidth
            />
          </div>

          <Divider />

          {/* SETTINGS */}
          <Typography variant="h6">Settings</Typography>

          <div className="form-row grid-cols-2">
            <FormControlLabel
              control={
                <Switch
                  checked={data.student_signup_enabled}
                  onChange={(e) =>
                    handleChange("student_signup_enabled", e.target.checked)
                  }
                />
              }
              label="Student Signup"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={data.email_verification_required}
                  onChange={(e) =>
                    handleChange(
                      "email_verification_required",
                      e.target.checked
                    )
                  }
                />
              }
              label="Email Verification Required"
            />
          </div>

          <Divider />

          {/* SOCIAL LOGIN */}
          <Typography variant="h6">Social Login</Typography>

          {["google", "facebook", "microsoft", "github"].map((provider) => (
            <div key={provider}>
              <FormControlLabel
                control={
                  <Switch
                    checked={data[`${provider}_login_enabled`]}
                    onChange={(e) =>
                      handleChange(
                        `${provider}_login_enabled`,
                        e.target.checked
                      )
                    }
                  />
                }
                label={provider.toUpperCase()}
              />

              {data[`${provider}_login_enabled`] && (
                <div className="form-row grid-cols-2">
                  <TextField
                    label={`${provider} Client ID`}
                    value={data[`${provider}_client_id`] || ""}
                    onChange={(e) =>
                      handleChange(`${provider}_client_id`, e.target.value)
                    }
                    error={!data[`${provider}_client_id`]}
                    helperText={
                      !data[`${provider}_client_id`]
                        ? "Client ID required"
                        : ""
                    }
                    fullWidth
                  />

                  <TextField
                    label={`${provider} Secret`}
                    value={
                      provider === "facebook"
                        ? data.facebook_app_secret
                        : data[`${provider}_client_secret`]
                    }
                    onChange={(e) =>
                      handleChange(
                        provider === "facebook"
                          ? "facebook_app_secret"
                          : `${provider}_client_secret`,
                        e.target.value
                      )
                    }
                    error={
                      provider === "facebook"
                        ? !data.facebook_app_secret
                        : !data[`${provider}_client_secret`]
                    }
                    helperText={
                      provider === "facebook"
                        ? !data.facebook_app_secret
                          ? "App Secret required"
                          : ""
                        : !data[`${provider}_client_secret`]
                        ? "Client Secret required"
                        : ""
                    }
                    fullWidth
                  />
                </div>
              )}
            </div>
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
}