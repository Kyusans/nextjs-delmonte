import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { Edit2, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import UpdateMasterfile from './modal/UpdateMasterfile';
import { Button } from '@/components/ui/button';

const CourseCategoryMaster = () => {
  const [courseCategory, setCourseCategory] = useState([]);
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
            getData={getCourseCategory}
          />
        </div>
      )
    }
  ]

  const getCourseCategory = async () => {
    try {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append("operation", "getCourseCategory");
      const res = await axios.post(url, formData);
      console.log("res.data ni course category: ", res.data);
      if (res.data !== 0) {
        setCourseCategory(res.data);
      } else {
        setCourseCategory([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("CourseCategoryMaster.jsx ~ getCourseCategory ~ error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCourseCategory();
  }, []);

  return (
    <div>
      {isLoading ? <Spinner /> : (
        <>
          <div className="flex justify-end mb-4">
            <Button><PlusCircle className="h-4 w-4 mr-1" />Add Course Category</Button>
          </div>
          <DataTable title="Course Category" data={courseCategory} columns={columns} autoIndex={true} />
        </>
      )}
    </div>
  )
}

export default CourseCategoryMaster