'use client';
import React from 'react';
import Link from 'next/link';
import styles from '@/styles/Button.module.css';

interface PlainButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean; // ✅ add this
  fullWidth?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function PlainButton({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false, // ✅ add default
  fullWidth = false,
  href,
  onClick,
  className = '',
}: PlainButtonProps) {
  const classes = [
    styles.btn,
    styles[variant],
    styles[size],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className,
  ].filter(Boolean).join(' ');

  const content = loading ? <span className={styles.spinner} /> : children;

  if (href) {
    return (
      <Link href={href} className={classes} aria-disabled={disabled || loading}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled || loading}>
      {content}
    </button>
  );
}


{/* <PlainButton variant="primary" href="/signup">Sign Up</PlainButton>
<PlainButton variant="secondary" href="/courses">Browse</PlainButton>
<PlainButton variant="danger" onClick={deleteHandler}>Delete</PlainButton>
<PlainButton variant="success" onClick={saveHandler}>Save</PlainButton>
<PlainButton variant="ghost" onClick={cancelHandler}>Cancel</PlainButton> */}