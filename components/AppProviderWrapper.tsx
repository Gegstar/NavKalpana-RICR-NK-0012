'use client';
import { AppProvider } from '@/contexts/AppContext';

export default function AppProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AppProvider>{children}</AppProvider>;
}