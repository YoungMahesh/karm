/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import TimerBox from "./TimerBox";
import Loading from "./Loading";
import TimerBoxEmpty from "./TimerBoxEmpty";
import { api } from "~/utils/api";

export default function TimersList() {
  const { data, isLoading } = api.timer.getAllIds.useQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center">
        {data.length ? (
          <>
            {data.map((tm, idx) => (
              <TimerBox key={idx} timerId={tm.id} timerTitle={tm.title} />
            ))}
          </>
        ) : (
          <TimerBoxEmpty />
        )}
      </div>
    </div>
  );
}
