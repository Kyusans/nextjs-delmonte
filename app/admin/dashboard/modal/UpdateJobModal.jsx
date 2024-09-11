"use client"
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Popover } from '@/components/ui/popover';
import UpdateDuties from './UpdateDuties';
import { toast } from 'sonner';
import axios from 'axios';
import Spinner from '@/components/ui/spinner';
import { retrieveData } from '@/app/utils/storageUtils';

function UpdateJobModal({ jobData, type, getSelectedJobs }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleClose = () => {
    getSelectedJobs();
  };

  const updatePage = () => {
    switch (type) {
      case "duties":
        return (
          <UpdateDuties
            data={data}
            handleAddData={handleAddData}
            getData={getData}
            handleUpdate={handleUpdate}
          />
        )
      default:
        return null
    }
  }

  const getData = async (operation) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = {
        jobId: retrieveData("jobId"),
      }
      const formData = new FormData();
      formData.append("operation", operation);
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      if (res.data !== 0) {
        setData(res.data);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("UpdateJobModal.jsx => getData(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddData = async (operation, jsonData) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      // const jsonData = {
      //   dutyId: retrieveData("dutyId"),
      //   duties: value
      // }
      console.log("jsonData ni handleAddData: ", jsonData)
      const formData = new FormData();
      formData.append("operation", operation);
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data ni handleAddData: ", res.data)
      if (res.data !== 0) {
        toast.success("Success!");
      }
    } catch (error) {
      toast.error("Network error");
      console.log("UpdateJobModal.jsx => handleAddData(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (operation, jsonData, getDataOperation) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      console.log("url ni handleUpdate: ", url)

      console.log("jsonData ni handleUpdate: ", jsonData)
      const formData = new FormData();
      // formData.append("operation", "updateDuties");
      formData.append("operation", operation);
      formData.append("json", JSON.stringify(jsonData));

      const res = await axios.post(url, formData);

      if (res.data === 1) {
        toast.success("Updated successfully");
        getData(getDataOperation);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("UpdateJobModal.jsx => handleUpdate(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setData(jobData);
  }, [jobData]);

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
          {isLoading ? <Spinner /> : (
            <>
              {updatePage()}
            </>
          )}
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <div className="flex justify-end p-3">
              <Button variant="secondary">Close Drawer</Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default UpdateJobModal;
