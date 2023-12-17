import spotifyApiRequest from "./api";

export default function userTopSongs(accessToken: string) {
  return spotifyApiRequest("me/top/tracks?time_range=short_term", accessToken);
}
