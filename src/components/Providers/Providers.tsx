"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "../theme-provider/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { ToasterProvider } from "./toaster-provider";
import { CartProvider } from "../Cart/CartContext";
import CartSheet from "../Cart/CartSheet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <TRPCReactProvider>
          <CartProvider>
            {children}
            <CartSheet />
            <ToasterProvider />
          </CartProvider>
        </TRPCReactProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
