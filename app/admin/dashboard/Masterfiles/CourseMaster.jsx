import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddCourse from './modal/AddMasterfileForms/AddCourse';

const CourseMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, newId) => {
    setData([...data, {
      courses_id: newId,
      courses_name: values.courseName,
      course_categoryName: values.courseCategory,
      crs_type_name: values.courseType
    }]);
  }

  const columns = [
    { header: "Course", accessor: "courses_name" },
    { header: "Course Category", accessor: "course_categoryName" },
    { header: "Course Description", accessor: "crs_type_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UpdateMasterfile
            title="course"
            data={row}
            subject="course"
            id={row.courses_id}
          /> */}
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
            autoIndex={false}
            add={
              <AddCourse
                title="course"
                getData={getData}
                data={data}
                addColumn={addColumn}
              />}
          />
        </>
      )}
    </div>
  )
}

export default CourseMaster