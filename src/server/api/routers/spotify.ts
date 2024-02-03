import { createTRPCRouter, spotifyAuthProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export type SpotifyPlayerState = {
  isPlaying: boolean;
  device: {
    id: string;
    isActive: boolean;
    name: string;
    type: "Computer" | "Smartphone" | "Speaker";
  };
  item: {
    id: string;
    name: string;
    cover: string;
  };
};

type SpotifyPlayerStateResponse = {
  is_playing: boolean;
  device: {
    id: string;
    is_active: boolean;
    name: string;
    type: "Computer" | "Phone";
  };
  item: {
    id: string;
    name: string;
    album: {
      images: {
        url: string;
      }[];
    };
  };
};

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
          `https://api.spotify.com/v1/search?q=${input.query}&type=artist%2Ctrack&limit=20&offset=0`,
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

        const data = (await response.json()) as any;
        console.log(data);

        return data;
      } catch (e: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: e?.message,
        });
      }
    }),
});
