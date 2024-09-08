import { useEffect, useState } from "react";

type CountdownTimerProps = {
  onCountdownEnd: () => void;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ onCountdownEnd }) => {
  const [timeLeft, setTimeLeft] = useState<number>(5);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeLeft(5);
      onCountdownEnd();
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <>
      <span className="text-8xl font-bold">{timeLeft}</span>
    </>
  );
};

export default CountdownTimer;
