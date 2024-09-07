import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-center" />
      <div className="p-2 flex gap-4 text-center justify-center">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/join" className="[&.active]:font-bold">
          Join
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
