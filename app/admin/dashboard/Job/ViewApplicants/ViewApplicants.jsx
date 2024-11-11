import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { retrieveData, storeData } from '@/app/utils/storageUtils';
import { toast } from 'sonner';
import axios from 'axios';
import SelectedApplicant from '../modal/SelectedApplicant';
import SetToInterviewModal from './modal/SetToInterviewModal';
import UpdateJobPassingPercentage from './modal/UpdateJobPassingPercentage';
import { Filter } from 'lucide-react';
import DataTable from '@/app/my_components/DataTable';

const ViewApplicants = ({ datas, passingPercentage, getSelectedJob }) => {
  const [data, setData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [showSelectedApplicant, setShowSelectedApplicant] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(0);
  const [statusName, setStatusName] = useState("");

  const handleShowSelectedApplicant = (id, statusName) => {
    setSelectedApplicantId(id);
    setStatusName(statusName);
    setShowSelectedApplicant(true);
  };

  const handleCloseSelectedApplicant = () => {
    getSelectedJob();
    setShowSelectedApplicant(false);
  };

  const handleChangeStatus = async (id, status) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = {
        jobId: retrieveData("jobId"),
        candId: id,
        status: status
      };
      console.log("jsonData: ", jsonData);
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "changeApplicantStatus");
      const res = await axios.post(url, formData);
      console.log("ViewApplicants.jsx => handleChangeStatus(): ", res.data);
      if (res.data !== 1) {
        toast.error("There's something wrong");
      }
    } catch (error) {
      toast.error("Network error");
      console.log("ViewApplicants.jsx => handleChangeStatus(): " + error);
    }
  };

  const columns = [
    { header: 'Full Name', accessor: 'FullName'},
    { header: 'Email', accessor: 'cand_email' },
    {
      header: 'Total Points',
      accessor: (row) => `${row.points?.totalPoints || 0}/${row.points?.maxPoints || 0}`,
      className: (row) => `${row.points?.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
    },
    {
      header: 'Percentage',
      accessor: (row) => row.points?.percentage ? `${row.points.percentage}%` : 'N/A',
      className: (row) => `${row.points?.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
    },
    { header: 'Status', accessor: 'status_name' }
  ];

  useEffect(() => {
    console.log("datas: ", datas.candidates);
    setData(datas);
  }, [datas]);

  return (
    <div>
      <div className='p-3'>
        <DataTable
          columns={columns}
          data={datas.candidates}
          onRowClick={(row) => handleShowSelectedApplicant(row.cand_id, row.status_name)}
          headerAction={<SetToInterviewModal datas={datas["candidates"]} passingPercentage={passingPercentage} getSelectedJob={getSelectedJob} />}
        />
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
