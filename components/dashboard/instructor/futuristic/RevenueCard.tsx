"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import gsap from "gsap";
import styles from "@/styles/RevenueCard.module.css";

interface RevenueCardProps {
  label: string;
  value: number;
  prefix?: string;
}

export default function RevenueCard({ label, value, prefix = "$" }: RevenueCardProps) {
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        countRef.current,
        { innerText: 0 },
        {
          innerText: value,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: countRef.current,
            start: "top 90%",
          },
          onUpdate: function () {
            if (countRef.current) {
              countRef.current.innerText = prefix + Number(this.targets()[0].innerText).toLocaleString();
            }
          },
        }
      );
    });
    return () => ctx.revert();
  }, [value, prefix]);

  return (
    <Card className={`${styles.revenueCard} gsap-reveal`}>
      <CardContent className={styles.cardContent}>
        <Typography variant="overline" className={styles.label}>
          {label}
        </Typography>
        <Box className={styles.valueContainer}>
          <Typography
            variant="h3"
            component="span"
            ref={countRef}
            className={styles.value}
          >
            {prefix}0
          </Typography>
          <Box className={styles.trending}>
            <TrendingUpIcon className={styles.trendingIcon} />
            +12%
          </Box>
        </Box>
      </CardContent>
      {/* Decorative gradient blur */}
      <Box className={styles.decorativeBlur} />
    </Card>
  );
}
