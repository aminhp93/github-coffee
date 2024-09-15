import "@/styles/globals.css";

// Import packages

import type { NextPage } from "next";
import type { AppProps } from "next/app";

import dynamic from "next/dynamic";

// dynamic import for layout
const Layout = dynamic(() => import("./_layout"), {
  ssr: false,
});

const App = (props: {
  Component: NextPage;
  pageProps: AppProps["pageProps"];
}) => {
  const { Component, pageProps } = props;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

export default App;
