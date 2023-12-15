import { api } from "@/utils/api";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

export default function Home() {
  const { data: sessionData } = useSession();
  const { data, isLoading } = api.spotify.getRecentlyPlayed.useQuery();

  if (!sessionData) {
    return (
      <>
        <Head>
          <title>dj9</title>
          <meta
            name="description"
            content="dj9 app - Create playlists based on your tastes"
          />
        </Head>
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-sky-950 p-10">
          <h1 className=" text-6xl font-semibold text-emerald-300">dj9</h1>
          <h2 className=" text-center text-xl text-slate-50">
            Create playlists based on your tastes
          </h2>
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => void signIn("spotify", { callbackUrl: "/" })}
          >
            Sign in
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>dj9</title>
        <meta
          name="description"
          content="dj9 app - Create playlists based on your tastes"
        />
      </Head>
      <main className="flex min-h-screen w-full flex-col gap-8 bg-sky-950 p-8">
        <header className="">
          <div className="flex items-center justify-between gap-4">
            <img
              src={sessionData.user?.image ?? ""}
              alt={sessionData.user?.name ?? ""}
              className="h-12 w-12 rounded-full"
            />
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void signOut()}
            >
              Sign out
            </button>
          </div>
        </header>
        <section className="flex flex-col gap-4">
          <h1 className="text-xl font-semibold text-emerald-300">
            Here are your recent played songs
          </h1>
          <ul className="flex flex-col gap-4">
            {data?.map(
              ({
                track: {
                  id,
                  name,
                  album: { images },
                  artists,
                },
              }) => (
                <li key={id} className="flex items-center gap-4">
                  <img
                    src={images[0].url}
                    alt={name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold text-slate-50">{name}</h2>
                    <p className="text-slate-300">
                      {artists.map(({ name }) => name).join(", ")}
                    </p>
                  </div>
                </li>
              ),
            )}
          </ul>
        </section>
      </main>
    </>
  );
}
