'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { businessUnitService } from '@/services/businessUnit.service';
import { BusinessUnit } from '@/models/businessUnit.model';
import { Box, CircularProgress, Typography } from '@mui/material';

function Page() {
  const [data, setData] = useState<BusinessUnit[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchBusinessUnits = async () => {
    try {
      const res = await businessUnitService.getAll(0, 10);
      setData(res?.data || res);
    } catch (error) {
      console.error('Error fetching business units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessUnits();
  }, []);

  // ================= COLUMNS =================
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'domain',
        header: 'Domain',
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
        Cell: ({ cell }: any) => (cell.getValue() ? '✅' : '❌'),
      },
      {
        accessorKey: 'google_login_enabled',
        header: 'Google',
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
    ],
    []
  );

  // ================= UI =================
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        No Business Units Found
      </Typography>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>
        Business Units
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={data}
        enableSorting
        enableColumnFilters
        // initialState={{ pagination: { pageSize: 5 } }}
        // muiTableContainerProps={{ sx: { maxHeight: 500 } }}
      />
    </Box>
  );
}

export default Page;