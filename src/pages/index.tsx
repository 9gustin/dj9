import { Home } from "@/components/Home/Home";
import { Login } from "@/components/Login";
import { useSession } from "next-auth/react";

const statusPage = {
  loading: () => <p>Loading...</p>,
  unauthenticated: Login,
  authenticated: Home,
};

export default function HomePage() {
  const { status } = useSession();

  if (!status) return null;

  const Page = statusPage[status];
  return <Page />;
}
