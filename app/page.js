"use client"
import Image from "next/image";

export default function Home() {
  const handleSendEmail = async () => {
    alert("Email Sent");
    const formData = new FormData();
    formData.append("operation", "sendEmail");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={handleSendEmail}>Send Email</button>
    </main>
  );
}
