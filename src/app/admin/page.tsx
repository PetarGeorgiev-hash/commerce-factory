"use client";

import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { ROUTES } from "@/lib/constants/routes";
import AdminForm from "@/components/Admin/AdminFormBoard/AdminForm";
// import AdminProducts from "@/components/Admin/AdminProducts/AdminProducts";
import LoadingText from "@/components/LoadingText";
import { AdminSidebar } from "@/components/Admin/AdminSidebar/AdminSidebar";

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
    <div>
      {/* <AdminSidebar /> */}
      {/* <AdminForm />
      <AdminProducts /> */}
    </div>
  );
}
