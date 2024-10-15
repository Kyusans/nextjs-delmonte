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
    {
      title: "Course", operation: "getCourse", columns: [
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
    },
    {
      title: "Institution", operation: "getInstitution", columns: [
        { header: "Institution", accessor: "institution_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="institution"
                data={row}
                subject="institution"
                id={row.institution_id}
              />
            </div>
          )
        }
      ]
    },
    {
      title: "Knowledge and Compliance", operation: "getKnowledge", columns: [
        { header: "Knowledge and Compliance", accessor: "knowledge_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="knowledge and compliance"
                data={row}
                subject="knowledge"
                id={row.knowledge_id}
              />
            </div>
          )
        }
      ]
    },
    {
      title: "License Master", operation: "getLicenseMaster", columns: [
        { header: "License Master", accessor: "license_master_name" },
        { header: "License Type", accessor: "license_type_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="license master"
                data={row}
                subject="licenseMaster"
                id={row.license_master_id}
              />
            </div>
          )
        }
      ]
    },
    {
      title: "License type", operation: "getLicenseType", columns: [
        { header: "License type", accessor: "license_type_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="license type"
                data={row}
                subject="licenseType"
                id={row.license_type_id}
              />
            </div>
          )
        }
      ]
    },
    {
      title: "Skills", operation: "getSkills", columns: [
        { header: "Skills", accessor: "perS_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="skills"
                data={row}
                subject="skills"
                id={row.perS_id}
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
    const newIndex = index;
    setSelectedIndex(newIndex);
    setData([]);
    getData();
    console.log("selectedIndex ni : ", selectedIndex);
  }, [getData, index, selectedIndex]);

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
              key={selectedIndex}
            />
          </>
        )
      }
    </div>
  )
}

export default MasterFiles