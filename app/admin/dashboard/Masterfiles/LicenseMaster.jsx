import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddLicense from './modal/AddMasterfileForms/AddLicense';

const LicenseMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (column, id) => {
    setData([...data, { ...column, license_master_id: id }]);
  }

  const columns = [
    { header: "License Master", accessor: "license_master_name" },
    { header: "License Type", accessor: "license_type_name" },
    {
      header: "",
      cell: (row) => (
        <div className="flex gap-2">
          {/* <UpdateMasterfile
            title="license master"
            data={row}
            subject="licenseMaster"
            id={row.license_master_id}
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
      formData.append("operation", "getLicenseMaster");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("LicenseMaster.jsx ~ getData ~ error:", error);
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
            title="License Masters"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
              <AddLicense
                title={"License Master"}
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

export default LicenseMaster
