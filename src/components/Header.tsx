import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import {
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceSpeaker,
} from "@tabler/icons-react";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";

const deviceIcon = {
  Computer: IconDeviceLaptop,
  Smartphone: IconDeviceMobile,
  Speaker: IconDeviceSpeaker,
};

export const Header = () => {
  const { data: sessionData } = useSession();

  const { data, isLoading } = api.spotify.getPlayerState.useQuery();

  if (!sessionData?.user) {
    return null;
  }

  const DeviceIcon = data?.device.type && deviceIcon[data.device.type];

  return (
    <header className="flex items-center justify-between gap-4 rounded-lg bg-gray-700 p-4 text-gray-100">
      <div className="flex gap-4">
        {isLoading && <div className="h-12 w-12 rounded-md bg-gray-700" />}
        {data && (
          <div
            className={classNames(
              "flex gap-2",
              !data.isPlaying && "opacity-50",
            )}
          >
            <img
              src={data.item.cover}
              alt={data.item.name}
              className={classNames(
                "h-full w-12 rounded-md border-2 border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 object-cover",
                {
                  "animate-pulse": data.isPlaying,
                },
              )}
            />
            <div className="flex flex-col gap-1">
              <p className="line-clamp-1 overflow-hidden text-ellipsis">
                {data.item.name}
              </p>
              <div className="flex gap-2">
                {DeviceIcon && <DeviceIcon size={24} />}
                <p>{data.device.name}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Button onClick={() => signOut()}>Logout</Button>
    </header>
  );
};
