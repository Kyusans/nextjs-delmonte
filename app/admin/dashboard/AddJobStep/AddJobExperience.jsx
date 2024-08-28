"use client";
import { retrieveData, storeData } from '@/app/utils/storageUtils'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription } from '@/components/ui/card'
import ShowAlert from '@/components/ui/show-alert'
import { PlusIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import AddExperience from '../modal/AddExperience';

function AddJobExperience({previousStep, nextStep}) {
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
      storeData("jobExperience", JSON.stringify(filteredDatas));
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
      storeData("jobExperience", JSON.stringify([...datas, status]));
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
    if (retrieveData("jobExperience") !== null || retrieveData("jobExperience") !== "[]") {
      setDatas(JSON.parse(retrieveData("jobExperience")));
    } else {
      setDatas([]);
    }
    console.log(JSON.stringify(JSON.parse(retrieveData("jobExperience"))));
  }, []);

  return (
    <>
      <div>
        <Button onClick={handleOpenModal}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Job Experience
        </Button>
        <Alert className="w-full mt-3">
          <AlertTitle className="text-md">Job Experience</AlertTitle>
          <ScrollArea className={`w-full ${datas.length > 2 && "h-[calc(100vh-25rem)]"}`}>
            {datas && datas.length > 0 ? (
              <CardContent className={`${datas.length !== 1 && "lg:grid lg:grid-cols-2 lg:gap-x-4"}`}>
                {datas.map((data, index) => (
                  <Alert key={index} className="relative w-full mt-3">
                    <button
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveList(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <AlertTitle className="text-sm">
                      <div className='mb-3 break-words'>Years of Experience:&nbsp;<span>{data.yearsOfExperience} years</span></div>
                      <div className='mb-3 break-words'>{index + 1}.&nbsp;&nbsp;<span>{data.jobExperience}</span></div>
                    </AlertTitle>
                  </Alert>
                ))}
              </CardContent>
            ) : (
              <CardDescription className="text-center">
                No Job Experience added yet
              </CardDescription>
            )}
          </ScrollArea>
        </Alert>
        <AddExperience open={showModal} onHide={handleCloseModal} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  )
}

export default AddJobExperience
