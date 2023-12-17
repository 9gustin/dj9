import spotifyApiRequest from "./api";

export default async function listGenres(accessToken: string) {
  return spotifyApiRequest(
    "recommendations/available-genre-seeds",
    accessToken,
  );
}
