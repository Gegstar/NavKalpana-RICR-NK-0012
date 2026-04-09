'use client';
import { Typography } from '@mui/material';
import styles from '@/styles/Title.module.css';

interface TitleProps {
  title: string;
  highlight?: string;
  align?: 'left' | 'center' | 'right';
}

export default function Title({ title, highlight, align = 'center' }: TitleProps) {
  const renderTitle = () => {
    if (!highlight) {
      return <span>{title}</span>;
    }

    const highlightIndex = title.indexOf(highlight);
    if (highlightIndex === -1) {
      return <span>{title}</span>;
    }

    const before = title.slice(0, highlightIndex);
    const after = title.slice(highlightIndex + highlight.length);

    return (
      <>
        {before}
        <span className={styles.highlight}>{highlight}</span>
        {after}
      </>
    );
  };

  return (
    <Typography
      variant="h2"
      className={`${styles.sectionTitle} ${styles[align]}`}
    >
      {renderTitle()}
    </Typography>
  );
}