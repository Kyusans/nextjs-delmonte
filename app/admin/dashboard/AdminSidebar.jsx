"use client";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Briefcase, CircleUser, Home, LogOut, Menu, Settings, Settings2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

function AdminSidebar({ changeView }) {
  const [view, setView] = useState(0);
  const sideTabs = [
    { name: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Jobs", icon: <Briefcase className="h-5 w-5" /> },
  ]
  const handleChangeView = (index) => {
    changeView(index);
    setView(index);
  }
  return (
    <>
      <header className="sm:hidden w-full sticky top-0 flex h-16 items-center gap-4 border-b bg-[#0e4028] px-4 md:px-6 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="shrink-0 md:hidden bg-[#0e5a35] text-white"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div
              href="#"
              className="flex items-center gap-2 text-lg font-semibold mb-10"
            >
              <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className="w-32 h-24 transition-all group-hover:scale-110" />
              <span className="sr-only">Delmonte</span>
            </div>

            <nav className="grid gap-6 text-lg font-medium">
              {sideTabs.map((tab, index) => (
                <div
                  key={index}
                  href="#"
                  className={`flex p-3 items-center gap-2 text-lg font-semibold md:text-base rounded-md ${index === view ? 'bg-accent text-primary transition-all duration-450 ease-in-out' : 'text-tertiary'}`}
                  onClick={() => handleChangeView(index)}
                >
                  {tab.icon}
                  {tab.name}
                  <span className="sr-only">{tab.name}</span>
                </div>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-[#0e5a35] text-white">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings2 className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-[#0e5a35] dark:bg-[#0e4028] sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* logo  */}
          <div
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image src="/assets/images/delmonteLogo.png" alt="DelmonteLogo" width={152} height={152} className=" transition-all group-hover:scale-110" />
            <span className="sr-only">Del Monte</span>
          </div>
          <TooltipProvider>
            {sideTabs.map((tab, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    href="#"
                    className={`flex h-9 w-9  ${view === index ? "bg-primary text-black hover:text-white transition-all duration-500 ease-in-out" : "bg-transparent transition-colors text-white hover:text-black"} items-center justify-center rounded-lg hover:bg-primary transition-colors md:h-8 md:w-8 cursor-pointer`}
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
                  className="flex h-9 w-9 items-center justify-center "
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" className="bg-transparent rounded-lg text-white transition-colors hover:text-black md:h-8 md:w-8">
                        <Settings className="h-5 w-5" />
                        <span className="sr-only">Settings</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
    </>

  )
}

export default AdminSidebar