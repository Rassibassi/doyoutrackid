import type { AppProps } from "next/app";
import "bulma/css/bulma.min.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
