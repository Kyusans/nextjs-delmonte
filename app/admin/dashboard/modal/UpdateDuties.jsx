"use client"
import { CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import React, { useEffect, useState } from 'react';
import AddDuties from './AddDuties';
import ShowAlert from '@/components/ui/show-alert';
import { Edit2, PlusIcon, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { storeData } from '@/app/utils/storageUtils';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';

function UpdateDuties({ data, getSelectedJobs, jobId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [datas, setDatas] = useState([]);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const handleCloseAlert = (status) => {
    if (status === 1) {
      const filteredDatas = datas.filter((_, index) => index !== indexToRemove);
      setDatas(filteredDatas);
    }
    setShowAlert(false);
  };

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = async (status) => {
    if (status !== 0) {
      await handleAddDuties(status.duties);
      getSelectedJobs();
    } else {
      setDatas(datas);
    }
    setShowModal(false);
  };

  const handleRemoveList = (indexToRemove) => {
    setIndexToRemove(indexToRemove);
    handleShowAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  const handleEdit = (index, text, selectedId) => {
    setEditIndex(index);
    setEditedText(text);
    setSelectedId(selectedId);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedText("");
    setSelectedId(null);
  };

  const handleAddDuties = async (value) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = {
        dutyId: jobId,
        duties: value
      }
      console.log("jsonData ni handleAddDuties: ", jsonData)
      const formData = new FormData();
      formData.append("operation", "addDuties");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data ni handleAddDuties: ", res.data)
      if (res.data !== 0) {
        toast.success("Duties added successfully");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      if (!editedText) {
        toast.error("Empty field is not allowed");
      }
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      console.log("url ni handleUpdate: ", url)
      const jsonData = {
        duties: editedText,
        dutyId: selectedId,
      }
      console.log("jsonData ni handleUpdate: ", jsonData)
      const formData = new FormData();
      formData.append("operation", "updateDuties");
      formData.append("json", JSON.stringify(jsonData));

      const res = await axios.post(url, formData);

      if (res.data === 1) {
        toast.success("Duties updated successfully");
        const updatedDatas = datas.map((item, index) =>
          index === editIndex ? { ...item, duties_text: editedText } : item
        );
        setDatas(updatedDatas);
        handleCancelEdit();
      } else {
        handleCancelEdit();
      }
    } catch (error) {
      toast.error("Network error");
      console.log("UpdateDuties.jsx => handleUpdate(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setDatas(data);
    }
    console.log("data ni useEffect: ", data)
  }, [data]);

  return (
    <>
      <div>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Button onClick={handleOpenModal}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Duties
            </Button>
            <Alert className="w-full mt-3">
              {datas && datas.length > 0 ? (
                <>
                  <div className="hidden md:block">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/12">Index</TableHead>
                          <TableHead className="w-10/12">Duty</TableHead>
                          <TableHead className="w-1/12 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datas.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-1/12">{index + 1}</TableCell>
                            <TableCell className="w-10/12 whitespace-normal">
                              {editIndex === index ? (
                                <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                              ) : (
                                data.duties_text
                              )}
                            </TableCell>
                            <TableCell className="w-1/12 text-center">
                              {editIndex === index ? (
                                <div className='flex justify-center'>
                                  <Button onClick={handleCancelEdit} variant="secondary">Cancel</Button>
                                  <Button onClick={handleUpdate} className="ml-2">Update</Button>
                                </div>
                              ) : (
                                <>
                                  <button onClick={() => handleEdit(index, data.duties_text, data.duties_id)}>
                                    <Edit2 className="h-4 w-4 mr-4" />
                                  </button>
                                  <button className="h-4 w-4" onClick={() => handleRemoveList(index)}>
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="block md:hidden">
                    {datas.map((data, index) => (
                      <div key={index} className="relative w-full p-4 rounded-md shadow">
                        <div className="flex justify-end">
                          {editIndex === index ? (
                            <>
                              <Button onClick={handleUpdate} variant="primary" className="mr-2">Update</Button>
                              <Button onClick={handleCancelEdit} variant="secondary">Cancel</Button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(index, data.duties_text, data.duties_id)}>
                                <Edit2 className="h-4 w-4 mr-4" />
                              </button>
                              <button
                                className="h-4 w-4"
                                onClick={() => handleRemoveList(index)}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          {editIndex === index ? (
                            <Textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
                          ) : (
                            <>
                              {index + 1}.&nbsp;&nbsp;
                              {data.duties_text}
                            </>
                          )}
                        </div>
                        <Separator className="mt-3" />
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <CardDescription className="text-center">
                  No duties added yet
                </CardDescription>
              )}
            </Alert>
          </>
        )}
        <AddDuties open={showModal} onHide={handleCloseModal} />
        <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />
      </div>
    </>
  );
}

export default UpdateDuties;
