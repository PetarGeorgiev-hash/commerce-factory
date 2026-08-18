"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { register } from "@/server/actions/auth";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/lib/constants/routes";
import { useTranslations } from "next-intl";

const RegisterForm = () => {
  const t = useTranslations("RegisterPage.Form");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string)?.toString().trim();
    const password = (formData.get("password") as string)?.toString().trim();
    const name = (formData.get("name") as string)?.toString().trim();
    const confirmPassword = (formData.get("repeat-password") as string)
      ?.toString()
      .trim();

    if (!email || !name || !password || !confirmPassword) {
      setError(t("allFieldsRequired"));
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
    };

    try {
      const result = await register(data);

      if ("error" in result) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (!("error" in result)) {
        // Sign in the user directly with credentials
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: ROUTES.HOME,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("generic"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <CardContent className="grid gap-4">
        {error && (
          <div className="text-destructive text-sm font-medium">{error}</div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            disabled={isLoading}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="repeat-password">{t("repeatPassword")}</Label>
          <Input
            id="repeat-password"
            name="repeat-password"
            type="password"
            autoComplete="repeat-password"
            required
            disabled={isLoading}
          />
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? t("creatingAccount") : t("submit")}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
      </CardContent>
    </form>
  );
};

export default RegisterForm;
