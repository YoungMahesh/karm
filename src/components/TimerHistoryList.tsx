/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import { trpc } from "../utils/trpc";
import TimerHistoryBox from "./TimerHistoryBox";
import { useEffect, useState } from "react";
import { itemsPerPage } from "../utils/timer";
import Notify from "./Nofity";
import Loading from "./Loading";
import { useAuth } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function TimerHistoryList() {
  const { isSignedIn } = useAuth();
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { isLoading, data } = api.timerSessions.getAllIdsCount.useQuery();

  useEffect(() => {
    if (data) {
      const _totalP = Math.ceil(data / itemsPerPage);
      setTotalPages(_totalP);
      if (_totalP > 0) setPage(1);
    }
  }, [data]);

  if (isLoading) return <Loading />;

  if (!data)
    return (
      <Notify>
        You don&apos;t have any history currently. Start and Stop timer to view
        history here
      </Notify>
    );

  return (
    <>
      {isSignedIn ? (
        <>
          <>{page > 0 ? <Table1 page={page} limit={itemsPerPage} /> : null}</>
          <>
            {totalPages > 1 ? (
              <div className="btn-group mt-4 flex justify-center">
                {Array.from({ length: totalPages }).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={idx === page - 1 ? "btn-active btn" : "btn"}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        </>
      ) : null}
    </>
  );
}

function Table1({ page, limit }: { page: number; limit: number }) {
  const { data, isLoading } = api.timerSessions.getAllIds.useQuery({
    page,
    limit,
  });

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th></th>
          <th>TimerTitle</th>
          <th>StartTime</th>
          <th>EndTime</th>
          <th>TimePassed</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((tm, idx) => (
          <TimerHistoryBox
            key={idx}
            id={(page - 1) * itemsPerPage + idx + 1}
            timerSessionId={tm.id}
            page={page}
          />
        ))}
      </tbody>
    </table>
  );
}
