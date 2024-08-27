"use client";
import { retrieveData, storeData } from '@/app/utils/storageUtils'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CardContent, CardDescription } from '@/components/ui/card'
import ShowAlert from '@/components/ui/show-alert'
import { PlusIcon, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area';
import AddKnowledge from '../modal/AddKnowledge';

function AddJobKnowledge() {
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
      storeData("jobKnowledge", JSON.stringify(filteredDatas));
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
      storeData("jobKnowledge", JSON.stringify([...datas, status]));
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
    if (retrieveData("jobKnowledge") !== null || retrieveData("jobKnowledge") !== "[]") {
      setDatas(JSON.parse(retrieveData("jobKnowledge")));
    } else {
      setDatas([]);
    }
    console.log(JSON.stringify(JSON.parse(retrieveData("jobKnowledge"))));
  }, []);

  return (
    <>
      <div>
        <Button onClick={handleOpenModal}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Job Knowledge
        </Button>
        <Alert className="w-full mt-3">
          <AlertTitle className="text-md">{datas.length > 0 ? "Job Knowledge" : ""}</AlertTitle>
          <ScrollArea className={`w-full ${datas.length > 2 && "h-[calc(100vh-25rem)]"}`}>
            {datas && datas.length > 0 ? (
              <CardContent className={`${datas.length !== 1 && "lg:grid lg:grid-cols-2 lg:gap-x-4"}`}>
                {datas.map((data, index) => (
                  <Alert key={index} className="relative w-full bg-[#1c1917] mt-3">
                    <button
                      className="absolute top-2 right-2 text-white"
                      onClick={() => handleRemoveList(index)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <AlertTitle className="text-md">
                      <div className='mb-3 break-words'>{index + 1}.&nbsp;&nbsp;<span className='text-white'>{data.jobKnowledge}</span></div>
                    </AlertTitle>
                  </Alert>
                ))}
              </CardContent>
            ) : (
              <CardDescription className="text-center">
                No Job Knowledge added yet
              </CardDescription>
            )}
          </ScrollArea>
        </Alert>
        <AddKnowledge open={showModal} onHide={handleCloseModal} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  )
}

export default AddJobKnowledge
