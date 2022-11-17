import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import {
  TrashIcon,
  PencilIcon,
  BookmarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { itemsPerPage, secondsToDate, secondsToHours } from "../utils/timer";
import Loading from "./Loading";

// @ts-ignore
import DateTimePicker from "react-datetime-picker/dist/entry.nostyle";

export default function TimerBox({
  timerSessionId,
  id,
  page,
}: {
  timerSessionId: string;
  id: number;
  page: number;
}) {
  const [startTE, setStartTE] = useState<Date>(new Date());
  const [endTE, setEndTE] = useState<Date>(new Date());
  const [timePassedE, setTimePassedE] = useState(0);

  const { data, isLoading, refetch } = trpc.timerSessions.get.useQuery({
    timerSessionId,
  });
  const getAll = trpc.timerSessions.getAllIds.useQuery({
    page,
    limit: itemsPerPage,
  });
  const updateT = trpc.timerSessions.update.useMutation();
  const deleteT = trpc.timerSessions.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEditing && data) {
      setStartTE(new Date(data.startTime * 1000));
      setEndTE(new Date(data.endTime * 1000));
      setTimePassedE(data.timePassed);
    }
  }, [isEditing]);

  useEffect(() => {
    if (startTE && endTE) {
      const _currTimeP =
        Math.floor(endTE.getTime() / 1000) -
        Math.floor(startTE.getTime() / 1000);
      if (_currTimeP > 0) setTimePassedE(_currTimeP);
      else setTimePassedE(0);
    }
  }, [startTE, endTE]);

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  const deleteTimerSession = async () => {
    setIsDeleting(true);
    await deleteT.mutateAsync({ timerSessionId: data.id });
    await getAll.refetch();
    setIsDeleting(false);
  };

  const editTimerSession = async () => {
    if (startTE && endTE) {
      setIsSaving(true);
      await updateT.mutateAsync({
        timerSessionId: data.id,
        startTime: Math.floor(startTE.getTime() / 1000),
        endTime: Math.floor(endTE.getTime() / 1000),
        timePassed: timePassedE,
      });
      await refetch();
      setIsEditing(false);
      setIsSaving(false);
    }
  };

  return (
    <tr>
      <th>{id}</th>
      <td>{data.timer.title} </td>
      {!isEditing ? (
        <>
          <td>{secondsToDate(data.startTime)}</td>
          <td>{secondsToDate(data.endTime)} </td>
          <td>{secondsToHours(data.timePassed)}</td>
          <td>
            <PencilIcon
              className="h-6 w-6 cursor-pointer text-blue-600"
              onClick={() => setIsEditing(true)}
            />
          </td>
          <td>
            {isDeleting ? (
              <button className="loading btn-error btn" />
            ) : (
              <TrashIcon
                className="h-6 w-6 cursor-pointer text-red-600"
                onClick={deleteTimerSession}
              />
            )}
          </td>
        </>
      ) : (
        <>
          <td>
            <DateTimePicker
              onChange={(e: Date) => setStartTE(e)}
              value={startTE}
            />
          </td>
          <td>
            <DateTimePicker onChange={(e: Date) => setEndTE(e)} value={endTE} />
          </td>

          <td>{secondsToHours(timePassedE)}</td>
          <td>
            {isSaving ? (
              <button className="btn-outlinewww loading btn" />
            ) : (
              <BookmarkIcon
                className="h-6 w-6 cursor-pointer text-blue-600"
                onClick={editTimerSession}
              />
            )}
          </td>
          <td>
            <XMarkIcon
              className="h-6 w-6 cursor-pointer text-red-600"
              onClick={() => setIsEditing(false)}
            />
          </td>
        </>
      )}
    </tr>
  );
}
