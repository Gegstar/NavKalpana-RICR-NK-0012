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
import { courseService } from "@/services/course.service";
import { fileUploadService } from "@/services/fileUpload.service";
import { toastService } from "@/services/toast.service";
import { Course } from "@/models/course.model";
import "@/styles/App.css";

const initialState: Partial<Course> = {
  title: "",
  description: "",
  thumbnailUrl: "",
  price: 0,
  currency: "INR",
  isFree: false,
  isPublished: false,
  isActive: true,
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const courseId = Array.isArray(id) ? id[0] : id;
  const isNew = courseId === "new";

  const [data, setData] = useState<Partial<Course>>(initialState);
  const [loading, setLoading] = useState(!isNew);
  const [uploading, setUploading] = useState(false);

  const isFormValid = () => {
    return !!data.title?.trim();
  };

  // ================= FETCH =================
  const fetchCourse = async (courseId: string) => {
    try {
      const res = await courseService.getCourseById(courseId);

      const safeData = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [k, v ?? ""]),
      );

      setData((prev) => ({
        ...prev,
        ...safeData,
      }));
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNew && courseId) {
      fetchCourse(courseId);
    } else {
      setLoading(false);
    }
  }, [courseId]);

  // ================= CHANGE =================
  const handleChange = (field: keyof Course, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= FILE UPLOAD =================
  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const res = await toastService.promise(
        fileUploadService.upload(
          file,
          data.title?.trim() || "course",
          "courses",
        ),
        {
          loading: "Uploading image...",
          success: "Image uploaded successfully!",
          error: "Failed to upload image",
        },
      );

      setData((prev) => ({
        ...prev,
        thumbnailUrl: res.url,
      }));
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setUploading(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toastService.error("Please fill required fields");
      return;
    }

    try {
      if (isNew) {
        await toastService.promise(courseService.createCourse(data), {
          loading: "Creating course...",
          success: "Course created successfully!",
          error: (err) =>
            err?.response?.data?.message || "Failed to create course",
        });
      } else {
        const payload = {
          title: data.title,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          price: data.price,
          currency: data.currency,
          isFree: data.isFree,
          isPublished: data.isPublished,
          isActive: data.isActive,
        };
        await toastService.promise(
          courseService.updateCourse(courseId as string, payload),
          {
            loading: "Updating course...",
            success: "Course updated successfully!",
            error: (err) =>
              err?.response?.data?.message || "Failed to update course",
          },
        );
      }

      router.push("/courses");
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
      <Box className="form-header">
        <Typography variant="h5">
          {isNew ? "Create Course" : "Edit Course"}
        </Typography>

        <Box className="form-header-actions">
          <Button onClick={() => router.push("/courses")} color="error">
            Cancel
          </Button>

          <Button
            type="submit"
            form="course-form"
            variant="contained"
            className="btn-primary"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </Box>
      </Box>

      <Box id="course-form" component="form" onSubmit={handleSubmit}>
        <FormGroup className="form-group">
          <Typography variant="h6">Basic Info</Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Title"
              value={data.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              error={!data.title}
              helperText={!data.title ? "Title is required" : ""}
              fullWidth
              required
            />

            <Box>
              <Button
                component="label"
                variant="outlined"
                disabled={uploading}
                fullWidth
              >
                {uploading ? "Uploading..." : "Upload Thumbnail"}

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                />
              </Button>

              <TextField
                label="Thumbnail URL"
                value={data.thumbnailUrl || ""}
                onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
                fullWidth
                sx={{ mt: 1 }}
              />
            </Box>
          </div>
          <div className="form-row grid-cols-2">
            {data.thumbnailUrl && (
              <Box mt={2}>
                <img
                  src={data.thumbnailUrl}
                  alt="thumbnail"
                  style={{
                    width: 220,
                    borderRadius: 8,
                  }}
                />
              </Box>
            )}
          </div>
          <div className="form-row grid-cols-1">
            <TextField
              label="Description"
              multiline
              rows={4}
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
            />
          </div>

          <Divider />

          <Typography variant="h6">Pricing</Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Price"
              type="number"
              value={data.price ?? 0}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              fullWidth
            />

            <TextField
              label="Currency"
              value={data.currency || "INR"}
              onChange={(e) => handleChange("currency", e.target.value)}
              fullWidth
            />
          </div>

          <Divider />

          <Typography variant="h6">Settings</Typography>

          <div className="form-row grid-cols-2">
            <FormControlLabel
              control={
                <Switch
                  checked={!!data.isFree}
                  onChange={(e) => handleChange("isFree", e.target.checked)}
                />
              }
              label="Free Course"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={!!data.isPublished}
                  onChange={(e) =>
                    handleChange("isPublished", e.target.checked)
                  }
                />
              }
              label="Published"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={!!data.isActive}
                  onChange={(e) => handleChange("isActive", e.target.checked)}
                />
              }
              label="Active"
            />
          </div>
        </FormGroup>
      </Box>
    </Paper>
  );
}
