'use client';
import React from 'react';
import { Button as MuiButton, CircularProgress, ButtonProps as MuiButtonProps } from '@mui/material';
import { keyframes } from '@mui/system';

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

interface ButtonProps extends MuiButtonProps {
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
  animation?: 'pulse' | 'bounce' | 'none';
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  icon,
  iconPosition = 'start',
  disabled,
  variant = 'contained',
  size = 'medium',
  animation = 'none',
  sx,
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      size={size}
      disabled={disabled || loading}
      startIcon={!loading && icon && iconPosition === 'start' ? icon : undefined}
      endIcon={!loading && icon && iconPosition === 'end' ? icon : undefined}
      sx={{
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: variant === 'contained' ? '0 6px 20px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...(animation === 'pulse' && {
          animation: `${pulse} 2s infinite`,
        }),
        ...(animation === 'bounce' && {
          animation: `${bounce} 1s ease infinite`,
        }),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={24}
          color="inherit"
          sx={{
            mr: 1,
            animation: 'fadeIn 0.2s ease',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        />
      ) : (
        children
      )}
    </MuiButton>
  );
};

export default Button;