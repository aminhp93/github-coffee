import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppBar from "./AppBar";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "github-coffee",
  description: "where daily problems are solved",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  components: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <AppBar>
            {children}
            <Analytics />
          </AppBar>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
