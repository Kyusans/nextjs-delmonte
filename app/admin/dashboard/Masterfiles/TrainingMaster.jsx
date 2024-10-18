import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddTraining from './modal/AddMasterfileForms/AddTraining';
import UpdateMasterfile from './modal/UpdateMasterfile';
import { Trash2 } from 'lucide-react';
import UpdateTraining from './modal/UpdateMasterfileForms/UpdateTraining';
const TrainingMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, id) => {
    console.log("values", values);
    setData([...data, { ...values, perT_id: id }]);
  }

  const columns = [
    { header: "Training", accessor: "perT_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-4">
          <UpdateTraining
            data={data}
            id={row.perT_id}
            currentName={row.perT_name}
            getData={getData}
          />
          <Trash2 className="h-5 w-5 cursor-pointer" />
        </div>
      )
    }
  ]

  const getData = async () => {
    try {
      setIsLoading(true);
      const url = process.env.NEXT_PUBLIC_API_URL + 'admin.php';
      const formData = new FormData();
      formData.append("operation", "getTraining");
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
            title="Training"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
              <AddTraining
                title="training"
                subject="training"
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

export default TrainingMaster
