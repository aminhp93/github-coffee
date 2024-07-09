"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Layout } from "@/@core/layout";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";
import { SnackbarProvider } from "notistack";

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Suspense>
            <SnackbarProvider>
              <Layout>
                {children}
                <Analytics />
              </Layout>
            </SnackbarProvider>
          </Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

export default RootLayout;
