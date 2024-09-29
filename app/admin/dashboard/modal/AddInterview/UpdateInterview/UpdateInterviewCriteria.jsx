"use client"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useRef } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

function UpdateInterviewCriteria({ open, onHide, data, criteriaList, isMaster }) {
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
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      points: data.points.toString(),
    },
  });
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      if (isMaster) {
        const filteredList = criteriaList.filter((element) => {
          return element.name !== values.name;
        })
        if (filteredList.some((element) => element.name === data.name)) {
          toast.error("Criteria already exist");
          return;
        }
        toast.success("Criteria updated successfully");
        onHide(values);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("AddInterviewMasterCriteria.jsx => onSubmit(): " + error);
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
            <DialogTitle>Add Interview Criteria</DialogTitle>
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
                        <FormLabel>Interview Criteria</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter interview criteria"
                            {...field}
                          />
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
                  <Button type="button" variant="outline">Close</Button>
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

export default UpdateInterviewCriteria
