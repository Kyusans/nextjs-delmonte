import DataTable from '@/app/my_components/DataTable';
import DatePicker from '@/app/my_components/DatePicker';
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { date, z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { retrieveData } from '@/app/utils/storageUtils';
import axios from 'axios';
import Spinner from '@/components/ui/spinner';


const SetToInterviewModal = ({ datas, passingPercentage, getSelectedJob }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);

  const formSchema = z.object({
    date: z.string().min(1, { message: "This field is required" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      const candidates = data.map((candidate) => ({
        fullName: candidate.FullName,
        candId: candidate.cand_id,
        candEmail: candidate.cand_email,
      }));

      const jsonData = {
        candidates: candidates,
        jobId: retrieveData("jobId"),
        date: values.date,
      }

      const formData = new FormData();
      formData.append("operation", "batchSetInterview");
      formData.append("json", JSON.stringify(jsonData));
      console.log("jsonData: ", jsonData);

      const res = await axios.post(url, formData);
      console.log("res: ", res);

      if (res.data === 1) {
        getSelectedJob();
        toast.success("Candidates set to interview successfully");
        form.reset();
        setIsOpen(false);
      } else {
        toast.error("Failed to set candidates to interview");
      }
    } catch (error) {
      toast.error("Network error");
      console.log("SetToInterviewModal.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    setTabIndex(tabIndex + 1);
  };

  const handlePrevPage = () => {
    setTabIndex(tabIndex - 1);
  }

  useEffect(() => {
    if (isOpen) {
      console.log("datas: ", datas);
      const filteredData = datas.filter(data =>
        data.status_name === "Pending" || data.status_name === "Process" &&
        data.points.percentage >= passingPercentage
      );
      console.log("datas: ", filteredData);
      setData(filteredData);
      if (filteredData.length === 0) {
        setIsOpen(false);
        toast.error("No candidates to set to interview");
      }
    }
  }, [datas, isOpen, passingPercentage])

  const columns = [
    { header: 'Full Name', accessor: 'FullName'},
    { header: 'Status', accessor: 'status_name' },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button className="mr-1">Set all to interview</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set all new passed candidates to interview</DialogTitle>
        </DialogHeader>
        <Separator className="mt-2" />
        {isLoading ? <Spinner /> :
          (
            <>
              {tabIndex === 0 && (
                <>
                  <div className='px-3'>
                    <DataTable columns={columns} data={data} itemsPerPage={5} hideSearch={true} />
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
                    <Button onClick={handleNextPage}>
                      Next
                    </Button>
                  </div>
                </>
              )}

              {tabIndex === 1 && (
                <>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <DatePicker
                              form={form}
                              name={field.name}
                              label="Pick a date for interview"
                              futureAllowed={true}
                              pastAllowed={false}
                              withTime={true}
                            />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <Button variant="outline" onClick={handlePrevPage}>Previous</Button>
                        <Button type="submit">
                          Set all to interview
                        </Button>
                      </div>
                    </form>
                  </Form>
                </>
              )}
            </>
          )
        }

      </DialogContent>
    </Dialog>
  )
}

export default SetToInterviewModal