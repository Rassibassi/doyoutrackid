import type { AppProps } from "next/app";
import "normalize.css";

import Layout from "../components/Layout/Layout";
import { ElevenEleven } from "../contexts/elevenEleven";
import { useIsElevenEleven } from "../hooks/useIsElevenEleven";

import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const [isElevenEleven, setIsElevenEleven] = useIsElevenEleven();

  return (
    <ElevenEleven.Provider value={{ isElevenEleven, setIsElevenEleven }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ElevenEleven.Provider>
  );
}

export default MyApp;
