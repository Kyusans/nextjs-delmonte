import React, { useEffect, useState } from 'react'
import ViewExam from './modal/ViewExam'
import axios from 'axios';
import { retrieveData } from '@/app/utils/storageUtils';
import { toast } from 'sonner';
import Spinner from '@/components/ui/spinner';
import DataTable from '@/app/my_components/DataTable';

const ExamPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const getExamCandidates = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = { jobId: retrieveData('jobId') };
      const formData = new FormData();
      formData.append("operation", "getExamCandidates");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data ni getInterviewCandidates: ", res);
      setCandidates(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network error");
      console.log("InterviewPage.jsx ~ getInterviewCandidates(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    { header: "Full Name", accessor: "fullName", columnSortable: true },
    { header: "Status", accessor: "status_name" },
  ]

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
              headerAction={<ViewExam />}
            />
          </div>
        )
      }
    </div>
  )
}

export default ExamPage