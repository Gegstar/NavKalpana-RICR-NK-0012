
'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  Button,
} from '@mui/material';

import {
  ExpandMore,
  PlayCircle,
  PictureAsPdf,
  InsertDriveFile,
  Link as LinkIcon,
} from '@mui/icons-material';

import { courseService } from '@/services/course.service';

import {
  ViewCourse,
  ViewCourseLesson,
  ViewLessonResource,
} from '@/models/course.model';

import { toastService } from '@/services/toast.service';

import '@/styles/App.css';

function CourseViewPage() {
  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [course, setCourse] =
    useState<ViewCourse | null>(
      null,
    );

  // =====================================================
  // FETCH COURSE
  // =====================================================

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res =
        await courseService.viewCourse(
          id as string,
        );

      setCourse(res);
    } catch (err) {
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  // =====================================================
  // RESOURCE ICON
  // =====================================================

  const getResourceIcon = (
    type: string,
  ) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle />;

      case 'PDF':
        return <PictureAsPdf />;

      case 'LINK':
        return <LinkIcon />;

      default:
        return <InsertDriveFile />;
    }
  };

  // =====================================================
  // OPEN RESOURCE
  // =====================================================

  const openResource = (
    resource: ViewLessonResource,
  ) => {
    if (
      resource.resourceType ===
      'VIDEO'
    ) {
      router.push(
        `/watch-video?url=${encodeURIComponent(
          resource.resourceUrl,
        )}`,
      );

      return;
    }

    window.open(
      resource.resourceUrl,
      '_blank',
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

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

  // =====================================================
  // EMPTY
  // =====================================================

  if (!course) {
    return (
      <Box textAlign="center" mt={10}>
        <Typography variant="h5">
          Course Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="page-container">
      {/* ================================================= */}
      {/* HERO */}
      {/* ================================================= */}

      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background:
            'linear-gradient(135deg, #111827, #1f2937)',
          color: '#fff',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          mb={2}
        >
          {course.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{ opacity: 0.9 }}
        >
          {course.description}
        </Typography>

        <Box
          mt={3}
          display="flex"
          gap={1}
          flexWrap="wrap"
        >
          <Chip
            label={`${course.modules.length} Modules`}
            color="primary"
          />

          <Chip
            label={
              course.isFree
                ? 'Free Course'
                : 'Premium Course'
            }
            color={
              course.isFree
                ? 'success'
                : 'warning'
            }
          />
        </Box>
      </Paper>

      {/* ================================================= */}
      {/* MODULES */}
      {/* ================================================= */}

      <Typography
        variant="h4"
        mb={3}
        fontWeight={700}
      >
        Course Content
      </Typography>

      {course.modules.map(
        (module, moduleIndex) => (
          <Accordion
            key={module.id}
            defaultExpanded={
              moduleIndex === 0
            }
            sx={{
              mb: 2,
              borderRadius: '16px !important',
              overflow: 'hidden',
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMore />
              }
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {module.position}.{' '}
                  {module.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {
                    module.lessons.length
                  }{' '}
                  lessons
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              {module.lessons.map(
                (
                  lesson: ViewCourseLesson,
                ) => (
                  <Box
                    key={lesson.id}
                    mb={3}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      mb={1}
                    >
                      Lesson:{' '}
                      {lesson.title}
                    </Typography>

                    <List>
                      {lesson.resources.map((resource) => (
  <Box key={resource.id}>
    <ListItem
      sx={{
        borderRadius: 2,
        mb: 1,
        border: '1px solid #e5e7eb',
      }}
      secondaryAction={
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            openResource(resource)
          }
        >
          Open
        </Button>
      }
    >
      <Box mr={2}>
        {getResourceIcon(
          resource.resourceType,
        )}
      </Box>

      <ListItemText
        primary={resource.title}
        secondary={
          resource.resourceType
        }
      />
    </ListItem>

    <Divider />
  </Box>
))}
                    </List>
                  </Box>
                ),
              )}
            </AccordionDetails>
          </Accordion>
        ),
      )}
    </Box>
  );
}

export default CourseViewPage;

