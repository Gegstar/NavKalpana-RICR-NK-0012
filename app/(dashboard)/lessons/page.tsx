'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { lessonService } from '@/services/lesson.service';
import { Lesson } from '@/models/lessons.model';
import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Skeleton,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toastService } from '@/services/toast.service';

function Page() {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ================= FETCH DATA =================
  const fetchLessons = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await lessonService.getAllLessons();
      setData(res || []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Failed to fetch lessons';

      setError(message);
      setData([]);
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // ================= NAVIGATION =================
  const handleCreate = () => {
    router.push('/lessons/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/lessons/${id}`);
  };

  // ================= REFRESH =================
  const handleRefresh = async () => {
    try {
      setError(null);

      const res = await toastService.promise(
        lessonService.getAllLessons(),
        {
          loading: 'Refreshing lessons...',
          success: 'Lessons refreshed!',
          error: 'Failed to refresh lessons',
        }
      );

      setData(res || []);
    } catch {
      setError('Failed to refresh lessons');
    }
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        size: 200,
      },
      {
        accessorKey: 'moduleTitle',
        header: 'Module Name',
        size: 200,
      },
      {
        accessorKey: 'position',
        header: 'Position',
        size: 80,
      },
      {
        accessorKey: 'isPreview',
        header: 'Preview',
        size: 70,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'isPublished',
        header: 'Published',
        size: 80,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'completed',
        header: 'Completed',
        size: 80,
        Cell: ({ cell }: any) => {
          const value = cell.getValue();
          if (value === undefined || value === null) return '-';
          return value ? '✅' : '❌';
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        Cell: ({ cell }: any) =>
          cell.getValue()
            ? new Date(cell.getValue() as string).toLocaleDateString()
            : '-',
      },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }: any) => (
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              onClick={() => handleEdit(row.original.id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  // ================= SKELETON =================
  if (loading && !data.length) {
    return (
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={180} height={40} />
        </Box>

        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            display="grid"
            gridTemplateColumns="repeat(6, 1fr)"
            gap={2}
            mb={2}
          >
            {[...Array(6)].map((_, j) => (
              <Skeleton key={j} variant="rectangular" height={40} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  // ================= ERROR UI =================
  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="error">
          ⚠️ {error}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={fetchLessons}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // ================= EMPTY =================
  if (!data.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">No Lessons Found</Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleCreate}
        >
          Create Lesson
        </Button>
      </Box>
    );
  }

  // ================= MAIN =================
  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Lessons</Typography>

        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>

          <Button variant="contained" onClick={handleCreate}>
            + New Lesson
          </Button>
        </Box>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={data}
        state={{ isLoading: loading }}
        enableSorting
        enableColumnFilters
      />
    </Box>
  );
}

export default Page;