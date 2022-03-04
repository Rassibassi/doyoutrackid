import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preloading font from font-face in global.scss to prevent FOUT */}
          <link
            rel="preload"
            href="/ArialNarrow.woff2"
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
          {/* TODO(jack.matthews): make SVG */}
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
