import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddSkill from './modal/AddMasterfileForms/AddSkill';

const SkillsMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, id) => {
    console.log("values", values);
    setData([...data, { ...values, skill_id: id }]);
  }

  const columns = [
    { header: "Skills", accessor: "perS_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UpdateMasterfile
            title="skills"
            data={row}
            subject="skills"
            id={row.perS_id}
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
      formData.append("operation", "getSkills");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("SkillsMaster.jsx ~ getData ~ error:", error);
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
            title="Skills"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
            <AddSkill 
              title="skills" 
              subject="skills" 
              getData={getData} 
              data={data} 
              addColumn={addColumn} 
            />
            }
          />
        </>
      )}
      
    </div>
  )
}

export default SkillsMaster
