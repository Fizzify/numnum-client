import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const Route = createLazyFileRoute("/join")({
  component: JoinComponent,
});

export const socket = io(import.meta.env.VITE_API_URL);

function JoinComponent() {
  const [roomCode, setRoomCode] = useState("");
  const navigate = useNavigate();

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setRoomCode(text);
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleRoomJoin = () => {
    try {
      const url = new URL(roomCode);

      const pathname = url.pathname;

      const slug = pathname.split("/").pop();

      socket.emit("join", slug);
    } catch {
      socket.emit("join", roomCode);
    }
  };

  useEffect(() => {
    socket.on("join-success", (roomId) => {
      toast.success(`Joined: ${roomId}`);

      navigate({
        to: "/r/$roomId",
        params: { roomId },
        search: {
          waiting: false,
        },
      });
    });

    socket.on("join-fail", () => {
      toast.error("Room does not exist!");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <DefaultLayout>
      <h1 className="text-4xl font-bold">Join a room</h1>
      <div className="my-4" />
      <div className="flex items-center">
        <div className="bg-neutral-700 flex items-center">
          <input
            className="bg-neutral-700 px-4 py-1 outline-none border-none"
            placeholder="Enter room code/link..."
            onChange={handleRoomCodeChange}
            value={roomCode}
          />
          <button className="mx-4" onClick={handlePaste}>
            📋
          </button>
        </div>
        <button
          className="px-4 py-1 bg-yellow-300 text-black"
          onClick={handleRoomJoin}
        >
          Join
        </button>
      </div>
    </DefaultLayout>
  );
}
