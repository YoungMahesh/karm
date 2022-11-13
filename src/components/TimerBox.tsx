import { useEffect, useMemo, useState } from "react";
import { currTime, secondsToHours1, wait } from "../utils/timer";
import { trpc } from "../utils/trpc";

const currRemaining = (
  totalTime: number,
  lastUpdated: number,
  timePassed: number,
  isRunning: boolean
) => {
  const _timeRemaining = timePassed ? totalTime - timePassed : totalTime;
  const timeReduced = currTime() - lastUpdated;
  if (timeReduced > _timeRemaining) return 0;
  return isRunning ? _timeRemaining - timeReduced : _timeRemaining;
};
export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.get.useQuery({ timerId });
  const getAll = trpc.timer.getAllIds.useQuery();
  const startT = trpc.timer.start.useMutation();
  const stopT = trpc.timer.stop.useMutation();
  const deleteT = trpc.timer.delete.useMutation();
  const createTS = trpc.timerSessions.create.useMutation();
  const timeRem = trpc.timer.getTotalTime.useQuery({ timerId });

  const [isRefetching, setIsRefetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tTime, setTTime] = useState([0, 0, 0]);
  const [currRem, setCurrRem] = useState<[number, number, number]>([0, 0, 0]);

  const updateRemTime = () => {
    console.log("update rem time", data, timeRem.data);
    if (data && timeRem.data) {
      setCurrRem(
        secondsToHours1(
          currRemaining(
            data.totalTime!,
            data.updatedAt!,
            timeRem.data._sum.timePassed!,
            data.isRunning!
          )
        )
      );
    }
  };

  // useEffect(() => {
  //   if (
  //     data?.isRunning &&
  //     (currRem[2] > 0 || currRem[1] > 0 || currRem[0] > 0)
  //   ) {
  //     setTimeout(() => {

  //       updateRemTime();
  //     }, 1000);
  //   }
  // }, [currRem]);

  useEffect(() => {
    if (data && timeRem.data) {
      updateRemTime();
    }
  }, [data, timeRem.data]);

  useEffect(() => {
    if (data && timeRem.data) {
      return setTTime(secondsToHours1(data.totalTime));
    } else {
      return setTTime([0, 0, 0]);
    }
  }, [data, timeRem.data]);

  if (!data) return <p>no data</p>;

  const refetchRemTime = async () => {
    setIsRefetching(true);
    await timeRem.refetch();
    updateRemTime();
    setIsRefetching(false);
  };

  const startTimer = async () => {
    setIsUpdating(true);
    await startT.mutateAsync({ timerId: data.id, updatedAt: currTime() });
    await refetch();
    setIsUpdating(false);
  };

  const stopTimer = async () => {
    setIsUpdating(true);
    const _startTime = data.updatedAt;
    const _endTime = currTime();

    await Promise.all([
      createTS.mutateAsync({
        timerId: data.id,
        startTime: _startTime,
        endTime: _endTime,
        timePassed: _endTime - _startTime,
      }),
      stopT.mutateAsync({
        timerId: data.id,
      }),
    ]);
    await refetch();
    setIsUpdating(false);
    refetchRemTime();
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
                <span style={{ "--value": tTime[0] } as any}></span>:
                <span style={{ "--value": tTime[1] } as any}></span>:
                <span style={{ "--value": tTime[2] } as any}></span>
              </span>
            </p>
            <p>
              Time Remaining:
              <span className="countdown font-mono text-2xl">
                <span style={{ "--value": currRem[0] } as any}></span>:
                <span style={{ "--value": currRem[1] } as any}></span>:
                <span style={{ "--value": currRem[2] } as any}></span>
              </span>
            </p>

            <div className="card-actions justify-end">
              {isRefetching ? (
                <button className="loading btn-primary btn">
                  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                </button>
              ) : (
                <button onClick={refetchRemTime} className="btn-primary btn">
                  Refetch
                </button>
              )}
              {isUpdating ? (
                <button className="loading btn-primary btn" />
              ) : (
                <button
                  onClick={() => (data.isRunning ? stopTimer() : startTimer())}
                  className="btn-primary btn"
                >
                  {data.isRunning ? "Stop" : "Start"}
                </button>
              )}
              {isDeleting ? (
                <button className="loading btn-error btn" />
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
