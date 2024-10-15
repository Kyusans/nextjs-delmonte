import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit2 } from 'lucide-react';
import React, { useState } from 'react'
import UpdateCourseCategory from './UpdateMasterfileForms/UpdateCourseCategory';

const UpdateMasterfile = ({ title, data, subject, id, getData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const updateView  = () => {
    switch(subject){
      case "courseCategory":
        return <UpdateCourseCategory />
      default:
        return null;
    }
  }
  const handleClose = () => {
    setIsOpen(false);
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogTrigger>
          <Edit2
            className="h-5 w-5 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {title}</DialogTitle>
            {updateView()}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UpdateMasterfile