import { trpc } from "../utils/trpc";
import TimerBox from "./TimerBox";

export default function TimersList() {
  const { data, isLoading } = trpc.timer.getAllIds.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  return (
    <div className="flex flex-wrap justify-center">
      {data.map((tm, idx) => (
        <TimerBox key={idx} timerId={tm.id} />
      ))}
    </div>
  );
}
