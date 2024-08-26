"use client"
import React from 'react'
import AdminSidebar from './AdminSidebar'

function AdminDashboard() {
  const handleChangeView = (index) => {
    console.log("index:", index);
  }
  return (
    <div>
      <AdminSidebar changeView={handleChangeView} />
    </div>
  )
}

export default AdminDashboard
