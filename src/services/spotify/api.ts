import { TRPCError } from "@trpc/server";

export default async function spotifyApiRequest<ResponseType>(
  customEndpoint: string,
  accessToken?: string,
  method: "GET" | "POST" = "GET",
): Promise<ResponseType> {
  if (!accessToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    const endpoint = `https://api.spotify.com/v1/${customEndpoint}`;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method,
    });

    if (!response.ok) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Spotify API error",
      });
    }
    const data = (await response.json()) as ResponseType;
    console.log(data);
    return data;
  } catch (e: unknown) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: (
        e as {
          message: string;
        }
      ).message,
    });
  }
}
