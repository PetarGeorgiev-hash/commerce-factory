import { AdminPanel } from "@/components/Admin/AdminPanel";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { auth } from "@/server/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user.role !== "ADMIN") {
    redirect(ROUTES.HOME);
  }

  return (
    <SidebarProvider>
      <AdminPanel />
      <main style={{ width: "100%" }}>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
