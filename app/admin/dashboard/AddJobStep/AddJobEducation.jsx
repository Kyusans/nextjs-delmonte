"use client";
import { retrieveData, storeData } from '@/app/utils/storageUtils'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ShowAlert from '@/components/ui/show-alert'
import { PlusIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import AddEducation from '../modal/AddEducation';

function AddJobEducation({ courseCategory, previousStep, nextStep }) {
  const [datas, setDatas] = useState([]);
  const [indexToRemove, setIndexToRemove] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const handleCloseAlert = (status) => {
    if (status === 1) {
      const filteredDatas = datas.filter((_, index) => index !== indexToRemove);
      setDatas(filteredDatas);
      storeData("jobEducation", JSON.stringify(filteredDatas));
    }
    setShowAlert(false);
  };

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = (status) => {
    if (status !== 0) {
      setDatas([...datas, status]);
      storeData("jobEducation", JSON.stringify([...datas, status]));
    } else {
      setDatas(datas);
    }
    setShowModal(false);
  };

  const handleRemoveList = (indexToRemove) => {
    setIndexToRemove(indexToRemove);
    handleShowAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  useEffect(() => {
    if (retrieveData("jobEducation") !== null || retrieveData("jobEducation") !== "[]") {
      setDatas(JSON.parse(retrieveData("jobEducation")));
    } else {
      setDatas([]);
    }
  }, []);

  return (
    <>
      <div>
        <Button onClick={handleOpenModal}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Job Education
        </Button>
        <Alert className="w-full mt-3">
          <AlertTitle className="text-md">Job Education</AlertTitle>
          <ScrollArea className={`w-full ${datas.length > 2 && "h-[calc(100vh-25rem)]"}`}>
            {datas && datas.length > 0 ? (
              <CardContent className={`grid gap-4 ${datas.length > 1 ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                {datas.map((data, index) => (
                  <Alert key={index} className="relative w-full mt-3">
                    <button
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveList(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <AlertTitle className="text-sm">
                      <div className='mb-1 text-xl break-words'>
                        {courseCategory.find((item) => item.value === data.courseCategory)?.label}
                      </div>
                      <div className='mb-3 text-sm break-words'>
                        {data.jobEducation}
                      </div>
                    </AlertTitle>
                  </Alert>
                ))}
              </CardContent>
            ) : (
              <CardDescription className="text-center">
                No Job Education added yet
              </CardDescription>
            )}
          </ScrollArea>
        </Alert>
        <AddEducation open={showModal} onHide={handleCloseModal} courseCategory={courseCategory} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  )
}

export default AddJobEducation;
