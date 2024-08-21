import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import { toast } from "sonner";

export default function EnterPin({ open, onHide, pincode, email, expirationDate }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);

    try {
      const expirationDateTime = new Date(expirationDate);
      const currentDateTime = new Date();
      if (code === pincode) {
        if (expirationDateTime < currentDateTime) {
          toast.error("Pin code has expired.");
          handleDeletePin();
        } else {
          toast.success("Pin code verified.");
          onHide(1);
        }
      } else {
        toast.error("Incorrect pin code.");
      }

    } catch (error) {
      toast.error("Network error");
      console.log("EnterPin.jsx => handleSubmit(): " + error);
    } 
  };

  const handleDeletePin = () => {
    setIsLoading(true);
    try {
      const url = secureLocalStorage.getItem("url") + "users.php";
      const jsonData = { email: email, pincode: code };
      const formData = new FormData();
      formData.append("json", JSON.stringify(jsonData));
      formData.append("operation", "deletePinCode");

      const res = axios.post(url, formData);
      if(res.data === 1) {
        onHide(2);
      }
    } catch (error) {
      toast.error("Network error");
      console.log("EnterPin.jsx => handleDeletePin(): " + error);
    } finally {
      setIsLoading(false);
    }

  };

  const handleHide = () => {
    onHide(0);
  };
  return (
    <Dialog open={open} onOpenChange={handleHide}>
      <DialogOverlay className="bg-black/5" />
      <DialogContent className="sm:max-w-[425px] bg-[#0e5a35] ">
        <DialogHeader>
          <DialogTitle>Enter Pin</DialogTitle>
          <DialogDescription>
            Please check your e-mail account for the verification code we sent
            you and enter the code below. {pincode}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div>
            <Input
              id="name"
              className="col-span-3 bg-[#0e4028] border-2 border-[#0b864a]"
              placeholder="Enter Pin"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className="dark:bg-[#f5f5f5] dark:text-[#0e4028]" onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
