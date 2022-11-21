import { useEffect, useState } from "react";
import { currTime, hoursToSeconds, secondsToHours1 } from "../utils/timer";
import { trpc } from "../utils/trpc";
import {
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import Loading from "./Loading";
import Swal from "sweetalert2";

const currRemaining = (
  totalTime: number,
  lastUpdated: number,
  timePassed: number,
  isRunning: boolean
) => {
  const _timeRemaining0 =
    totalTime - timePassed > 0 ? totalTime - timePassed : 0;
  const _timeRemaining = timePassed ? _timeRemaining0 : totalTime;
  if (isRunning) {
    const timeReduced = currTime() - lastUpdated;
    if (timeReduced > _timeRemaining) return 0;
    return _timeRemaining - timeReduced;
  }
  return _timeRemaining;
};

const Swal0 = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success mr-2",
    cancelButton: "btn btn-error",
  },
  buttonsStyling: false,
});
export default function TimerBox({ timerId }: { timerId: string }) {
  const { data, isLoading, refetch } = trpc.timer.get.useQuery({ timerId });
  const updateTotalT = trpc.timer.updateTotalTime.useMutation();
  const getAll = trpc.timer.getAllIds.useQuery({ page: 1, limit: 10 });
  const startT = trpc.timer.start.useMutation();
  const stopT = trpc.timer.stop.useMutation();
  const deleteT = trpc.timer.delete.useMutation();
  const createTS = trpc.timerSessions.create.useMutation();
  const timePass = trpc.timer.getTotalPassedTime.useQuery({ timerId });

  const [isRefetching, setIsRefetching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tTime, setTTime] = useState([0, 0, 0]);
  const [currRem, setCurrRem] = useState<[number, number, number]>([0, 0, 0]);

  const updateRemTime = () => {
    if (data && timePass.data) {
      setCurrRem(
        secondsToHours1(
          currRemaining(
            data.totalTime!,
            data.updatedAt!,
            timePass.data._sum.timePassed!,
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

  useEffect(() => updateRemTime(), [data, timePass.data]);

  useEffect(() => {
    if (data && timePass.data) {
      return setTTime(secondsToHours1(data.totalTime));
    } else {
      return setTTime([0, 0, 0]);
    }
  }, [data, timePass.data]);

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  const refetchRemTime = async () => {
    setIsRefetching(true);
    await timePass.refetch();
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

  const updateTotalTime = async (newTotalHours: string) => {
    if (timePass.data !== undefined && timePass.data._sum.timePassed !== null) {
      const _newTimeInSec = hoursToSeconds(parseFloat(newTotalHours));
      if (_newTimeInSec <= timePass.data._sum.timePassed)
        throw new Error("New-time must be greater than Time-passed");
    } else throw new Error("Could not fetch time-passed");

    await updateTotalT.mutateAsync({
      timerId: data.id,
      totalTime: hoursToSeconds(parseFloat(newTotalHours)),
    });
    await refetch();
    return newTotalHours;
  };

  const onEditClick = () => {
    Swal0.fire({
      title: "Modify Total Time",
      text: "Enter new total time in hours (e.g. 1.5)",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Modify",
      showLoaderOnConfirm: true,
      preConfirm: (newTotalHours) => updateTotalTime(newTotalHours),

      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal0.fire({
            text: `Updated TotalTime to ${result.value} hours`,
            icon: "success",
          });
        }
      })
      .catch((err) => {
        Swal0.fire({
          icon: "error",
          title: "Got Error",
          text: err.message,
        });
      });
  };

  return (
    <>
      <div
        className="card w-fit bg-base-100 shadow-xl"
        style={{
          background: data.isRunning
            ? "linear-gradient(to right, #B0F3F1,#FFCFDF)"
            : "inherit",
        }}
      >
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
            <button
              onClick={onEditClick}
              className="btn-outline btn-success btn"
            >
              <PencilIcon className="h-6 w-6" />
            </button>
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
      </div>
    </>
  );
}
