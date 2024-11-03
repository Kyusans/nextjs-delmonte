import DataTable from '@/app/my_components/DataTable';
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

const SetToInterviewModal = ({ datas, passingPercentage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isOpen) {
      console.log("datas: ", datas);
      const filteredData = datas.filter(data =>
        data.status_name === "Pending" || data.status_name === "Process" &&
        data.points.percentage >= passingPercentage
      );
      console.log("datas: ", filteredData);
      setData(filteredData);
      if(filteredData.length === 0) {
        setIsOpen(false);
        toast.error("No candidates to set to interview");
      }
    }
  }, [datas, isOpen, passingPercentage])

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
          <DialogTitle>Set all new passed candidates to interview</DialogTitle>
        </DialogHeader>
        <Separator className="mt-2" />
        <div className='px-3'>
          <DataTable columns={columns} data={data} itemsPerPage={5} centerSearch={true} />
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