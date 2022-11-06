import { useEffect, useState } from "react";
import { currTime, secondsToHours, wait } from "../utils/timer";
import { trpc } from "../utils/trpc";

export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.getOne.useQuery({ timerId });
  const getAll = trpc.timer.getAllIds.useQuery();
  const startT = trpc.timer.startTimer.useMutation();
  const stopT = trpc.timer.stopTimer.useMutation();
  const deleteT = trpc.timer.deleteTimer.useMutation();
  const [remTime, setRemTime] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  if (!data) return <p>no data</p>;

  const startTimer = async () => {
    setIsUpdating(true);
    await startT.mutateAsync({ timerId: data.id });
    console.log("started timer");
    await refetch();
    setIsUpdating(false);
  };

  const stopTimer = async () => {
    setIsUpdating(true);
    await stopT.mutateAsync({ timerId: data.id, timeRemaining: remTime });
    console.log("stopped timer");
    await refetch();
    setIsUpdating(false);
  };

  const deleteTimer = async () => {
    setIsDeleting(true);
    await deleteT.mutateAsync({ timerId: data.id });
    await getAll.refetch();
    setIsDeleting(false);
  };

  return (
    <>
      <div className="card w-fit bg-base-100 shadow-xl">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="card-body">
            <h2 className="card-title">{data.title}</h2>
            <p>{data.description}</p>
            <p>Total Time: {secondsToHours(data.totalTime)}</p>
            <p>Time Remaining: {secondsToHours(remTime)}</p>

            <div className="card-actions justify-end">
              {isUpdating ? (
                <button className="btn-primary loading btn" />
              ) : (
                <button
                  onClick={() => (data.isRunning ? stopTimer() : startTimer())}
                  className="btn-primary btn"
                >
                  {data.isRunning ? "Stop" : "Start"}
                </button>
              )}
              {isDeleting ? (
                <button className="btn-error loading btn" />
              ) : (
                <button onClick={deleteTimer} className="btn-error btn">
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
