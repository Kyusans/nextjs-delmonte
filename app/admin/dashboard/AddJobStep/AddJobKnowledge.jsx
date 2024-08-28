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
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


function AddJobKnowledge({ previousStep, nextStep }) {
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

  const handleNextStep = () => {
    if (retrieveData("jobKnowledge") === null || retrieveData("jobKnowledge") === "[]") {
      toast.error("Please add knowledge and compliance first");
      return;
    }
    nextStep(45);
  }


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
        <div className='flex justify-end gap-2'>
          <Button variant="secondary" onClick={() => previousStep(30)} className="mt-3">Previous</Button>
          <Button onClick={handleNextStep} className="mt-3">Next</Button>
        </div>
        <Button onClick={handleOpenModal}>
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Knowledge and Compliance
        </Button>
        <Alert className="w-full mt-3">
          {datas && datas.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/12">Index</TableHead>
                  <TableHead className="w-10/12">Duty</TableHead>
                  <TableHead className="w-1/12 text-center">Points</TableHead>
                  <TableHead className="w-1/12 text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datas.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-1/12">{index + 1}</TableCell>
                    <TableCell className="w-10/12 whitespace-normal">
                      {data.jobKnowledge}
                    </TableCell>
                    <TableCell className="w-1/12 text-center">{index.points}</TableCell>
                    <TableCell className="w-1/12 text-center">
                      <button
                        className="h-4 w-4"
                        onClick={() => handleRemoveList(index)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          ) : (
            <CardDescription className="text-center">
              No duties added yet
            </CardDescription>
          )}
        </Alert>
        <AddKnowledge open={showModal} onHide={handleCloseModal} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  )
}

export default AddJobKnowledge
