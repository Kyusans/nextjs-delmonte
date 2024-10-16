import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { Edit2, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import UpdateMasterfile from './modal/UpdateMasterfile';
import { Button } from '@/components/ui/button';
import AddMasterfile from './modal/AddMasterfile';
const CourseMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    { header: "Course", accessor: "courses_name" },
    { header: "Course Category", accessor: "course_categoryName" },
    { header: "Course Description", accessor: "crs_type_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          <UpdateMasterfile
            title="course"
            data={row}
            subject="course"
            id={row.courses_id}
          />
        </div>
      )
    }
  ]

  const getData = async () => {
    try {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append("operation", "getCourse");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("CourseMaster.jsx ~ getData ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isLoading ? <Spinner /> : (
        <>
          <DataTable
            title="Course"
            data={data}
            columns={columns}
            autoIndex={true}
            add={<AddMasterfile title="course" subject="course" />}
          />
        </>
      )}
    </div>
  )
}

export default CourseMaster