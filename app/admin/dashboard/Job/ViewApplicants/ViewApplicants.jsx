import { Card, CardDescription } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import SelectedApplicant from '../../modal/SelectedApplicant'

const ViewApplicants = ({ datas, passingPercentage }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const indexOfLastCandidate = currentPage * itemsPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - itemsPerPage;
  const currentCandidates = data.candidates?.slice(indexOfFirstCandidate, indexOfLastCandidate);
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

  const handleShowSelectedApplicant = (id) => {
    setSelectedApplicantId(id);
    setShowSelectedApplicant(true);
  };

  const handleSort = (field) => {
  
  };

  useEffect(() => {
    setData(datas);
    console.log("data ko to", datas);
  }, [datas]);

  const handleCloseSelectedApplicant = () => setShowSelectedApplicant(false);
  return (
    <div>
      <ScrollArea className="h-[400px]">
        {data.candidates?.length > 0 ? (
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
                  <div className="flex items-center justify-center gap-1" onClick={() => handleSort('status_name')}>
                    <span>Status</span>
                    <ChevronsUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentCandidates?.map((candData, index) => (
                <TableRow key={index} className="cursor-pointer" onClick={() => handleShowSelectedApplicant(candData.cand_id)}>
                  <TableCell>{index + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                  <TableCell>{candData.FullName}</TableCell>
                  <TableCell>{candData.points.totalPoints}/{candData.points.maxPoints}</TableCell>
                  <TableCell className={candData.points.percentage >= data.jobPassing[0].passing_percentage ? "text-green-500" : "text-red-500"}>
                    {candData.points.percentage}%
                  </TableCell>
                  <TableCell>{candData.status_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Card className="text-center bg-background">
            <CardDescription className="p-5">
              No applicants applied yet
            </CardDescription>
          </Card>
        )}

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
        <SelectedApplicant open={showSelectedApplicant} onHide={handleCloseSelectedApplicant} candId={selectedApplicantId} />
      )}
    </div>
  )
}

export default ViewApplicants