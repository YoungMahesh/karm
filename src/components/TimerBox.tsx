import { useEffect, useState } from "react";
import { currTime, itemsPerPage, secondsToHours1, wait } from "../utils/timer";
import { trpc } from "../utils/trpc";
import {
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

const currRemaining = (
  totalTime: number,
  lastUpdated: number,
  timePassed: number,
  isRunning: boolean
) => {
  const _timeRemaining = timePassed ? totalTime - timePassed : totalTime;
  if (isRunning) {
    const timeReduced = currTime() - lastUpdated;
    if (timeReduced > _timeRemaining) return 0;
    return _timeRemaining - timeReduced;
  }
  return _timeRemaining;
};
export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.get.useQuery({ timerId });
  const getAll = trpc.timer.getAllIds.useQuery({ page: 1, limit: 10 });
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

  useEffect(() => updateRemTime(), [data, timeRem.data]);

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
                <button className="loading btn-outline btn-success btn"></button>
              ) : (
                <button
                  onClick={refetchRemTime}
                  className="btn-outline btn-success btn"
                >
                  <ArrowPathIcon className="h-6 w-6" />
                </button>
              )}
              {isUpdating ? (
                <>
                  {data.isRunning ? (
                    <button className="loading btn-outline btn-error btn"></button>
                  ) : (
                    <button className="loading btn-outline btn-success btn"></button>
                  )}
                </>
              ) : (
                <>
                  {data.isRunning ? (
                    <button
                      onClick={stopTimer}
                      className="btn-outline btn-error btn"
                    >
                      <StopIcon className="h-6 w-6" />
                    </button>
                  ) : (
                    <button
                      onClick={startTimer}
                      className="btn-outline btn-success btn"
                    >
                      <PlayIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              {isDeleting ? (
                <button className="loading btn-outline btn-error btn" />
              ) : (
                <button
                  onClick={deleteTimer}
                  className="btn-outline btn-error btn"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
