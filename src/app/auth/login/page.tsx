import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FaFacebook,FaGoogle } from "react-icons/fa";
import { ROUTES } from "@/lib/constants/routes";
import LoginForm from "@/components/LoginForm/LogingForm";
import LoginProviderButton from "@/components/LoginForm/LoginProviderButton";

export default function LoginPage() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email below to sign in to your account
        </CardDescription>
      </CardHeader>
      <LoginForm />
      <CardContent className="grid gap-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>
        <LoginProviderButton
          providerLogo={<FaFacebook />}
          providerName="Facebook"
        />
        <LoginProviderButton
          providerLogo={<FaGoogle />}
          providerName="Google"
        />
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground w-full text-center text-sm">
          <Link
            href={ROUTES.REGISTER}
            className="hover:text-primary underline underline-offset-4"
          >
            Don&apos;t have an account? Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}