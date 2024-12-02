"use client"
import React, { useState, useEffect } from "react";
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

let resolveCallback;

const ShowAlert = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      setIsButtonDisabled(true);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev > 1) return prev - 1;
          clearInterval(timer);
          setIsButtonDisabled(false);
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countdown]);

  const show = (alertMessage, callback, duration = 0) => {
    setMessage(alertMessage);
    setOpen(true);
    setCountdown(duration);
    resolveCallback = callback;
  };

  const handleClose = (status) => {
    setOpen(false);
    if (resolveCallback) resolveCallback(status);
  };

  return (
    <AlertDialog open={open} onOpenChange={() => handleClose(0)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleClose(0)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleClose(1)}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? `Continue in ${countdown}` : "Continue"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Singleton to expose the show method
const showAlert = {
  show: (message, callback, duration) => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("showAlert", { detail: { message, callback, duration } });
      window.dispatchEvent(event);
    }
  },
};

export { ShowAlert, showAlert };

// Hook up the alert in your root component (e.g., _app.js)
const ShowAlertListener = () => {
  useEffect(() => {
    const handler = (e) => {
      const { message, callback, duration } = e.detail;
      if (window._showAlertInstance) {
        window._showAlertInstance(message, callback, duration);
      }
    };

    window.addEventListener("showAlert", handler);

    return () => window.removeEventListener("showAlert", handler);
  }, []);

  return null;
};

export default ShowAlertListener;
