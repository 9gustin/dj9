import { Input } from "@/components/ui/input";
import { useDebouncedState } from "@mantine/hooks";
import { SearchResult } from "./components/SearchResult";

export const MainContent = () => {
  const [search, setSearch] = useDebouncedState("", 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">What's your mood?</h1>
      <Input
        className="md:h-12"
        placeholder="Duki, Bad Bunny, Travis Scott, etc"
        onChange={handleInputChange}
      />
      <SearchResult query={search} />
    </section>
  );
};
