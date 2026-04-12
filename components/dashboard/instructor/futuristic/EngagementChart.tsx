"use client";

import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import styles from "@/styles/EngagementChart.module.css";
import { useThemeColor } from "@/hooks/useThemeColor";

const data = [
  { day: "Mon", engagement: 400 },
  { day: "Tue", engagement: 300 },
  { day: "Wed", engagement: 500 },
  { day: "Thu", engagement: 280 },
  { day: "Fri", engagement: 590 },
  { day: "Sat", engagement: 320 },
  { day: "Sun", engagement: 450 },
];

export default function EngagementChart() {
  const primaryColor = useThemeColor("--color-primary");
  const textSecondary = useThemeColor("--color-text-secondary");
  const glassBorder = useThemeColor("--glass-border");

  return (
    <Card className={`${styles.chartCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Typography variant="overline" className={styles.label}>
          Student Engagement Trend
        </Typography>
        
        <Box className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={glassBorder} />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: textSecondary, fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: textSecondary, fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: useThemeColor("--overlay-bg"), 
                  border: `1px solid ${glassBorder}`,
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ color: useThemeColor("--color-text-primary") }}
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke={primaryColor} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorEngage)" 
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
