import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddKnowledge from './modal/AddMasterfileForms/AddKnowledge';

const KnowledgeMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, newId) => {
    setData([...data, {
      knowledge_id: newId,
      knowledge_name: values.knowledgeName
    }]);
  }

  const columns = [
    { header: "Knowledge and Compliance", accessor: "knowledge_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UpdateMasterfile
            title="knowledge and compliance"
            data={row}
            subject="knowledge"
            id={row.knowledge_id}
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
      formData.append("operation", "getKnowledge");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("KnowledgeMaster.jsx ~ getData ~ error:", error);
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
            title="Knowledge and Compliance"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
              <AddKnowledge
                title="knowledge and compliance"
                subject="knowledge"
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

export default KnowledgeMaster
