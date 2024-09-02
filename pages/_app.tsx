import "@/styles/globals.css";

// Import packages

import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  setConfig?: () => void;
};

type Props = AppProps & {
  Component: NextPageWithLayout;
  getLayout?: (page: ReactElement) => ReactNode;
  authGuard?: boolean;
  guestGuard?: boolean;
  setConfig?: () => void;
};

const App = (props: Props) => {
  const { Component, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
};

export default App;
