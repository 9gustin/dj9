import { SearchSection } from "@/components/Home/components/SearchSection";
import { type SearchItem } from "@/server/api/routers/spotify/types";
import { api } from "@/utils/api";
import { IconPlaylistAdd } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function Mix() {
  const queryParams = useRouter().query;

  const { data, isFetching } = api.spotify.recommendations.useQuery(
    {
      seedTracks: queryParams.tracks?.toString(),
      seedArtists: queryParams.artists?.toString(),
    },
    {
      enabled: Boolean(queryParams.tracks) || Boolean(queryParams.artists),
    },
  );

  const { mutate: $addToQueue } = api.spotify.addToQueue.useMutation({
    onSuccess: () => {
      // TODO: ADD TOAST
      console.log("Added to queue");
    },
  });
  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!data?.tracks) {
    return <div>Error</div>;
  }

  const handleAdd = async (item: SearchItem) => {
    if (!item.uri) return;

    $addToQueue({
      trackURI: item.uri,
    });
  };

  return (
    <SearchSection
      title="For you ;)"
      items={data.tracks}
      genericActions={[
        {
          icon: <IconPlaylistAdd />,
          action: handleAdd,
        },
      ]}
    />
  );
}
