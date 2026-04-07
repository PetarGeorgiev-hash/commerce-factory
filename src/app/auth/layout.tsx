import { ROUTES } from "@/lib/constants/routes";
import Link from "next/link";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user) {
    redirect(ROUTES.HOME);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1">
        <div className="flex min-h-screen flex-1 flex-col justify-center bg-gradient-to-b from-[#a1c8e8] to-[#6dade1] px-6 py-12 lg:px-8 dark:bg-gradient-to-b dark:from-[#1f2e3a] dark:to-[#314d63]">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center text-2xl font-bold tracking-tight text-white">
              <Link href={ROUTES.HOME} className="flex items-center gap-2">
                <span>Shop</span>
                <span className="text-[hsl(118,35%,19%)] dark:text-gray-800">
                  Name
                </span>
              </Link>
            </div>
            <p className="bold mt-2 text-center text-xl text-emerald-100 shadow-2xl">
                Welcome back! Please enter your details to sign in to your account.
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {children}
          </div>

          <div className="mt-10 text-center text-white">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Shop Quote&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </main>
    </div>
  );
}
