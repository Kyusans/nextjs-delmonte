import { Button } from '@/components/ui/button'
import { Edit2, PlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddInterviewCriteria from './modals/AddInterview/AddInterviewCriteria'
import UpdateInterviewCriteria from './modals/UpdateInterview/UpdateInterviewCriteria'
import ShowAlert from '@/components/ui/show-alert'
import axios from 'axios'
import { toast } from 'sonner'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

function InterviewPage({ interviewData, getSelectedJob }) {
  const [data, setData] = useState([]);

  // add interview criteria modal diri
  const [showAddModal, setShowAddModal] = useState(false);
  const openShowModal = () => { setShowAddModal(true); };
  const closeShowModal = (status) => {
    if (status !== 0) {
      getSelectedJob();
    }
    setShowAddModal(false);
  };

  const addCriteria = () => {
    getSelectedJob();
  }

  // update interview criteria modal diri
  const [selectedData, setSelectedData] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const openShowModalUpdate = (data, index) => {
    setShowUpdateModal(true);
    setSelectedData(data);
    setSelectedIndex(index);
  };
  const closeUpdateModal = (status) => {
    if (status !== 0) {
      let criteriaList = data;
      criteriaList[selectedIndex] = { inter_criteria_name: status.name, inter_criteria_points: status.points };
      setData(criteriaList);
      getSelectedJob();
    }
    setShowUpdateModal(false);
    setSelectedIndex(0);
  }

  // delete sa criteria ni diri
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [indexToRemove, setIndexToRemove] = useState(null);
  const handleShowAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };
  const handleCloseAlert = async (status) => {
    console.log("status: ", status);
    if (status === 1) {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = { criteriaId: indexToRemove };
      console.log("JSON DATA: ", jsonData);
      const formData = new FormData();
      formData.append("operation", "deleteInterviewCriteria");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data: ", res.data);
      if (res.data === 1) {
        getSelectedJob();
        toast.success("Criteria deleted successfully");
      }
    }
    setShowAlert(false);
  };


  const handleRemoveList = (idToRemove) => {
    setIndexToRemove(idToRemove);
    handleShowAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  useEffect(() => {
    if (interviewData.interviewCriteria) {
      setData(interviewData.interviewCriteria);
    }
  }, [interviewData.interviewCriteria]);

  return (
    <div className={data.length <= 2 && "h-[calc(100vh-220px)]"}>
      <div>
        {data.length === 0 ? (
          <div className='flex flex-col justify-center items-center gap-3'>
            <div className='font-bold text-xl mt-3'>No criteria for interview</div>
            <Button onClick={openShowModal}>
              <PlusCircle className='h-5 w-5 mr-1' /> Add criteria
            </Button>
          </div>
        ) : (
          <div className='mt-3'>
            <Button onClick={openShowModal} className='mb-3'>
              <PlusCircle className='h-5 w-5 mr-1' /> Add criteria
            </Button>
            <div className={`grid ${data.length > 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-2`}>
              {data.map((item, index) => (
                <Card key={index} className='bg-background'>
                  <CardContent>
                    <CardHeader>
                      <div className='flex justify-end gap-3'>
                        <Edit2 className='h-5 w-5 mr-1 hover:cursor-pointer' />
                        <Trash2 className='h-5 w-5 mr-1 hover:cursor-pointer' onClick={() => handleRemoveList(item.inter_criteria_id)} />
                      </div>
                      <CardTitle> {item.criteria_inter_name}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Badge variant="secondary" className="mr-2">{item.interview_categ_name}</Badge>
                      <Badge>{item.inter_criteria_points} points</Badge>
                    </CardFooter>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      {
        showAddModal && (
          <AddInterviewCriteria
            open={showAddModal}
            onHide={closeShowModal}
            interviewCriteria={data}
            addCriteria={addCriteria}
          />
        )
      }
      {
        showUpdateModal && (
          <UpdateInterviewCriteria
            open={showUpdateModal}
            onHide={closeUpdateModal}
            data={selectedData}
            criteriaList={data}
            isMaster={false}
          />
        )
      }
      <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} duration={1} />
    </div>
  );
}


export default InterviewPage