"use client";

import React, { useRef } from "react";
import { Box, Container, Grid, Card, CardContent, Typography } from "@mui/material";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "@/styles/InstructorDashboard.module.css";
import { useThemeColor } from "@/hooks/useThemeColor";

// Futuristic Components
import ThreeBackground from "./futuristic/ThreeBackground";
import GreetingSection from "./futuristic/GreetingSection";
import Analytics3DObject from "./futuristic/Analytics3DObject";
import RevenueCard from "./futuristic/RevenueCard";
import CompletionMetrics from "./futuristic/CompletionMetrics";
import SupportQueries from "./futuristic/SupportQueries";
import EngagementChart from "./futuristic/EngagementChart";
import CourseManagementList from "./futuristic/CourseManagementList";
import UpcomingSchedule from "./futuristic/UpcomingSchedule";

gsap.registerPlugin(ScrollTrigger);

export default function InstructorDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryColor = useThemeColor("--color-primary");

  useGSAP(() => {
    const tl = gsap.timeline({
      defaults: { ease: "elastic.out(1, 0.75)", duration: 1.2 }
    });

    // Master Entrance Animation
    tl.from(".gsap-reveal", {
      y: 100,
      opacity: 0,
      stagger: 0.1,
      clearProps: "all"
    });

  }, { scope: containerRef });

  return (
    <Box ref={containerRef} className={styles.dashboardWrapper}>
      <ThreeBackground />

      <Container maxWidth="xl">
        {/* 1. Greeting Section */}
        <GreetingSection />

        <Grid container spacing={4}>
          {/* 2. 3D Enrollment Analytics Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card className={`${styles.analyticsCard} gsap-reveal`}>
              <CardContent className={styles.cardContent}>
                <Typography variant="overline" className={styles.overline}>
                  Total Active Students
                </Typography>
                <Analytics3DObject color={primaryColor} size={1.4} active={true} />
                <Typography variant="h2" className={styles.analyticsValue}>
                  1,245
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Community is growing fast!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* 3. Revenue Overview */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Grid container spacing={4} direction="column" sx={{ height: "100%" }}>
              <Grid size={{ xs: 12}}>
                <RevenueCard label="Monthly Revenue" value={8900} />
              </Grid>
              <Grid size={{ xs: 12}}>
                <RevenueCard label="Total Payout" value={28450} />
              </Grid>
            </Grid>
          </Grid>

          {/* 4. Support & Queries */}
          <Grid size={{ xs: 12, md: 4 }}>
            <SupportQueries />
          </Grid>

          {/* 5. Engagement Chart */}
          <Grid size={{ xs: 12, md: 8 }}>
            <EngagementChart />
          </Grid>

          {/* 6. Course Completion */}
          <Grid size={{ xs: 12, md: 4 }}>
            <CompletionMetrics />
          </Grid>

          {/* 7. Course Management List */}
          <Grid size={{ xs: 12, md: 7 }}>
            <CourseManagementList />
          </Grid>

          {/* 8. Upcoming Schedule */}
          <Grid size={{ xs: 12, md: 5 }}>
            <UpcomingSchedule />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
