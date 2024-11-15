import React, { useEffect, useState } from 'react'
import ViewExam from './modal/ViewExam'
import axios from 'axios';
import { retrieveData } from '@/app/utils/storageUtils';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import DataTable from '@/app/my_components/DataTable';
import SelectedApplicant from '../modal/SelectedApplicant';

const ExamPage = ({ handleChangeStatus }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [selectedCandId, setSelectedCandId] = useState(null);

  const handleOpenInterviewModal = () => {
    setIsInterviewModalOpen(true);
  };

  const handleCloseInterviewModal = () => {
    getExamCandidates();
    setIsInterviewModalOpen(false);
  };

  const getExamCandidates = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = { jobId: retrieveData('jobId') };
      const formData = new FormData();
      formData.append("operation", "getExamCandidates");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data ni getExamCandidates: ", res);
      setCandidates(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network error");
      console.log("ExamPage.jsx ~ getExamCandidates(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Status", accessor: "status_name" },
  ]

  const handleOnClickRow = (id) => {
    setSelectedCandId(id);
    handleOpenInterviewModal();
  };

  useEffect(() => {
    getExamCandidates();
  }, [])
  return (
    <div>
      {isLoading ? <Spinner /> :
        (
          <div className="p-3">
            <DataTable
              columns={columns}
              data={candidates}
              autoIndex={true}
              onRowClick={handleOnClickRow}
              idAccessor="cand_id"
              headerAction={<ViewExam />}
            />
          </div>
        )
      }
      {isInterviewModalOpen &&
        <SelectedApplicant
          open={isInterviewModalOpen}
          onHide={handleCloseInterviewModal}
          statusName="Exam"
          candId={selectedCandId}
          handleChangeStatus={handleChangeStatus}
        />
      }
    </div>
  )
}

export default ExamPage