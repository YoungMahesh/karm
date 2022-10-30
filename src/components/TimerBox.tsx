import { useEffect, useState } from "react";
import { currTime, secondsToHours, wait } from "../utils/timer";
import { trpc } from "../utils/trpc";
import Button1 from "./Button1";

export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.getOne.useQuery({ timerId });
  const startT = trpc.timer.startTimer.useMutation();
  const stopT = trpc.timer.stopTimer.useMutation();
  const [remTime, setRemTime] = useState(0);

  useEffect(() => {
    if (data && data.isRunning) {
      console.log("executed counting");
      remTime > 0 && setTimeout(() => setRemTime((r) => r - 1), 1000);
    }
  }, [remTime]);

  useEffect(() => {
    if (data) {
      console.log("setting remaining time", data.timeRemaining);
      if (data.isRunning) {
        const timeReduced = currTime() - data.updatedAt;
        if (timeReduced > data.timeRemaining) {
          setRemTime(0);
        } else {
          setRemTime(data.timeRemaining - timeReduced);
        }
      } else {
        setRemTime(data.timeRemaining);
      }
    }
  }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  const startTimer = async (id: string) => {
    await startT.mutateAsync({ timerId: id });
    console.log("started timer");
    refetch();
  };

  const stopTimer = async (id: string) => {
    await stopT.mutateAsync({ timerId: id, timeRemaining: remTime });
    console.log("stopped timer");
    refetch();
  };

  return (
    <div className="w-fit rounded border-2 border-black p-2">
      <p>Title: {data.title}</p>
      <p>Description: {data.description}</p>
      <p>Total Time: {secondsToHours(data.totalTime)}</p>
      <p>Time Remaining: {secondsToHours(remTime)}</p>
      {data.isRunning ? (
        <Button1 onClick={() => stopTimer(data.id)}>Stop</Button1>
      ) : (
        <Button1 onClick={() => startTimer(data.id)}>Start</Button1>
      )}
    </div>
  );
}
