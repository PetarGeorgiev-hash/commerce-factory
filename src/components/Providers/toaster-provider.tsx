"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export function ToasterProvider({
  position = "bottom-right",
}: {
  position?: "top-right" | "bottom-right" | "top-left" | "bottom-left";
}) {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      position={position}
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        style: {
          fontSize: "0.875rem",
          padding: "1rem",
        },
        className: "toaster-custom",
      }}
    />
  );
}
