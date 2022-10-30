import { useState } from "react";
import { hoursToSeconds } from "../utils/timer";
import { trpc } from "../utils/trpc";
import Button1 from "./Button1";

export default function CreateTimer() {
  const { refetch } = trpc.timer.getAllIds.useQuery();
  const createT = trpc.timer.createTimer.useMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState(0);

  const createTimer = async () => {
    await createT.mutateAsync({
      title,
      description,
      totalTime: hoursToSeconds(totalTime),
    });
    refetch();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl text-blue-500">Create Timer</h1>
      <form>
        <div>
          <label htmlFor="name">Title: </label>
          <input
            className="border-2 border-black p-1"
            type="text"
            name="name"
            id="name"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description: </label>
          <input
            className="border-2 border-black p-1"
            type="text"
            name="description"
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="totalTime">Total Time (in Hours): </label>
          <input
            className="border-2 border-black p-1"
            type="number"
            name="totalTime"
            id="totalTime"
            required
            value={totalTime}
            onChange={(e) => setTotalTime(parseInt(e.target.value))}
          />
        </div>

        <Button1 onClick={createTimer}>Create </Button1>
      </form>
    </div>
  );
}
