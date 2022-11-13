import { useState } from "react";
import { hoursToSeconds } from "../utils/timer";
import { trpc } from "../utils/trpc";
import { XMarkIcon } from "@heroicons/react/24/solid";

export default function CreateTimer() {
  const { refetch } = trpc.timer.getAllIds.useQuery();
  const createT = trpc.timer.create.useMutation();

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
      <div className="bg-base-100 p-2 sm:w-fit sm:p-4">
        <div className="mt-4 flex flex-col items-center justify-center gap-2">
          <div className="flex w-full items-center justify-around">
            <h1 className="text-lg sm:text-2xl">Create Timer</h1>
            <label htmlFor="my-drawer-4">
              <XMarkIcon className="h-6 w-6 cursor-pointer text-blue-600 sm:h-8 sm:w-8" />
            </label>
          </div>
          <div className="form-control">
            <Input1
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input1
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input1
              placeholder="Time (in Hours)"
              value={totalTime}
              onChange={(e) => setTotalTime(e.target.value)}
            />

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

const Input1 = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (_: any) => void;
}) => (
  <input
    type="text"
    placeholder={placeholder}
    className="input-bordered input mb-2 w-full max-w-xs"
    value={value}
    onChange={onChange}
    required
  />
);
