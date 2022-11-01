import { useState } from "react";
import { hoursToSeconds } from "../utils/timer";
import { trpc } from "../utils/trpc";

export default function CreateTimer() {
  const { refetch } = trpc.timer.getAllIds.useQuery();
  const createT = trpc.timer.createTimer.useMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const clearCreateForm = () => {
    setTitle("");
    setDescription("");
    setTotalTime("");
  };

  const createTimer = async () => {
    setIsCreating(true);
    await createT.mutateAsync({
      title,
      description,
      totalTime: hoursToSeconds(parseFloat(totalTime)),
    });
    await refetch();
    clearCreateForm();
    setIsCreating(false);
  };

  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-2">
      <h1 className="text-2xl text-blue-500">Create Timer</h1>
      <div className="form-control">
        <label className="input-group mb-2">
          <span>Title</span>
          <input
            type="text"
            placeholder="Study Physics"
            className="input-bordered input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="input-group mb-2">
          <span>Description</span>
          <input
            type="text"
            placeholder="Quantum Mechanics"
            className="input-bordered input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label className="input-group mb-2">
          <span>Total Time (in Hours)</span>
          <input
            type="text"
            placeholder="11.5"
            className="input-bordered input"
            value={totalTime}
            onChange={(e) => setTotalTime(e.target.value)}
            required
          />
        </label>
        {isCreating ? (
          <button className="loading btn" />
        ) : (
          <button onClick={createTimer} className="btn">
            Create
          </button>
        )}
      </div>
    </div>
  );
}
