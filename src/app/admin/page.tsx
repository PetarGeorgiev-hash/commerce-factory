"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { ROUTES } from "@/lib/constants/routes";
import AdminForm from "@/components/Admin/AdminFormBoard/AdminForm";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);


  useEffect(() => {
    if (status === "loading") return;
    //TODO add this when we have roles implemented
    // if (!session || session.user.role !== "ADMIN") {
    //   router.push(ROUTES.HOME);
    // }
  }, [session, status, router]);

  if (status === "loading") return <div>Loading...</div>;


  return (
    <div className="container mx-auto p-4">
      <AdminForm />
    </div>
  );
}
