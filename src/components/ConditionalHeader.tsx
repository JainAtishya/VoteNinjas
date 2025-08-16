'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { GlobalHeader } from './GlobalHeader';

export function ConditionalHeader() {
  const pathname = usePathname();
  
  // Don't show GlobalHeader on landing page, root, or admin routes since they have custom navbar or layout
  if (pathname === '/landing' || pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }
  
  return <GlobalHeader />;
}
