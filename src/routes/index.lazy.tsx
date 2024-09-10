import { createLazyFileRoute, Link } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import Button from "../primitive/button";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <DefaultLayout>
      <motion.img
        width={364}
        height={76}
        alt="numnum logo."
        src="/logo.png"
        initial={{
          y: -30,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 1,
        }}
      />
      <div className="my-4" />
      <div className="flex items-center gap-2">
        <Link
          to="/r/$roomId"
          params={{ roomId: nanoid() }}
          search={{ waiting: true }}
        >
          <Button>Create</Button>
        </Link>
        <Link to="/join">
          <button className="px-4 py-2">Join</button>
        </Link>
      </div>
    </DefaultLayout>
  );
}
