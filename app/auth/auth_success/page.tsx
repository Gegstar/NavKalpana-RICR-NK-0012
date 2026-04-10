'use client';

import { Suspense } from 'react';
import AuthSuccessContent from './AuthSuccessContent';

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  );
}
