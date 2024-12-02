import DataTable from '@/app/my_components/DataTable';
import { retrieveData } from '@/app/utils/storageUtils';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import SelectedApplicant from '../modal/SelectedApplicant';
import UpdateJobOffer from './modals/UpdateJobOffer';
import { Trash2 } from 'lucide-react';
import { formatDate } from '@/app/signup/page';

const JobOfferPage = ({ handleChangeStatus }) => {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandId, setSelectedCandId] = useState(null);

  const getJobOfferCandidates = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = { jobId: retrieveData('jobId') };
      const formData = new FormData();
      formData.append("operation", "getJobOfferCandidates");
      formData.append("json", JSON.stringify(jsonData));
      const res = await axios.post(url, formData);
      console.log("res.data ni getJobOfferCandidates : ", res);
      setCandidates(res.data !== 0 ? res.data : []);
    } catch (error) {
      toast.error("Network error");
      console.log("JobOfferPage.jsx ~ getJobOfferCandidates(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
    getJobOfferCandidates();
  }

  const handleOnClickRow = (id, isActionClick) => {
    if (!isActionClick) {
      setSelectedCandId(id);
      handleOpenModal();
    }
  };

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Document", accessor: "joboffer_document" },
    { header: "Salary", accessor: "joboffer_salary" },
    { header: "Date offered", accessor: "joboffer_date" },
    { header: "Date Expired", accessor: (row) => formatDate(row.joboffer_expiryDate) },
    { header: "Job Offer Status", accessor: "jobOfferStatus", className: "text-center" },
    {
      header: 'Actions',
      cell: (row) => (
        <div onClick={(e) => e.stopPropagation()} className='flex items-center gap-3'>
          <UpdateJobOffer
            candidate={row}
            getJobOfferCandidates={getJobOfferCandidates}
          />
          <Trash2  className='cursor-pointer w-5 h-5' />
        </div>
      )
    },
  ];

  useEffect(() => {
    getJobOfferCandidates();
  }, [])

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) :
        (
          <DataTable
            itemsPerPage={5}
            columns={columns}
            data={candidates}
            onRowClick={(id) => handleOnClickRow(id, false)}
            idAccessor="cand_id"
          />
        )
      }

      {isModalOpen &&
        <SelectedApplicant
          open={isModalOpen}
          onHide={handleCloseModal}
          statusName="Job Offer"
          candId={selectedCandId}
          handleChangeStatus={handleChangeStatus}
        />
      }
    </div>
  )
}
export default JobOfferPage
