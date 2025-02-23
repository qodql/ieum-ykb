import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react"
import Head from 'next/head';


export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  

  return (
    <SessionProvider session={session}>
       <Head>
        <title>IEUM</title>
        <link rel="icon" href="/icon/favicon.png" /> 
      </Head>
     
      <Component {...pageProps} />
     
    </SessionProvider>
  )
}
