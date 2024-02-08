import { createTRPCRouter, spotifyAuthProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  type SpotifySearchResult,
  type SpotifyPlayerState,
  type SpotifyPlayerStateResponse,
  type SpotifySearchResponse,
} from "./types";

export const spotifyRouter = createTRPCRouter({
  getPlayerState: spotifyAuthProcedure.query(async ({ ctx }) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player", {
        headers: {
          Authorization: `Bearer ${ctx.session!.user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Spotify API error",
        });
      }

      const data = (await response.json()) as SpotifyPlayerStateResponse;

      return {
        isPlaying: data.is_playing,
        device: {
          id: data.device.id,
          isActive: data.device.is_active,
          name: data.device.name,
          type: data.device.type,
        },
        item: {
          id: data.item.id,
          name: data.item.name,
          cover: data.item.album.images[0]?.url,
        },
      } as SpotifyPlayerState;
    } catch (e: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: e?.message,
      });
    }
  }),
  searchItems: spotifyAuthProcedure
    .input(
      z
        .object({
          query: z.string().nullish(),
        })
        .nullish(),
    )
    .query(async ({ ctx, input }) => {
      if (!input?.query?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing query",
        });
      }
      try {
        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${input.query}&type=artist%2Ctrack&limit=10&offset=0`,
          {
            headers: {
              Authorization: `Bearer ${ctx.session!.user.accessToken}`,
            },
          },
        );

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Spotify API error",
          });
        }

        const data = (await response.json()) as SpotifySearchResponse;

        const artists = data.artists.items.map(
          ({ id, name, type, images }) => ({
            id,
            name,
            type,
            image: images[0]?.url,
          }),
        );

        const tracks = data.tracks.items.map(
          ({ id, name, type, album, artists }) => ({
            id,
            name,
            type,
            artists: artists.map((artist) => ({
              id: artist.id,
              name: artist.name,
            })),
            image: album.images[0]?.url,
          }),
        );

        return {
          tracks,
          artists,
        } as SpotifySearchResult;
      } catch (e: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: e?.message,
        });
      }
    }),
});
