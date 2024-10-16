import React, { useCallback, useEffect, useState, useMemo } from 'react'
import UpdateMasterfile from './modal/UpdateMasterfile'
import { toast } from 'sonner';
import axios from 'axios';
import Spinner from '@/components/ui/spinner';
import DataTable from '@/app/my_components/DataTable';
import AddMasterfile from './modal/AddMasterfile';

const MasterFiles = ({ index }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const masterFiles = useMemo(() => [
    {
      title: "Course Category", operation: "getCourseCategory", add: <AddMasterfile title="course category" subject="courseCategory" />, columns: [
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
      title: "Course", operation: "getCourse", add: <AddMasterfile title="course" subject="course" />, columns: [
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
      title: "Institution", operation: "getInstitution", add: <AddMasterfile title="institution" subject="institution" />, columns: [
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
      title: "Knowledge and Compliance", operation: "getKnowledge", add: <AddMasterfile title="knowledge and compliance" subject="knowledge" />, columns: [
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
      title: "License Master", operation: "getLicenseMaster", add: <AddMasterfile title="license master" subject="licenseMaster" />, columns: [
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
      title: "License type", operation: "getLicenseType", add: <AddMasterfile title="license type" subject="licenseType" />, columns: [
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
      title: "Skills", operation: "getSkills", add: <AddMasterfile title="skills" subject="skills" />, columns: [
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
    {
      title: "Training", operation: "getTraining", add: <AddMasterfile title="training" subject="training" />, columns: [
        { header: "Training", accessor: "perT_name" },
        {
          header: "",
          cell: (row) => (
            <div className="flex gap-2">
              <UpdateMasterfile
                title="training"
                data={row}
                subject="training"
                id={row.perT_id}
              />
            </div>
          )
        }
      ]
    },
  ], []);



  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
        const formData = new FormData();
        formData.append("operation", masterFiles[index].operation);
        console.log("operation ni : ", masterFiles[index].operation);
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
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };
    setData([]);
    getData();
  }, [index]);

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
              add={masterFiles[selectedIndex].add}
            />
          </>
        )
      }
    </div>
  )
}

export default MasterFiles