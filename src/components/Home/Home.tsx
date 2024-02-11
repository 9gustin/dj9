import { Input } from "@/components/ui/input";
import { useDebouncedState } from "@mantine/hooks";
import { Button } from "../ui/button";
import { SelectedChips } from "./components/SelectedChips";
import { IconArrowsShuffle } from "@tabler/icons-react";
import { SearchData } from "./components/SearchData";
import { useRouter } from "next/router";
import { type SearchItem } from "@/server/api/routers/spotify/types";
import { useState } from "react";
import { api } from "@/utils/api";

const SEED_LIMIT = 5;

export const Home = () => {
  const [query, setSearch] = useDebouncedState("", 300);
  const [selected, setSelected] = useState<SearchItem[]>([]);

  const router = useRouter();

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <section className="mb-20 flex flex-col gap-4 md:mb-0">
      <div className="hidden flex-col gap-4 md:flex">
        <h1 className="flex items-center justify-between text-xl font-semibold">
          What's your mood?
          {Boolean(selected.length) && (
            <Button
              type="button"
              className="m-0 h-10 w-10 bg-green-600 p-0"
              onClick={handleMix}
            >
              <IconArrowsShuffle />
            </Button>
          )}
        </h1>
        <Input
          className="h-12"
          placeholder="Duki, Bad Bunny, Travis Scott, etc"
          onChange={handleInputChange}
        />
        <SelectedChips selected={selected} toggleItem={toggleItem} />
      </div>
      <SearchData
        query={query}
        loading={isFetching}
        data={data}
        selected={selected}
        toggleItem={toggleItem}
      />
      <div className="fixed bottom-0 left-0 right-0 flex w-full flex-col gap-4 rounded-t-lg border-t-2 border-gray-500 bg-gray-700 p-4 shadow-md shadow-gray-100 md:hidden">
        <h1 className="flex items-center justify-between text-xl font-semibold">
          What's your mood?
          {Boolean(selected.length) && (
            <Button
              type="button"
              className="m-0 h-10 w-10 bg-green-600 p-0"
              onClick={handleMix}
            >
              <IconArrowsShuffle />
            </Button>
          )}
        </h1>
        <Input
          className="md:h-12"
          placeholder="Duki, Bad Bunny, Travis Scott, etc"
          onChange={handleInputChange}
        />
        {Boolean(selected.length) && (
          <>
            <SelectedChips
              selected={selected}
              toggleItem={toggleItem}
              className="flex md:hidden"
            />
          </>
        )}
      </div>
    </section>
  );
};
