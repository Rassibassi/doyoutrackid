import type { AppProps } from "next/app";
import "normalize.css";

import Layout from "../components/Layout/Layout";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
