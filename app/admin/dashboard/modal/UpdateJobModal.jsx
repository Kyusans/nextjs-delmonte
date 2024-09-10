"use client"
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Popover } from '@/components/ui/popover';
import UpdateDuties from './UpdateDuties';

function UpdateJobModal({ jobData, type, getSelectedJobs, jobId}) {


  const handleClose = () => {
    getSelectedJobs();
  };

  const updatePage = () => {
    if(type === "duties"){
      return <UpdateDuties data={jobData} getSelectedJobs={getSelectedJobs} jobId={jobId} />
    }
  }

  return (
    <Drawer onClose={handleClose}>
      <DrawerTrigger asChild>
        <button variant="transparent">
          <Popover>
            <Edit className="mr-2 h-4 w-4" />
          </Popover>
        </button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle>Update {type}</DrawerTitle>
          <DrawerDescription>Update the job {type}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="w-full h-[calc(100vh-200px)] p-4">
          {updatePage()}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close Drawer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default UpdateJobModal;
