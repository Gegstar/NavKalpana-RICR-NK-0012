'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Pagination,
  Skeleton,
  Button,
  Stack,
} from '@mui/material';
import { Search, Refresh, Add } from '@mui/icons-material';
import PlainButton from '@/components/ui/PlainButton';
import { courseService } from '@/services/course.service';
import { toastService } from '@/services/toast.service';
import { Course } from '@/models/course.model';

function Page() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const coursesPerPage = 6;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await courseService.getAllCourses();
      setCourses(res || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch courses');
      setCourses([]);
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const instructorName = course.instructor?.name || '';

    return (
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      instructorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  const handleViewDetails = (id: string) => {
    router.push(`/courses/${id}`);
  };

  if (loading && !courses.length) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton
                variant="rectangular"
                height={280}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={8}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={fetchCourses}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* HEADER */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            All Courses
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Discover courses from expert instructors
          </Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchCourses}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/courses/new')}
          >
            New Course
          </Button>
        </Stack>
      </Box>

      {/* SEARCH */}
      <Box mb={4}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search courses by title or instructor"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: '#fff',
            },
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* EMPTY */}
      {!paginatedCourses.length && (
        <Box
          textAlign="center"
          py={8}
          border="1px dashed #ddd"
          borderRadius={3}
        >
          <Typography variant="h6">No courses found</Typography>

          <Typography variant="body2" color="text.secondary" mt={1}>
            Try another search or create a new course.
          </Typography>
        </Box>
      )}

      {/* COURSES */}
      <Grid container spacing={3}>
        {paginatedCourses.map((course) => (
          <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                transition: '0.25s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 14px 32px rgba(0,0,0,0.10)',
                },
              }}
            >
              <CardMedia
                component="img"
                height="190"
                image={course.thumbnailUrl || '/images/course-placeholder.png'}
                alt={course.title}
              />

              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 220,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {course.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: 42,
                  }}
                >
                  {course.description || 'No description available'}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={1}
                >
                  Instructor: {course.instructor?.name || 'Not assigned'}
                </Typography>

                <Box flexGrow={1} />

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {course.isFree
                      ? 'Free'
                      : `${course.currency} ${course.price}`}
                  </Typography>

                  <PlainButton
                    variant="primary"
                    size="small"
                    onClick={() => handleViewDetails(course.id)}
                  >
                    View Details
                  </PlainButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={5}>
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}
    </Container>
  );
}

export default Page;