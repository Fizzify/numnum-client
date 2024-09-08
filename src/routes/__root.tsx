import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: () => (
    <>
      <Toaster position="top-center" />
      <div className="p-4 flex gap-4 text-center justify-center">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/join" className="[&.active]:font-bold">
          Join
        </Link>
      </div>
      <hr className="border-none bg-white h-0.5" />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
