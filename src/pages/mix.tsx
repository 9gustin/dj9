import { SearchSection } from "@/components/Home/components/MainContent/components/SearchResult";
import { api } from "@/utils/api";
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

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!data?.tracks) {
    return <div>Error</div>;
  }

  return (
    <SearchSection
      title="For you ;)"
      items={data.tracks}
      actions={{
        open: true,
      }}
    />
  );
}
