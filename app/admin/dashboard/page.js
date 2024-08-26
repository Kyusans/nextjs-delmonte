"use client"
import React, { useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminSidebar from './AdminSidebar';
import { CardTitle } from '@/components/ui/card';

export default function Page() {
  const [viewIndex, setViewIndex] = useState(0);

  const handleChangeView = (index) => {
    setViewIndex(index);
  }

  const adminViews = [
    {title: "Dashboard", view: <AdminDashboard />},
    {title: "Dashboard", view: <AdminDashboard />},
  ]
  return (
    <div>
      <AdminSidebar changeView={handleChangeView} />
      <main className="sm:ml-20">
        <CardTitle className="text-3xl py-3">{adminViews[viewIndex].title}</CardTitle>
        {adminViews[viewIndex].view}
      </main>
    </div>
  )
}
