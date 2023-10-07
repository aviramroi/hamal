import '../styles/globals.css';
import { AppProps } from 'next/app';
import NProgress from 'nprogress'; // nprogress module
import Router, { useRouter } from 'next/router';

import { Toaster } from 'sonner';

// Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <>
      <Toaster richColors />
      <Component {...pageProps} />
    </>
  );
}
