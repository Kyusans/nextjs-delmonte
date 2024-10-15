"use client"
import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import AdminSidebar from './AdminSidebar';
import { CardTitle } from '@/components/ui/card';
import AdminJobs from './Job/AdminJobs';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { retrieveData, storeData } from '@/app/utils/storageUtils';
import CourseCategoryMaster from './Masterfiles/CourseCategoryMaster';
import MasterFiles from './Masterfiles/MasterFiles';

export default function Page() {
  const [viewIndex, setViewIndex] = useState(0);
  const [masterFileIndex, setMasterFileIndex] = useState(0);

  const adminViews = [
    { view: <AdminDashboard /> },
    { view: <AdminJobs /> },
    { view: <MasterFiles index={masterFileIndex} /> },
  ]


  const handleChangeView = (index) => {
    setViewIndex(index);
  }

  const handleChangeMasterFile = (index) => {
    setMasterFileIndex(index);
    setViewIndex(2);
  }
  return (
    <div className='bg-background h-screen'>
      <AdminSidebar changeView={handleChangeView} changeMasterFile={handleChangeMasterFile} />
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
