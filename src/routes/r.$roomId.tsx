import { createFileRoute } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { useEffect } from "react";
import { socket } from "../socket";

export const Route = createFileRoute("/r/$roomId")({
  component: RoomComponent,
});

function RoomComponent() {
  const { roomId } = Route.useParams();
  const roomLink = `https://numnum.vercel.app/r/${roomId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
  };

  useEffect(() => {
    socket.emit("join", roomId);

    socket.on("join-success", () => {
      console.log("BOOM");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Waiting for players...</h1>
      <div className="my-4" />
      <button
        className="px-4 py-2 text-neutral-400 bg-neutral-700"
        onClick={handleCopyLink}
      >{`https://numnum.vercel.app/r/${roomId} 📋`}</button>
    </DefaultLayout>
  );
}
