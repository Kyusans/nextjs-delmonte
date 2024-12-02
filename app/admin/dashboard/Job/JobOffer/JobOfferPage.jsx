"use client"
import DataTable from '@/app/my_components/DataTable';
import { retrieveData } from '@/app/utils/storageUtils';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ShowOffer from './modals/ShowOffer';

const JobOfferPage = ({ handleChangeStatus }) => {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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
    setSelectedCandidate(null);
    // getJobOfferCandidates();
  }

  const handleOnClickRow = (id) => {
    const candidate = candidates.find(c => c.cand_id === id);
    setSelectedCandidate(candidate);
    handleOpenModal();
  };

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Document", accessor: "joboffer_document" },
    { header: "Salary", accessor: "joboffer_salary" },
    { header: "Date offered", accessor: "joboffer_date" },
    { header: "Date Expired", accessor: "joboffer_expiryDate" },
    { header: "Job Offer Status", accessor: "jobOfferStatus" },
  ];

  useEffect(() => {
    getJobOfferCandidates();
  }, [])

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <DataTable
          itemsPerPage={5}
          columns={columns}
          data={candidates}
          onRowClick={handleOnClickRow}
          idAccessor="cand_id"
        />
      )}

      <ShowOffer
        open={isModalOpen}
        onHide={handleCloseModal}
        candidate={selectedCandidate}
      />
    </div>
  )
}

export default JobOfferPage