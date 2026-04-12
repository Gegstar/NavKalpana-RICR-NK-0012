"use client";

import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";
import bentoStyles from "@/styles/BentoGrid.module.css";
import dashboardStyles from "@/styles/StudentDashboard.module.css";

export default function DashboardSkeleton() {
  return (
    <Box className={dashboardStyles.dashboardWrapper} sx={{ p: 'var(--spacing-xl)' }}>
      {/* Header Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Skeleton variant="rectangular" width={300} height={40} sx={{ borderRadius: 'var(--radius-md)' }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 'var(--radius-md)' }} />
        </Box>
      </Box>

      {/* Greeting Skeleton */}
      <Skeleton variant="text" width={250} height={60} sx={{ mb: 4 }} />

      {/* Bento Grid Skeleton */}
      <div className={bentoStyles.bentoGrid}>
        <div className={`${bentoStyles.bentoItem} ${bentoStyles.col4} ${bentoStyles.row11}`}>
          <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className={`${bentoStyles.bentoItem} ${bentoStyles.col4} ${bentoStyles.row11}`}>
          <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className={`${bentoStyles.bentoItem} ${bentoStyles.col4} ${bentoStyles.row11}`}>
          <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className={`${bentoStyles.bentoItem} ${bentoStyles.col8}`}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 'var(--radius-lg)' }} />
        </div>
        <div className={`${bentoStyles.bentoItem} ${bentoStyles.col4}`}>
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 'var(--radius-lg)' }} />
        </div>
      </div>
    </Box>
  );
}
