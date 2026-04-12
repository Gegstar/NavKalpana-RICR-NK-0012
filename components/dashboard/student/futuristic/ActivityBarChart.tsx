"use client";

import React from "react";
import { Box, Typography, Stack, Tooltip } from "@mui/material";

interface ActivityBarChartProps {
  activity: number[];
}

export default function ActivityBarChart({ activity }: ActivityBarChartProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Study Productivity</Typography>
      
      <Stack 
        direction="row" 
        spacing={1.5} 
        alignItems="flex-end" 
        sx={{ flex: 1, height: '100%', mt: 'auto' }}
      >
        {activity.map((val, i) => (
          <Box 
            key={i} 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: 1 
            }}
          >
            <Tooltip title={`${val} hours`} arrow>
              <Box
                sx={{
                  width: '100%',
                  bgcolor: 'var(--primary-yellow)',
                  height: `${val}%`,
                  borderRadius: '4px 4px 0 0',
                  opacity: 0.6 + (val / 150),
                  transition: 'all 0.3s ease',
                  '&:hover': { opacity: 1, transform: 'scaleX(1.1)', boxShadow: '0 0 12px var(--primary-yellow)' }
                }}
              />
            </Tooltip>
            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>
              {days[i]}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
