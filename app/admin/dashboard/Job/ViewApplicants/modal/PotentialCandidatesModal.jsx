import DataTable from '@/app/my_components/DataTable'
import { retrieveData } from '@/app/utils/storageUtils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Spinner from '@/components/ui/spinner'
import axios from 'axios'
import { set } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import SetToInterviewModal from './SetToInterviewModal'

const PotentialCandidatesModal = ({ passingPercentage }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [potentialCandidates, setPotentialCandidates] = useState([])

  const getPotentialCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const jobId = retrieveData("jobId");
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const jsonData = { jobId: jobId, passingPercentage: passingPercentage }
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "getPotentialCandidates");
      const res = await axios.post(url, formData);
      console.log("res poteningal", res);
      console.log("JobTitle", retrieveData("jobTitle"));
      setPotentialCandidates(res.data === 0 ? [] : res.data);
    } catch (error) {
      console.error("PotentialCanidatasModal.jsx ~ getPotentialCandidates() : ", error);
      toast.error("Network Error");
    } finally {
      setIsLoading(false);
    }
  }, [passingPercentage]);

  const sendEmailToAll = async () => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      console.log("potentialCandidates", potentialCandidates);
      const master = { jobTitle: retrieveData("jobTitle") };
      const candidates = potentialCandidates.map((candidate) => ({
        fullName: candidate.fullName,
        candEmail: candidate.email,
      }));
      const jsonData = { candidates: candidates, master: master };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "sendPotentialCandidateEmail");
      const res = await axios.post(url, formData);
      if(res.data === 1) {
        toast.success("Email sent successfully");
      }
      console.log("res ni sendEmailToAll", res);
    } catch (error) {
      toast.error("Network Error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      getPotentialCandidates()
    }
  }, [getPotentialCandidates, isOpen])

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    {
      header: 'Total Points',
      accessor: (row) => `${row.totalPoints || 0}/${row.maxPoints || 0}`,
      className: (row) => `${row.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
      hiddenOnMobile: true,
    },
    {
      header: 'Percentage',
      accessor: "percentage",
      className: (row) => `${row.percentage >= passingPercentage ? 'text-green-500' : 'text-red-500'}`,
      sortable: true
    },
  ];

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Get potential candidates</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Potential candidates for this job</DialogTitle>
          <DialogDescription />
          {isLoading ? <Spinner /> :
            <>
              <DataTable
                columns={columns}
                data={potentialCandidates}
                headerAction={
                  <>
                    <Button onClick={sendEmailToAll}>Send email to all</Button>
                  </>
                }
              />
            </>
          }
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PotentialCandidatesModal