import { useMemo, useState } from "react";
import { currTime, secondsToHours1 } from "../utils/timer";
import { trpc } from "../utils/trpc";

export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.getOne.useQuery({ timerId });
  const getAll = trpc.timer.getAllIds.useQuery();
  const startT = trpc.timer.startTimer.useMutation();
  const stopT = trpc.timer.stopTimer.useMutation();
  const deleteT = trpc.timer.deleteTimer.useMutation();
  const createTS = trpc.timerSessions.createTimerSession.useMutation();
  const [remTime, setRemTime] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [h1, m1, s1] = useMemo(() => {
    if (remTime <= 0) return [0, 0, 0];
    if (data) {
      if (data.isRunning) setTimeout(() => setRemTime(remTime - 1), 1000);
      else setRemTime(data.timeRemaining);
    }
    console.log(Math.floor(Date.now() / 1000), remTime);
    return secondsToHours1(remTime);
  }, [remTime]);

  const [h0, m0, s0] = useMemo(() => {
    if (data) {
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

      return secondsToHours1(data.totalTime);
    } else {
      return [0, 0, 0];
    }
  }, [data]);

  if (!data) return <p>no data</p>;

  const startTimer = async () => {
    setIsUpdating(true);
    await startT.mutateAsync({ timerId: data.id });
    await refetch();
    setIsUpdating(false);
  };

  const stopTimer = async () => {
    setIsUpdating(true);
    const _startTime = data.updatedAt;
    const _endTime = currTime();
    const _timePassed = _endTime - _startTime;
    const _timeRemaining =
      data.timeRemaining - _timePassed > 0
        ? data.timeRemaining - _timePassed
        : 0;
    await stopT.mutateAsync({
      timerId: data.id,
      timeRemaining: _timeRemaining,
    });
    await createTS.mutateAsync({
      timerId: data.id,
      startTime: _startTime,
      endTime: _endTime,
      timePassed: _timePassed,
    });
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
            <p>
              Total Time:
              <span className="countdown font-mono text-2xl">
                <span style={{ "--value": h0 } as any}></span>:
                <span style={{ "--value": m0 } as any}></span>:
                <span style={{ "--value": s0 } as any}></span>
              </span>
            </p>
            <p>
              Time Remaining:
              <span className="countdown font-mono text-2xl">
                <span style={{ "--value": h1 } as any}></span>:
                <span style={{ "--value": m1 } as any}></span>:
                <span style={{ "--value": s1 } as any}></span>
              </span>
            </p>

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
