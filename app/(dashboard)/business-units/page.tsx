'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { businessUnitService } from '@/services/businessUnit.service';
import { BusinessUnit } from '@/models/businessUnit.model';
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
  const [data, setData] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ added

  const router = useRouter();

  // ================= FETCH DATA =================
  const fetchBusinessUnits = async () => {
    try {
      setLoading(true);
      setError(null); // reset error

      const res = await businessUnitService.getAll(0, 10);
      setData(res?.data || res);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Failed to fetch business units';

      setError(message);
      setData([]); // ensure empty
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessUnits();
  }, []);

  // ================= NAVIGATION =================
  const handleCreate = () => {
    router.push('/business-units/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/business-units/${id}`);
  };

  // ================= REFRESH =================
  const handleRefresh = async () => {
    try {
      setError(null);

      const res = await toastService.promise(
        businessUnitService.getAll(0, 10),
        {
          loading: 'Refreshing data...',
          success: 'Data refreshed!',
          error: 'Failed to refresh data',
        }
      );

      setData(res?.data || res);
    } catch (err) {
      setError('Failed to refresh data');
    }
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        size:150
      },
      {
        accessorKey: 'domain',
        header: 'Domain',
        size:200,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'subdomain',
        header: 'Subdomain',
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        accessorKey: 'student_signup_enabled',
        header: 'Signup',
        size:50,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'google_login_enabled',
        header: 'Google',
        size:50,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'created_at',
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
          <Skeleton variant="text" width={220} height={40} />
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
          onClick={fetchBusinessUnits}
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
        <Typography variant="h6">No Business Units Found</Typography>

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreate}>
          Create Business Unit
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
        <Typography variant="h4">Business Units</Typography>

        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>

          <Button variant="contained" onClick={handleCreate}>
            + New Business Unit
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