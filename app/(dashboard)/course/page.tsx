"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Chip,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import gsap from "gsap";
import PlainButton from "@/components/ui/PlainButton";
import styles from "@/styles/Courses.module.css";

// Dummy data – replace with API call
const allCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Sarah Chen",
    rating: 4.8,
    students: 12500,
    price: 89.99,
    image: "/images/web-dev.svg",
    category: "Development",
  },
  {
    id: 2,
    title: "React & Next.js Mastery",
    instructor: "Prof. James Wilson",
    rating: 4.9,
    students: 9800,
    price: 99.99,
    image: "/images/react.svg",
    category: "Development",
  },
  {
    id: 3,
    title: "UI/UX Design Masterclass",
    instructor: "Emily Rodriguez",
    rating: 4.7,
    students: 8700,
    price: 79.99,
    image: "/images/uiux.svg",
    category: "Design",
  },
  {
    id: 4,
    title: "Python for Data Science",
    instructor: "Dr. Michael Lee",
    rating: 4.8,
    students: 11200,
    price: 89.99,
    image: "/images/python.svg",
    category: "Data Science",
  },
  {
    id: 5,
    title: "Digital Marketing Strategy",
    instructor: "Lisa Wang",
    rating: 4.6,
    students: 5400,
    price: 69.99,
    image: "/images/marketing.svg",
    category: "Marketing",
  },
  {
    id: 6,
    title: "Node.js API Design",
    instructor: "Prof. James Wilson",
    rating: 4.8,
    students: 6200,
    price: 79.99,
    image: "/images/nodejs.svg",
    category: "Development",
  },
  {
    id: 7,
    title: "Machine Learning Basics",
    instructor: "Dr. Sarah Chen",
    rating: 4.9,
    students: 7800,
    price: 99.99,
    image: "/images/ml.svg",
    category: "Data Science",
  },
  {
    id: 8,
    title: "Business Analytics",
    instructor: "Prof. Robert Brown",
    rating: 4.5,
    students: 3200,
    price: 59.99,
    image: "/images/business.svg",
    category: "Business",
  },
];

const categories = ["All", "Development", "Design", "Data Science", "Marketing", "Business"];

export default function AllCourses() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Filter courses
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  // GSAP entrance animation
  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.6, delay: i * 0.1, ease: "power2.out" }
        );
      }
    });
  }, [paginatedCourses]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnroll = (courseId: number) => {
    // Simulate enrollment – replace with API call
    router.push(`/student/course/${courseId}`);
  };

  return (
    <Container maxWidth="xl" className={styles.container}>
      {/* Header */}
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          All Courses
        </Typography>
        <Typography variant="body2" className={styles.subtitle}>
          Discover courses from expert instructors
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box className={styles.filterBar}>
        <TextField
          placeholder="Search courses or instructors..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
          className={styles.searchField}
        />
        <FormControl size="small" className={styles.filterSelect}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results count */}
      <Typography variant="body2" className={styles.resultsCount}>
        Showing {paginatedCourses.length} of {filteredCourses.length} courses
      </Typography>

      {/* Courses Grid */}
      <Grid container spacing={3} className={styles.coursesGrid}>
        {paginatedCourses.map((course, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <Card
              className={styles.courseCard}
              ref={(el) => { if (el) cardsRef.current[idx] = el; }}
            >
              <CardMedia
                component="img"
                image={course.image}
                alt={course.title}
                className={styles.cardMedia}
              />
              <CardContent className={styles.cardContent}>
                <Typography variant="h6" className={styles.courseTitle}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className={styles.instructor}>
                  {course.instructor}
                </Typography>
                <Box className={styles.ratingBox}>
                  <Rating value={course.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="caption">({course.rating})</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {course.students.toLocaleString()} students
                </Typography>
                <Box className={styles.cardFooter}>
                  <Typography variant="h6" className={styles.price}>
                    ${course.price}
                  </Typography>
                  <PlainButton
                    variant="primary"
                    size="small"
                    onClick={() => handleEnroll(course.id)}
                  >
                    Enroll Now
                  </PlainButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box className={styles.pagination}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <Box className={styles.emptyState}>
          <Typography variant="h6">No courses found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
    </Container>
  );
}
