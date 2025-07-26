// src/app/admin/layout.jsx
'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-center p-10">Loading...</p>;
  }

  // If user is not authenticated or is not an admin, redirect them
  if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
    redirect('/events'); // Or show an "Access Denied" page
  }

  // If they are an admin, render the layout
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav>
          <ul>
            <li className="mb-4"><Link href="/admin" className="hover:text-blue-300">Dashboard</Link></li>
            <li className="mb-4"><Link href="/admin/events" className="hover:text-blue-300">Manage Events</Link></li>
            <li className="mb-4"><Link href="/admin/users" className="hover:text-blue-300">Manage Users</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
