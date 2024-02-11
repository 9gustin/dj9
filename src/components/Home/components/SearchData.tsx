import {
  type SearchItem,
  type SpotifySearchResult,
} from "@/server/api/routers/spotify/types";
import { SearchSection } from "./SearchSection";

const searchKeys: Record<keyof SpotifySearchResult, string> = {
  tracks: "Tracks",
  artists: "Artists",
};

export const SearchData = ({
  query,
  loading,
  data,
  toggleItem,
  selected,
}: {
  query: string;
  loading: boolean;
  selected: SearchItem[];
  toggleItem: (item: SearchItem) => boolean;
  data: SpotifySearchResult | undefined;
}) => {
  if (!query.trim()) {
    return (
      <p className="text-gray-500">
        Provide songs, artists, genres to get started. We'll make the rest ;)
      </p>
    );
  }

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <p className="text-gray-500">No results found</p>;
  }

  return Object.keys(data).map((key) => {
    const items = data[key as keyof typeof data];
    if (items.length === 0) return null;

    return (
      <SearchSection
        key={key}
        title={searchKeys[key as keyof SpotifySearchResult]}
        items={items}
        toggleItem={toggleItem}
        selected={selected}
      />
    );
  });
};
