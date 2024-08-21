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
import secureLocalStorage from "react-secure-storage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";

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
      const parsedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return parsedDate <= today;
    }, {
      message: "Invalid Date",
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
  const [progress, setProgress] = useState(13);
  // const [pincode, setPincode] = useState("");
  // const [showPin, setShowPin] = useState(false);
  const [email, setEmail] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  // const handleShowPin = () => { setShowPin(true); }
  // const handleHidePin = (status) => { 
  //   switch(status) {
  //     case 1:
  //       setIsValidated(true);
  //       nextPage();
  //       break;
  //     case 2:
  //       setPincode("");
  //       setExpirationDate("");
  //       setIsValidated(false);
  //       onSubmit(form.getValues());
  //       break;
  //     default:
  //       break;
  //   }
  //   setShowPin(false);
  //  }

  const genders = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

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
    } else if (localStorage.getItem("personalInfo")) {
      const data = JSON.parse(localStorage.getItem("personalInfo"));
      if (data.email === values.email) {
        nextPage();
        return;
      } 
    }
    try {
      setIsLoading(true);
      const url = secureLocalStorage.getItem("url") + "users.php";
      const jsonData = { email: values.email };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "isEmailExist");
      setTimeout(() => {
        setProgress(45);
      }, [1500]);
      setTimeout(() => {
        setProgress(70);
      }, [1000]);
      const res = await axios.post(url, formData);
      if (res.data === -1) {
        toast.error("Email already exist");
        return;
      } else {
        localStorage.setItem("personalInfo", JSON.stringify(values));
        nextPage();
      }
    } catch (error) {
      toast.error("Network error");
      console.log("PersonalInformation.jsx => onSubmit(): " + error);
    } finally {
      setIsLoading(false);
    }

    // try {
    //   if (values.password !== values.confirmPassword) {
    //     toast.error("Passwords do not match");
    //     return;
    //   } else if (isValidated) {
    //     nextPage();
    //     return;
    //   } else if (pincode !== "") {
    //     handleShowPin();
    //     return
    //   }
    //   setIsloading(true);
    //   setEmail(values.email);
    //   const url = secureLocalStorage.getItem("url") + "users.php";
    //   // console.log("url: " + url);
    //   // console.log("email niya: " + values.email);
    //   const jsonData = { email: values.email, }
    //   const formData = new FormData();
    //   formData.append("json", JSON.stringify(jsonData));
    //   formData.append("operation", "getPinCode");
    //   setTimeout(() => {
    //     setProgress(60);
    //   }, [2000])
    //   const res = await axios.post(url, formData);

    //   console.log("RES DATA: ", res.data);
    //   if (parseInt(res.data) === -1) {
    //     toast.error("This email is already taken");
    //     return
    //   } else if (res.data !== 0) {
    //     setTimeout(() => {
    //       setProgress(96);
    //     }, [500])
    //     console.log("pincode niya: " + res.data);
    //     setPincode(res.data.pincode);
    //     setExpirationDate(res.data.expirationDate);
    //     console.log(values);
    //     handleShowPin();
    //   } else {
    //     toast.error("Network error");
    //     console.log("PersonalInformation.jsx => onSubmit(): " + res.data);
    //   }

    // } catch (error) {
    //   setTimeout(() => {
    //     toast.error("Network error");
    //   }, [500])
    //   console.log("PersonalInformation.jsx => onSubmit(): " + error);
    // } finally {
    //   setTimeout(() => {
    //     setProgress(96);
    //     setIsloading(false);

    //   }, [500])

    // }
  };

  const handleDateChange = (date) => {
    if (date) {
      form.setValue("dob", formatISO(date, { representation: 'date' }));
    }
  };

  useEffect(() => {
    if (secureLocalStorage.getItem("url") !== "http://localhost/delmonte/api/") {
      secureLocalStorage.setItem("url", "http://localhost/delmonte/api/");
    }
    console.log("url", secureLocalStorage.getItem("url"));
  }, [])

  useEffect(() => {
    if (localStorage.getItem("personalInfo") !== null) {
      form.reset(JSON.parse(localStorage.getItem("personalInfo")));
    }
    console.log("personalInfo", localStorage.getItem("personalInfo"));
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
                    <div className="w-full h-full flex justify-center items-center">
                      <Progress value={progress} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center p-4 sm:p-6">
                      <div className="space-y-2 sm:space-y-6 w-full max-w-2xl">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3">
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
                          <FormField
                            control={form.control}
                            name="presentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Present Address</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Present Address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="permanentAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Permanent Address</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Permanent Address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn("justify-start w-full text-left font-normal bg-[#0e4028] hover:bg-[#0e5a35] border-2 border-[#0b864a]", !field.value && "text-muted-foreground")}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value ? format(new Date(field.value), "yyyy-MM-dd") : <span>Pick a date</span>}
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
                          <FormField
                            control={form.control}
                            name="sss"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SSS</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="SSS" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="tin"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>TIN</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="TIN" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="philhealth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PhilHealth</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="PhilHealth" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="pagibig"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pagibig</FormLabel>
                                <FormControl>
                                  <Input className="bg-[#0e4028] border-2 border-[#0b864a]" placeholder="Pagibig" {...field} />
                                </FormControl>
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
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mt-3 justify-end">
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
      {/* <EnterPin open={showPin} onHide={handleHidePin} pincode={pincode} email={email} expirationDate={expirationDate}/> */}
    </>
  );
};

export default PersonalInformation;



