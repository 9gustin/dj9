import spotifyApiRequest from "./api";

export default async function playlistSongs(
  playlistId: string,
  accessToken: string,
) {
  return spotifyApiRequest(
    `playlists/${playlistId}/tracks?limit=50&fields=${encodeURIComponent(
      "items(track(id))",
    )}`,
    accessToken,
  );
}
