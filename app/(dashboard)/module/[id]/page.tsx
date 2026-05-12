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
} from "@mui/material";

import { moduleService } from "@/services/module.service";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";

import { Module } from "@/models/module.model";
import { Course } from "@/models/course.model";

import "@/styles/App.css";

const initialState: Partial<Module> = {
  title: "",
  courseId: "",
  position: 1,
  isPublished: false,
};

export default function ModuleDetailPage() {
  const { id } = useParams();

  const router = useRouter();

  const moduleId = Array.isArray(id) ? id[0] : id;

  const isNew = moduleId === "new";

  const [data, setData] =
    useState<Partial<Module>>(initialState);

  const [courses, setCourses] = useState<Course[]>([]);

  const [loading, setLoading] = useState(!isNew);

  // =========================================================
  // VALIDATION
  // =========================================================

  const isFormValid = () => {
    return !!data.title?.trim() && !!data.courseId;
  };

  // =========================================================
  // FETCH MODULE
  // =========================================================

  const fetchModule = async (
    moduleId: string
  ) => {
    try {
      const res =
        await moduleService.getModuleById(
          moduleId
        );

      const safeData = Object.fromEntries(
        Object.entries(res).map(([k, v]) => [
          k,
          v ?? "",
        ])
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

  // =========================================================
  // FETCH COURSES
  // =========================================================

  const fetchCourses = async () => {
    try {
      const res =
        await courseService.getAllCourses();

      setCourses(res || []);
    } catch (err) {
      toastService.apiError(err);
    }
  };

  useEffect(() => {
    fetchCourses();

    if (!isNew && moduleId) {
      fetchModule(moduleId);
    } else {
      setLoading(false);
    }
  }, [moduleId]);

  // =========================================================
  // CHANGE
  // =========================================================

  const handleChange = (
    field: keyof Module,
    value: any
  ) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!isFormValid()) {
      toastService.error(
        "Please fill required fields"
      );

      return;
    }

    try {
      if (isNew) {
        await toastService.promise(
          moduleService.createModule(data),
          {
            loading: "Creating module...",
            success:
              "Module created successfully!",
            error: (err) =>
              err?.response?.data?.message ||
              "Failed to create module",
          }
        );
      } else {
        const payload = {
          title: data.title,
          courseId: data.courseId,
          position: data.position,
          isPublished: data.isPublished,
        };

        await toastService.promise(
          moduleService.updateModule(
            moduleId as string,
            payload
          ),
          {
            loading: "Updating module...",
            success:
              "Module updated successfully!",
            error: (err) =>
              err?.response?.data?.message ||
              "Failed to update module",
          }
        );
      }

      router.push("/module");
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <Paper className="form-container form-80">
      {/* HEADER */}

      <Box className="form-header">
        <Typography variant="h5">
          {isNew
            ? "Create Module"
            : "Edit Module"}
        </Typography>

        <Box className="form-header-actions">
          <Button
            onClick={() =>
              router.push("/modules")
            }
            color="error"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="module-form"
            variant="contained"
            className="btn-primary"
            disabled={!isFormValid()}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* FORM */}

      <Box
        id="module-form"
        component="form"
        onSubmit={handleSubmit}
      >
        <FormGroup className="form-group">
          {/* BASIC INFO */}

          <Typography variant="h6">
            Basic Info
          </Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Module Title"
              value={data.title || ""}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }
              error={!data.title}
              helperText={
                !data.title
                  ? "Title is required"
                  : ""
              }
              fullWidth
              required
            />

            <TextField
              select
              label="Course"
              value={data.courseId || ""}
              onChange={(e) =>
                handleChange(
                  "courseId",
                  e.target.value
                )
              }
              fullWidth
              required
            >
              {courses.map((course) => (
                <MenuItem
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* POSITION */}

          <Divider />

          <Typography variant="h6">
            Module Settings
          </Typography>

          <div className="form-row grid-cols-2">
            <TextField
              label="Position"
              type="number"
              value={data.position ?? 1}
              onChange={(e) =>
                handleChange(
                  "position",
                  Number(e.target.value)
                )
              }
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={
                    !!data.isPublished
                  }
                  onChange={(e) =>
                    handleChange(
                      "isPublished",
                      e.target.checked
                    )
                  }
                />
              }
              label="Published"
            />
          </div>
        </FormGroup>
      </Box>
    </Paper>
  );
}