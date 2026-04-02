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
  MenuItem,
  Avatar,
} from "@mui/material";
import { usersService } from "@/services/users.service";
import { toastService } from "@/services/toast.service";
import "@/styles/App.css";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const isNew = id === "new";

  const [data, setData] = useState<any>({
    full_name: "",
    username: "",
    email: "",
    role: "STUDENT",

    profile_image: "",

    is_active: true,
    is_verified: false,

    business_unit_id: "",
  });

  const [loading, setLoading] = useState(!isNew);

  // ================= VALIDATION =================
  const isFormValid = () => {
    if (!data.full_name?.trim()) return false;
    if (!data.username?.trim()) return false;
    if (!data.email?.trim()) return false;
    if (!data.role) return false;

    return true;
  };

  // ================= FETCH =================
  const fetchUser = async (userId: string) => {
    try {
      const res = await usersService.getUserById(userId);

      const safeData = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [k, v ?? ""])
      );

      setData((prev: any) => ({
        ...prev,
        ...safeData,
      }));
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && id) {
      fetchUser(id as string);
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
      toastService.error("Please fill all required fields");
      return;
    }

    try {
      if (isNew) {
        await toastService.promise(usersService.createUser(data), {
          loading: "Creating user...",
          success: "User created successfully!",
          error: (err) =>
            err?.response?.data?.message || "Failed to create user",
        });
      } else {
        await toastService.promise(
          usersService.updateUser(id as string, data),
          {
            loading: "Updating user...",
            success: "User updated successfully!",
            error: (err) =>
              err?.response?.data?.message || "Failed to update user",
          }
        );
      }

      router.push("/users");
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
          {isNew ? "Create User" : "Edit User"}
        </Typography>

        <Box className="form-header-actions">
          <Button onClick={() => router.push("/users")} color="error">
            Cancel
          </Button>

          <Button
            type="submit"
            form="form"
            variant="contained"
            className="btn-primary"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* FORM */}
      <Box id="form" component="form" onSubmit={handleSubmit}>
        <FormGroup className="form-group">

          {/* BASIC INFO */}
          <Typography variant="h6">Basic Info</Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Full Name"
              value={data.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              error={!data.full_name}
              helperText={!data.full_name ? "Required" : ""}
              fullWidth
            />

            <TextField
              label="Username"
              value={data.username}
              onChange={(e) => handleChange("username", e.target.value)}
              error={!data.username}
              helperText={!data.username ? "Required" : ""}
              fullWidth
            />
          </div>

          <div className="form-row grid-cols-2">
            <TextField
              label="Email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!data.email}
              helperText={!data.email ? "Required" : ""}
              fullWidth
            />

            <TextField
              select
              label="Role"
              value={data.role}
              onChange={(e) => handleChange("role", e.target.value)}
              fullWidth
            >
              {["STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].map(
                (role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                )
              )}
            </TextField>
          </div>

          <Divider />

          {/* PROFILE */}
          <Typography variant="h6">Profile</Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Avatar src={data.profile_image || ""}>
              {data.full_name?.[0]}
            </Avatar>

            <TextField
              label="Profile Image URL"
              value={data.profile_image}
              onChange={(e) =>
                handleChange("profile_image", e.target.value)
              }
              fullWidth
            />
          </Box>

          <Divider />

          {/* STATUS */}
          <Typography variant="h6">Status</Typography>

          <div className="form-row grid-cols-2">
            <FormControlLabel
              control={
                <Switch
                  checked={data.is_active}
                  onChange={(e) =>
                    handleChange("is_active", e.target.checked)
                  }
                />
              }
              label="Active"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={data.is_verified}
                  onChange={(e) =>
                    handleChange("is_verified", e.target.checked)
                  }
                />
              }
              label="Verified"
            />
          </div>

          <Divider />

          {/* BUSINESS UNIT */}
          <Typography variant="h6">Business Unit</Typography>

          <div className="form-row grid-cols-1">
            <TextField
              label="Business Unit ID"
              value={data.business_unit_id || ""}
              onChange={(e) =>
                handleChange("business_unit_id", e.target.value)
              }
              fullWidth
            />
          </div>

        </FormGroup>
      </Box>
    </Paper>
  );
}