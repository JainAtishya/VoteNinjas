'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { FloatingDock } from './ui/floating-dock';
import { Home, BarChart, Trophy, Calendar } from 'lucide-react';

export function ConditionalFloatingDock() {
  const pathname = usePathname();
  
  // Don't show FloatingDock on landing page, root, or admin routes since they have custom navigation or layout
  if (pathname === '/landing' || pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }
  
  const navItems = [
    {
      title: 'Home',
      href: '/landing',
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: 'Events',
      href: '/events',
      icon: <Calendar className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: 'Leaderboard',
      href: '/leaderboard',
      icon: <BarChart className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: 'Results',
      href: '/results',
      icon: <Trophy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />,
    },
  ];
  
  return (
    <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center">
      <FloatingDock items={navItems} />
    </div>
  );
}
