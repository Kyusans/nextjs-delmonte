"use client"
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Home() {

  useEffect(() => {
    if (secureLocalStorage.getItem("url") !== "http://localhost/delmonte/api/") {
      secureLocalStorage.setItem("url", "http://localhost/delmonte/api/");
    }
    console.log("url", secureLocalStorage.getItem("url"));
  }, [])

  return (
    <>
      <header className="p-4">
        <ModeToggle />
      </header>
    </>
  );
}
