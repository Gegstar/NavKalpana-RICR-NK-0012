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
    small: { icon: 24, text: '1rem' },
    medium: { icon: 32, text: '1.5rem' },
    large: { icon: 48, text: '2rem' },
  };

  const sizes = sizeMap[size];

  const logoSx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
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
  };

  const textSx = {
    fontWeight: 'bold',
    fontSize: sizes.text,
    lineHeight: 1,
  };

  const renderLogo = () => {
    if (variant === 'icon') {
      return <Box sx={iconSx}>S</Box>;
    }

    if (variant === 'text') {
      return (
        <Typography sx={textSx}>
          Skill<span style={{ color: theme.palette.primary.main }}>Verse</span>
        </Typography>
      );
    }

    // full variant
    return (
      <>
        {showText && (
          <Typography sx={textSx}>
            Skill<span style={{ color: theme.palette.primary.main }}>Verse</span>
          </Typography>
        )}
      </>
    );
  };

  return (
    <Link href="/" style={logoSx}>
      {renderLogo()}
    </Link>
  );
}
