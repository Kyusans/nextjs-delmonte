"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "This field is required",
  }),
  lastName: z.string().min(1, {
    message: "This field is required",
  }),
  middleName: z.string().min(1, {
    message: "This field is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  alternateEmail: z.string().email({
    message: "Invalid email address",
  }),
  contact: z.string().min(11, {
    message: "This field is required",
  }).regex(/^\+?[0-9]\d{1,14}$/, {
    message: "Invalid contact number format",
  }),
  alternateContact: z.string().min(11, {
    message: "This field is required",
  }).regex(/^\+?[0-9]\d{1,14}$/, {
    message: "Invalid contact number format",
  }),
});

const PersonalInformation = ({ nextPage }) => {
  const [isLoading, setIsloading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      alternateEmail: "",
      contact: "",
      alternateContact: "",
    },
  });

  const onSubmit = async (values) => {
    setIsloading(true);
    try {
      console.log(values);
    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    } finally {
      setIsloading(false);
    }
  };
  return (
    <div className="flex justify-center items-center p-4 sm:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 sm:space-y-6 w-full max-w-lg">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Middle Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Email</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Alternate Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Contact Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Contact</FormLabel>
                  <FormControl>
                    <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Alternate Contact" {...field} />
                  </FormControl>
                    <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mt-3 justify-end">
            <Button
              className="px-4 py-2 rounded w-full sm:w-auto"
              variant="secondary"
              disabled
            >
              Previous
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 text-white rounded dark:bg-[#f5f5f5] dark:text-[#0e4028] w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInformation;



