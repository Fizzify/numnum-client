import { createLazyFileRoute, Link } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { nanoid } from "nanoid";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <DefaultLayout>
      <h3 className="text-4xl font-bold">Welcome to numnum!</h3>
      <div className="my-4"></div>
      <div>
        <Link
          to="/r/$roomId"
          params={{ roomId: nanoid() }}
          search={{ waiting: true }}
        >
          <button className="px-4 py-1 bg-yellow-300 text-black">Create</button>
        </Link>
        <Link to="/join">
          <button className="px-4 py-2">Join</button>
        </Link>
      </div>
    </DefaultLayout>
  );
}
