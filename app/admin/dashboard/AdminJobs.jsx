import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import secureLocalStorage from 'react-secure-storage';
import { toast } from 'sonner';
import { Circle } from 'lucide-react'; // Import the Circle icon from lucide-react

function AdminJobs() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);

  const getAllJobs = async () => {
    setIsLoading(true);
    try {
      const url = secureLocalStorage.getItem("url") + "admin.php";
      const formData = new FormData();
      formData.append("operation", "getAllJobs");
      const res = await axios.post(url, formData);
      console.log("RES DATA ni getAllJobs: ", res.data);
      if (res.data !== 0) {
        setJobs(res.data);
      } else {
        setJobs([]);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("AdminJobs.jsx => getAllJobs(): " + error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getAllJobs();
  }, [])

  return (
    <>
      <Card className='w-full'>
        <CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-3 mt-3">
          {jobs.map((job, index) => (
            <Card key={index} className='flex flex-col'>
              <CardTitle className="bg-[#0e5a35] w-full p-10 rounded-t-lg text-white">
                {job.jobM_title}
              </CardTitle>
              <CardContent>
                <div className="flex items-center gap-2 mb-2 mt-4">
                  <Circle
                    className={`h-4 w-4 ${job.Total_Applied === 0 ? 'text-gray-400' : 'text-green-500'}`}
                  />
                  <span className={`text-sm font-bold ${job.Total_Applied === 0 ? 'text-gray-400' : 'text-green-500'}`}>
                    {job.jobM_status === 1 ? `${job.Total_Applied} Applicants` : 'No Applicants'}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button className="bg-[#188c54] text-white">View</Button>
                <div className="flex items-center gap-2 mb-2">
                  <Circle
                    className={`h-4 w-4 ${job.jobM_status === 1 ? 'text-green-500' : 'text-gray-400'}`}
                  />
                  <span className={`text-sm ${job.jobM_status === 1 ? 'text-green-500' : 'text-gray-400'}`}>
                    {job.jobM_status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
      </Card>
    </>
  )
}

export default AdminJobs;
