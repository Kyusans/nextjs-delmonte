"use client"
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard/")
    console.log("url", secureLocalStorage.getItem("url"));
  }, [router])

  return (
    <>
      <header className="p-4">
        <ModeToggle />
      </header>
    </>
  );
}
