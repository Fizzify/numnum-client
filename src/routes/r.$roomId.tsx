import { createFileRoute, useSearch } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, useAnimationControls } from "framer-motion";
import winning from "../messages/winning.json";
import losing from "../messages/losing.json";
import CountdownTimer from "../extra/countdown-timer";
import { PairType } from "../types/pair";

export const Route = createFileRoute("/r/$roomId")({
  component: RoomComponent,
});

export const socket = io("https://numnum-server-production.up.railway.app/");

type SearchType = {
  waiting: boolean;
};

function RoomComponent() {
  const { roomId } = Route.useParams();
  const roomLink = `${window.location.origin}/r/${roomId}?waiting=false`;

  const search = useSearch({
    strict: false,
    select(search) {
      return (search as SearchType).waiting;
    },
  });

  const [heading, setHeading] = useState("");
  const [headingColor, setHeadingColor] = useState<"white" | "red" | "green">(
    "white"
  );
  const [isWaiting, setIsWaiting] = useState(true);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [problemPairs, setProblemPairs] = useState<PairType[]>([]);
  const [answerValue, setAnswerValue] = useState("");

  const controls = useAnimationControls();

  const renderedProblem = problemPairs[currentProblem];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
  };

  const handleClickStart = () => {
    socket.emit("start-game", roomId);
  };

  const handleEndGame = () => {
    socket.emit("end-game", roomId);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProblem >= problemPairs.length - 1) return handleEndGame();
    if (Number(answerValue) === renderedProblem.answer) {
      setCurrentProblem((prev) => prev + 1);
      setAnswerValue("");
    } else {
      controls.start({
        x: [5, 0, 5, 0],
        backgroundColor: ["#ff0000", "#404040"],
        transition: {
          duration: 0.5,
        },
      });
    }
  };

  const handleChangeAnswerValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswerValue(e.target.value);
  };

  const handleCountdownEnd = () => {
    setIsCountdown(false);
  };

  useEffect(() => {
    socket.emit("join", roomId);

    const handleJoinSuccess = () => {
      setHeading("Waiting for players...");
    };

    const handlePlayerJoin = () => {
      setIsWaiting(false);
      setHeading("Waiting to start...");
    };

    const handleGeneratePairs = (pairs: any) => {
      setCurrentProblem(0);
      setAnswerValue("");
      setIsGameStarted(true);
      setProblemPairs(pairs);
      setIsCountdown(true);
      console.log(pairs);
    };

    const handleDecideGame = (userId: string) => {
      setIsGameStarted(false);
      const randomMessageNumber = Math.round(Math.random() * 49);

      const isWinner = userId === socket.id;

      setHeading(
        isWinner
          ? winning.messages[randomMessageNumber]
          : losing.messages[randomMessageNumber]
      );

      console.log(randomMessageNumber);

      console.log(winning.messages[randomMessageNumber]);
      console.log(losing.messages[randomMessageNumber]);
      setHeadingColor(isWinner ? "green" : "red");
    };

    socket.on("join-success", handleJoinSuccess);
    socket.on("player-join", handlePlayerJoin);
    socket.on("generate-pairs", handleGeneratePairs);
    socket.on("decide-game", handleDecideGame);
    return () => {
      socket.off("join-success", handleJoinSuccess);
      socket.off("player-join", handlePlayerJoin);
    };
  }, [roomId]);
  return (
    <>
      {isCountdown ? (
        <div className="top-0 left-0 absolute w-full h-full bg-neutral-900/80 flex justify-center text-center items-center z-50">
          <CountdownTimer onCountdownEnd={handleCountdownEnd} />
        </div>
      ) : (
        <DefaultLayout>
          {!isGameStarted ? (
            <>
              <h1
                className="text-4xl font-bold text-center"
                style={{
                  color: headingColor,
                }}
              >
                {heading}
              </h1>
              <h2>{!search && "Waiting for host"}</h2>
              <div className="my-4" />
              <button
                className="px-4 py-2 text-neutral-400 bg-neutral-700"
                onClick={handleCopyLink}
              >{`${roomLink} 📋`}</button>
              <div className="my-4" />
              {search && !isWaiting && (
                <button
                  className="px-4 py-1 bg-yellow-300 text-black"
                  onClick={handleClickStart}
                >
                  Start
                </button>
              )}
            </>
          ) : (
            <>
              <img
                width={50}
                height={50}
                src={`/monsters/${renderedProblem.image}`}
              />
              <h1 className="text-4xl font-bold text-center">{`${renderedProblem.numOne} + ${renderedProblem.numTwo}`}</h1>
              <div className="my-4" />
              <motion.form
                className="bg-neutral-700"
                onSubmit={handleSubmitAnswer}
                animate={controls}
              >
                <input
                  autoFocus
                  autoComplete="off"
                  className="px-4 py-2 bg-transparent outline-none border-none"
                  onChange={handleChangeAnswerValue}
                  value={answerValue}
                />
                <button
                  className="px-2 py-2 bg-yellow-300 text-black"
                  type="submit"
                >
                  {">"}
                </button>
              </motion.form>
              <div className="my-4" />
              <span>Problem Number {currentProblem + 1}</span>
            </>
          )}
        </DefaultLayout>
      )}
    </>
  );
}
