"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./components/ChangePasswordForm"; // Corrected import

export default function ChangePasswordPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const router = useRouter();

  if (status === "loading") {
    return <div className="text-center">Loading...</div>;
  }

  if (status === "unauthenticated" || !session?.user) {
    router.push("/login");
    return null;
  }

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Success message from API
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Change Password
        </h2>
        <ChangePasswordForm onSubmit={handleChangePassword} message={message} />
      </div>
    </div>
  );
}
