'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { FloatingNav } from './ui/floating-navbar';
import { HoverBorderGradient as Button } from './ui/hover-border-gradient';
import { ModeToggle } from './theme-toggle';

export function GlobalHeader() {
  const { data: session, status } = useSession();

  const navItems = [{ name: 'Events', link: '/events' }];

  const rightContent = () => {
    if (status === 'loading') {
      return <div className="h-10 w-24 animate-pulse rounded-full bg-gray-200" />;
    }

    if (status === 'authenticated') {
      return (
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-700 dark:text-neutral-300">
            {session.user.name}
          </span>
          {session.user.role === 'admin' && (
            <Link href="/admin">
              <Button containerClassName="rounded-full" className="px-3 py-1.5 text-xs">
                Admin
              </Button>
            </Link>
          )}
          <Button
            onClick={() => signOut()}
            containerClassName="rounded-full"
            className="px-3 py-1.5 text-xs"
          >
            Sign Out
          </Button>
          <ModeToggle />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4">
        <Button
          onClick={() => signIn()}
          containerClassName="rounded-full"
          className="px-3 py-1.5 text-xs"
        >
          Sign In
        </Button>
        <ModeToggle />
      </div>
    );
  };

  return <FloatingNav navItems={navItems} rightContent={rightContent()} />;
}