import { createFileRoute, useSearch } from "@tanstack/react-router";
import DefaultLayout from "../layout/default";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { motion, useAnimationControls } from "framer-motion";
import winning from "../messages/winning.json";
import losing from "../messages/losing.json";
import CountdownTimer from "../extra/countdown-timer";
import { PairType } from "../types/pair";
import Loader from "../extra/loader";
import Button from "../primitive/button";
import HealthBar from "../extra/health-bar";

export const Route = createFileRoute("/r/$roomId")({
  component: RoomComponent,
});

export const socket = io(import.meta.env.VITE_API_URL);

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
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [oppositeMonsterHealth, setOppositeMonsterHealth] = useState(100);
  const hitAnimControls = useAnimationControls();

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
      setMonsterHealth((prev) => prev - 10);

      hitAnimControls.start({
        y: [-20, 5],
        opacity: [1, 1, 1, 0],
        transition: {
          duration: 1,
        },
      });
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
      setMonsterHealth(100);
      setOppositeMonsterHealth(100);
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

      setHeadingColor(isWinner ? "green" : "red");
    };

    const handleDamageMonster = (userId: string, monsterHealthLeft: number) => {
      const isHitter = userId === socket.id;

      if (!isHitter) setOppositeMonsterHealth(monsterHealthLeft);
    };

    socket.on("join-success", handleJoinSuccess);
    socket.on("player-join", handlePlayerJoin);
    socket.on("generate-pairs", handleGeneratePairs);
    socket.on("decide-game", handleDecideGame);
    socket.on("damage-monster", handleDamageMonster);
    return () => {
      socket.off("join-success", handleJoinSuccess);
      socket.off("player-join", handlePlayerJoin);
    };
  }, [roomId]);

  useEffect(() => {
    socket.emit("solve-problem", roomId, socket.id, monsterHealth);
  }, [monsterHealth]);
  return (
    <>
      {isCountdown ? (
        <div className="top-0 left-0 absolute w-full h-full bg-neutral-900/80 flex flex-col justify-center text-center items-center z-50">
          <CountdownTimer onCountdownEnd={handleCountdownEnd} />
          <img
            width={200}
            height={200}
            src={`/misc/fire.gif`}
            alt="Fire."
            style={{
              imageRendering: "pixelated",
            }}
          />
        </div>
      ) : (
        <DefaultLayout>
          {!isGameStarted ? (
            <>
              <motion.img
                width={100}
                height={100}
                src={`/doom_guy.webp`}
                alt="Doom guy."
                style={{
                  imageRendering: "pixelated",
                }}
                initial={{
                  y: 0,
                }}
                animate={{
                  y: [6, -6, 6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
              />
              <div className="my-4" />
              <h1
                className="text-4xl font-bold text-center"
                style={{
                  color: headingColor,
                }}
              >
                {heading}
              </h1>
              <div className="my-2" />
              <p className="text-neutral-400">
                {!search && "Waiting for host"}
              </p>
              <div className="my-4" />
              <button
                className="px-4 py-2 text-neutral-400 bg-neutral-700 hover:bg-neutral-800 active:bg-neutral-600 flex items-center"
                onClick={handleCopyLink}
              >
                <span className="block text-ellipsis whitespace-nowrap overflow-hidden max-w-96">{`${roomLink}`}</span>
                📋
              </button>
              <div className="my-4" />
              {search && !isWaiting && (
                <Button onClick={handleClickStart}>Start</Button>
              )}

              <div className="my-4" />

              <Loader />
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-center text-center gap-4">
                <motion.img
                  width={100}
                  height={100}
                  src={`/monsters/${renderedProblem.image}`}
                  alt="Monster."
                  style={{
                    imageRendering: "pixelated",
                    filter:
                      "brightness(0) saturate(100%) invert(26%) sepia(75%) saturate(4552%) hue-rotate(349deg) brightness(90%) contrast(111%)",
                  }}
                  initial={{
                    y: 0,
                  }}
                  animate={{
                    y: [6, -6, 6],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />
                <HealthBar health={monsterHealth} />
                <motion.span
                  className="text-red-500"
                  animate={hitAnimControls}
                  initial={{
                    opacity: 0,
                  }}
                >
                  -10
                </motion.span>
              </div>
              <h1 className="text-4xl font-bold text-center font-sans">{`${renderedProblem.numOne} + ${renderedProblem.numTwo}`}</h1>
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
              <div className="my-8" />

              <div className="text-center scale-75">
                <h2>Player Two Monster</h2>
                <HealthBar health={oppositeMonsterHealth} />
              </div>
            </>
          )}
        </DefaultLayout>
      )}
    </>
  );
}
