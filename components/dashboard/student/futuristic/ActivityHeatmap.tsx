"use client";

import React from "react";
import { Box, Typography, Stack, Tooltip } from "@mui/material";

interface ActivityHeatmapProps {
  activityData: number[]; // Array of intensity levels
}

export default function ActivityHeatmap({ activityData }: ActivityHeatmapProps) {
  // Generate mock data for 50 weeks
  const heatmapData = Array.from({ length: 50 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const idx = (weekIndex * 7 + dayIndex);
      const val = activityData && activityData[idx % activityData.length] ? activityData[idx % activityData.length] : 0;
      return Math.floor(val / 25); // 0-4
    })
  );

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Learning Activity</Typography>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>Yearly consistency: 84%</Typography>
      </Stack>
      
      <Box sx={{ display: 'flex', gap: 0.5, overflowX: 'auto', pb: 1, minHeight: 110 }}>
        {heatmapData.map((week, i) => (
          <Stack key={i} spacing={0.5}>
            {week.map((level, j) => (
              <Tooltip key={j} title={`Activity Level: ${level}`} arrow>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '2px',
                    bgcolor: level === 0 ? 'var(--border-light)' : 
                             level === 1 ? '#FEF9C3' : 
                             level === 2 ? '#FDE047' : 'var(--primary-yellow)',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.3)', zIndex: 1, boxShadow: '0 0 8px var(--primary-yellow)' }
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
