import type { AppProps } from "next/app";
import "normalize.css";
import "bulma/css/bulma.min.css";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
