import { useRouter } from "next/router";

export default function Mix() {
  const queryParams = useRouter().query;

  return (
    <div>
      <h1>mix</h1>
      <pre>{JSON.stringify(queryParams, null, 2)}</pre>
    </div>
  );
}
