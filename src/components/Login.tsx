import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { IconBrandSpotify } from "@tabler/icons-react";

export const Login = () => {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-8 p-10">
      <h1 className="text-4xl font-semibold">dj9</h1>
      <h2 className="text-center text-xl">Improve your spotify experience</h2>
      <Button
        size="lg"
        variant="secondary"
        className="flex items-center gap-2"
        onClick={() => void signIn("spotify", { callbackUrl: "/" })}
      >
        <IconBrandSpotify /> Login with Spotify
      </Button>
    </main>
  );
};
