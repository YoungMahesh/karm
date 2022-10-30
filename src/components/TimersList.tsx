import { currTime } from "../utils/timer";
import { trpc } from "../utils/trpc";
import Button1 from "./Button1";

export default function TimersList() {
  const { data, isLoading, refetch } = trpc.timer.getAll.useQuery();
  const startT = trpc.timer.startTimer.useMutation();
  const stopT = trpc.timer.stopTimer.useMutation();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  const startTimer = async (id: string) => {
    await startT.mutateAsync({ timerId: id });
    console.log("started timer");
    refetch();
  };

  const stopTimer = async (
    id: string,
    lastUpdated: number,
    timeRemaining: number
  ) => {
    const timeReduced = currTime() - lastUpdated;
    timeRemaining -= timeReduced;
    await stopT.mutateAsync({ timerId: id, timeRemaining });
    console.log("stopped timer");
    refetch();
  };

  return (
    <div>
      {data.map((tm, idx) => (
        <div key={idx} className="w-fit rounded border-2 border-black p-2">
          <p>Title: {tm.title}</p>
          <p>Description: {tm.description}</p>
          <p>Total Time: {tm.totalTime}</p>
          <p>Time Remaining: {tm.timeRemaining}</p>
          <p>Is Running: {tm.isRunning ? "Yes" : "No"}</p>
          {tm.isRunning ? (
            <Button1
              onClick={() => stopTimer(tm.id, tm.updatedAt, tm.timeRemaining)}
            >
              Stop
            </Button1>
          ) : (
            <Button1 onClick={() => startTimer(tm.id)}>Start</Button1>
          )}
        </div>
      ))}
    </div>
  );
}
