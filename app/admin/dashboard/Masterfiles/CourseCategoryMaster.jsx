import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import UpdateMasterfile from './modal/UpdateMasterfile';
import AddMasterfile from './modal/AddMasterfile';

const CourseCategoryMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
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

  const getData = async () => {
    try {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append("operation", "getCourseCategory");
      const res = await axios.post(url, formData);
      console.log("res.data ni course category: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("CourseCategoryMaster.jsx ~ getData ~ error:", error);
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
            title="Course Category"
            data={data}
            columns={columns}
            autoIndex={true}
            add={<AddMasterfile
              title="course category"
              subject="courseCategory"
              data={data}
              getData={getData}
            />}
          />
        </>
      )}
    </div>
  )
}

export default CourseCategoryMaster