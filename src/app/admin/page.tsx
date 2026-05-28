import { ROUTES } from "@/lib/constants/routes";
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect(ROUTES.ADMIN_PRODUCTS)
}
