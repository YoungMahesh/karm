import { trpc } from "../utils/trpc";
import TimerBox from "./TimerBox";
import { useSession } from "next-auth/react";

export default function TimersList() {
  const { data, isLoading } = trpc.timer.getAllIds.useQuery();
  const session = useSession();
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  return (
    <>
      {session.data?.user ? (
        <div className="flex flex-wrap justify-center">
          {data.map((tm, idx) => (
            <TimerBox key={idx} timerId={tm.id} />
          ))}
        </div>
      ) : null}
    </>
  );
}
