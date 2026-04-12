"use client";

import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { CheckCircle2 } from "lucide-react";

interface SkillChipsProps {
  skills: string[];
}

export default function SkillChips({ skills }: SkillChipsProps) {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <CheckCircle2 size={20} color="var(--primary-yellow)" />
        <Typography variant="h6" fontWeight="bold">Professional Skills</Typography>
      </Stack>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, flex: 1 }}>
        {skills.map((skill, index) => (
          <Chip
            key={index}
            label={skill}
            variant="outlined"
            size="medium"
            sx={{
              borderRadius: 2,
              borderColor: 'var(--border-light)',
              bgcolor: 'var(--bg-light)',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'var(--bg-white)',
                borderColor: 'var(--primary-yellow)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-sm)',
                color: 'var(--primary-yellow)'
              }
            }}
          />
        ))}
      </Box>
      <Box sx={{ mt: 3, p: 1.5, bgcolor: 'var(--bg-light)', borderRadius: 2 }}>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block' }}>
          Next Milestone: <strong>Cloud Architecture</strong> (85% progress)
        </Typography>
      </Box>
    </Box>
  );
}
