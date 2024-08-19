"use client"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useEffect } from "react";
import secureLocalStorage from "react-secure-storage";

export default function Home() {

  useEffect(() => {
    if(secureLocalStorage.getItem("url") !== "http://localhost/delmonte/api/") {
      secureLocalStorage.setItem("url", "http://localhost/delmonte/api/");
    }
    console.log("url", secureLocalStorage.getItem("url"));
  }, [])

  return (
    <>
      <header className="p-4">
        <ModeToggle />
      </header>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          hello
      </main>
    </>
  );
}
