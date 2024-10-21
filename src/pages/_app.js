import "@/styles/globals.css";
import store from '../stores/BookStore';
import { SessionProvider } from "next-auth/react"
import Head from 'next/head';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session} store={store}>
       <Head>
        <link rel="icon" href="/icon/favicon.png" /> 
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
