'use client';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MaterialReactTable } from 'material-react-table';

import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Skeleton,
  Chip,
} from '@mui/material';

import {
  Edit,
  Refresh,
  Add,
  Delete,
  VideoLibrary,
  PictureAsPdf,
  Link as LinkIcon,
  Image,
  AudioFile,
  Archive,
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';

import { lessonResourceService } from '@/services/lesson-resourses.service';

import { toastService } from '@/services/toast.service';

import { LessonResource } from '@/models/lesson-resources.model';

function Page() {
  const router = useRouter();

  const [data, setData] = useState<
    LessonResource[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  // =====================================================
  // FETCH
  // =====================================================

  const fetchResources = async () => {
    try {
      setLoading(true);

      setError(null);

      const res =
        await lessonResourceService.getAllResources();

      setData(res || []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Failed to fetch resources';

      setError(message);

      setData([]);

      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const handleCreate = () => {
    router.push('/lesson-resource/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/lesson-resource/${id}`);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed = confirm(
      'Delete this resource?',
    );

    if (!confirmed) return;

    try {
      await toastService.promise(
        lessonResourceService.deleteResource(
          id,
        ),
        {
          loading:
            'Deleting resource...',
          success:
            'Resource deleted successfully',
          error:
            'Failed to delete resource',
        },
      );

      fetchResources();
    } catch {}
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const handleRefresh = async () => {
    try {
      const res = await toastService.promise(
        lessonResourceService.getAllResources(),
        {
          loading:
            'Refreshing resources...',
          success:
            'Resources refreshed!',
          error:
            'Failed to refresh resources',
        },
      );

      setData(res || []);
    } catch {}
  };

  // =====================================================
  // ICON BY TYPE
  // =====================================================

  const getResourceIcon = (
    type: string,
  ) => {
    switch (type) {
      case 'VIDEO':
        return <VideoLibrary />;

      case 'PDF':
        return <PictureAsPdf />;

      case 'LINK':
        return <LinkIcon />;

      case 'IMAGE':
        return <Image />;

      case 'AUDIO':
        return <AudioFile />;

      case 'ZIP':
        return <Archive />;

      default:
        return <VideoLibrary />;
    }
  };

  // =====================================================
  // COLUMNS
  // =====================================================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 250,
      },

      {
        accessorKey: 'lessonTitle',
        header: 'Lesson',
        size: 200,

        Cell: ({ cell }: any) =>
          cell.getValue() || '-',
      },

      {
        accessorKey: 'resourceType',
        header: 'Type',
        size: 150,

        Cell: ({ cell }: any) => {
          const type =
            cell.getValue();

          return (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
            >
              {getResourceIcon(type)}

              <Chip
                label={type}
                size="small"
              />
            </Box>
          );
        },
      },

      {
        accessorKey: 'position',
        header: 'Position',
        size: 80,
      },

      {
        accessorKey: 'resourceUrl',
        header: 'Resource URL',

        Cell: ({ cell }: any) => (
          <a
            href={cell.getValue()}
            target="_blank"
            rel="noreferrer"
          >
            Open Resource
          </a>
        ),
      },

      {
        accessorKey: 'createdAt',
        header: 'Created At',

        Cell: ({ cell }: any) =>
          cell.getValue()
            ? new Date(
                cell.getValue(),
              ).toLocaleDateString()
            : '-',
      },

      {
        id: 'actions',
        header: 'Actions',

        Cell: ({ row }: any) => (
          <Box display="flex">
            <Tooltip title="Edit">
              <IconButton
                color="primary"
                onClick={() =>
                  handleEdit(
                    row.original.id,
                  )
                }
              >
                <Edit />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                color="error"
                onClick={() =>
                  handleDelete(
                    row.original.id,
                  )
                }
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [],
  );

  // =====================================================
  // LOADING
  // =====================================================

  if (loading && !data.length) {
    return (
      <Box p={2}>
        {[...Array(6)].map(
          (_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={50}
              sx={{ mb: 2 }}
            />
          ),
        )}
      </Box>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography
          variant="h6"
          color="error"
        >
          ⚠️ {error}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={fetchResources}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // =====================================================
  // EMPTY
  // =====================================================

  if (!data.length) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6">
          No Lesson Resources Found
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleCreate}
        >
          Create Resource
        </Button>
      </Box>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Lesson Resources
        </Typography>

        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
          >
            New Resource
          </Button>
        </Box>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={data}
        state={{
          isLoading: loading,
        }}
        enableSorting
        enablePagination
        enableColumnFilters
        enableDensityToggle
        enableFullScreenToggle
      />
    </Box>
  );
}

export default Page;