import { Input } from "@/components/ui/input";
import { useDebouncedState } from "@mantine/hooks";

export const MainContent = () => {
  const [search, setSearch] = useDebouncedState("", 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">What's your mood?</h1>
      <Input
        placeholder="Duki, Bad Bunny, Travis Scott, etc"
        onChange={handleInputChange}
      />
      <p className="text-gray-500">
        Provide songs, artists, genres to get started. We'll make the rest ;)
        <br />
        TODO: {search}
      </p>
    </section>
  );
};
