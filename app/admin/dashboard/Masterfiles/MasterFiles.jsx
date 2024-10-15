import React, { useCallback, useEffect, useState, useMemo } from 'react'
import UpdateMasterfile from './modal/UpdateMasterfile'
import { toast } from 'sonner';
import axios from 'axios';
import Spinner from '@/components/ui/spinner';
import DataTable from '@/app/my_components/DataTable';

const MasterFiles = ({ index }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const masterFiles = useMemo(() => [
    {
      title: "Course Category", operation: "getCourseCategory", columns: [
        { header: "Course Category", accessor: "course_categoryName" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="course category"
                data={row}
                subject="courseCategory"
                id={row.course_categoryId}
              />
            </div>
          )
        }
      ]
    },

  ], []);

  const getData = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append("operation", masterFiles[selectedIndex].operation);
      console.log("operation ni : ", masterFiles[selectedIndex].operation);
      const res = await axios.post(url, formData);
      console.log("res.data ni : ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("MasterFileView.jsx ~ getData ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIndex, masterFiles]);

  useEffect(() => {
    getData();
  }, [getData]);


  useEffect(() => {
    setSelectedIndex(index - 2);
  }, [index])

  return (
    <div>
      {isLoading ? <Spinner /> :
        (
          <>
            <DataTable
              title={masterFiles[selectedIndex].title}
              data={data}
              columns={masterFiles[selectedIndex].columns}
              autoIndex={true}
            />
          </>
        )
      }
    </div>
  )
}

export default MasterFiles