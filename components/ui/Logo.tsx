'use client';
import Link from 'next/link';
import { Box, Typography, useTheme } from '@mui/material';

interface LogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ variant = 'full', size = 'medium', showText = true }: LogoProps) {
  const theme = useTheme();

  const sizeMap = {
    small: { icon: 24, text: '1rem', gap: 0.5 },
    medium: { icon: 32, text: '1.5rem', gap: 1 },
    large: { icon: 48, text: '2rem', gap: 1.5 },
  };

  const sizes = sizeMap[size];

  const logoSx = {
    display: 'flex',
    alignItems: 'center',
    gap: sizes.gap,
    textDecoration: 'none',
    color: 'inherit',
  };

  const iconSx = {
    width: sizes.icon,
    height: sizes.icon,
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: sizes.icon * 0.6,
    color: '#fff',
    transition: 'transform 0.2s ease',
  };

  const textSx = {
    fontWeight: 'bold',
    fontSize: sizes.text,
    lineHeight: 1,
    letterSpacing: '-0.02em',
  };

  // Hover effect on the whole logo
  const hoverSx = {
    '&:hover .logo-icon': {
      transform: 'scale(1.05)',
    },
  };

  if (variant === 'icon') {
    return (
      <Link href="/" style={logoSx}>
        <Box sx={iconSx} className="logo-icon">S</Box>
      </Link>
    );
  }

  if (variant === 'text') {
    return (
      <Link href="/" style={logoSx}>
        <Typography sx={textSx}>
          Skill<span style={{ color: theme.palette.primary.main }}>Verse</span>
        </Typography>
      </Link>
    );
  }

  // Full variant: icon + text
  return (
    <Link href="/" style={{ ...logoSx, ...hoverSx }}>
      {showText && (
        <Typography sx={textSx}>
          Skill<span style={{ color: theme.palette.primary.main }}>Verse</span>
        </Typography>
      )}
    </Link>
  );
}