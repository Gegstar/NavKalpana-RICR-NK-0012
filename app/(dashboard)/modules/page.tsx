'use client';

import React, { useEffect, useMemo, useState } from 'react';

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
} from '@mui/icons-material';

import { useRouter } from 'next/navigation';

import { moduleService } from '@/services/module.service';
import { toastService } from '@/services/toast.service';

import { Module } from '@/models/module.model';

function Page() {
  const router = useRouter();

  const [data, setData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchModules = async () => {
    try {
      setLoading(true);
      setError(null);

      const res =
        await moduleService.getAllModules();

      setData(res || []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'Failed to fetch modules';

      setError(message);

      setData([]);

      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleCreate = () => {
    router.push('/modules/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/modules/${id}`);
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = async () => {
    try {
      setError(null);

      const res = await toastService.promise(
        moduleService.getAllModules(),
        {
          loading: 'Refreshing modules...',
          success: 'Modules refreshed!',
          error: 'Failed to refresh modules',
        }
      );

      setData(res || []);
    } catch {
      setError('Failed to refresh modules');
    }
  };

  // =========================================================
  // COLUMNS
  // =========================================================

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Module Title',
        size: 250,
      },

      {
        accessorKey: 'courseTitle',
        header: 'Course Name',
        size: 220,

        Cell: ({ cell }: any) =>
          cell.getValue() || '-',
      },

      {
        accessorKey: 'position',
        header: 'Position',
        size: 80,
      },

      {
        accessorKey: 'lessonsCount',
        header: 'Lessons',
        size: 80,

        Cell: ({ cell }: any) =>
          cell.getValue() || 0,
      },

      {
        accessorKey: 'isPublished',
        header: 'Published',
        size: 120,

        Cell: ({ cell }: any) => {
          const value = cell.getValue();

          return value ? (
            <Chip
              label="Published"
              color="success"
              size="small"
            />
          ) : (
            <Chip
              label="Draft"
              color="default"
              size="small"
            />
          );
        },
      },

      {
        accessorKey: 'createdAt',
        header: 'Created At',

        Cell: ({ cell }: any) =>
          cell.getValue()
            ? new Date(
                cell.getValue() as string
              ).toLocaleDateString()
            : '-',
      },

      {
        id: 'actions',
        header: 'Actions',

        Cell: ({ row }: any) => (
          <Tooltip title="Edit Module">
            <IconButton
              color="primary"
              onClick={() =>
                handleEdit(row.original.id)
              }
            >
              <Edit />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    []
  );

  // =========================================================
  // LOADING UI
  // =========================================================

  if (loading && !data.length) {
    return (
      <Box p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
        >
          <Skeleton
            variant="text"
            width={200}
            height={40}
          />

          <Skeleton
            variant="rectangular"
            width={180}
            height={40}
          />
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
              <Skeleton
                key={j}
                variant="rectangular"
                height={40}
              />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  // =========================================================
  // ERROR UI
  // =========================================================

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
          onClick={fetchModules}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // =========================================================
  // EMPTY UI
  // =========================================================

  if (!data.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h6">
          No Modules Found
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleCreate}
        >
          Create Module
        </Button>
      </Box>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <Box p={2}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Modules
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
            New Module
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
        enableColumnFilters
        enablePagination
        enableDensityToggle
        enableFullScreenToggle
      />
    </Box>
  );
}

export default Page;