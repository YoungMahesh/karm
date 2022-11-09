import { trpc } from "../utils/trpc";
import TimerHistoryBox from "./TimerHistoryBox";
import { useSession } from "next-auth/react";

export default function TimerHistoryList() {
  const { data, isLoading } = trpc.timerSessions.getAllIds.useQuery();
  const session = useSession();

  console.log("timerhistorybox");
  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>no data</p>;

  console.log("timerhistorylist", data);
  return (
    <>
      {session.data?.user ? (
        <div className="flex flex-wrap justify-center">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>StartTime</th>
                  <th>EndTime</th>
                  <th>TimePassed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((tm, idx) => (
                  <TimerHistoryBox
                    key={idx}
                    index={idx + 1}
                    timerSessionId={tm.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </>
  );
}
