'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { usersService } from '@/services/users.service';
import { User } from '@/models/users.model';
import {
  Box,
  Typography,
  Button,
  Tooltip,
  IconButton,
  Skeleton,
  Avatar,
  Chip,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { toastService } from '@/services/toast.service';

function UsersPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ================= FETCH =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await usersService.getUsers();
      setData(res?.data || res);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'Failed to fetch users';

      setError(message);
      setData([]);
      toastService.apiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= NAV =================
  const handleCreate = () => router.push('/users/new');
  const handleEdit = (id: string) => router.push(`/users/${id}`);

  // ================= REFRESH =================
  const handleRefresh = async () => {
    try {
      setError(null);

      const res = await toastService.promise(
        usersService.getUsers(),
        {
          loading: 'Refreshing users...',
          success: 'Users refreshed!',
          error: 'Failed to refresh users',
        }
      );

      setData(res?.data || res);
    } catch {
      setError('Failed to refresh users');
    }
  };

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'profile_image',
        header: '',
        size: 50,
        Cell: ({ row }: any) => (
          <Avatar
            src={row.original.profile_image || ''}
            alt={row.original.full_name}
          >
            {row.original.full_name?.[0]}
          </Avatar>
        ),
      },
      {
        accessorKey: 'full_name',
        header: 'Name',
        size: 180,
      },
      {
        accessorKey: 'username',
        header: 'Username',
        size: 140,
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 220,
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 140,
        Cell: ({ cell }: any) => (
          <Chip
            label={cell.getValue()}
            color={
              cell.getValue() === 'SUPER_ADMIN'
                ? 'error'
                : cell.getValue() === 'ADMIN'
                ? 'warning'
                : cell.getValue() === 'INSTRUCTOR'
                ? 'info'
                : 'default'
            }
            size="small"
          />
        ),
      },
      {
        accessorKey: 'auth_provider',
        header: 'Provider',
        size: 120,
      },
      {
        accessorKey: 'is_active',
        header: 'Active',
        size: 80,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'is_verified',
        header: 'Verified',
        size: 100,
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'business_unit_id',
        header: 'Business Unit',
        size: 180,
        Cell: ({ cell }: any) => cell.getValue() || '-',
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 80,
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

  // ================= LOADING =================
  if (loading && !data.length) {
    return (
      <Box p={2}>
        <Skeleton height={40} width={200} />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={50} sx={{ mt: 1 }} />
        ))}
      </Box>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography color="error">⚠️ {error}</Typography>
        <Button onClick={fetchUsers} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  // ================= EMPTY =================
  if (!data.length) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography>No Users Found</Typography>
        <Button onClick={handleCreate} sx={{ mt: 2 }} variant="contained">
          Create User
        </Button>
      </Box>
    );
  }

  // ================= MAIN =================
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Users</Typography>

        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh
          </Button>

          <Button variant="contained" onClick={handleCreate}>
            + New User
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

export default UsersPage;