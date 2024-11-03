import DataTable from '@/app/my_components/DataTable';
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react'

const SetToInterviewModal = ({ datas }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isOpen) {
      console.log("datas: ", datas);
    }
  }, [datas, isOpen])

  const columns = [
    { header: 'Full Name', accessor: 'FullName' },
    { header: 'Status', accessor: 'status_name' },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="mr-1">Set all to interview</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set all new candidates to interview</DialogTitle>
        </DialogHeader>
        <Separator className="mt-2" />
        <div className='px-3'>
          <DataTable columns={columns} data={datas} itemsPerPage={5} centerSearch={true} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
          <Button onClick={() => setIsOpen(false)}>
            Set all to interview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SetToInterviewModal