import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";
import logo from "../../public/logo.svg";
import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Header() {
  const { data: sessionData, status } = useSession();
  const { data } = trpc.profile.get.useQuery();
  const router = useRouter();

  if (status === "loading") return <p className="text-center">Loading...</p>;

  return (
    <header className="navbar ">
      <div className="flex-1 px-2 lg:flex-none">
        <Image
          src={logo}
          width={80}
          alt="Timers"
          className="cursor-pointer rounded"
          onClick={() => router.push("/")}
          priority
        />
      </div>
      <div className="flex flex-1 justify-end px-2">
        <div className="flex items-stretch">
          {sessionData ? (
            <div className="dropdown-end dropdown">
              <label tabIndex={0} className="btn-ghost rounded-btn btn">
                <Bars3Icon className="h-8 w-8 cursor-pointer text-blue-600 sm:h-10 sm:w-10" />
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu rounded-box mt-4 w-52 bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href="/history">History</Link>
                </li>
                <li>
                  <Link href="/profile">{data?.name}</Link>
                </li>

                <li onClick={() => signOut()}>
                  <a>Sign out</a>
                </li>
              </ul>
            </div>
          ) : (
            <button className="btn-primary btn" onClick={() => signIn()}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
