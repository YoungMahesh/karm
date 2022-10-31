import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export default function AuthShowcase() {
  const { data: sessionData, status } = useSession();
  const { data } = trpc.profile.getProfile.useQuery();
  const router = useRouter();

  if (status === "loading") return <p className="text-center">Loading...</p>;

  return (
    <header className="flex  items-center justify-between p-2">
      <Image
        src="/karm.svg"
        height={90}
        width={90}
        alt="Karm"
        className="cursor-pointer rounded"
        onClick={() => router.push("/")}
      />

      <div>
        {sessionData && (
          <button className="btn mr-2" onClick={() => router.push("/profile")}>
            {data?.name}
          </button>
        )}

        <button
          className="btn"
          onClick={sessionData ? () => signOut() : () => signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </header>
  );
}
