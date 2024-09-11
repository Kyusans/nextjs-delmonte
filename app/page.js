"use client"
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/admin/dashboard/")
  })

  return (
    <>
      <header className="p-4">
        <ModeToggle />
      </header>
    </>
  );
}
