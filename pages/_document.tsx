import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en" dir="rtl">
      <Head />
      <body dir="rtl">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
