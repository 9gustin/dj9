import { type SearchItem } from "@/server/api/routers/spotify/types";
import { CardResult, type GenericAction } from "./ItemCard";
import { Button } from "@/components/ui/button";

export const SearchSection = ({
  title,
  items,
  action,
  loading,
  selected,
  toggleItem,
  genericActions,
}: {
  title: string;
  loading?: boolean;
  action?: GenericAction<never>;
  items: SearchItem[];
  selected?: SearchItem[];
  genericActions?: GenericAction<SearchItem>[];
  toggleItem?: (id: SearchItem) => boolean;
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="my-2 flex items-center justify-start gap-4 text-2xl font-bold text-gray-300">
        {title}
        {action && (
          <Button
            type="button"
            className="m-0 h-10 w-10 bg-green-600 p-0"
            onClick={() => action.action()}
          >
            {action.icon}
          </Button>
        )}
      </h2>
      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && Boolean(items.length) && (
        <ul className="flex flex-col flex-wrap gap-4 md:grid md:grid-flow-row-dense md:grid-cols-2 md:gap-4">
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
      )}
    </div>
  );
};
