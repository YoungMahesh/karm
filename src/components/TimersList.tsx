import { trpc } from "../utils/trpc";
import TimerBox from "./TimerBox";
import { useSession } from "next-auth/react";

export default function TimersList() {
  const { data, isLoading } = trpc.timer.getAllIds.useQuery({
    page: 1,
    limit: 10,
  });
  const session = useSession();
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  return (
    <>
      {session.data?.user ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-wrap justify-center">
            {data.map((tm, idx) => (
              <TimerBox key={idx} timerId={tm.id} />
            ))}
          </div>
          <div>
            <p className="mt-4">
              Note: Currently Timer seconds does not auto update, you need to
              click on &quot;Refetch&quot; to see current remaining time
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
