"use client";

import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { ROUTES } from "@/lib/constants/routes";
import AdminForm from "@/components/Admin/AdminFormBoard/AdminForm";
import AdminPosts from "@/components/Admin/AdminPosts/AdminPosts";
import LoadingText from "@/components/LoadingText";

export default function AdminPage() {
  const { data: session, status } = useSession();
  // const router = useRouter();

  // TODO add this when we have roles implemented
  // useEffect(() => {
  //   if (status === "loading") return;
  //   if (session?.user.role !== "ADMIN") {
  //     router.push(ROUTES.HOME);
  //   }
  // }, [session, status, router]);

  if (status === "loading")
    return <LoadingText text="Loading admin dashboard..." />;

  return (
    <div className="container mx-auto p-4">
      <AdminForm />
      <AdminPosts />
    </div>
  );
}
