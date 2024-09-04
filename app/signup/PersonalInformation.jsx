"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ComboBox from "../my_components/combo-box";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, formatISO, set } from "date-fns";
import { cn } from "@/lib/utils";
import EnterPin from "./modals/EnterPin";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { retrieveData, storeData } from "../utils/storageUtils";
import { formatDate } from "./page";

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
  contact: z.string().min(1, {
    message: "This field is required",
  }).regex(/^\+?[0-9]\d{1,14}$/, {
    message: "Invalid contact number format",
  }),
  alternateContact: z.string().min(1, {
    message: "This field is required",
  }).regex(/^\+?[0-9]\d{1,14}$/, {
    message: "Invalid contact number format",
  }),
  presentAddress: z.string().min(1, {
    message: "This field is required",
  }),
  permanentAddress: z.string().min(1, {
    message: "This field is required",
  }),
  gender: z.string().min(1, {
    message: "This field is required",
  }),
  dob: z.string().min(1, { message: "This field is required" })
    .refine((date) => {
      const parsedEndDate = Date.parse(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedEndDate <= today.getTime();
    }, {
      message: "Date cannot be in the future",
    }),
  sss: z.string().min(1, {
    message: "This field is required",
  }),
  tin: z.string().min(1, {
    message: "This field is required",
  }),
  philhealth: z.string().min(1, {
    message: "This field is required",
  }),
  pagibig: z.string().min(1, {
    message: "This field is required",
  }),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters",
  }),
  confirmPassword: z.string().min(5, {
    message: "Password must be at least 5 characters",
  }),
});

const PersonalInformation = ({ nextPage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  // para sa pag input2 lang ni so walay dropdown or katong date
  const personalInformation = [
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Middle Name", value: "middleName" },
    { label: "Email", value: "email" },
    { label: "Alternate Email", value: "alternateEmail" },
    { label: "Contact", value: "contact" },
    { label: "Alternate Contact", value: "alternateContact" },
    { label: "Present Address", value: "presentAddress" },
    { label: "Permanent Address", value: "permanentAddress" },
    { label: "SSS", value: "sss" },
    { label: "TIN", value: "tin" },
    { label: "Philhealth", value: "philhealth" },
    { label: "Pag-ibig", value: "pagibig" },
    { label: "Password", value: "password" },
    { label: "Confirm Password", value: "confirmPassword" },
  ]

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
      presentAddress: "",
      permanentAddress: "",
      gender: "",
      dob: "",
      sss: "",
      tin: "",
      philhealth: "",
      pagibig: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    } else if (retrieveData("personalInfo")) {
      const data = JSON.parse(retrieveData("personalInfo"));
      if (data.email === values.email) {
        nextPage();
        return;
      }
    }
    try {
      setIsLoading(true);
      const url = retrieveData("url") + "users.php";
      const jsonData = { email: values.email };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "isEmailExist");
      const res = await axios.post(url, formData);
      console.log("EMAIL EXIST: ", res.data);
      if (res.data === -1) {
        toast.error("Email already exist");
        return;
      } else {
        storeData("personalInfo", JSON.stringify(values));
        nextPage();
      }
    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showDOB, setShowDOB] = useState(false);
  const handleDateChange = (date) => {
    if (date) {
      form.setValue("dob", formatISO(date, { representation: 'date' }));
      form.trigger("dob"); 
      setTimeout(() => {
        setShowDOB(false);
      }, 50);
    }
  };

  useEffect(() => {
    if (retrieveData("url") !== "http://localhost/delmonte/api/") {
      storeData("url", "http://localhost/delmonte/api/");
    }
    console.log("url", retrieveData("url"));
  }, [])

  useEffect(() => {
    if (retrieveData("personalInfo") !== null) {
      form.reset(JSON.parse(retrieveData("personalInfo")));
    }
    console.log("personalInfo", retrieveData("personalInfo"));
  }, [form])

  return (
    <>
      <div className="w-full max-w-4xl mt-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <ScrollArea className="h-[calc(100vh-25rem)]">
              <Card className="w-full h-full flex flex-col bg-[#0e5a35]  xs:border-[#0e4028]">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-center">{"Personal Information"}</CardTitle>
                </CardHeader>
                <CardContent className="h-full">
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <div className="flex justify-center items-center p-4 sm:p-6">
                      <div className="space-y-2 sm:space-y-6 w-full max-w-2xl">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-3">
                          {personalInformation.map((data) => (
                            <FormField
                              key={data.value}
                              control={form.control}
                              name={data.value}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{data.label}</FormLabel>
                                  <FormControl>
                                    <Input type={data.value.match(/password/i) ? "password" : "text"} className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder={data.label} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                          <FormField
                            name="gender"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <div>
                                  <ComboBox
                                    list={genders}
                                    subject="Gender"
                                    value={field.value}
                                    onChange={field.onChange}
                                  />
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dob"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <div>
                                  <Popover open={showDOB}>
                                    <PopoverTrigger asChild>
                                      <Button
                                        onClick={() => setShowDOB(!showDOB)}
                                        variant={"outline"}
                                        className={cn("justify-start w-full text-left font-normal bg-[#0e4028] hover:bg-[#0e5a35] border-2 border-[#0b864a]", !field.value && "text-muted-foreground")}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? formatDate(new Date(field.value), "yyyy-MM-dd") : <span>Pick a date</span>}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className=" w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        captionLayout="dropdown-buttons"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={handleDateChange}
                                        fromYear={1960}
                                        toYear={new Date().getFullYear()}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </ScrollArea>
            <div className="flex flex-row gap-4 w-full max-w-4xl mt-3 justify-end p-3">
              <Button
                className="px-4 py-2 rounded w-full sm:w-auto bg-[#0e5a35]"
                variant="secondary"
                disabled
              >
                Previous
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 text-white rounded dark:bg-[#f5f5f5] dark:text-[#0e4028] w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading && <Spinner />}
                Next
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default PersonalInformation;