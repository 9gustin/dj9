import { SearchSection } from "@/components/Home/components/SearchSection";
import { type SearchItem } from "@/server/api/routers/spotify/types";
import { api } from "@/utils/api";
import {
  IconArrowBackUp,
  IconArrowsShuffle,
  IconPlaylistAdd,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import Link from "next/link";
import { useToast } from "../ui/use-toast";

export const MixPage = () => {
  const queryParams = useRouter().query;
  const { toast } = useToast();

  const { data, isFetching, refetch } = api.spotify.recommendations.useQuery(
    {
      seedTracks: queryParams.tracks?.toString(),
      seedArtists: queryParams.artists?.toString(),
    },
    {
      enabled: Boolean(queryParams.tracks) || Boolean(queryParams.artists),
      retry: false,
      onError: () =>
        toast({
          variant: "destructive",
          title: "Error fetching recommendations",
          description: "Please try again later",
        }),
    },
  );

  const { mutate: $addToQueue } = api.spotify.addToQueue.useMutation({
    onError: () =>
      toast({
        variant: "destructive",
        title: "Error adding this song to queue",
        description: "Please try again later",
      }),
    onSuccess: () =>
      toast({
        title: "Song added successfully",
      }),
  });

  const handleAdd = async (item?: SearchItem) => {
    if (!item?.uri) return;

    $addToQueue({
      trackURI: item.uri,
    });
  };

  const handleMix = async () => {
    await refetch();
  };

  return (
    <>
      <SearchSection
        action={{
          icon: <IconArrowsShuffle />,
          action: handleMix,
        }}
        loading={isFetching}
        title="For you ;)"
        items={data?.tracks}
        genericActions={[
          {
            icon: <IconPlaylistAdd />,
            action: handleAdd,
          },
        ]}
      />
      <Link href="/" className="w-min">
        <Button variant="secondary" className="gap-2" size="sm">
          <IconArrowBackUp className="h-4 w-4" /> Go back
        </Button>
      </Link>
    </>
  );
};
