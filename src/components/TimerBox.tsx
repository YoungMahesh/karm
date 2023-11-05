/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { currTime, hoursToSeconds, secondsToHours1 } from "../utils/timer";
// import { trpc } from "../utils/trpc";
import { api } from "~/utils/api";
import {
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/solid";
import Loading from "./Loading";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const currRemaining = (
  totalTime: number,
  lastUpdated: number,
  timePassed: number | null,
  isRunning: boolean,
) => {
  const _timePassed = timePassed ? timePassed : 0;
  const _timeRemaining0 =
    totalTime - _timePassed > 0 ? totalTime - _timePassed : 0;
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
export default function TimerBox({
  timerId,
  timerTitle,
}: {
  timerId: number;
  timerTitle: string;
}) {
  const { data, isLoading, refetch } = api.timer.get.useQuery({ timerId });
  const updateTotalT = api.timer.updateTotalTime.useMutation();
  const getAll = api.timer.getAllIds.useQuery({ page: 1, limit: 10 });
  const startT = api.timer.start.useMutation();
  const stopT = api.timer.stop.useMutation();
  const deleteT = api.timer.delete.useMutation();
  const createTS = api.timerSessions.create.useMutation();
  const timePass = api.timer.getTotalPassedTime.useQuery({ timerTitle });

  const [isRunning1, setIsRunning1] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tTime, setTTime] = useState(["00", "00", "00"]);
  const [currRem, setCurrRem] = useState<[number, number, number]>([0, 0, 0]);

  const updateRemTime = (totalTime: number) => {
    if (data && timePass.data) {
      const _currRemSeconds = currRemaining(
        totalTime,
        data.updatedAt,
        timePass.data._sum.timePassed,
        data.isRunning,
      );

      const _currRemInHours = secondsToHours1(_currRemSeconds);

      setCurrRem(_currRemInHours);
    }
  };

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isRunning1 && (currRem[2] > 0 || currRem[1] > 0 || currRem[0] > 0)) {
      timerId = setInterval(() => {
        if (currRem[2] > 0) {
          setCurrRem([currRem[0], currRem[1], currRem[2] - 1]);
        } else if (currRem[1] > 0) {
          setCurrRem([currRem[0], currRem[1] - 1, 59]);
        } else if (currRem[0] > 0) {
          setCurrRem([currRem[0] - 1, 59, 59]);
        }
      }, 1000);
      intervalRef.current = timerId;
    }
    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, [currRem, isRunning1]);

  useEffect(() => {
    if (data) updateRemTime(data.totalTime);
  }, [data?.totalTime, timePass.data?._sum]);

  useEffect(() => {
    if (data) {
      const _totalTime0 = secondsToHours1(data.totalTime);
      const _totalTime = _totalTime0.map((t) =>
        t.toString().length === 1 ? `0${t}` : t,
      ) as [string, string, string];
      setTTime(_totalTime);
      setIsRunning1(data.isRunning);
    } else {
      setTTime(["00", "00", "00"]);
    }
  }, [data?.totalTime, data?.isRunning]);

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  const startTimer = async () => {
    setIsUpdating(true);
    setIsRunning1(true);
    await startT.mutateAsync({ title: data.title, updatedAt: currTime() });
    await refetch();
    setCurrRem((prev) => [prev[0], prev[1], prev[2]]);
    setIsUpdating(false);
  };

  const stopTimer = async () => {
    setIsUpdating(true);
    const _startTime = data.updatedAt;
    const _endTime = currTime() - 1;
    setIsRunning1(false);

    await Promise.all([
      createTS.mutateAsync({
        timerId: data.id,
        startTime: _startTime,
        endTime: _endTime,
        timePassed: _endTime - _startTime,
      }),
      stopT.mutateAsync({
        title: data.title,
      }),
    ]);
    await refetch();
    await timePass.refetch();
    setIsUpdating(false);
  };

  const deleteTimer = async () => {
    await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete timer "${data.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "rgb(54, 211, 153)",
      confirmButtonText: "Yes, delete it!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          setIsDeleting(true);
          await deleteT.mutateAsync({ title: data.title });
          await getAll.refetch();
          setIsDeleting(false);
          toast.success(`Timer "${data.title}" deleted succesfully!`);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(`Got Error while deleting timer "${data.title}"!`);
      });
  };

  const updateTotalTime = async (newTotalHours: string) => {
    if (timePass.data !== undefined) {
      const _timePassed = timePass.data._sum.timePassed ?? 0;
      const _newTimeInSec = hoursToSeconds(parseFloat(newTotalHours));
      if (_newTimeInSec <= _timePassed)
        throw new Error("New-time must be greater than Time-passed");
    } else throw new Error("Could not fetch time-passed");

    await updateTotalT.mutateAsync({
      title: data.title,
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
          void Swal0.fire({
            text: `Updated TotalTime to ${result.value} hours`,
            icon: "success",
          });
        }
      })
      .catch((err) => {
        void Swal0.fire({
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
          background: isRunning1
            ? "linear-gradient(to right, #B0F3F1,#FFCFDF)"
            : "inherit",
        }}
      >
        <div className="card-body">
          <h2 className="card-title">{data.title}</h2>
          <p>{data.description}</p>
          <p>
            Total Time: &nbsp;
            <span className="font-mono text-2xl">
              <span>{tTime[0]}</span>:<span>{tTime[1]}</span>:
              <span>{tTime[2]}</span>
            </span>
          </p>
          <p>
            Time Remaining: &nbsp;
            <span className="font-mono text-2xl">{currRem[0]}:</span>
            <span className="countdown font-mono text-2xl">
              <span style={{ "--value": currRem[1] } as any}></span>:
              <span style={{ "--value": currRem[2] } as any}></span>
            </span>
          </p>

          <div className="card-actions justify-center pt-2">
            <button
              onClick={onEditClick}
              className="btn btn-success btn-outline"
            >
              <PencilIcon className="h-6 w-6" />
            </button>
            {isUpdating ? (
              <>
                {isRunning1 ? (
                  <button className="btn btn-error btn-outline loading"></button>
                ) : (
                  <button className="btn btn-success btn-outline loading"></button>
                )}
              </>
            ) : (
              <>
                {isRunning1 ? (
                  <button
                    onClick={stopTimer}
                    className="btn btn-error btn-outline"
                  >
                    <StopIcon className="h-6 w-6" />
                  </button>
                ) : (
                  <button
                    onClick={startTimer}
                    className="btn btn-success btn-outline"
                  >
                    <PlayIcon className="h-6 w-6" />
                  </button>
                )}
              </>
            )}
            {isDeleting ? (
              <button className="btn btn-error btn-outline loading" />
            ) : (
              <button
                onClick={deleteTimer}
                className="btn btn-error btn-outline"
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
