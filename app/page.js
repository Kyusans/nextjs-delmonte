"use client"
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const goToAdmin = () => {
    router.push("/admin/dashboard/")
  }
  return (
    <>
      <header className="p-4">
        <ModeToggle />
      </header>
      <Button onClick={goToAdmin}> Go to Admin</Button>
    </>
  );
}
