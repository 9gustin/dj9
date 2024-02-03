import { Header } from "./components/Header";
import { MainContent } from "./components/MainContent";

export const Home = () => {
  return (
    <main className="m-auto flex min-h-screen w-full max-w-screen-md flex-col gap-4 p-2 md:p-4">
      <Header />
      <MainContent />
    </main>
  );
};
