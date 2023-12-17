import spotifyApiRequest from "./api";

export default function addToQueue(id: string, accessToken: string) {
  const uri = `spotify:track:${id}`;
  return spotifyApiRequest(
    `me/player/queue?uri=${encodeURIComponent(uri)}`,
    accessToken,
    "POST",
  );
}
