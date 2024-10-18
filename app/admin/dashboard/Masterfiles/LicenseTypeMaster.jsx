import DataTable from '@/app/my_components/DataTable';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';
import AddLicenseType from './modal/AddMasterfileForms/AddLicenseType';
import UpdateMasterfile from './modal/UpdateMasterfile';
import { Trash2 } from 'lucide-react';
const LicenseTypeMaster = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addColumn = (values, id) => {
    setData([...data, { ...values, license_type_id: id }]);
  }

  const columns = [
    { header: "License type", accessor: "license_type_name" },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex gap-4">
          <UpdateMasterfile
            title="license type"
            data={row}
            subject="licenseType"
            id={row.license_type_id}
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
      formData.append("operation", "getLicenseType");
      const res = await axios.post(url, formData);
      console.log("res.data ni getData: ", res.data);
      if (res.data !== 0) {
        setData(res.data);
      } else {
        setData([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("LicenseTypeMaster.jsx ~ getData ~ error:", error);
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
            title="License Type"
            data={data}
            columns={columns}
            autoIndex={true}
            add={
              <AddLicenseType
                title="license type"
                subject="licenseType"
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

export default LicenseTypeMaster
