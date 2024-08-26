"use client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Home, LineChart, Package, Package2, Settings, ShoppingCartIcon, Users2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

function AdminSidebar({ changeView }) {
  const [view, setView] = useState(0);
  const sideTabs = [
    { name: "Home", icon: <Home className="h-5 w-5" /> },
    { name: "Orders", icon: <ShoppingCartIcon className="h-5 w-5" /> },
  ]
  const handleChangeView = (index) => {
    changeView(index);
    setView(index);
  }
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <div
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className=" transition-all group-hover:scale-110" priority/>
          <span className="sr-only">Del Monte</span>
        </div>
        <TooltipProvider>
          {sideTabs.map((tab, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  href="#"
                  className={`flex h-9 w-9 ${view === index ? "bg-primary text-secondary" : "bg-transparent text-muted-foreground hover:text-foreground"} items-center justify-center rounded-lg  transition-colors md:h-8 md:w-8 cursor-pointer`}
                  onClick={() => handleChangeView(index)}
                >
                  {tab.icon}
                  <span className="sr-only">{tab.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">{tab.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  )
}

export default AdminSidebar