import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddInstitution from './modal/AddMasterfileForms/AddInstitution';

const InstitutionMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, newId) => {
    setData([...data, {
      institution_id: newId,
      institution_name: values.institutionName
    }]);
  }

  const columns = [
    { header: "Institution", accessor: "institution_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UpdateMasterfile
            title="institution"
            data={row}
            subject="institution"
            id={row.institution_id}
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
      formData.append("operation", "getInstitution");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("InstitutionMaster.jsx ~ getData ~ error:", error);
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
            title="Institution"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
              <AddInstitution
                title="institution"
                subject="institution"
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

export default InstitutionMaster
