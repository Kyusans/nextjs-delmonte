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
import AddSkill from '../modal/AddSkill';
import { toast } from 'sonner';

function AddJobSkill({ skill, previousStep, nextStep }) {
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
      storeData("jobSkill", JSON.stringify(filteredDatas));
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
      storeData("jobSkill", JSON.stringify([...datas, status]));
    } else {
      setDatas(datas);
    }
    setShowModal(false);
  };

  const handleRemoveList = (indexToRemove) => {
    setIndexToRemove(indexToRemove);
    handleShowAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  const handleNextStep = () => {
    if (retrieveData("jobSkill") === null || retrieveData("jobSkill") === "[]") {
      toast.error("Please add education first");
      return;
    }
    nextStep(83);
  }

  useEffect(() => {
    if (retrieveData("jobSkill") !== null || retrieveData("jobSkill") !== "[]") {
      setDatas(JSON.parse(retrieveData("jobSkill")));
    } else {
      setDatas([]);
    }
  }, []);

  return (
    <>
      <div>
        <div className='flex justify-end gap-2 mb-3'>
          <Button variant="secondary" onClick={() => previousStep(60)} className="mt-3">Previous</Button>
          <Button onClick={handleNextStep} className="mt-3">Next</Button>
        </div>
        <Button onClick={handleOpenModal}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Skill
        </Button>
        <Alert className="w-full mt-3">
          <AlertTitle className="text-md">Job Skill</AlertTitle>
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
                        {skill.find((item) => item.value === data.skill)?.label}
                      </div>
                      <div className='mb-3 text-sm break-words'>
                        {data.jobSkill}
                      </div>
                    </AlertTitle>
                  </Alert>
                ))}
              </CardContent>
            ) : (
              <CardDescription className="text-center">
                No Job Skill added yet
              </CardDescription>
            )}
          </ScrollArea>
        </Alert>
        <AddSkill open={showModal} onHide={handleCloseModal} skill={skill} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  )
}

export default AddJobSkill;
