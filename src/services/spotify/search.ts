import spotifyApiRequest from "./api";

export default async function search(q: string, accessToken: string) {
  return spotifyApiRequest(
    `search?q=${encodeURIComponent(q)}&type=${encodeURIComponent(
      "album,artist,playlist,track",
    )}`,
    accessToken,
  );
}
