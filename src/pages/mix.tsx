import { SearchSection } from "@/components/Home/components/MainContent/components/SearchResult";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function Mix() {
  const queryParams = useRouter().query;

  const { data, isLoading } = api.spotify.recommendations.useQuery(
    {
      seedTracks: queryParams.tracks?.toString(),
      seedArtists: queryParams.tracks?.toString(),
    },
    {
      enabled: Boolean(queryParams.tracks) || Boolean(queryParams.artists),
    },
  );

  if (isLoading) {
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
