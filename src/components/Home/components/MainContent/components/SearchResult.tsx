import { api } from "@/utils/api";
import type {
  SearchItem,
  SpotifySearchResult,
} from "@/server/api/routers/spotify/types";
import { Button } from "@/components/ui/button";
import {
  IconArrowsShuffle,
  IconExternalLink,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";

const searchKeys: Record<keyof SpotifySearchResult, string> = {
  tracks: "Tracks",
  artists: "Artists",
};

const SEED_LIMIT = 5;

type ItemActions = {
  select?: {
    initialSelected?: string[];
    toggleItem?: (id: string) => boolean;
  };
  open?: boolean;
};

const CardResult = ({
  item,
  actions,
}: {
  item: SearchItem;
  actions?: ItemActions;
}) => {
  const [selected, setSelected] = useState(
    () =>
      actions?.select?.initialSelected &&
      actions.select.initialSelected.includes(item.id),
  );

  const handleSelectItem = () => {
    if (!actions?.select?.toggleItem) return;

    if (actions.select.toggleItem(item.id)) {
      setSelected((prev) => !prev);
    } else {
      // TODO: SHOW ALERT
    }
  };

  const description =
    "artists" in item
      ? item.artists.map((artist) => artist.name).join(", ")
      : null;
  const { name, image } = item;

  return (
    <div
      className={classNames(
        "flex h-24 gap-2 rounded-lg bg-gray-700 p-2 shadow-md",
        selected && "border-2 border-gray-500",
      )}
    >
      {image && (
        <img
          src={image}
          alt={name}
          className={classNames(
            "h-20 w-20 rounded-md object-cover",
            selected ? "opacity-100" : "opacity-60",
          )}
        />
      )}
      <div className="flex flex-1 flex-col gap-1 text-gray-100">
        <h3 className="line-clamp-2 overflow-hidden text-ellipsis font-semibold">
          {name}
        </h3>
        {description && (
          <p className="line-clamp-1 overflow-hidden text-ellipsis text-sm text-gray-300">
            {description}
          </p>
        )}
      </div>
      {actions?.select && (
        <Button
          type="button"
          className={classNames(
            "m-auto h-10 w-10 p-0",
            selected ? "bg-red-600" : "bg-green-600",
          )}
          onClick={handleSelectItem}
        >
          {selected ? (
            <IconX className="h-4 w-4" />
          ) : (
            <IconPlus className="h-4 w-4" />
          )}
        </Button>
      )}
      {actions?.open && item.href && (
        <Button
          type="button"
          className={classNames(
            "m-auto h-10 w-10 p-0",
            selected ? "bg-red-600" : "bg-green-600",
          )}
          onClick={() => window.open(item.href, "_blank")}
        >
          <IconExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const SearchSection = ({
  title,
  items,
  actions,
}: {
  title: string;
  items: SearchItem[];
  actions?: ItemActions;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="mb-2 mt-4 text-2xl font-bold text-gray-300">{title}</h2>
      <ul
        className="flex flex-col flex-wrap gap-4 md:grid 
      md:grid-flow-row-dense md:grid-cols-2 md:gap-4
      "
      >
        {items.map((item) => (
          <li key={item.id}>
            <CardResult item={item} actions={actions} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const SearchResult = ({ query }: { query: string }) => {
  const selectedIds = useRef<string[]>([]);
  const router = useRouter();
  const [hasSelected, setHasSelected] = useState(false);

  const toggleItem = (id: string): boolean => {
    if (selectedIds.current.includes(id)) {
      selectedIds.current = selectedIds.current.filter((i) => i !== id);
    } else if (selectedIds.current.length < SEED_LIMIT) {
      selectedIds.current.push(id);
    } else {
      return false;
    }
    setHasSelected(selectedIds.current.length > 0);
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

  if (!query.trim()) {
    return (
      <p className="text-gray-500">
        Provide songs, artists, genres to get started. We'll make the rest ;)
      </p>
    );
  }

  if (isFetching) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <p className="text-gray-500">No results found</p>;
  }

  const handleMix = () => {
    const selectedTracks = data.tracks.filter((track) =>
      selectedIds.current.includes(track.id),
    );

    const selectedArtists = data.artists.filter((artist) =>
      selectedIds.current.includes(artist.id),
    );

    router
      .push({
        pathname: "/mix",
        query: {
          tracks: selectedTracks.map((track) => track.id).join(","),
          artists: selectedArtists.map((artist) => artist.id).join(","),
        },
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {Object.keys(data).map((key) => {
        const items = data[key as keyof typeof data];
        if (items.length === 0) return null;

        return (
          <SearchSection
            key={key}
            title={searchKeys[key as keyof SpotifySearchResult]}
            items={items}
            actions={{
              select: { toggleItem, initialSelected: selectedIds.current },
            }}
          />
        );
      })}
      {hasSelected && (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-700 p-2 shadow-md shadow-gray-100 md:bottom-4 md:left-auto md:right-4 md:w-min md:bg-transparent md:shadow-none">
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
