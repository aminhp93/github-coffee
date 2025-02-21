import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function App({ Component, pageProps }: AppProps) {
  return(
    <StyledEngineProvider injectFirst>
    <CssBaseline />
    <Component {...pageProps} />
  </StyledEngineProvider>
  )
}
