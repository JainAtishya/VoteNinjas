'use client';
import { useState } from 'react';

import Header from '../../components/Dashboard/header';
import Main from '../../components/Dashboard/Main';
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex">
      <div className="w-full">
        <Main />
      </div>
    </div>
  );
}