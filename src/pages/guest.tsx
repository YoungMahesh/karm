import { Guestbook } from "@prisma/client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export default function Guest() {
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();
  const { data, isLoading, refetch } = trpc.guest.getAll.useQuery();
  const postM = trpc.guest.postMessage.useMutation();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <main className="flex flex-col items-center">
      <h1 className="pt-4 text-3xl">Guestbook</h1>
      <p>Tutorial for create-t3-app</p>

      <div className="pt-10">
        {session ? (
          <div>
            <p>Hi {session.user?.name}</p>
            <button onClick={() => signOut()}>Logout</button>

            <div className="pt-6">
              <form
                className="flex gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();

                  postM.mutate({
                    name1: session.user?.name as string,
                    message1: message,
                  }, );
                  setMessage("");
                }}
              >
                <input
                  type="text"
                  value={message}
                  placeholder="Your message..."
                  maxLength={100}
                  onChange={(event) => setMessage(event.target.value)}
                  className="rounded-md border-2 border-zinc-800 px-4 py-2 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <button onClick={() => signIn("discord")}>
              Login with Discord
            </button>
          </div>
        )}
      </div>

      <Messages data={data!} isLoading={isLoading} />
    </main>
  );
}

const Messages = ({data, isLoading}: {data: Guestbook[], isLoading: boolean}) => {

  if (isLoading) return <p>Loading...</p>;
  return (
    <div className="pt-10">
      {data?.map((message) => (
        <div key={message.id}>
          <p>{message.name}</p>
          <p>{message.message}</p>
        </div>
      ))}
    </div>
  );
};
