import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-center" />
      <div className="p-4 flex gap-4 text-center justify-center bg-black/40">
        <Link
          to="/"
          className="[&.active]:text-yellow-300 [&.active]:font-bold"
        >
          Home
        </Link>
        <Link
          to="/join"
          className="[&.active]:text-yellow-300 [&.active]:font-bold"
        >
          Join
        </Link>
      </div>
      <Outlet />
    </>
  ),
});
