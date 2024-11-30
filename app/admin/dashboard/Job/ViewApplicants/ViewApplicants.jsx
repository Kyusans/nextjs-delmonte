import React, { useEffect, useState } from 'react';
import { retrieveData } from '@/app/utils/storageUtils';
import { toast } from 'sonner';
import axios from 'axios';
import SelectedApplicant from '../modal/SelectedApplicant';
import SetToInterviewModal from './modal/SetToInterviewModal';
import UpdateJobPassingPercentage from './modal/UpdateJobPassingPercentage';
import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';

const ViewApplicants = ({ handleChangeStatus }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [showSelectedApplicant, setShowSelectedApplicant] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(0);
  const [statusName, setStatusName] = useState("");
  const [passingPercentage, setPassingPercentage] = useState(0);

  const handleShowSelectedApplicant = (id, statusName) => {
    if (statusName === "Pending") {
      handleChangeStatus(id, 2);
      setStatusName("Process");
    } else {
      setStatusName(statusName);
    }
    setSelectedApplicantId(id);
    setShowSelectedApplicant(true);
  };

  const handleCloseSelectedApplicant = () => {
    getPendingDetails();
    setShowSelectedApplicant(false);
  };

  const getPendingDetails = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      const jsonData = { jobId: retrieveData("jobId") };
      console.log("jsonData: ", jsonData);
      formData.append("operation", "getPendingDetails");
      formData.append("json", JSON.stringify(jsonData));
      const response = await axios.post(url, formData);
      const res = response.data;
      setData(res.candidates || []);
      setPassingPercentage(res.passingPercentage[0].passing_percentage || 0);
      console.log("ViewApplicants.jsx => getPendingDetails(): ", res);
    } catch (error) {
      toast.error("Network error");
      console.log("ViewApplicants.jsx => getPendingDetails(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const columns = [
    { header: 'Full Name', accessor: 'FullName' },
    {
      header: 'Total Points',
      accessor: (row) => `${row.totalPoints || 0}/${row.maxPoints || 0}`,
      className: (row) => `${row.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
    },
    {
      header: 'Percentage',
      accessor: "percentage",
      className: (row) => `${row.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
      sortable: true
    },
    { header: 'Status', accessor: 'status_name' }
  ];

  useEffect(() => {
    getPendingDetails();
  }, []);

  return (
    <div>
      <div className='p-3'>
        {isLoading ? <Spinner /> :
          <DataTable
            columns={columns}
            data={data}
            itemsPerPage={5}
            onRowClick={(row) => handleShowSelectedApplicant(row.cand_id, row.status_name)}
            headerAction={<SetToInterviewModal datas={data} passingPercentage={passingPercentage} getPendingCandidates={getPendingDetails} />}
            tableCaption={
              <div className="flex items-center justify-center ml-1 md:mx-3 ">
                <p>Passing percentage: {passingPercentage ? passingPercentage : 0}%</p>
                <UpdateJobPassingPercentage currentPassingPercentage={passingPercentage} getSelectedJob={getPendingDetails} />
              </div>
            }
          />
        }
      </div>

      {showSelectedApplicant && (
        <SelectedApplicant
          open={showSelectedApplicant}
          candId={selectedApplicantId}
          onHide={handleCloseSelectedApplicant}
          statusName={statusName}
          handleChangeStatus={handleChangeStatus}
        />
      )}
    </div>
  );
};


export default ViewApplicants;
