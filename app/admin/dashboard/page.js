"use client"
import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminSidebar from './AdminSidebar';
import { CardTitle } from '@/components/ui/card';
import AdminJobs from './AdminJobs';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { retrieveData, storeData } from '@/app/utils/storageUtils';

export default function Page() {
  const [viewIndex, setViewIndex] = useState(0);

  const handleChangeView = (index) => {
    setViewIndex(index);
  }

  useEffect(() => {
    if (retrieveData("url") !== "http://localhost/delmonte/api/") {
      storeData("url", "http://localhost/delmonte/api/");
    }
  }, [])

  const adminViews = [
    { view: <AdminDashboard /> },
    { view: <AdminJobs /> },
  ]
  return (
    <div className='bg-background h-screen'>
      <AdminSidebar changeView={handleChangeView} />
      <main className="sm:ps-20 px-5 py-3">
        <div className='flex justify-end'>
          <ModeToggle />
        </div>
        <CardTitle className="text-3xl py-3">{adminViews[viewIndex].title}</CardTitle>
        {adminViews[viewIndex].view}
      </main>
    </div>
  )
}
