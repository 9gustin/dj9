import { api } from "@/utils/api";
import type { SearchItem } from "@/server/api/routers/spotify/types";
import { Button } from "@/components/ui/button";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/router";
import { SelectedChips } from "./SelectedChips";
import { SearchData } from "./SearchData";

const SEED_LIMIT = 5;

export const SearchResult = ({ query }: { query: string }) => {
  const router = useRouter();
  const [selected, setSelected] = useState<SearchItem[]>([]);

  const toggleItem = (item: SearchItem): boolean => {
    if (selected.length >= SEED_LIMIT) {
      return false;
    }

    const index = selected.findIndex(({ id }) => id === item.id);

    if (index === -1) {
      setSelected((prev) => [...prev, item]);
    } else {
      setSelected((prev) => {
        const newSelected = [...prev];
        newSelected.splice(index, 1);
        return newSelected;
      });
    }
    return true;
  };

  const { data, isFetching } = api.spotify.searchItems.useQuery(
    {
      query,
    },
    {
      enabled: Boolean(query.trim()),
    },
  );

  const handleMix = () => {
    const query = selected.reduce<{
      tracks: string;
      artists: string;
    }>(
      (acc, item) => {
        if (item.type === "track") {
          acc.tracks += `${item.id},`;
        } else {
          acc.artists += `${item.id},`;
        }
        return acc;
      },
      { tracks: "", artists: "" },
    );

    router
      .push({
        query,
        pathname: "/mix",
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <SelectedChips
        selected={selected}
        toggleItem={toggleItem}
        className="hidden md:flex"
      />
      <SearchData
        query={query}
        loading={isFetching}
        data={data}
        selected={selected}
        toggleItem={toggleItem}
      />
      {Boolean(selected.length) && (
        <div className="fixed bottom-0 left-0 right-0 flex w-full flex-col gap-4 rounded-lg border-t-2 border-gray-500 bg-gray-700 p-2 shadow-md shadow-gray-100 md:bottom-4 md:left-auto md:right-4 md:w-min md:border-none md:bg-transparent md:shadow-none">
          <SelectedChips
            selected={selected}
            toggleItem={toggleItem}
            className="flex md:hidden"
          />
          <Button
            size="lg"
            onClick={handleMix}
            variant="secondary"
            className="w-full gap-2 md:w-auto"
          >
            <IconArrowsShuffle /> Mix it
          </Button>
        </div>
      )}
    </>
  );
};
