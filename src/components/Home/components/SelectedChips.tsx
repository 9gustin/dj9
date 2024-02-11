import { cn } from "@/lib/utils";
import { type SearchItem } from "@/server/api/routers/spotify/types";
import { IconX } from "@tabler/icons-react";

export const SelectedChips = ({
  selected,
  className,
  toggleItem,
}: {
  className?: string;
  selected: SearchItem[];
  toggleItem: (item: SearchItem) => boolean;
}) => {
  if (!Boolean(selected.length)) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {selected.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => toggleItem(item)}
          className="flex gap-2 rounded-lg border-2 border-gray-500 bg-gray-700 px-2 py-1 md:gap-4 md:p-2"
        >
          <p>{item.name}</p>
          <IconX />
        </button>
      ))}
    </div>
  );
};
