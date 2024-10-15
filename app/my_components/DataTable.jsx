import React, { useState, useMemo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const DataTable = ({ columns, data, itemsPerPage = 10, autoIndex = false, title }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      columns.some(column =>
        column.accessor &&
        String(item[column.accessor]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, columns, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    let items = [];
    let maxVisiblePages;

    if (windowWidth < 640) {
      maxVisiblePages = 1;
    } else if (windowWidth < 768) {
      maxVisiblePages = 2;
    } else {
      maxVisiblePages = 3;
    }

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > maxVisiblePages) {
        items.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      const start = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(start + maxVisiblePages - 1, totalPages - 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (end < totalPages - 1) {
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-xs"
        />
      </div>
      {filteredData.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {autoIndex && <TableHead>#</TableHead>}
                {columns.map((column, index) => (
                  <TableHead key={index}>{column.header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {autoIndex && (
                    <TableCell>
                      {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                    </TableCell>
                  )}
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.accessor ? row[column.accessor] : column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='overflow-x-auto'>
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className='cursor-pointer'
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    className='cursor-pointer'
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="text-center py-4">No data found</div>
      )}
    </div>
  );
};

export default DataTable;
