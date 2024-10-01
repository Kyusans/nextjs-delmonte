import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronsUpDown } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import SelectedApplicant from '../../modal/SelectedApplicant';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { retrieveData, storeData } from '@/app/utils/storageUtils';
import axios from 'axios';
import { toast } from 'sonner';

const ViewApplicants = ({ datas, passingPercentage, getSelectedJob }) => {
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("0");
  const [statusName, setStatusName] = useState("");

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  const indexOfLastCandidate = currentPage * itemsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
  const currentCandidates = data.candidates?.slice(indexOfFirstCandidate, indexOfLastCandidate) || [];
  const totalPages = Math.ceil((data.candidates?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const [showSelectedApplicant, setShowSelectedApplicant] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(0);

  const handleShowSelectedApplicant = async (id, statusName) => {
    setSelectedApplicantId(id);
    if (statusName === "Pending") {
      handleChangeStatus(id, 2);
      setStatusName("Process");
      const updatedCandidates = data.candidates.map((candidate) =>
        candidate.cand_id === id && candidate.status_name === 'Pending'
          ? { ...candidate, status_name: 'Process' }
          : candidate
      );
      setData({ ...data, candidates: updatedCandidates });
    } else {
      setStatusName(statusName);
    }
    setShowSelectedApplicant(true);
  };

  const handleSort = (field) => {
    setSortField(field);
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(order);
    const sortedData = [...data.candidates].sort((a, b) => {
      let aField = field === 'FullName' ? a.FullName.toLowerCase() : a.points[field];
      let bField = field === 'FullName' ? b.FullName.toLowerCase() : b.points[field];
      if (aField < bField) return order === 'asc' ? -1 : 1;
      if (aField > bField) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setData({ ...data, candidates: sortedData });
  };

  const handleChangeStatus = async (id, status) => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const jsonData = {
        jobId: retrieveData("jobId"),
        candId: id,
        status: status
      }
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
  }

  const handleCloseSelectedApplicant = () => {
    getSelectedJob();
    setShowSelectedApplicant(false);
  };

  useEffect(() => {
    setData(datas);
    setStatus(datas.status);
    setSelectedStatus(retrieveData("selectedStatus") || "0");
  }, [datas]);

  useEffect(() => {
    let filteredCandidates;
    if (selectedStatus === "0") {
      filteredCandidates = datas.candidates;
    } else {
      filteredCandidates = datas.candidates?.filter(
        (item) => item.status_name === selectedStatus
      );
    }
    setCurrentPage(1);
    setData({ ...datas, candidates: filteredCandidates });
  }, [selectedStatus, datas]);

  return (
    <div>
      <ScrollArea className="h-[400px]">
        <Table className="w-full text-center">
          <TableCaption className="text-center">
            Passing percentage: {passingPercentage ? passingPercentage : 0}%
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Index</TableHead>
              <TableHead className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1" onClick={() => handleSort('FullName')}>
                  <span>Full Name</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1" onClick={() => handleSort('totalPoints')}>
                  <span>Points</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1" onClick={() => handleSort('percentage')}>
                  <span>Percentage</span>
                  <ChevronsUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1 bg-transparent border-0">Status <ChevronsUpDown className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Select status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={String(selectedStatus)}
                        onValueChange={(name) => {
                          setSelectedStatus(name)
                          storeData("selectedStatus", name)
                        }}
                      >
                        <DropdownMenuRadioItem value="0">All</DropdownMenuRadioItem>
                        {status.map((status, index) => (
                          <DropdownMenuRadioItem key={index} value={String(status.status_name)}>
                            {status.status_name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.candidates?.length > 0 ? (
              <>
                {currentCandidates?.map((candData, index) => (
                  <TableRow key={index} className="cursor-pointer" onClick={() => handleShowSelectedApplicant(candData.cand_id, candData.status_name)}>
                    <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                    <TableCell>{candData.FullName}</TableCell>
                    <TableCell>{candData.points.totalPoints}/{candData.points.maxPoints}</TableCell>
                    <TableCell className={candData.points.percentage >= data.jobPassing[0].passing_percentage ? "text-green-500" : "text-red-500"}>
                      {candData.points.percentage}%
                    </TableCell>
                    <TableCell>{candData.status_name}</TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <div className="text-center col-span-4">
                    No applicant found
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {data.candidates?.length > itemsPerPage && (
        <div className='flex justify-end items-end mt-4'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePreviousPage} href="#" className={"hover:text-primary"} />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    className={` ${currentPage === index + 1 ? "text-primary" : ""}`}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={handleNextPage} href="#" className={"hover:text-primary"} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
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