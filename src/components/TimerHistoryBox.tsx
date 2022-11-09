import { useState } from "react";

import { trpc } from "../utils/trpc";
// import { TrashIcon } from '@heroicons/react/24/solid'
import { BeakerIcon, TrashIcon } from "@heroicons/react/24/solid";
import { secondsToDate, secondsToHours } from "../utils/timer";

export default function TimerBox({
  timerSessionId,
  index,
}: {
  timerSessionId: string;
  index: number;
}) {
  const { data, isLoading } = trpc.timerSessions.getOne.useQuery({
    timerSessionId,
  });
  const getAll = trpc.timerSessions.getAllIds.useQuery();
  const deleteT = trpc.timerSessions.deleteOne.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  console.log("timerhistorybox", data, timerSessionId);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (!data) return <p>no data</p>;

  const deleteTimerSession = async () => {
    setIsDeleting(true);
    await deleteT.mutateAsync({ timerSessionId: data.id });
    await getAll.refetch();
    setIsDeleting(false);
  };

  return (
    <tr>
      <th>{index}</th>
      <td>{data.timer.title} </td>
      <td>{secondsToDate(data.startTime)}</td>
      <td>{secondsToDate(data.endTime)} </td>
      <td>{secondsToHours(data.timePassed)}</td>
      <td>
        {isDeleting ? (
          <button className="btn-error loading btn" />
        ) : (
          <TrashIcon
            className="h-6 w-6 cursor-pointer text-red-600"
            onClick={deleteTimerSession}
          />
        )}
      </td>
    </tr>
  );
}
