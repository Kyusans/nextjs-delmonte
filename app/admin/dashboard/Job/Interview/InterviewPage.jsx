import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit2, PlusCircle, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddInterviewCriteria from './modals/AddInterview/AddInterviewCriteria'
import AddInterviewMaster from './modals/AddInterview/AddInterviewMaster'
import UpdateInterviewCriteria from './modals/UpdateInterview/UpdateInterviewCriteria'
import ShowAlert from '@/components/ui/show-alert'
import axios from 'axios'
import { toast } from 'sonner'

function InterviewPage({ interviewData, getSelectedJob }) {
  const [data, setData] = useState([]);

  // add interview criteria modal diri
  const [showAddModal, setShowAddModal] = useState(false);
  const openShowModal = () => { setShowAddModal(true); };
  const closeShowModal = (status) => {

    setShowAddModal(false);
  };

  const addCriteria = (status) => {
    if (status !== 0) {
      setData([...data, { inter_criteria_name: status.name, inter_criteria_points: status.points }]);
    }
  }

  // add interview master modal diri
  const [showAddInterviewMaster, setShowAddInterviewMaster] = useState(false);
  const openShowModalMaster = () => { setShowAddInterviewMaster(true); };
  const closeShowModalMaster = () => {
    setShowAddInterviewMaster(false);
    getSelectedJob();
  };

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
      const jsonData = { criteriaId: data[indexToRemove].inter_criteria_id };
      console.log("JSON DATA: ", jsonData);
      const formData = new FormData();
      formData.append("operation", "deleteInterviewCriteria");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data: ", res.data);
      if (res.data === 1) {
        getSelectedJob();
        toast.success("Criteria deleted successfully");
        const filteredData = data.filter((element) => element !== data[indexToRemove]);
        setData(filteredData);
      }
    }
    setShowAlert(false);
  };


  const handleRemoveList = (indexToRemove) => {
    setIndexToRemove(indexToRemove);
    handleShowAlert("This action cannot be undone. It will permanently delete the item and remove it from your list");
  };

  useEffect(() => {
    if (interviewData.interviewCriteria) {
      setData(interviewData.interviewCriteria);
    }
  }, [interviewData.interviewCriteria]);

  return (
    <div>
      {interviewData.interviewMaster === 0 ? (
        <div className='flex flex-col justify-center items-center gap-3'>
          <div className='font-bold text-xl'>No criteria for interview</div>
          <Button onClick={openShowModalMaster}>
            <PlusCircle className='h-5 w-5 mr-1' /> Add criteria
          </Button>
        </div>
      ) : (
        <div>
          <ScrollArea className="w-full h-[calc(100vh-200px)]">
            <Button onClick={openShowModal} className='my-2'>
              <PlusCircle className='h-5 w-5 mr-1' /> Add criteria
            </Button>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Criteria</TableHead>
                  <TableHead className="text-center">Points</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No criteria found
                    </TableCell>
                  </TableRow>
                ) :
                  (<>
                    {data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.inter_criteria_name}</TableCell>
                        <TableCell className="text-center">{item.inter_criteria_points}</TableCell>
                        <TableCell>
                          <div className='flex justify-center'>
                            <button onClick={() => { openShowModalUpdate(item, index) }}>
                              <Edit2 className="h-4 w-4 mr-4" />
                            </button>
                            <button className="h-4 w-4" onClick={() => { handleRemoveList(index) }}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>)
                }
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      )}
      {showAddModal && (
        <AddInterviewCriteria
          open={showAddModal}
          onHide={closeShowModal}
          interviewId={interviewData.interviewMaster[0].interviewM_id}
          interviewCriteria={data}
          addCriteria={addCriteria}
        />
      )}
      {showAddInterviewMaster && (
        <AddInterviewMaster
          open={showAddInterviewMaster}
          onHide={closeShowModalMaster}
        />
      )}
      {showUpdateModal && (
        <UpdateInterviewCriteria
          open={showUpdateModal}
          onHide={closeUpdateModal}
          data={selectedData}
          criteriaList={data}
          isMaster={false}
        />
      )}
      <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} duration={2} />
    </div>
  );
}


export default InterviewPage