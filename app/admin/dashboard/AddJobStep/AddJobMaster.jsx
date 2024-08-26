"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { retrieveData, storeData } from '@/app/utils/storageUtils';

function AddJobMaster() {
  const isInitialMount = useRef(true);

  const formSchema = z.object({
    title: z.string().min(1, { message: "This field is required" }),
    description: z.string().min(1, { message: "This field is required" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = (values) => {
    try {
      onHide(values);
      form.reset();
    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    }
  };

  useEffect(() => {
    if (retrieveData("jobTitle") !== null) {
      form.setValue("title", retrieveData("jobTitle"));
    }

    if (retrieveData("jobDescription") !== null) {
      form.setValue("description", retrieveData("jobDescription"));
    }
  }, [form])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return () => {
        storeData("jobTitle", form.getValues("title"));
        storeData("jobDescription", form.getValues("description"));
      };
    }
  }, [form]);

  return (
    <div className='flex flex-col'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-center items-center p-4 sm:p-6">
            <div className="space-y-2 sm:space-y-3 w-full max-w-8xl">
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
                      <Textarea placeholder="Enter job description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default AddJobMaster;
