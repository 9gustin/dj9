import { type SearchItem } from "@/server/api/routers/spotify/types";
import { CardResult, GenericAction } from "./ItemCard";

export const SearchSection = ({
  title,
  items,
  selected,
  toggleItem,
  genericActions,
}: {
  title: string;
  items: SearchItem[];
  selected?: SearchItem[];
  genericActions?: GenericAction[];
  toggleItem?: (id: SearchItem) => boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="my-2 text-2xl font-bold text-gray-300">{title}</h2>
      <ul
        className="flex flex-col flex-wrap gap-4 md:grid 
      md:grid-flow-row-dense md:grid-cols-2 md:gap-4
      "
      >
        {items.map((item) => (
          <li key={item.id}>
            <CardResult
              item={item}
              actions={
                selected && toggleItem
                  ? {
                      select: {
                        isSelected: selected.some(
                          (selected) => selected.id === item.id,
                        ),
                        toggleItem: () => toggleItem(item),
                      },
                    }
                  : {
                      generic: genericActions,
                    }
              }
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
