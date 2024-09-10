import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ShowAlert({ open, onHide, message }) {
  const [countdown, setCountdown] = useState(5);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    let timer;

    if (open) {
      setCountdown(5);
      setIsButtonDisabled(true);
      
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev > 1) {
            return prev - 1;
          } else {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      setIsButtonDisabled(true);
    };
  }, [open]);

  const handleOnHide = () => {
    onHide(0);
  };

  const handleContinue = () => {
    onHide(1);
  };

  return (
    <div>
      <AlertDialog open={open} onOpenChange={handleOnHide}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleContinue} disabled={isButtonDisabled}>
              {isButtonDisabled ? `Continue in ${countdown}` : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ShowAlert;



  //how to use it
  // const [alertMessage, setAlertMessage] = useState("");
  // const [showAlert, setShowAlert] = useState(false);
  // const handleShowAlert = (message) => {
  // setAlertMessage(message);
  //   setShowAlert(true);
  // };
  // const handleCloseAlert = (status) => {
  //   if (status === 1) {
  //     const filteredPosition = position.filter((_, index) => index !== indexToRemove);
  //     setPosition(filteredPosition);
  //     localStorage.setItem("employmentHistory", JSON.stringify(filteredPosition));
  //   }
  //   setShowAlert(false);
  // };
  // <ShowAlert open={showAlert} onHide={handleCloseAlert} message={alertMessage} />

