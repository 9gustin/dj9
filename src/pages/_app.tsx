import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import Head from "next/head";
import { Header } from "@/components/Header";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <title>dj9</title>
        <meta
          name="description"
          content="dj9 app - Create playlists based on your tastes"
        />
      </Head>
      <main className="m-auto flex min-h-screen w-full max-w-screen-md flex-col gap-4 p-2 md:p-4">
        <SessionProvider session={session}>
          <Header />

          <Component {...pageProps} />
        </SessionProvider>
      </main>
    </>
  );
};

export default api.withTRPC(MyApp);
