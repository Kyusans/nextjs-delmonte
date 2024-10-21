"use client"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import ComboBox from '@/app/my_components/combo-box';
import { retrieveData } from '@/app/utils/storageUtils';
import AddKnowledgeMaster from '@/app/admin/dashboard/Masterfiles/modal/AddMasterfileForms/AddKnowledge';

function AddKnowledge({ open, onHide, knowledgeList, handleAddList, handleAddData }) {
  const [openState, setOpenState] = useState(false);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const formSchema = z.object({
    knowledgeId: z.number().min(1, {
      message: "This field is required",
    }),
    // jobKnowledge: z.string().min(1, {
    //   message: "This field is required",
    // }),
    points: z.string().min(1, {
      message: "This field is required",
    }).refine((value) => !isNaN(Number(value)), {
      message: "Points must be a number",
    })
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      knowledgeId: 0,
      // jobKnowledge: "",
      points: "",
    },
  });

  const handleOthers = () => {
    setOpenState(true);
  }

  const handleCloseState = () => {
    setOpenState(false);
  }

  const addColumn = (values, id) => {
    setKnowledgeData([...knowledgeData, { value: id, label: values.knowledgeName }]);
    handleAddData(values, id);
  }

  const onSubmit = (values) => {
    try {
      const selectedKnowledge = JSON.parse(retrieveData("jobKnowledge")) || [];
      console.log("selectedKnowledge:", selectedKnowledge);
      let isValid = true;
      selectedKnowledge.forEach((element) => {
        console.log("element.knowledgeId:", element.knowledgeId);
        if (element.knowledgeId === values.knowledgeId) {
          toast.error("You already have this knowledge and compliance");
          isValid = false;
        }
      });
      if (isValid) {
        console.log("AddKnowledge.jsx => onSubmit():", values);
        // onHide(values);
        handleAddList(values);
        form.reset();
      }
    } catch (error) {
      toast.error("Network error");
      console.log("AddKnowledge.jsx => onSubmit(): " + error);
    }
  };

  const handleOnHide = () => {
    onHide(0);
  }

  useEffect(() => {
    setKnowledgeData(knowledgeList);
  }, [knowledgeList]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOnHide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Add Knowledge and Compliance</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex justify-center items-center">
                <div className="space-y-2 sm:space-y-3 w-full max-w-8xl">
                  <FormField
                    name="knowledgeId"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Knowledge and compliance </FormLabel>
                        <div>
                          <ComboBox
                            list={knowledgeData}
                            subject="knowledge and compliance"
                            value={field.value}
                            onChange={field.onChange}
                            styles={"bg-background"}
                            others={handleOthers}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                    control={form.control}
                    name="jobKnowledge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Knowledge Description</FormLabel>
                        <FormControl>
                          <Textarea style={{ height: "200px" }} placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
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
                  <Button variant="outline">Close</Button>
                </DialogClose>
                <Button type="submit">Add Job Knowledge</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <AddKnowledgeMaster
        data={knowledgeData}
        addColumn={addColumn}
        openState={openState}
        closeState={handleCloseState}
      />
    </>
  )
}

export default AddKnowledge