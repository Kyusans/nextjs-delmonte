"use client"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';
import axios from 'axios';

function AddInterviewCriteria({ open, onHide, interviewId, interviewCriteria }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const formSchema = z.object({
    name: z.string().min(1, {
      message: "This field is required",
    }),
    points: z.string().min(1, {
      message: "This field is required",
    }).refine((value) => !isNaN(Number(value)), {
      message: "Points must be a number",
    }),
    interviewId: z.number().min(1, {
      message: "This field is required",
    }),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      points: "",
      interviewId: interviewId
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + "admin.php";
      if (interviewCriteria.some((element) => element.inter_criteria_name === values.name)) {
        toast.error("Criteria already exist");
        return;
      }
      const formData = new FormData();
      formData.append("operation", "addInterviewCriteria");
      formData.append("json", JSON.stringify(values));
      const res = await axios.post(url, formData);
      console.log("res.data ni onSubmit:", res.data);
      if (res.data === 1) {
        toast.success("Criteria added successfully");
        onHide(values);
        form.reset();
      }
      console.log("values:", values);
    } catch (error) {
      toast.error("Network error");
      console.log("AddInterviewCriteria.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnHide = () => {
    onHide(0);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOnHide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Interview Category</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center items-center">
                <div className="space-y-2 sm:space-y-3 w-full max-w-8xl">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interview Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter interview category"  {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter points" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-cols gap-2 justify-end mt-5">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>{isLoading && <Spinner />} Submit</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddInterviewCriteria