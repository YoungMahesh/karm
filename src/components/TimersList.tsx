import { trpc } from "../utils/trpc";
import TimerBox from "./TimerBox";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import Loading from "./Loading";
import TimerBoxEmpty from "./TimerBoxEmpty";
import Notify from "./Nofity";

export default function TimersList() {
  const { data, isLoading } = trpc.timer.getAllIds.useQuery({
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
              <TimerBox key={idx} timerId={tm.id} />
            ))}
          </>
        ) : (
          <TimerBoxEmpty />
        )}
      </div>

      <div className="mt-4">
        <Notify>
          <p className="flex flex-wrap">
            <span>
              Note: Currently Timer seconds does not auto update, you need to
              click on Refetch-Icon
            </span>
            &nbsp; (&quot;{<ArrowPathIcon className="h-6 w-6" />}&quot;) &nbsp;
            <span> to see current remaining time</span>
          </p>
        </Notify>
      </div>
    </div>
  );
}
