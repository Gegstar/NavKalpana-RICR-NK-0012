"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Divider,
  MenuItem,
  Alert,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Delete,
  Save,
  Image,
  VideoLibrary,
  Description,
} from "@mui/icons-material";
import { courseService } from "@/services/course.service";
import { toastService } from "@/services/toast.service";
import styles from "@/styles/AddCourse.module.css";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  content: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function AddCourse() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const categories = ["Development", "Design", "Business", "Marketing", "Data Science"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  // Module management
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "",
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId));
  };

  const updateModuleTitle = (moduleId: string, title: string) => {
    setModules(
      modules.map((m) => (m.id === moduleId ? { ...m, title } : m))
    );
  };

  // Lesson management
  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString() + Math.random(),
      title: "",
      videoUrl: "",
      content: "",
    };
    setModules(
      modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    );
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) }
          : m
      )
    );
  };

  const updateLesson = (
    moduleId: string,
    lessonId: string,
    field: keyof Lesson,
    value: string
  ) => {
    setModules(
      modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              lessons: m.lessons.map((l) =>
                l.id === lessonId ? { ...l, [field]: value } : l
              ),
            }
          : m
      )
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Course title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (modules.length === 0) newErrors.modules = "Add at least one module";
    modules.forEach((module) => {
      if (!module.title.trim()) {
        newErrors[`module_${module.id}`] = "Module title required";
      }
      module.lessons.forEach((lesson) => {
        if (!lesson.title.trim()) {
          newErrors[`lesson_${lesson.id}`] = "Lesson title required";
        }
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Prepare FormData
      const formDataToSend = new FormData();

      // Append basic course info as JSON string
      const courseData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        modules: modules.map((m) => ({
          title: m.title,
          lessons: m.lessons.map((l) => ({
            title: l.title,
            videoUrl: l.videoUrl,
            content: l.content,
          })),
        })),
      };
      formDataToSend.append("data", JSON.stringify(courseData));

      // Append thumbnail file if present
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }

      // Call API
      await courseService.createCourse(formDataToSend);
      toastService.success("Course created successfully!");
      router.push("/instructor/courses");
    } catch (error: any) {
      console.error("Create course error:", error);
      toastService.error(error?.response?.data?.message || "Failed to create course");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={styles.container}>
      <Container maxWidth="lg">
        <Paper className={styles.paper}>
          <Typography variant="h4" className={styles.title}>
            Create New Course
          </Typography>
          <Typography variant="body2" className={styles.subtitle}>
            Fill in the details to add a new course
          </Typography>

          <Divider className={styles.divider} />

          {/* Basic Information */}
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                error={!!errors.category}
                helperText={errors.category}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Price (USD)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                required
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<Image />}
              >
                Upload Thumbnail
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleThumbnailChange}
                />
              </Button>
              {thumbnailPreview && (
                <Box mt={2}>
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className={styles.thumbnailPreview}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider className={styles.divider} />

          {/* Modules & Lessons */}
          <Box className={styles.modulesHeader}>
            <Typography variant="h6">Course Content</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={addModule}
            >
              Add Module
            </Button>
          </Box>
          {errors.modules && (
            <Alert severity="error" className={styles.alert}>
              {errors.modules}
            </Alert>
          )}

          {modules.map((module, idx) => (
            <Paper key={module.id} className={styles.moduleCard}>
              <Box className={styles.moduleHeader}>
                <TextField
                  label={`Module ${idx + 1} Title`}
                  value={module.title}
                  onChange={(e) => updateModuleTitle(module.id, e.target.value)}
                  error={!!errors[`module_${module.id}`]}
                  helperText={errors[`module_${module.id}`]}
                  fullWidth
                  size="small"
                />
                <IconButton
                  color="error"
                  onClick={() => removeModule(module.id)}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box className={styles.lessonsHeader}>
                <Typography variant="subtitle2">Lessons</Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={() => addLesson(module.id)}
                >
                  Add Lesson
                </Button>
              </Box>

              {module.lessons.map((lesson, lIdx) => (
                <Box key={lesson.id} className={styles.lessonCard}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        label={`Lesson ${lIdx + 1} Title`}
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(module.id, lesson.id, "title", e.target.value)
                        }
                        error={!!errors[`lesson_${lesson.id}`]}
                        helperText={errors[`lesson_${lesson.id}`]}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                      <TextField
                        label="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) =>
                          updateLesson(module.id, lesson.id, "videoUrl", e.target.value)
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <VideoLibrary fontSize="small" />,
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                      <TextField
                        label="Content (text/notes)"
                        value={lesson.content}
                        onChange={(e) =>
                          updateLesson(module.id, lesson.id, "content", e.target.value)
                        }
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: <Description fontSize="small" />,
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 1 }}>
                      <IconButton
                        color="error"
                        onClick={() => removeLesson(module.id, lesson.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              {module.lessons.length === 0 && (
                <Typography variant="body2" className={styles.noLessons}>
                  No lessons yet. Click "Add Lesson" to start.
                </Typography>
              )}
            </Paper>
          ))}

          {modules.length === 0 && (
            <Alert severity="info" className={styles.infoAlert}>
              No modules added. Click "Add Module" to build your course content.
            </Alert>
          )}

          <Box className={styles.actions}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={20} /> : "Save Course"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}