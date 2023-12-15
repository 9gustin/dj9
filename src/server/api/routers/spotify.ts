import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const spotifyRouter = createTRPCRouter({
  getRecentlyPlayed: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.accessToken) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const accessToken = ctx.session.user.accessToken;
      const endpoint = "https://api.spotify.com/v1/me/player/recently-played";
      const response = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Spotify API error",
        });
      }

      const data = await response.json();
      console.log(data);
      return data.items;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e.message,
      });
    }
  }),
});
