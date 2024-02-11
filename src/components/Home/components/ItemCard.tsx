import { Button } from "@/components/ui/button";
import { type SearchItem } from "@/server/api/routers/spotify/types";
import { IconPlus, IconX } from "@tabler/icons-react";
import classNames from "classnames";

export type GenericAction = {
  icon: React.ReactNode;
  action: (item: SearchItem) => void | Promise<void>;
};

type ItemActions = {
  select?: {
    isSelected?: boolean;
    toggleItem?: () => boolean;
  };
  generic?: GenericAction[];
};

export const CardResult = ({
  item,
  actions,
}: {
  item: SearchItem;
  actions?: ItemActions;
}) => {
  const handleSelectItem = () => {
    if (!actions?.select?.toggleItem) return;
    actions.select.toggleItem();
  };

  const description =
    "artists" in item
      ? item.artists.map((artist) => artist.name).join(", ")
      : null;
  const { name, image } = item;

  const selected = actions?.select?.isSelected;

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
      {actions?.generic && (
        <div className="flex gap-2">
          {actions.generic.map((action, index) => (
            <Button
              key={index}
              type="button"
              className="m-auto h-10 w-10 bg-green-600 p-0"
              onClick={() => action.action(item)}
            >
              {action.icon}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
