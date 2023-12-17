import spotifyApiRequest from "./api";

export default async function recommendations(
  accessToken: string,
  artists?: string[],
  genres?: string[],
  tracks?: string[],
) {
  let url = "recommendations?";

  if (artists) {
    url += `seed_artists=${encodeURIComponent(artists.join(","))}&`;
  }
  if (genres) {
    url += `seed_genres=${encodeURIComponent(genres.join(","))}&`;
  }
  if (tracks) {
    url += `seed_tracks=${encodeURIComponent(tracks.join(","))}&`;
  }

  return spotifyApiRequest(url, accessToken);
}
