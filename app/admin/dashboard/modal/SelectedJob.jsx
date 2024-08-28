import { retrieveData } from '@/app/utils/storageUtils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner';

function SelectedJob({ open, onHide, jobId }) {

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true);

  const getSelectedJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = retrieveData("url") + "admin.php";
      const jsonData = {
        "jobId": jobId
      }
      const formData = new FormData();
      formData.append("operation", "getSelectedJobs");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("RES DATA ni getSelectedJobs: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("AdminJobs.jsx => getSelectedJobs(): " + error);
    } finally {
      setIsLoading(false);
    }
  }, [jobId])

  useEffect(() => {
    if (open) {
      getSelectedJobs();
    }
  }, [getSelectedJobs, open])

  return (
    <>
      {isLoading ? <Spinner /> :
        <Dialog open={open} onOpenChange={onHide} >

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{data.jobMaster[0].jobM_title}</DialogTitle>
              <DialogDescription>{data.jobMaster[0].jobM_description}</DialogDescription>
            </DialogHeader>
            hello
          </DialogContent>
        </Dialog>
      }
    </>
  )
}

export default SelectedJob