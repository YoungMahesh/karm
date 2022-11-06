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
    <div className="drawer-side">
      <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
      <div className="w-fit bg-base-100 p-4">
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <div className="fixed right-5 top-5 ">
            <label
              htmlFor="my-drawer-4"
              className="btn-primary drawer-button btn text-xl"
            >
              X
            </label>
          </div>
          <h1 className="text-2xl">Create Timer</h1>
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
              <span>Time (in Hours)</span>
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
              <button onClick={createTimer} className="btn-primary btn">
                Create
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
