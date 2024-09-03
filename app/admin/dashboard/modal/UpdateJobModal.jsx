"use client"
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Edit } from 'lucide-react';
import React, { useEffect, useState } from 'react';

function UpdateJobModal({ jobData }) {
  const [dataString, setDataString] = useState("");

  const formSchema = z.object({
    title: z.string().min(1, { message: "This field is required" }),
    description: z.string().min(1, { message: "This field is required" }),
    passingPercentage: z.string().min(1, {
      message: "This field is required",
    }).refine((val) => {
      if (parseInt(val) < 0 || parseInt(val) > 100) {
        return false;
      }
      return true;
    }).refine((value) => !isNaN(Number(value)), {
      message: "This field must be a number",
    }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      passingPercentage: "",
    },
  });

  const onSubmit = (values) => {
    try {
      console.log("AddJobMaster.jsx => onSubmit(): ", values);
      storeData("jobMaster", values);
      nextStep(15);
      form.reset();
    } catch (error) {
      toast.error("Network error");
      console.log("AddJobMaster.jsx => onSubmit(): " + error);
    }
  };

  const handleClose = () => {
    // Handle the close event here
  };

  useEffect(() => {
    setDataString(JSON.stringify(jobData));
  }, [jobData]);

  return (
    <Drawer onClose={handleClose}>
      <DrawerTrigger asChild>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader>
          <DrawerTitle>Update Job</DrawerTitle>
          <DrawerDescription>Update the job details</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="w-full h-[calc(100vh-200px)] p-4">
          <Form {...form} className="w-full">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* <div className="flex flex-cols gap-2 justify-end mt-3">
                <Button type="submit">Next</Button>
              </div> */}
              <div className="flex justify-center items-center">
                <div className="space-y-3 sm:space-y-3 w-full max-w-8xl p-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter job title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea style={{ height: "200px" }} placeholder="Enter job description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passingPercentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passing percentage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter passing percentage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
          <div className="break-words">{dataString}</div>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close Drawer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default UpdateJobModal;
