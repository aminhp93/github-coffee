import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { MainLayout } from "@/@core/layouts";
import { NotificationProvider } from "@/@core/components/notification";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <NotificationProvider>
        <CssBaseline />
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </NotificationProvider>
    </StyledEngineProvider>
  );
}
