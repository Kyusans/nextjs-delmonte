import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { PlusSquare } from 'lucide-react'
import React, { useState } from 'react'

const AddMasterfile = ({ title, subject }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger>
          <button><PlusSquare className="h-5 w-5 text-primary" /></button>
        </SheetTrigger>
        <SheetContent side="bottom" className="w-full h-full">
          <SheetHeader>
            <SheetTitle>Add {title}</SheetTitle>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AddMasterfile
