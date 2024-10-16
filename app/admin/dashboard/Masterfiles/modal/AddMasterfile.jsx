import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import AddCourseCategory from './AddMasterfileForms/AddCourseCategory';

const AddMasterfile = ({ title, subject, getData, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSuccess = () => {
    setIsOpen(false);
  }

  const addView = () => {
    switch (subject) {
      case "courseCategory":
        return <AddCourseCategory data={data} getData={getData} onSuccess={onSuccess} />
      default:
        return null;
    }
  }
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <button><PlusSquare className="h-5 w-5 text-primary" /></button>
        </SheetTrigger>
        <SheetContent side="bottom" className="w-full h-full">
          <SheetHeader className="mb-3">
            <SheetTitle>Add {title}</SheetTitle>
          </SheetHeader>
          {addView()}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AddMasterfile
