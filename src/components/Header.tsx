import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import logo from "../../public/logo.svg";

export default function Header() {
  const { data: sessionData, status } = useSession();
  const { data } = trpc.profile.getProfile.useQuery();
  const router = useRouter();

  if (status === "loading") return <p className="text-center">Loading...</p>;

  return (
    <header className="flex items-center justify-between p-2">
      <Image
        src={logo}
        width={70}
        alt="Timers"
        className="cursor-pointer rounded"
        onClick={() => router.push("/")}
        priority
      />

      <div>
        {sessionData && (
          <>
            <button
              className="btn-primary btn mr-2"
              onClick={() => router.push("/history")}
            >
              History
            </button>
            <button
              className="btn-primary btn mr-2"
              onClick={() => router.push("/profile")}
            >
              {data?.name}
            </button>
          </>
        )}

        {sessionData ? (
          <button className="btn-error btn" onClick={() => signOut()}>
            Sign out
          </button>
        ) : (
          <button className="btn-primary btn" onClick={() => signIn()}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
