"use client"
import { AdminPanel } from "@/components/Admin/AdminPanel"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/constants/routes";
import LoadingText from "@/components/LoadingText";

export default function Layout({ children }: { children: React.ReactNode }) {
const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.role !== "ADMIN" || status === "unauthenticated") {
      router.push(ROUTES.HOME);
    }
  }, [session, status, router]);

  if (status === "loading")
    return <LoadingText text="Loading admin dashboard..." />;
  return (
    <SidebarProvider>
      <AdminPanel />
      <main style={{width: '100%'}}>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}