"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "./AppBar";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { SnackbarProvider } from "notistack";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Suspense>
            <SnackbarProvider>
              <AppBar>
                {children}
                <Analytics />
              </AppBar>
            </SnackbarProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
