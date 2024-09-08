import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import React from 'react'

function SelectedApplicant({ open, onHide, candId }) {
  const handleHide = () => {
    onHide();
  }
  return (
    <>
      <Sheet open={open} onOpenChange={onHide} className="h-full">
        <SheetContent side={"bottom"}>
          <SheetHeader>
            <SheetTitle>View Selected Applicant</SheetTitle>
            <SheetDescription>
              View selected applicant details here.
            </SheetDescription>
          </SheetHeader>
          
        </SheetContent>
      </Sheet>
    </>
  );
}
export default SelectedApplicant;
