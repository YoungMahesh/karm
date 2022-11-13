import { trpc } from "../utils/trpc";
import TimerHistoryBox from "./TimerHistoryBox";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { itemsPerPage } from "../utils/timer";
import Notify from "./Nofity";
import Loading from "./Loading";

export default function TimerHistoryList() {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const session = useSession();
  const { isLoading, data } = trpc.timerSessions.getAllIdsCount.useQuery();

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
      <Notify msg="You don't have any history currently. Start and Stop timer to view history here." />
    );

  return (
    <>
      {session.data?.user ? (
        <div className="flex flex-col items-center">
          {page > 0 ? (
            <Table1>
              <TimerHistoryList1 page={page} limit={itemsPerPage} />
            </Table1>
          ) : null}

          <>
            {totalPages > 1 ? (
              <div className="btn-group mt-4">
                {Array.from({ length: totalPages }).map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPage(idx + 1)}
                    className={idx === page - 1 ? "btn btn-active" : "btn"}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        </div>
      ) : null}
    </>
  );
}

function TimerHistoryList1({ page, limit }: { page: number; limit: number }) {
  const { data, isLoading } = trpc.timerSessions.getAllIds.useQuery({
    page,
    limit,
  });

  if (isLoading) return <Loading />;
  if (!data) return <p>no data</p>;

  return (
    <>
      {data.map((tm, idx) => (
        <TimerHistoryBox
          key={idx}
          id={(page - 1) * itemsPerPage + idx + 1}
          timerSessionId={tm.id}
          page={page}
        />
      ))}
    </>
  );
}

function Table1({ children }: { children: any }) {
  return (
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
              <th></th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}
